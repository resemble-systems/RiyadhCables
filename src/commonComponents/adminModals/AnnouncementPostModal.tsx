import * as React from "react";
import {
  DatePicker,
  DatePickerProps,
  Input,
  Modal,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import RichTextEditor from "../richTextEditor/RichTextEditor";
import { PlusOutlined } from "@ant-design/icons";
import { RcFile } from "antd/es/upload";
import { Web } from "sp-pnp-js";
import { SPHttpClient, ISPHttpClientOptions } from "@microsoft/sp-http";

export interface IAnnouncementPostModalProps {
  self: any;
  title: string;
  context: WebPartContext;
  modalOpen: boolean;
  handleClose: () => void;
}
interface IAnnouncementPostModalState {
  uploadContent: {
    Date: string;
    Title: string;
    Location: string;
    Description: string;
    CreatedBy: string;
  };
  PreviewImage: string;
  PreviewOpen: boolean;
  PreviewTitle: string;
  fileList: UploadFile[];
  uploadData: any;
}
export default class AnnouncementPostModal extends React.Component<
  IAnnouncementPostModalProps,
  IAnnouncementPostModalState
> {
  public inputRef: any;
  public constructor(
    props: IAnnouncementPostModalProps,
    state: IAnnouncementPostModalState
  ) {
    super(props);
    this.state = {
      uploadContent: {
        Date: "",
        Title: "",
        Location: "",
        Description: "",
        CreatedBy: "",
      },
      PreviewImage: "",
      PreviewOpen: false,
      PreviewTitle: "",
      fileList: [],
      uploadData: [],
    };
    this.inputRef = React.createRef();
  }
  public componentDidMount(): void {
    /* setTimeout(() => {
      const inputImage = document.getElementById("picture");
      console.log("inputImage", inputImage);
      inputImage?.addEventListener("change", (event) => {
        console.log("Image Insert", event.target);
      });
    }, 5000); */
  }

  public async uploadListItems(listName: string) {
    const { context } = this.props;
    const { uploadContent } = this.state;
    const headers: any = {
      "X-HTTP-Method": "POST",
      "If-Match": "*",
    };
    const spHttpClintOptions: ISPHttpClientOptions = {
      headers,
      body: JSON.stringify(uploadContent),
    };
    const postResponse = await context.spHttpClient.post(
      `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listName}')/items`,
      SPHttpClient.configurations.v1,
      spHttpClintOptions
    );
    if (postResponse.ok) {
      const postData = await postResponse.json();
      this.addAttachment(postData.ID, listName);
      console.log("post details", postData);
      console.log("Post Success", postResponse.headers);
    } else {
      alert("Post Failed");
      console.log("Post Failed", postResponse);
    }
  }

  public async addAttachment(ID: number, listName: string) {
    const { fileList } = this.state;
    if (fileList?.length > 0) {
      const inputArr = fileList;
      const arrLength = fileList.length;
      let fileData: any = [];
      for (let i = 0; i < arrLength; i++) {
        console.log(`In for loop ${i} times`);
        var file = inputArr[i]?.originFileObj;
        var reader = new FileReader();
        reader.onload = (function (file) {
          return function (e) {
            fileData.push({
              name: file?.name,
              content: e.target?.result,
            });
          };
        })(file);
        if (file) reader.readAsArrayBuffer(file);
        this.setState({ uploadData: fileData });
      }
      this.uploadAttachment(ID, listName, fileData);
    }
  }

  public async uploadAttachment(ID: number, LIST: string, DATA: any) {
    console.log("In upload", DATA, LIST, ID);
    let web = new Web(this.props.context.pageContext.web.absoluteUrl);
    await web.lists
      .getByTitle(LIST)
      .items.getById(ID)
      .attachmentFiles.addMultiple(DATA)
      .then((response: any) => {
        console.log("Attachment Response", response);
      })
      .catch((error) => {
        console.log("Attachment Response", error);
      });
    console.log("Attachment Added Successfully");
    this.setState({
      fileList: [],
    });
  }

  public render(): React.ReactElement<IAnnouncementPostModalProps> {
    const {
      fileList,
      PreviewImage,
      PreviewOpen,
      PreviewTitle,
      uploadContent,
      uploadData,
    } = this.state;
    const { title, modalOpen, handleClose, context } = this.props;
    console.log("uploadData", uploadData);
    const UserEmail = context.pageContext.user.email;

    const handleChange: UploadProps["onChange"] = ({
      fileList: newFileList,
    }) => {
      this.setState({ fileList: newFileList });
      console.log("Upload Images", newFileList);
    };

    const uploadButton = (
      <div>
        <PlusOutlined rev={undefined} />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );

    const handlePreview = async (file: UploadFile) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as RcFile);
      }
      this.setState({
        PreviewImage: file.url || (file.preview as string),
        PreviewOpen: true,
        PreviewTitle:
          file.name || file.url!.substring(file.url!.lastIndexOf("/") + 1),
      });
    };

    const getBase64 = (file: RcFile): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
      });

    const handleCancel = () => {
      this.setState({ PreviewOpen: false });
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        uploadContent: { ...uploadContent, Title: event.target.value },
      });
    };
    const handleLocation = (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        uploadContent: { ...uploadContent, Location: event.target.value },
      });
    };
    const handleDate: DatePickerProps["onChange"] = (date, dateString) => {
      console.log("Date Picker Input", date, dateString);
      this.setState({ uploadContent: { ...uploadContent, Date: dateString } });
    };
    const handleSubmit = (event: { preventDefault: () => void }) => {
      event.preventDefault();
      this.setState({
        uploadContent: { ...uploadContent, CreatedBy: UserEmail },
      });
      this.uploadListItems(title);
    };

    return (
      <Modal
        title={`${title} Form`}
        footer={false}
        centered={true}
        open={modalOpen}
        onOk={handleClose}
        onCancel={handleClose}
        width={"95vw"}
      >
        <div
          className="mb-2"
          style={{
            fontFamily: "Avenir Next",
            height: "88vh",
            overflowY: "scroll",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column gap-2 mb-3">
              <label htmlFor="Title">Title</label>
              <Input
                id="Title"
                placeholder="Enter Title"
                className="flex-fill"
                onChange={handleTitleChange}
              />
            </div>
            <div className="d-flex flex-column gap-2 mb-3">
              <label htmlFor="AssignedTo">Description</label>
              <RichTextEditor uploadContent={uploadContent} self={this} />
            </div>
            <div className="d-flex justify-content-between gap-2 mb-3">
              <div className="d-flex flex-column gap-2 flex-fill">
                <label htmlFor="Date">Date</label>
                <DatePicker id="Date" onChange={handleDate} />
              </div>
              <div className="d-flex flex-column gap-2 flex-fill">
                <label htmlFor="Location">Location</label>
                <Input
                  id="Location"
                  placeholder="Enter Location"
                  className="flex-fill"
                  onChange={handleLocation}
                />
              </div>
            </div>
            <div className="mb-3 d-flex flex-column gap-2">
              <label htmlFor="picture">Add Attachments</label>
              <Upload
                id="picture"
                onPreview={handlePreview}
                listType="picture-card"
                fileList={fileList}
                onChange={handleChange}
                multiple
                maxCount={10}
              >
                {fileList.length >= 10 ? null : uploadButton}
              </Upload>
            </div>
            <div className="d-flex justify-content-end">
              <button
                type="submit"
                className="text-white px-3 py-2 rounded"
                style={{ border: "none", backgroundColor: " rgb(181, 77, 38)" }}
              >
                Submit
              </button>
            </div>
          </form>
          <Modal
            open={PreviewOpen}
            title={PreviewTitle}
            footer={null}
            onCancel={handleCancel}
            centered={true}
          >
            <img alt="example" style={{ width: "100%" }} src={PreviewImage} />
          </Modal>
        </div>
      </Modal>
    );
  }
}
