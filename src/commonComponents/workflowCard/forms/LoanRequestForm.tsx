import * as React from "react";
import "./index.css";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Col, Form, Input, InputNumber, Modal, Radio, Row } from "antd";
import { Button, Divider, Select, Space } from "antd";
import {
  SPHttpClient,
  ISPHttpClientOptions,
  SPHttpClientResponse,
} from "@microsoft/sp-http";

export interface ILoanRequestFormProps {
  self: any;
  title: string;
  context: WebPartContext;
  modalOpen: boolean;
  handleClose: () => void;
  headerLogo: any;
  LoanCreationApprovers: any;
  selectedPersonDetails: {
    name: string;
    email: string;
    department: string;
    jobTitle: string;
    businessPhones: string;
    manager: string;
    managerEmail: string;
  };
  toWords: any;
}
interface ILoanRequestFormState {
  isSubmitting: boolean;
  isNotificationOpen: boolean;
  submittingText: string;
  amountInDigit: number;
  amountInWord: string;
  isError: boolean;
  errorMessage: string;
  currencyOption: any;
  newCurrency: string;
  currencySelected: string;
}
interface FieldType {
  department: string;
  date: string;
  EmployeeName: string;
  EmployeeID: string;
  JobTittle: string;
  EmployeeExt: string;
  LoanType: string;
  AmountInDigits: string;
  AmountInWords: string;
}
export default class LoanRequestForm extends React.Component<
  ILoanRequestFormProps,
  ILoanRequestFormState
