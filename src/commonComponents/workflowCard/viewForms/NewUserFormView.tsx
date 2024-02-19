import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Col, Modal, Row, Timeline } from "antd";
import * as React from "react";
import "./index.css";
import moment from "moment";
import { ClockCircleOutlined } from "@ant-design/icons";
import { SPHttpClient, ISPHttpClientOptions } from "@microsoft/sp-http";
import TextArea from "antd/es/input/TextArea";

export interface INewUserFormViewProps {
  self: any;
  title: string;
  context: WebPartContext;
  modalOpen: boolean;
  handleClose: () => void;
  modalData: any;
  isDataLoading: boolean;
  modalDataError: boolean;
  getNewUser: any;
  loadingText: string;
}
interface INewUserFormViewState {
  openRejectComments: boolean;
  reasonForRejection: string;
  isError: boolean;
  errorMessage: string;
}
interface DataType {
  key: React.Key;
  Title: string;
  LoginName: string;
  Status: string;
  Department: string;
  Date: string;
  EmailType: string;
  InternetAccess: string;
  Remarks: string;
  ITSM: string;
  CreatedBy: string;
  PendingWith: string;
  BusinessApproval: string;
  ITApproval: string;
  Created: string;
  BusinessApprovalTime: string;
  ITApprovalTime: string;
  BusinessApprovar: string;
  ITApprovar: string;
  AdditionalITApprovar: string;
  ReasonForRejection: string;
  ApprovalBy: string;
  ITTechnician: string;
  ITTechnicianApprovalTime: string;
  ITTechnicianApproval: string;
  ReferenceNumber: string;
  EmployeeType: string;
  EmployeeNo: string;
  UserCreatedBy: string;
  VPN: string;
  IsVPN: string;
  IsEmail: string;
  RejectedBy: string;
  Approvers: any;
  Rejectors: any;
}
export default class NewUserFormView extends React.Component<
  INewUserFormViewProps,
  INewUserFormViewState
