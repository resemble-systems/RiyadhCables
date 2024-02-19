import * as React from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import "./index.css";
import ImageModal from "./ImageModal";
export interface IRichTextEditorProps {
  uploadContent: {
    Date: string;
    Title: string;
    Location: string;
    Description: string;
    CreatedBy: string;
  };
  self: any;
}
interface IRichTextEditorState {
  imageUpload: any;
  imageUrl: string;
  isModalOpen: boolean;
}

export default class RichTextEditor extends React.Component<
  IRichTextEditorProps,
  IRichTextEditorState
> {
  public quillRef: React.RefObject<ReactQuill> | undefined;
  public constructor(props: IRichTextEditorProps, state: IRichTextEditorState) {
    super(props);
    this.state = {
      imageUpload: document.getElementsByClassName("ql-image"),
      imageUrl: "",
      isModalOpen: false,
    };
    this.quillRef = React.createRef();
  }
  public componentDidMount(): void {
    setTimeout(() => {
      const capture = {
        capture: true,
      };
      const imageUpload = document.getElementsByClassName("ql-image");
      imageUpload[0].addEventListener(
        "click",
        (event) => {
          event.stopPropagation();
          console.log("Image Handler");
          this.setState({ isModalOpen: true });
        },
        capture
      );
      this.setState({ imageUpload: imageUpload });
      
      console.log("imageUpload", imageUpload);
    }, 1000);
  }

  public componentDidUpdate(
    prevProps: Readonly<IRichTextEditorProps>,
    prevState: Readonly<IRichTextEditorState>
  ): void {}

  public render(): React.ReactElement<IRichTextEditorProps> {
    const { uploadContent, self } = this.props;
    const { imageUpload, isModalOpen, imageUrl } = this.state;
    console.log("imageUpload", imageUpload);
    console.log("quillRef", this.quillRef);
    const modules = {
      toolbar: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        [{ color: [] }, { background: [] }],
        ["link"],
        ["image"],
        ["clean"],
      ],
      clipboard: {
        matchVisual: false,
      },
    };

    const handleChange = (
      content: any,
      delta: any,
      source: any,
      editor: any
    ) => {
      console.log("Rich", content, delta, source, editor);
      self.setState({
        uploadContent: { ...uploadContent, Description: content },
      });
    };

    const handleSubmit = () => {
      if (imageUrl.length < 3) alert("Enter Valid Url");
      else
        self.setState({
          uploadContent: {
            ...uploadContent,
            Description: uploadContent.Description.concat(
              `<img src='${imageUrl}'/>`
            ),
          },
        });
      this.setState({ isModalOpen: false, imageUrl: "" });
    };
    console.log('uploadContent.Description', uploadContent.Description)
    return (
      <>
        <ReactQuill
          ref={this.quillRef}
          theme="snow"
          modules={modules}
          value={uploadContent.Description}
          style={{ overflowY: "scroll" }}
          placeholder="Add a description of your event"
          onChange={handleChange}
        />
        <ImageModal
          self={this}
          isModalOpen={isModalOpen}
          imageUrl={imageUrl}
          handleSubmit={handleSubmit}
        />
      </>
    );
  }
}
