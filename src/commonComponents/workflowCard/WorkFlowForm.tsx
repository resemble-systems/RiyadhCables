import * as React from "react";
import { DatePicker, DatePickerProps, Input, Modal, Select } from "antd";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { SPHttpClient, ISPHttpClientOptions } from "@microsoft/sp-http";

export interface IWorkFlowFormProps {
  self: any;
  title: string;
  context: WebPartContext;
  modalOpen: boolean;
  handleClose: () => void;
}
interface IWorkFlowFormState {
  nameOptions: Array<{ value: string; label: string; email: string }>;
  nameSelected: string;
  formInput: {
    Title: string;
    StartDate: string;
    EndDate: string;
  };
}
export default class WorkFlowForm extends React.Component<
  IWorkFlowFormProps,
  IWorkFlowFormState
> {
  public constructor(props: IWorkFlowFormProps, state: IWorkFlowFormState) {
    super(props);
    this.state = {
      nameOptions: [],
      nameSelected: "",
      formInput: { Title: "", StartDate: "", EndDate: "" },
    };
  }
  public componentDidMount(): void {}
  public getNames(nameSearch: string) {
    const { context } = this.props;
    context.msGraphClientFactory
      .getClient("3")
      .then((grahpClient: MSGraphClientV3): void => {
        grahpClient
          .api(`/me/people/?$search=${nameSearch}`)
          .version("v1.0")
          .select("*")
          .top(20)
          .get((error: any, mail: any, rawResponse?: any) => {
            if (error) {
              console.log("nameSearch messages Error", error);
              return;
            }
            console.log("nameSearch Response", mail);
            const nameData = mail.value.map(
              (data: { displayName: string; userPrincipalName: string }) => {
                return {
                  value: data.displayName,
                  label: data.displayName,
                  email: data.userPrincipalName,
                };
              }
            );
            console.log("nameData", nameData);
            this.setState({ nameOptions: nameData });
          });
      });
  }

  public workFlow() {
    const { context, title, self } = this.props;
    const { nameSelected, formInput } = this.state;
    const headers: any = {
      "X-HTTP-Method": "POST",
      "If-Match": "*",
    };
    const spHttpClintOptions: ISPHttpClientOptions = {
      headers,
      body: JSON.stringify({
        Title: formInput.Title,
        AsignedTo: nameSelected,
        StartDate: formInput.StartDate,
        DueDate: formInput.EndDate,
        Status: "Open",
        WorkFlowType: title,
        CreatedBy: context.pageContext.user.email,
      }),
    };
    context.spHttpClient
      .post(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('WorkFlow')/items`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      )
      .then((res) => {
        console.log(res, "WorkFlow Post Response");
        this.setState({
          formInput: { Title: "", EndDate: "", StartDate: "" },
          nameSelected: "",
        });
        alert("Work Flow Posted Successfully");
        self.setState({ modalOpen: false });
      });
  }

  public render(): React.ReactElement<IWorkFlowFormProps> {
    const { nameSelected, nameOptions, formInput } = this.state;
    const { modalOpen, title, handleClose } = this.props;

    const openNotificationWithIcon = (type: "error", feild: string) => {
      let errorDescription: string = "";
      switch (feild) {
        case "Title":
          errorDescription = "Title must contain more than 5 character";
          break;
        case "AsignedTo":
          errorDescription = "Asigned To cannot be empty";
          break;
        case "StartDate":
          errorDescription = "Start Date To cannot be empty";
          break;
        case "EndDate":
          errorDescription = "End Date To cannot be empty";
          break;
        default:
          errorDescription = "Somethimg went wrong";
      }
      alert(errorDescription);
    };
    const handleSearch = (newValue: string) => {
      let nameSearch = newValue;
      console.log("nameSearch", nameSearch);
      if (nameSearch.length >= 3) {
        this.getNames(nameSearch);
      }
    };
    const handleChange = (newValue: string) => {
      console.log("newValue", newValue);
      this.setState({ nameSelected: newValue });
    };
    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({ formInput: { ...formInput, Title: event.target.value } });
    };
    const handleStartDate: DatePickerProps["onChange"] = (date, dateString) => {~
      console.log("Date Picker Input", date, dateString);
      this.setState({ formInput: { ...formInput, StartDate: dateString } });
    };
    const handleEndDate: DatePickerProps["onChange"] = (date, dateString) => {
      console.log("Date Picker Input", date, dateString);
      this.setState({ formInput: { ...formInput, EndDate: dateString } });
    };
    const handleSubmit = (event: { preventDefault: () => void }) => {
      event.preventDefault();
      if (formInput.Title.length < 5) {
        openNotificationWithIcon("error", "Title");
      } else if (!nameSelected) {
        openNotificationWithIcon("error", "AsignedTo");
      } else if (!formInput.StartDate) {
        openNotificationWithIcon("error", "StartDate");
      } else if (!formInput.EndDate) {
        openNotificationWithIcon("error", "EndDate");
      } else {
        console.log("Form Submitted", formInput);
        this.workFlow();
      }
    };

    return (
      <Modal
        title={`${title} Form`}
        footer={false}
        centered={false}
        open={modalOpen}
        onOk={handleClose}
        onCancel={handleClose}
        width={1000}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            fontSize: "16px",
            fontWeight: "500",
            fontFamily: "Avenir Next",
          }}
        >
          <div className="d-flex flex-column gap-2 mb-3">
            <label htmlFor="Title">Title</label>
            <Input
              id="Title"
              placeholder="Enter Title"
              className="flex-fill"
              value={formInput.Title}
              onChange={handleTitleChange}
            />
          </div>
          <div className="d-flex flex-column gap-2 mb-3">
            <label htmlFor="AssignedTo">Assigned To</label>
            <Select
              className="flex-fill"
              id="AssignedTo"
              showSearch
              value={nameSelected}
              placeholder="Assigned To..."
              defaultActiveFirstOption={false}
              showArrow={false}
              filterOption={false}
              onSearch={handleSearch}
              onChange={handleChange}
              notFoundContent={null}
              options={(nameOptions || []).map((data) => ({
                value: data.value,
                label: data.label,
              }))}
            />
          </div>
          <div className="d-flex justify-content-between gap-2 mb-3">
            <div className="d-flex flex-column gap-2 flex-fill">
              <label htmlFor="StartDate">Start Date</label>
              <DatePicker onChange={handleStartDate} id="StartDate" />
            </div>
            <div className="d-flex flex-column gap-2 flex-fill">
              <label htmlFor="EndDate">End Date</label>
              <DatePicker onChange={handleEndDate} id="EndDate" />
            </div>
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
      </Modal>
    );
  }
}
