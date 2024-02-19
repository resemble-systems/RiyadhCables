import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Col, Modal, Row, Timeline } from "antd";
import * as React from "react";
import "./index.css";
import moment from "moment";
import { ClockCircleOutlined } from "@ant-design/icons";
import { SPHttpClient, ISPHttpClientOptions } from "@microsoft/sp-http";
import TextArea from "antd/es/input/TextArea";

export interface ILoanRequestFormViewProps {
  self: any;
  title: string;
  context: WebPartContext;
  modalOpen: boolean;
  handleClose: () => void;
  modalData: any;
  isDataLoading: boolean;
  modalDataError: boolean;
  getLoanRequest: any;
  loadingText: string;
}
interface ILoanRequestFormViewState {
  openRejectComments: boolean;
  reasonForRejection: string;
  isError: boolean;
  errorMessage: string;
}
interface DataType {
  key: React.Key;
  Title: string;
  Status: string;
  Department: string;
  Date: string;
  JobTitle: string;
  EmployeeID: string;
  EmployeeExt: string;
  AmountInDigits: string;
  AmountInWords: string;
  CreatedBy: string;
  PendingWith: string;
  BusinessApproval: string;
  HRApproval: string;
  Created: string;
  BusinessApprovalTime: string;
  HRApprovalTime: string;
  BusinessApprovar: string;
  HRApprovar: string;
  FinanceApproval: string;
  FinanceApprovalTime: string;
  LoanType: string;
  FinanceApprovar: string;
  PayrollApprovar: string;
  PayrollApprovalBeforeHR: string;
  PayrollApprovalAfterHR: string;
  PayrollApprovalAfterHRTime: string;
  PayrollApprovalBeforeHRTime: string;
  ReasonForRejection: string;
  ReferenceNumber: string;
  Currency: string;
  EmployeeeID: string;
  RejectedBy: string;
  Rejectors: any;
  Approvers: any;
}

export default class LoanRequestFormView extends React.Component<
  ILoanRequestFormViewProps,
  ILoanRequestFormViewState