> {
  public constructor(
    props: INewUserFormViewProps,
    state: INewUserFormViewState
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
    ITApprover: string,
    AdditionalITApprovar: string,
    ITApproval: string,
    ITTechnician: string,
    BusinessApprovar: string,
    RejectedBy: string,
    Approvers: any,
    Rejectors: any
  ): void {
    const { context, getNewUser, self } = this.props;
    const { reasonForRejection } = this.state;
    const headers: any = {
      "X-HTTP-Method": "MERGE",
      "If-Match": "*",
    };
    this.setState({ openRejectComments: false });
    const updateApproval = async (Body: {
      PendingWith: string;
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
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('NewUser')/items('${ID}')`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      );
      if (postResponse.ok) {
        console.log("User Updated", postResponse);
        getNewUser(ID);
      } else {
        console.log("Post Failed", postResponse);
      }
    };
    if (BusinessApproval === "Pending") {
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });
      const Body = {
        PendingWith:
          status === "Approved"
            ? `${ITApprover},${AdditionalITApprovar}`
            : "None",
        PendingDepartment: status === "Approved" ? `IT Approvers` : "Closed",
        BusinessApproval: status,
        BusinessApprovalTime: new Date().toString(),
        Status:
          status === "Approved" ? "Open" : `Rejected by Business Approvar`,
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
    if (BusinessApproval === "Approved" && ITApproval === "Pending") {
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });
      const Body = {
        PendingWith: status === "Approved" ? ITTechnician : "None",
        PendingDepartment: status === "Approved" ? `IT Technician` : "Closed",
        ITApproval: status,
        ITApprovalTime: new Date().toString(),
        Status: status === "Approved" ? `Open` : `Rejected by IT Approver`,
        ReasonForRejection: status === "Rejected" ? reasonForRejection : "",
        ApprovalBy: context.pageContext.user.displayName,
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
    if (ITApproval === "Approved") {
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });
      const Body = {
        PendingWith: "Closed",
        PendingDepartment: status === "Approved" ? `Closed` : "Closed",
        ITTechnicianApproval: status,
        ITTechnicianApprovalTime: new Date().toString(),
        Status: "User Created",
        UserCreatedBy: context.pageContext.user.displayName,
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

  public render(): React.ReactElement<INewUserFormViewProps> {
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
        title={`User Creation Request ${modalData[0]?.ReferenceNumber}`}
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
            <h4 className="text-center">User Creation Request</h4>
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
                            <div>Reference Number</div>
                            <input value={data.ReferenceNumber} disabled />
                          </div>
                          <div>
                            <div>Request For</div>
                            <input value={data.EmployeeType} disabled />
                          </div>
                          <div className="d-md-flex gap-3">
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
                            {data.EmployeeType !== "External User" && (
                              <div className="flex-fill">
                                <div>Employee No</div>
                                <input value={data.EmployeeNo} disabled />
                              </div>
                            )}
                            <div className="flex-fill">
                              <div>Requester Name</div>
                              <input value={data.LoginName} disabled />
                            </div>
                          </div>
                          {data.EmployeeType !== "External User" && (
                            <>
                              <div>
                                <div>Email Address</div>
                                <input
                                  value={
                                    data.IsEmail === "Yes" ? data.Title : "No"
                                  }
                                  disabled
                                />
                              </div>
                              <div>
                                <div>VPN</div>
                                <input
                                  value={data.IsVPN === "Yes" ? data.VPN : "No"}
                                  disabled
                                />
                              </div>
                              <div>
                                <div>Internet Access</div>
                                <input value={data.InternetAccess} disabled />
                              </div>
                            </>
                          )}
                          {data.EmployeeType === "External User" && (
                            <div>
                              <div>VPN</div>
                              <input
                                value={data.IsVPN === "Yes" ? data.VPN : "No"}
                                disabled
                              />
                            </div>
                          )}
                          {data.Remarks?.length > 0 && (
                            <div>
                              <div>Remarks</div>
                              <input value={data.Remarks} disabled />
                            </div>
                          )}
                          {data.ITSM?.length > 0 && (
                            <div>
                              <div>ITSM</div>
                              <input value={data.ITSM} disabled />
                            </div>
                          )}
                          {data.PendingWith !== "Closed" && (
                            <div>
                              <div>Pending With</div>
                              <input value={data.PendingWith} disabled />
                            </div>
                          )}
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
                                <div>IT Approvar</div>
                                <input
                                  value={`${data.ITApprovar}, ${data.AdditionalITApprovar}`}
                                  disabled
                                />
                              </div>
                              <div className="flex-fill">
                                <div>IT Approval</div>
                                <input value={data.ITApproval} disabled />
                              </div>
                            </div>
                          )}
                          {data.Status?.split(" ")[0] === "Rejected" && (
                            <div>
                              <div>Reason For Rejection</div>
                              <input value={data.ReasonForRejection} disabled />
                            </div>
                          )}
                          {data.Status === "User Created" && (
                            <div>
                              <div>Completed By</div>
                              <input value={data.UserCreatedBy} disabled />
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
                                    children: `${data.CreatedBy} created a new user`,
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
                                      " User Created has been send for Business Approval.",
                                  },
                                ]}
                              />
                            )}
                            {data.BusinessApproval === "Approved" &&
                            data.ITApproval === "Pending" ? (
                              <Timeline
                                mode={"left"}
                                items={[
                                  {
                                    label: `${moment(data?.Created)?.format(
                                      "Do MMM YYYY"
                                    )}
                              ${moment(data?.Created)?.format("h:mm a")}`,
                                    children: `${data.CreatedBy} created a new user`,
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
                                    children: `User Created has been Approved by ${data.BusinessApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for IT Approval",
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
                                    children: `${data.CreatedBy} created a new user`,
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
                                    children: `User Created has been Rejected by ${data.BusinessApprovar}.`,
                                  },
                                ]}
                              />
                            )}
                            {data.ITApproval === `Approved` &&
                            data.ITTechnicianApproval === "Pending" ? (
                              <Timeline
                                mode={"left"}
                                items={[
                                  {
                                    label: `${moment(data?.Created)?.format(
                                      "Do MMM YYYY"
                                    )}
                            ${moment(data?.Created)?.format("h:mm a")}`,
                                    children: `${data.CreatedBy} created a new user`,
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
                                    children: `User Created has been Approved by ${data.BusinessApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for IT Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.ITApprovalTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(data?.ITApprovalTime)?.format(
                                "h:mm a"
                              )}`,
                                    children: `User Created has been Approved by ${data.ApprovalBy}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children:
                                      "User is being created by IT Technician",
                                  },
                                ]}
                              />
                            ) : (
                              <></>
                            )}
                            {data.ITApproval === "Rejected" && (
                              <Timeline
                                mode={"left"}
                                items={[
                                  {
                                    label: `${moment(data?.Created)?.format(
                                      "Do MMM YYYY"
                                    )}
                         ${moment(data?.Created)?.format("h:mm a")}`,
                                    children: `${data.CreatedBy} created a new user`,
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
                                    children: `User Created has been Approved by ${data.BusinessApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for IT Approval",
                                  },
                                  {
                                    color: "red",
                                    label: `${moment(
                                      data?.ITApprovalTime
                                    )?.format("Do MMM YYYY")}
                           ${moment(data?.ITApprovalTime)?.format("h:mm a")}`,
                                    children: `User Created has been Rejected by ${data.ApprovalBy}.`,
                                  },
                                ]}
                              />
                            )}
                            {data.ITTechnicianApproval === "Approved" && (
                              <Timeline
                                mode={"left"}
                                items={[
                                  {
                                    label: `${moment(data?.Created)?.format(
                                      "Do MMM YYYY"
                                    )}
                            ${moment(data?.Created)?.format("h:mm a")}`,
                                    children: `${data.CreatedBy} created a new user`,
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
                                    children: `User Created has been Approved by ${data.BusinessApprovar}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children: "Waiting for IT Approval",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.ITApprovalTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(data?.ITApprovalTime)?.format(
                                "h:mm a"
                              )}`,
                                    children: `User Created has been Approved by ${data.ApprovalBy}.`,
                                  },
                                  {
                                    dot: (
                                      <ClockCircleOutlined
                                        style={{ fontSize: "16px" }}
                                        rev={undefined}
                                      />
                                    ),
                                    children:
                                      "User is being created by IT Technician",
                                  },
                                  {
                                    color: "green",
                                    label: `${moment(
                                      data?.ITTechnicianApprovalTime
                                    )?.format("Do MMM YYYY")}
                              ${moment(data?.ITTechnicianApprovalTime)?.format(
                                "h:mm a"
                              )}`,
                                    children: `User has been Created by ${data.ITTechnician}.`,
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
                                      data.ITApprovar,
                                      data.AdditionalITApprovar,
                                      data.ITApproval,
                                      data.ITTechnician,
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
                            {data.BusinessApproval === "Rejected" ||
                            data.ITApproval === "Rejected" ? (
                              <></>
                            ) : (
                              <>
                                {data.ITApproval === "Approved" ? (
                                  <></>
                                ) : (
                                  <>
                                    {data.Status === "Open" ? (
                                      <>
                                        {data.PendingWith?.split(",")?.filter(
                                          (data: string) =>
                                            data ===
                                            context.pageContext.user.displayName
                                        )?.length > 0 ? (
                                          <div className="d-flex justify-content-end mt-3 gap-3">
                                            <div
                                              className="py-2"
                                              style={{
                                                fontSize: "1rem",
                                                fontWeight: "600",
                                              }}
                                            >
                                              {data.BusinessApproval ===
                                              "Pending"
                                                ? "Business Approval"
                                                : "IT Approval"}
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
                                                  data.ITApprovar,
                                                  data.AdditionalITApprovar,
                                                  data.ITApproval,
                                                  data.ITTechnician,
                                                  data.BusinessApprovar,
                                                  data.RejectedBy,
                                                  data.Approvers,
                                                  data.Rejectors
                                                );
                                              }}
                                            >
                                              Approve
                                            </button>
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
                              </>
                            )}
                          </>
                        )}
                        {data.ITTechnicianApproval === "Pending" &&
                        data.Status === `Approved by IT Approver` ? (
                          <>
                            {data.PendingWith ===
                              context.pageContext.user.displayName &&
                            data.ITTechnician ===
                              context.pageContext.user.displayName ? (
                              <div className="d-flex justify-content-end mt-3 gap-3">
                                <div
                                  className="py-2"
                                  style={{
                                    fontSize: "1rem",
                                    fontWeight: "600",
                                  }}
                                >
                                  User Creation
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
                                      data.ITApprovar,
                                      data.AdditionalITApprovar,
                                      data.ITApproval,
                                      data.ITTechnician,
                                      data.BusinessApprovar,
                                      data.RejectedBy,
                                      data.Approvers,
                                      data.Rejectors
                                    );
                                  }}
                                >
                                  Created
                                </button>
                              </div>
                            ) : (
                              <></>
                            )}
                          </>
                        ) : (
                          <></>
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