> {
  public formRef: any;
  public constructor(
    props: ILoanRequestFormProps,
    state: ILoanRequestFormState
  ) {
    super(props);
    this.state = {
      isSubmitting: false,
      submittingText: "Requesting for Loan.....",
      isNotificationOpen: false,
      amountInDigit: 0,
      amountInWord: "",
      currencyOption: [],
      newCurrency: "",
      currencySelected: "SAR",
      isError: false,
      errorMessage: "",
    };
    this.formRef = React.createRef();
  }
  public componentDidMount(): void {
    this.getCurrency();
  }
  public getCurrency() {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('LoanRequestCurrency')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(`Error in LoanRequestCurrency Fetch ${res.status}`);
          return;
        }
      })
      .then((listItems: { value: any[] }) => {
        console.log("LoanRequestCurrency Details", listItems.value);
        const currencyData = listItems.value?.map((data) => {
          return {
            value: data.Title,
            label: data.Title,
          };
        });
        this.setState({ currencyOption: currencyData });
      });
  }

  public async addCurrency() {
    const { context } = this.props;
    const { newCurrency } = this.state;
    const headers: any = {
      "X-HTTP-Method": "POST",
      "If-Match": "*",
    };
    const spHttpClintOptions: ISPHttpClientOptions = {
      headers,
      body: JSON.stringify({
        Title: newCurrency?.toUpperCase(),
      }),
    };
    const postResponse = await context.spHttpClient.post(
      `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('LoanRequestCurrency')/items`,
      SPHttpClient.configurations.v1,
      spHttpClintOptions
    );
    if (postResponse.ok) {
      const postData = await postResponse.json();
      console.log("Loan Request Currency Created", postData);
      this.setState({
        submittingText: "Currency has been added successfully",
        isSubmitting: false,
        newCurrency: "",
      });
      this.getCurrency();
    } else {
      alert("Loan Request Currency Creation Failed.");
      console.log("LoanRequestCurrency Failed", postResponse);
    }
  }
  public render(): React.ReactElement<ILoanRequestFormProps> {
    const {
      self,
      modalOpen,
      title,
      toWords,
      handleClose,
      LoanCreationApprovers,
      selectedPersonDetails,
    } = this.props;
    const {
      isSubmitting,
      submittingText,
      isNotificationOpen,
      amountInDigit,
      amountInWord,
      currencyOption,
      currencySelected,
      errorMessage,
      isError,
    } = this.state;

    const postUser = async (values: any) => {
      const { context } = this.props;
      const { LoanType, EmployeeID } = values;
      const CreatorDepartment = selectedPersonDetails.department;
      const headers: any = {
        "X-HTTP-Method": "POST",
        "If-Match": "*",
      };
      const spHttpClintOptions: ISPHttpClientOptions = {
        headers,
        body: JSON.stringify({
          Title: selectedPersonDetails.name,
          Date: new Date().toString(),
          Department: selectedPersonDetails.department,
          JobTitle: selectedPersonDetails.jobTitle,
          EmpID: selectedPersonDetails.email,
          EmpExt: selectedPersonDetails.businessPhones,
          LoanType: LoanType,
          AmountInDigits: amountInDigit.toString(),
          AmountInWords: amountInWord,
          CreatedBy: context.pageContext.user.displayName,
          PendingWith:
            selectedPersonDetails.manager === ""
              ? LoanCreationApprovers?.BusinessApprover
              : selectedPersonDetails.manager,
          BusinessApprovar:
            selectedPersonDetails.manager === ""
              ? LoanCreationApprovers?.BusinessApprover
              : selectedPersonDetails.manager,
          BusinessApprovarEmail:
            selectedPersonDetails.managerEmail === ""
              ? LoanCreationApprovers.BusinessApproverEmail
              : selectedPersonDetails.managerEmail,
          HRApprovar: LoanCreationApprovers?.HRApprover,
          FinanceApprovar: LoanCreationApprovers?.FinanceApprover,
          PayrollApprovar: LoanCreationApprovers?.HRPayRollApprovar,
          PendingDepartment: "Business Approver",
          Currency: currencySelected,
          EmployeeID: EmployeeID,
        }),
      };
      const postResponse = await context.spHttpClient.post(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('LoanRequest')/items`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      );
      if (postResponse.ok) {
        const postData = await postResponse.json();
        console.log("LoanRequest Created", postData);
        console.log("Form Element", this.formRef);
        getLoanRequest(postData.ID, CreatorDepartment);
      } else {
        alert("Loan Request Creation Failed.");
        console.log("Post Failed", postResponse);
      }
    };

    const getLoanRequest = async (ID: number, CreatorDepartment: string) => {
      const { context } = this.props;
      const Response = await context.spHttpClient.get(
        `${
          context.pageContext.web.absoluteUrl
        }/_api/web/lists/GetByTitle('LoanRequest')/items?$select=ID,Date,Department,ReferenceNumber${
          CreatorDepartment
            ? `${`&$filter=Department eq '${CreatorDepartment}'`}`
            : ""
        }`,
        SPHttpClient.configurations.v1
      );
      if (Response.ok) {
        const ResponseData = await Response.json();
        console.log("LoanRequest ResponseData", ResponseData.value);
        if (ResponseData.value?.length > 0) {
          const monthFilter = ResponseData.value?.filter(
            (data: { Date: string | number }) =>
              new Date(data.Date).getMonth() === new Date().getMonth()
          );
          const TotalCount = monthFilter?.length + 1;
          mergeRef(ID, CreatorDepartment, TotalCount);
        } else {
          mergeRef(ID, CreatorDepartment, 1);
        }
      } else {
        console.log(`Error in PaymentRequest Fetch ${Response.status}`);
      }
    };

    const mergeRef = async (
      ID: number,
      CreatorDepartment: string,
      TotalCount: number
    ) => {
      const { context } = this.props;
      const month = new Date().getMonth();
      const year = new Date().getFullYear();
      const refNumber = `${CreatorDepartment}-${year}-${
        month + 1
      }-${TotalCount}`;
      const headers: any = {
        "X-HTTP-Method": "MERGE",
        "If-Match": "*",
      };
      const spHttpClintOptions: ISPHttpClientOptions = {
        headers,
        body: JSON.stringify({
          ReferenceNumber: refNumber,
        }),
      };
      const postResponse = await context.spHttpClient.post(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('LoanRequest')/items('${ID}')`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      );
      if (postResponse.ok) {
        console.log("Form Element", this.formRef);
        setTimeout(() => {
          console.log("LoanRequest Created");
          this.setState({
            isSubmitting: false,
            submittingText:
              "Loan Request has been created and send for Business Approval",
          });
          this.formRef?.current.resetFields();
          self.setState({
            selectedPersonDetails: {
              id: "",
              value: "",
              label: "",
              email: "",
              department: "",
              jobTitle: "",
            },
          });
        }, 1000);
      } else {
        alert("Loan Request Creation Failed.");
        console.log("Post Failed", postResponse);
      }
    };

    const onFinish = (values: any) => {
      console.log("Success Loan:", values);
      this.setState({ isSubmitting: true, isNotificationOpen: true });
      postUser(values);
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log("Failed Loan:", errorInfo);
    };
    console.log("Amount In word state", amountInWord);

    const handleAddCurrency = (event: { target: { value: string } }) => {
      this.setState({
        newCurrency: event.target.value,
      });
    };

    const addCurrency = () => {
      if (this.state.newCurrency?.length < 3) {
        this.setState({
          isError: true,
          errorMessage: "Enter Valid Currency",
        });
      } else {
        this.setState({
          isNotificationOpen: true,
          submittingText: "Updating Currency....",
        });
        this.addCurrency();
      }
    };

    const selectAfter = (
      <Select
        style={{ width: 150 }}
        aria-required
        defaultValue={"Select Currency"}
        value={currencySelected}
        onChange={(newValue: string) => {
          this.setState({ currencySelected: newValue });
        }}
        options={currencyOption?.map(
          (data: { value: string; label: string }) => ({
            value: data.value,
            label: data.label,
          })
        )}
        dropdownRender={(menu) => (
          <>
            {menu}
            <Divider style={{ margin: "8px 0" }} />
            <Space style={{ padding: "0 8px 4px" }}>
              <Input
                required
                name="currency"
                value={this.state.newCurrency}
                placeholder="Please enter Currency"
                status={this.state.newCurrency?.length < 3 ? "error" : ""}
                onChange={handleAddCurrency}
              />
              <Button danger onClick={addCurrency}>
                Add
              </Button>
            </Space>
          </>
        )}
      />
    );

    return (
      <Modal
        title={`${title} Form`}
        footer={false}
        centered={true}
        open={modalOpen}
        onOk={handleClose}
        onCancel={handleClose}
        width={"90vw"}
      >
        <div className="bg-white" style={{ position: "relative" }}>
          <div
            className="container border border-3 border-dark rounded-2 mb-3"
            style={{ height: "80vh", overflowY: "scroll" }}
          >
            <h4 className="text-center  pt-3">New Loan Request</h4>
            <Form
              name="basic"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              ref={this.formRef}
              style={{
                padding: "1rem",
              }}
            >
              <Form.Item<FieldType>
                label="Employee ID"
                name="EmployeeID"
                rules={[
                  {
                    required: true,
                    message: "Please enter Employee ID!",
                  },
                ]}
              >
                <Input placeholder="Enter Employee ID...." />
              </Form.Item>

              <Row gutter={[16, 0]} className="mb-3">
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <div style={{ paddingBottom: "8px" }}>Employee Name</div>
                  <Input value={selectedPersonDetails.name} disabled />
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={12}
                  xl={12}
                  className="marginBottom"
                >
                  <div style={{ paddingBottom: "8px" }}>Date</div>
                  <Input value={new Date().toString()} disabled />
                </Col>
              </Row>

              <Row gutter={[16, 0]} className="mb-3">
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={12}
                  xl={12}
                  className="marginBottom"
                >
                  <div style={{ paddingBottom: "8px" }}>Department</div>
                  <Input value={selectedPersonDetails.department} disabled />
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={12}
                  xl={12}
                  className="marginBottom"
                >
                  <div style={{ paddingBottom: "8px" }}>Email</div>
                  <Input value={selectedPersonDetails.email} disabled />
                </Col>
              </Row>

              <Row gutter={[16, 0]} className="mb-3">
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={12}
                  xl={12}
                  className="marginBottom"
                >
                  <div style={{ paddingBottom: "8px" }}>Job Title</div>
                  <Input value={selectedPersonDetails.jobTitle} disabled />
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={12}
                  xl={12}
                  className="marginBottom"
                >
                  <div style={{ paddingBottom: "8px" }}>Ext</div>
                  <Input
                    value={selectedPersonDetails.businessPhones}
                    disabled
                  />
                </Col>
              </Row>

              <Form.Item<FieldType>
                name="LoanType"
                label="Loan Type"
                rules={[
                  {
                    required: true,
                    message: "Please select Loan Type",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value="Personal Loan">Personal Loan</Radio>
                  <Radio value="Housing Loan">Housing Loan</Radio>
                  <Radio value="Dependent Loan">Dependent Loan</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item
                label="Amount in Digits"
                name="AmountInDigits"
                rules={[
                  {
                    required: true,
                    message: "Please enter Amount in Digits!",
                    pattern: new RegExp(/^[1-9]\d*(\.\d+)?$/),
                  },
                ]}
              >
                <InputNumber
                  placeholder="Enter Amount...."
                  style={{ width: "100%" }}
                  value={amountInDigit}
                  min={0}
                  max={999999999999999}
                  addonAfter={selectAfter}
                  onChange={(value: number) => {
                    console.log(
                      "Amount In Words",
                      toWords(parseFloat(Number(value).toFixed(2)))
                    );
                    this.setState({
                      amountInDigit: parseFloat(Number(value).toFixed(2)),
                      amountInWord: toWords(
                        parseFloat(Number(value).toFixed(2))
                      ),
                    });
                  }}
                />
              </Form.Item>

              <Row gutter={[16, 0]} className="mb-3">
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                  className="marginBottom"
                >
                  <div style={{ paddingBottom: "8px" }}>Amount in Words</div>
                  <Input disabled value={amountInWord} />
                </Col>
              </Row>

              <Form.Item>
                <>
                  {!isSubmitting ? (
                    <div className="d-flex gap-2 justify-content-end">
                      <button
                        type="button"
                        className="text-white px-3 py-2 rounded"
                        style={{
                          border: "none",
                          backgroundColor: " rgb(181, 77, 38)",
                        }}
                        onClick={() => {
                          this.formRef?.current.resetFields();
                          this.setState({ amountInWord: "" });
                        }}
                      >
                        Reset Form
                      </button>
                      <button
                        type="submit"
                        className="text-white px-3 py-2 rounded"
                        style={{
                          border: "none",
                          backgroundColor: " rgb(181, 77, 38)",
                        }}
                      >
                        Submit
                      </button>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-end">
                      <button
                        type="button"
                        className="text-info px-3 py-2 rounded"
                        style={{
                          border: "none",
                          backgroundColor: "#E5E4E2",
                        }}
                      >
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="spinner-border text-success"
                            role="status"
                          />
                          <span className="text-success fw-medium fs-6">
                            Submitting.....
                          </span>
                        </div>
                      </button>
                    </div>
                  )}
                </>
              </Form.Item>
            </Form>
          </div>
          {isError && (
            <div
              className="bg-white p-2 rounded-3 shadow-lg"
              style={{ position: "absolute", top: 0, right: 0 }}
            >
              <div
                className="d-flex justify-content-end"
                onClick={() => {
                  this.setState({ isError: false, errorMessage: "" });
                }}
              >
                <div
                  className="text-white bg-danger rounded px-2"
                  style={{ cursor: "pointer" }}
                >
                  x
                </div>
              </div>
              <div
                className="d-flex justify-content-center align-items-center gap-1"
                style={{ height: "60px" }}
              >
                <img
                  src={require("./assets/Rejected.svg")}
                  width={"25px"}
                  height={"25px"}
                />
                <div className="fs-6 fw-medium">{errorMessage}</div>
              </div>
            </div>
          )}
          {isNotificationOpen && (
            <div
              className="bg-white p-2 rounded-3 shadow-lg"
              style={{ position: "absolute", top: 0, right: 0 }}
            >
              <div
                className="d-flex justify-content-end"
                onClick={() => {
                  this.setState({ isNotificationOpen: false });
                }}
              >
                <div
                  className="text-white bg-danger rounded px-2"
                  style={{ cursor: "pointer" }}
                >
                  x
                </div>
              </div>
              <div
                className="d-flex justify-content-center align-items-center gap-1"
                style={{ height: "60px" }}
              >
                {submittingText === "Requesting for Loan....." ? (
                  <div className="spinner-border text-info" role="status" />
                ) : (
                  <img
                    src={require("./assets/Approved.svg")}
                    width={"25px"}
                    height={"25px"}
                  />
                )}
                <div className="fs-6 fw-medium">{submittingText}</div>
              </div>
            </div>
          )}
        </div>
      </Modal>
    );
  }
}