> {
  public constructor(
    props: ILoanRequestFormViewProps,
    state: ILoanRequestFormViewState
  ) {
    super(props);
    this.state = {
      openRejectComments: false,
      reasonForRejection: "",
      isError: false,
      errorMessage: "",
    };
  }
  public componentDidMount(): void {}

  public updateApproval(
    status: string,
    ID: React.Key,
    BusinessApproval: string,
    HRApproval: string,
    FinanceApproval: string,
    HRApprover: string,
    FinanceApprover: string,
    PayrollApprovar: string,
    PayrollApprovalBeforeHR: string,
    PayrollApprovalAfterHR: string,
    BusinessApprovar: string,
    RejectedBy: string,
    Approvers: any,
    Rejectors: any
  ): void {
    const { reasonForRejection } = this.state;
    const { context, getLoanRequest, self } = this.props;
    this.setState({ openRejectComments: false });
    const headers: any = {
      "X-HTTP-Method": "MERGE",
      "If-Match": "*",
    };
    const updateApproval = async (Body: {
      PendingWith?: string;
      BusinessApproval?: string;
      BusinessApprovalTime?: string;
      ITApproval?: string;
      ITApprovalTime?: string;
      Status?: string;
    }) => {
      const spHttpClintOptions: ISPHttpClientOptions = {
        headers,
        body: JSON.stringify(Body),
      };
      const postResponse = await context.spHttpClient.post(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('LoanRequest')/items('${ID}')`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      );
      if (postResponse.ok) {
        console.log("User Updated", postResponse);
        getLoanRequest(ID);
      } else {
        this.setState({
          isError: true,
          errorMessage: "Failed to update Approval Status",
        });
        console.log("Post Failed", postResponse);
      }
    };
    if (BusinessApproval === "Pending") {
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });
      const Body = {
        PendingWith: status === "Approved" ? PayrollApprovar : "None",
        BusinessApproval: status,
        BusinessApprovalTime: new Date().toString(),
        Status:
          status === "Approved" ? "Open" : `Rejected by Business Approvar`,
        ReasonForRejection: status === "Rejected" ? reasonForRejection : "",
        PendingDepartment:
          status === "Approved" ? "Payroll Approver" : "Closed",
        RejectedBy:
          status === "Rejected"
            ? context.pageContext.user.displayName
            : RejectedBy,
        Approvers:
          status === "Approved"
            ? JSON.stringify([
                ...Approvers,
                { name: context.pageContext.user.displayName },
              ])
            : JSON.stringify([...Approvers]),
        Rejectors:
          status === "Rejected"
            ? JSON.stringify([
                ...Rejectors,
                { name: context.pageContext.user.displayName },
              ])
            : JSON.stringify([...Rejectors]),
      };
      updateApproval(Body);
    }
    if (
      BusinessApproval === "Approved" &&
      PayrollApprovalBeforeHR === "Pending"
    ) {
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });
      const Body = {
        PendingWith: status === "Approved" ? HRApprover : "None",
        PendingDepartment: status === "Approved" ? "HR Approver" : "Closed",
        PayrollApprovalBeforeHR: status,
        PayrollApprovalBeforeHRTime: new Date().toString(),
        Status: status === "Approved" ? "Open" : `Rejected by Payroll Approvar`,
        ReasonForRejection: status === "Rejected" ? reasonForRejection : "",
        RejectedBy:
          status === "Rejected"
            ? context.pageContext.user.displayName
            : RejectedBy,
        Approvers:
          status === "Approved"
            ? JSON.stringify([
                ...Approvers,
                { name: context.pageContext.user.displayName },
              ])
            : JSON.stringify([...Approvers]),
        Rejectors:
          status === "Rejected"
            ? JSON.stringify([
                ...Rejectors,
                { name: context.pageContext.user.displayName },
              ])
            : JSON.stringify([...Rejectors]),
      };
      updateApproval(Body);
    }
    if (PayrollApprovalBeforeHR === "Approved" && HRApproval === "Pending") {
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });
      const Body = {
        PendingWith: status === "Approved" ? PayrollApprovar : "None",

        PendingDepartment:
          status === "Approved" ? "Payroll Approver" : "Closed",
        HRApproval: status,
        HRApprovalTime: new Date().toString(),
        Status: status === "Approved" ? "Open" : `Rejected by HR Approver`,
        ReasonForRejection: status === "Rejected" ? reasonForRejection : "",
        RejectedBy:
          status === "Rejected"
            ? context.pageContext.user.displayName
            : RejectedBy,
        Approvers:
          status === "Approved"
            ? JSON.stringify([
                ...Approvers,
                { name: context.pageContext.user.displayName },
              ])
            : JSON.stringify([...Approvers]),
        Rejectors:
          status === "Rejected"
            ? JSON.stringify([
                ...Rejectors,
                { name: context.pageContext.user.displayName },
              ])
            : JSON.stringify([...Rejectors]),
      };
      updateApproval(Body);
    }
    if (HRApproval === "Approved" && PayrollApprovalAfterHR === "Pending") {
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });
      const Body = {
        PendingWith: status === "Approved" ? FinanceApprover : "None",
        PendingDepartment:
          status === "Approved" ? "Finance Approver" : "Closed",
        PayrollApprovalAfterHR: status,
        PayrollApprovalAfterHRTime: new Date().toString(),
        Status: status === "Approved" ? "Open" : `Rejected by Payroll Approvar`,
        ReasonForRejection: status === "Rejected" ? reasonForRejection : "",
        RejectedBy:
          status === "Rejected"
            ? context.pageContext.user.displayName
            : RejectedBy,
        Approvers:
          status === "Approved"
            ? JSON.stringify([
                ...Approvers,
                { name: context.pageContext.user.displayName },
              ])
            : JSON.stringify([...Approvers]),
        Rejectors:
          status === "Rejected"
            ? JSON.stringify([
                ...Rejectors,
                { name: context.pageContext.user.displayName },
              ])
            : JSON.stringify([...Rejectors]),
      };
      updateApproval(Body);
    }
    if (PayrollApprovalAfterHR === "Approved") {
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });
      const Body = {
        PendingWith: "Closed",
        PendingDepartment: "Closed",
        FinanceApproval: status,
        FinanceApprovalTime: new Date().toString(),
        Status:
          status === "Approved"
            ? `Approved by Finance Approver`
            : `Rejected by Finance Approver`,
        ReasonForRejection: status === "Rejected" ? reasonForRejection : "",
        RejectedBy:
          status === "Rejected"
            ? context.pageContext.user.displayName
            : RejectedBy,
        Approvers:
          status === "Approved"
            ? JSON.stringify([
                ...Approvers,
                { name: context.pageContext.user.displayName },
              ])
            : JSON.stringify([...Approvers]),
        Rejectors:
          status === "Rejected"
            ? JSON.stringify([
                ...Rejectors,
                { name: context.pageContext.user.displayName },
              ])
            : JSON.stringify([...Rejectors]),
      };
      updateApproval(Body);
    }
  }

  public render(): React.ReactElement<ILoanRequestFormViewProps> {
    const {
      modalOpen,
      handleClose,
      modalData,
      isDataLoading,
      context,
      modalDataError,
      loadingText,
    } = this.props;

    const { openRejectComments, reasonForRejection, isError, errorMessage } =
      this.state;

    return (
      <Modal
        title={`Loan Request ${modalData[0]?.ReferenceNumber}`}
        footer={false}
        centered={true}
        open={modalOpen}
        onOk={handleClose}
        onCancel={handleClose}
        width={"90vw"}
      >
        <div className="bg-white">
          <div
            className="container-lg border border-3 border-dark rounded-2 my-3 py-3"
            style={{ height: "80vh", overflowY: "scroll" }}
          >
            <h4 className="text-center">Loan Request</h4>
            {isDataLoading ? (
              <div
                className="d-flex justify-content-center align-items-center flex-column"
                style={{ height: "70vh" }}
              >
                <div className="spinner-border text-info" role="status" />
                <div className="fs-5 fw-medium mt-3">{loadingText}</div>
              </div>
            ) : (
              <>
                {modalDataError ? (
                  <div
                    className="d-flex justify-content-center align-items-center flex-column"
                    style={{ height: "70vh" }}
                  >
                    <img
                      src={require("./assets/Rejected.svg")}
                      width={"40px"}
                      height={"40px"}
                    />
                    <div className="fs-6 fw-medium mt-3">Data not found</div>
                  </div>
                ) : (
                  <>
                    {modalData?.map((data: DataType) => (
                      <div>
                        <div className="d-flex flex-column gap-3 formData">
                          <div>
                            <div>Employee ID</div>
                            <input value={data.EmployeeeID} disabled />
                          </div>
                          <div>
                            <div>Reference Number</div>
                            <input value={data.ReferenceNumber} disabled />
                          </div>
                          <div className="d-md-flex gap-2">
                            <div className="flex-fill">
                              <div>Department</div>
                              <input value={data.Department} disabled />
                            </div>
                            <div className="flex-fill">
                              <div>Date</div>
                              <input value={data.Date} disabled />
                            </div>
                          </div>
                          <div className="d-md-flex gap-3">
                            <div className="flex-fill">
                              <div>Employee Name</div>
                              <input value={data.Title} disabled />
                            </div>
                            <div className="flex-fill">
                              <div>ID</div>
                              <input value={data.EmployeeID} disabled />
                            </div>
                          </div>
                          <div className="d-md-flex gap-3">
                            <div className="flex-fill">
                              <div>Job Title</div>
                              <input value={data.JobTitle} disabled />
                            </div>
                            <div className="flex-fill">
                              <div>Ext</div>
                              <input value={data.EmployeeExt} disabled />
                            </div>
                          </div>

                          <div className="d-md-flex gap-3">
                            <div className="flex-fill">
                              <div>Amount in Digits</div>
                              <input
                                value={`${data.AmountInDigits}${" "}${
                                  data.Currency
                                }`}
                                disabled
                              />
                            </div>
                            <div className="flex-fill">
                              <div>Amount in Words</div>
                              <input
                                value={`${data.AmountInWords}${" "}${
                                  data.Currency
                                }`}
                                disabled
                              />
                            </div>
                          </div>

                          <div className="d-md-flex gap-3">
                            <div className="flex-fill">
                              <div>Loan Type</div>
                              <input value={data.LoanType} disabled />
                            </div>
                            <div className="flex-fill">
                              <div>Pending With</div>
                              <input value={data.PendingWith} disabled />
                            </div>
                          </div>

                          <div className="d-md-flex gap-3">
                            <div className="flex-fill">
                              <div>Business Approvar</div>
                              <input value={data.BusinessApprovar} disabled />
                            </div>
                            <div className="flex-fill">
                              <div>Business Approval</div>
                              <input value={data.BusinessApproval} disabled />
                            </div>
                          </div>
                          {data.BusinessApproval === "Approved" && (
                            <div className="d-md-flex gap-3">
                              <div className="flex-fill">
                                <div>Payroll Approvar</div>
                                <input value={data.PayrollApprovar} disabled />
                              </div>
                              <div className="flex-fill">
                                <div>Payroll Approval</div>
                                <input
                                  value={data.PayrollApprovalBeforeHR}
                                  disabled
                                />
                              </div>
                            </div>
                          )}
                          {data.PayrollApprovalBeforeHR === "Approved" && (
                            <div className="d-md-flex gap-3">
                              <div className="flex-fill">
                                <div>HR Approvar</div>
                                <input value={data.HRApprovar} disabled />
                              </div>
                              <div className="flex-fill">
                                <div>HR Approval</div>
                                <input value={data.HRApproval} disabled />
                              </div>
                            </div>
                          )}
                          {data.PayrollApprovalAfterHR === "Approved" && (
                            <div className="d-md-flex gap-3">
                              <div className="flex-fill">
                                <div>Finance Approvar</div>
                                <input value={data.FinanceApprovar} disabled />
                              </div>
                              <div className="flex-fill">
                                <div>Finance Approval</div>
                                <input value={data.FinanceApproval} disabled />
                              </div>
                            </div>
                          )}
                          {data.Status?.split(" ")[0] === "Rejected" && (
                            <div>
                              <div>Reason For Rejection</div>
                              <input value={data.ReasonForRejection} disabled />
                            </div>
                          )}
                          <div>
                            <div className="text-center mb-3">
                              Approval Process
                            </div>
                            {data.BusinessApproval === "Pending" && (
                              <Timeline
                                mode={"left"}
                                items={[
                                  {
                                    label: `${moment(data?.Created)?.format(
                                      "Do MMM YYYY"
                                    )}
                                ${moment(data?.Created)?.format("h:mm a")}`,
                                    children: `${data.CreatedBy} created a Loan Request`,
                                    color: "green",
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children:
                                      "Loan Request has been send for Business Approval.",
                                  },
                                ]}
                              />
                            )}
                            {data.BusinessApproval === "Approved" &&
                            data.PayrollApprovalBeforeHR === "Pending" ? (
                              <Timeline
                                mode={"left"}
                                items={[
                                  {
                                    label: `${moment(data?.Created)?.format(
                                      "Do MMM YYYY"
                                    )}
                              ${moment(data?.Created)?.format("h:mm a")}`,
                                    children: `${data.CreatedBy} created a Loan Request`,
                                    color: "green",
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children:
                                      "Loan Request has been send for Business Approval.",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.BusinessApprovalTime
                                    )?.format("Do MMM YYYY")}
                                ${moment(data?.BusinessApprovalTime)?.format(
                                  "h:mm a"
                                )}`,
                                    children: `Loan Request has been Approved by ${data.BusinessApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for Payroll Approval",
                                  },
                                ]}
                              />
                            ) : (
                              <></>
                            )}
                            {data.BusinessApproval === "Rejected" && (
                              <Timeline
                                mode={"left"}
                                items={[
                                  {
                                    label: `${moment(data?.Created)?.format(
                                      "Do MMM YYYY"
                                    )}
                           ${moment(data?.Created)?.format("h:mm a")}`,
                                    children: `${data.CreatedBy} created a Loan Request`,
                                    color: "green",
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for Business Approval",
                                  },
                                  {
                                    color: "red",
                                    label: `${moment(
                                      data?.BusinessApprovalTime
                                    )?.format("Do MMM YYYY")}
                                  ${moment(data?.BusinessApprovalTime)?.format(
                                    "h:mm a"
                                  )}`,
                                    children: `Loan Request Created has been Rejected by ${data.BusinessApprovar}.`,
                                  },
                                ]}
                              />
                            )}
                            {data.PayrollApprovalBeforeHR === "Approved" &&
                            data.HRApproval === "Pending" ? (
                              <Timeline
                                mode={"left"}
                                items={[
                                  {
                                    label: `${moment(data?.Created)?.format(
                                      "Do MMM YYYY"
                                    )}
                            ${moment(data?.Created)?.format("h:mm a")}`,
                                    children: `${data.CreatedBy} created a Loan Request`,
                                    color: "green",
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for Business Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.BusinessApprovalTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(data?.BusinessApprovalTime)?.format(
                                "h:mm a"
                              )}`,
                                    children: `Loan Request Created has been Approved by ${data.BusinessApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for Payroll Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.HRApprovalTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(
                                data?.PayrollApprovalBeforeHRTime
                              )?.format("h:mm a")}`,
                                    children: `Loan Request Created has been Approved by ${data.PayrollApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for HR Approval",
                                  },
                                ]}
                              />
                            ) : (
                              <></>
                            )}
                            {data.PayrollApprovalBeforeHR === "Rejected" && (
                              <Timeline
                                mode={"left"}
                                items={[
                                  {
                                    label: `${moment(data?.Created)?.format(
                                      "Do MMM YYYY"
                                    )}
                         ${moment(data?.Created)?.format("h:mm a")}`,
                                    children: `${data.CreatedBy} created a Loan Request`,
                                    color: "green",
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for Business Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.BusinessApprovalTime
                                    )?.format("Do MMM YYYY")}
                           ${moment(data?.BusinessApprovalTime)?.format(
                             "h:mm a"
                           )}`,
                                    children: `Loan Request Created has been Approved by ${data.BusinessApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for Payroll Approval",
                                  },
                                  {
                                    color: "red",
                                    label: `${moment(
                                      data?.PayrollApprovalBeforeHRTime
                                    )?.format("Do MMM YYYY")}
                           ${moment(data?.HRApprovalTime)?.format("h:mm a")}`,
                                    children: `Loan Request Created has been Rejected by ${data.PayrollApprovar}.`,
                                  },
                                ]}
                              />
                            )}

                            {data.HRApproval === "Approved" &&
                            data.PayrollApprovalAfterHR === "Pending" ? (
                              <Timeline
                                mode={"left"}
                                items={[
                                  {
                                    label: `${moment(data?.Created)?.format(
                                      "Do MMM YYYY"
                                    )}
                            ${moment(data?.Created)?.format("h:mm a")}`,
                                    children: `${data.CreatedBy} created a Loan Request`,
                                    color: "green",
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for Business Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.BusinessApprovalTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(data?.BusinessApprovalTime)?.format(
                                "h:mm a"
                              )}`,
                                    children: `Loan Request Created has been Approved by ${data.BusinessApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for Payroll Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.PayrollApprovalBeforeHRTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(
                                data?.PayrollApprovalBeforeHRTime
                              )?.format("h:mm a")}`,
                                    children: `Loan Request Created has been Approved by ${data.PayrollApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for HR Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.HRApprovalTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(data?.HRApprovalTime)?.format(
                                "h:mm a"
                              )}`,
                                    children: `Loan Request Created has been Approved by ${data.HRApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children:
                                      "Your Loan request will be forwarded to Finance",
                                  },
                                ]}
                              />
                            ) : (
                              <></>
                            )}
                            {data.HRApproval === "Rejected" && (
                              <Timeline
                                mode={"left"}
                                items={[
                                  {
                                    label: `${moment(data?.Created)?.format(
                                      "Do MMM YYYY"
                                    )}
                            ${moment(data?.Created)?.format("h:mm a")}`,
                                    children: `${data.CreatedBy} created a Loan Request`,
                                    color: "green",
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for Business Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.BusinessApprovalTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(data?.BusinessApprovalTime)?.format(
                                "h:mm a"
                              )}`,
                                    children: `Loan Request Created has been Approved by ${data.BusinessApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for Payroll Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.PayrollApprovalBeforeHRTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(
                                data?.PayrollApprovalBeforeHRTime
                              )?.format("h:mm a")}`,
                                    children: `Loan Request Created has been Approved by ${data.PayrollApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for HR Approval",
                                  },
                                  {
                                    color: "red",
                                    label: `${moment(
                                      data?.HRApprovalTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(data?.HRApprovalTime)?.format(
                                "h:mm a"
                              )}`,
                                    children: `Loan Request Created has been Rejected by ${data.HRApprovar}.`,
                                  },
                                ]}
                              />
                            )}
                            {data.PayrollApprovalAfterHR === "Approved" &&
                            data.FinanceApproval === "Pending" ? (
                              <Timeline
                                mode={"left"}
                                items={[
                                  {
                                    label: `${moment(data?.Created)?.format(
                                      "Do MMM YYYY"
                                    )}
                            ${moment(data?.Created)?.format("h:mm a")}`,
                                    children: `${data.CreatedBy} created a Loan Request`,
                                    color: "green",
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for Business Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.BusinessApprovalTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(data?.BusinessApprovalTime)?.format(
                                "h:mm a"
                              )}`,
                                    children: `Loan Request Created has been Approved by ${data.BusinessApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for Payroll Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.PayrollApprovalBeforeHRTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(
                                data?.PayrollApprovalBeforeHRTime
                              )?.format("h:mm a")}`,
                                    children: `Loan Request Created has been Approved by ${data.PayrollApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for HR Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.HRApprovalTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(data?.HRApprovalTime)?.format(
                                "h:mm a"
                              )}`,
                                    children: `Loan Request Created has been Approved by ${data.HRApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children:
                                      "Your Loan request will be forwarded to Finance",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.PayrollApprovalAfterHRTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(
                                data?.PayrollApprovalAfterHRTime
                              )?.format("h:mm a")}`,
                                    children: `Loan Request Created has been Forwarded to Finance by ${data.PayrollApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for Finance Approval",
                                  },
                                ]}
                              />
                            ) : (
                              <></>
                            )}
                            {data.FinanceApproval === "Approved" && (
                              <Timeline
                                mode={"left"}
                                items={[
                                  {
                                    label: `${moment(data?.Created)?.format(
                                      "Do MMM YYYY"
                                    )}
                            ${moment(data?.Created)?.format("h:mm a")}`,
                                    children: `${data.CreatedBy} created a Loan Request`,
                                    color: "green",
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for Business Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.BusinessApprovalTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(data?.BusinessApprovalTime)?.format(
                                "h:mm a"
                              )}`,
                                    children: `Loan Request Created has been Approved by ${data.BusinessApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for Payroll Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.PayrollApprovalBeforeHRTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(
                                data?.PayrollApprovalBeforeHRTime
                              )?.format("h:mm a")}`,
                                    children: `Loan Request Created has been Approved by ${data.PayrollApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for HR Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.HRApprovalTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(data?.HRApprovalTime)?.format(
                                "h:mm a"
                              )}`,
                                    children: `Loan Request Created has been Approved by ${data.HRApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children:
                                      "Your Loan request will be forwarded to Finance",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.PayrollApprovalAfterHRTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(
                                data?.PayrollApprovalAfterHRTime
                              )?.format("h:mm a")}`,
                                    children: `Loan Request Created has been Forwarded to Finance by ${data.PayrollApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for Finance Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.FinanceApprovalTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(data?.FinanceApprovalTime)?.format(
                                "h:mm a"
                              )}`,
                                    children: `Loan Request Created has been Approved by ${data.FinanceApprovar}.`,
                                  },
                                ]}
                              />
                            )}
                            {data.FinanceApproval === "Rejected" && (
                              <Timeline
                                mode={"left"}
                                items={[
                                  {
                                    label: `${moment(data?.Created)?.format(
                                      "Do MMM YYYY"
                                    )}
                            ${moment(data?.Created)?.format("h:mm a")}`,
                                    children: `${data.CreatedBy} created a Loan Request`,
                                    color: "green",
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for Business Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.BusinessApprovalTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(data?.BusinessApprovalTime)?.format(
                                "h:mm a"
                              )}`,
                                    children: `Loan Request Created has been Approved by ${data.BusinessApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for Payroll Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.PayrollApprovalBeforeHRTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(
                                data?.PayrollApprovalBeforeHRTime
                              )?.format("h:mm a")}`,
                                    children: `Loan Request Created has been Approved by ${data.PayrollApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for HR Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.HRApprovalTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(data?.HRApprovalTime)?.format(
                                "h:mm a"
                              )}`,
                                    children: `Loan Request Created has been Approved by ${data.HRApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children:
                                      "Your Loan request will be forwarded to Finance",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.PayrollApprovalAfterHRTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(
                                data?.PayrollApprovalAfterHRTime
                              )?.format("h:mm a")}`,
                                    children: `Loan Request Created has been Forwarded to Finance by ${data.PayrollApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for Finance Approval",
                                  },
                                  {
                                    color: "red",
                                    label: `${moment(
                                      data?.FinanceApprovalTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(data?.FinanceApprovalTime)?.format(
                                "h:mm a"
                              )}`,
                                    children: `Loan Request Created has been Rejected by ${data.FinanceApprovar}.`,
                                  },
                                ]}
                              />
                            )}
                          </div>
                        </div>

                        {openRejectComments ? (
                          <>
                            <Row>
                              <Col
                                span={12}
                                offset={12}
                                style={{ fontSize: "1rem", fontWeight: 600 }}
                              >
                                <div>Reason for rejection</div>
                                <TextArea
                                  showCount
                                  maxLength={500}
                                  style={{ height: 120 }}
                                  value={reasonForRejection}
                                  onChange={(event) => {
                                    this.setState({
                                      reasonForRejection: event.target.value,
                                    });
                                  }}
                                />
                              </Col>
                            </Row>
                            <div className="d-flex justify-content-end mt-4 gap-3">
                              <button
                                type="submit"
                                className="text-white bg-danger px-3 py-2 rounded"
                                style={{
                                  border: "none",
                                }}
                                onClick={() => {
                                  if (reasonForRejection?.length > 3) {
                                    this.updateApproval(
                                      "Rejected",
                                      data.key,
                                      data.BusinessApproval,
                                      data.HRApproval,
                                      data.FinanceApproval,
                                      data.HRApprovar,
                                      data.FinanceApprovar,
                                      data.PayrollApprovar,
                                      data.PayrollApprovalBeforeHR,
                                      data.PayrollApprovalAfterHR,
                                      data.BusinessApprovar,
                                      data.RejectedBy,
                                      data.Approvers,
                                      data.Rejectors
                                    );
                                  } else {
                                    this.setState({
                                      isError: true,
                                      errorMessage:
                                        "Please add the reason for rejection",
                                    });
                                  }
                                }}
                              >
                                Submit
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            {data.Status === "Open" ? (
                              <>
                                {data.PendingWith ===
                                context.pageContext.user.displayName ? (
                                  <div className="d-flex justify-content-end mt-3 gap-3">
                                    <div
                                      className="py-2"
                                      style={{
                                        fontSize: "1rem",
                                        fontWeight: "600",
                                      }}
                                    >
                                      {data.BusinessApproval === "Pending"
                                        ? "Business Approval"
                                        : data.PayrollApprovalBeforeHR ===
                                          "Pending"
                                        ? "Payroll Approval"
                                        : data.PayrollApprovalAfterHR ===
                                          "Pending"
                                        ? ""
                                        : data.HRApproval === "Pending"
                                        ? "HR Approval"
                                        : "Finance Approval"}
                                    </div>
                                    <button
                                      type="submit"
                                      className="text-white bg-success px-3 py-2 rounded"
                                      style={{
                                        border: "none",
                                      }}
                                      onClick={() => {
                                        this.updateApproval(
                                          "Approved",
                                          data.key,
                                          data.BusinessApproval,
                                          data.HRApproval,
                                          data.FinanceApproval,
                                          data.HRApprovar,
                                          data.FinanceApprovar,
                                          data.PayrollApprovar,
                                          data.PayrollApprovalBeforeHR,
                                          data.PayrollApprovalAfterHR,
                                          data.BusinessApprovar,
                                          data.RejectedBy,
                                          data.Approvers,
                                          data.Rejectors
                                        );
                                      }}
                                    >
                                      {data.HRApproval === "Approved" &&
                                      data.PayrollApprovalAfterHR === "Pending"
                                        ? "Forward to Finance"
                                        : "Approve"}
                                    </button>
                                    {data.HRApproval === "Approved" &&
                                    data.PayrollApprovalAfterHR ===
                                      "Pending" ? (
                                      <></>
                                    ) : (
                                      <button
                                        type="submit"
                                        className="text-white bg-danger px-3 py-2 rounded"
                                        style={{
                                          border: "none",
                                        }}
                                        onClick={() => {
                                          this.setState({
                                            openRejectComments: true,
                                          });
                                        }}
                                      >
                                        Reject
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <></>
                                )}
                              </>
                            ) : (
                              <></>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
          {isError && (
            <div
              className="bg-white p-2 rounded-3 shadow-lg"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                zIndex: 9999999999999,
              }}
            >
              <div
                className="d-flex justify-content-end"
                onClick={() => {
                  this.setState({ isError: false });
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
        </div>
      </Modal>
    );
  }
}
