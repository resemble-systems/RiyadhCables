import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Col, Input, Modal } from "antd";
import * as React from "react";
import "./index.css";
import styles from "./Forms.module.sass";
import moment from "moment";
import { SPHttpClient, ISPHttpClientOptions } from "@microsoft/sp-http";
import { ClockCircleOutlined, SwapOutlined } from "@ant-design/icons";
import { Web } from "sp-pnp-js";
import PaymentRequestFeilds from "./components/PaymentRequestFeilds";
import Loading from "./components/Loading";
import DataNotFound from "./components/DataNotFound";
import Reject from "./components/Reject";
import { DataType } from "./components/DataType";
import Error from "./components/Error";
import FinanceSecretay from "./components/paymentApprovers/FinanceSecretary";
import CashTeam from "./components/paymentApprovers/CashTeam";
import ARTeam from "./components/paymentApprovers/ARTeam";
import APTeam from "./components/paymentApprovers/APTeam";
import CashHead from "./components/paymentApprovers/CashHead";
import ARHead from "./components/paymentApprovers/ARHead";
import APHead from "./components/paymentApprovers/APHead";
import VPFinance from "./components/paymentApprovers/VPFinance";
import CFO from "./components/paymentApprovers/CFO";
import ApproveReject from "./components/paymentApprovers/ApproveReject";
import FinanceController from "./components/paymentApprovers/FinanceController";

export interface IPaymentRequestViewProps {
  self: any;
  title: string;
  context: WebPartContext;
  modalOpen: boolean;
  handleClose: () => void;
  modalData: any;
  isDataLoading: boolean;
  modalDataError: boolean;
  getPaymentRequest: any;
  loadingText: string;
  fetchData?: any;
}

interface IPaymentRequestViewState {
  openRejectComments: boolean;
  reasonForRejection: string;
  isError: boolean;
  errorMessage: string;
  updationType: string;
  timeLineData: any;
  attachments: {
    Treasury: any;
  };
  postAttachments: {
    Treasury: any;
  };
  uploadAttachments: any;
  refNumber: {
    Treasury: string;
  };
  refNumberError: {
    Treasury: "" | "error";
  };
}

export default class PaymentRequestView extends React.Component<
  IPaymentRequestViewProps,
  IPaymentRequestViewState
> {
  public constructor(
    props: IPaymentRequestViewProps,
    state: IPaymentRequestViewState
  ) {
    super(props);
    this.state = {
      openRejectComments: false,
      reasonForRejection: "",
      isError: false,
      errorMessage: "",
      updationType: "Update",
      timeLineData: [],
      attachments: {
        Treasury: [],
      },
      postAttachments: {
        Treasury: [],
      },
      uploadAttachments: [],
      refNumber: {
        Treasury: "",
      },
      refNumberError: {
        Treasury: "",
      },
    };
  }

  public componentDidUpdate(
    prevProps: Readonly<IPaymentRequestViewProps>,
    prevState: Readonly<IPaymentRequestViewState>
  ): void {
    const { modalData } = this.props;
    if (prevProps.modalData !== modalData) {
      const dotRemoval = modalData[0].TimeLine?.map(
        (data: { label: string; dot: string; children: string }) => {
          if (data.dot === "Clock") {
            return {
              dot: (
                <ClockCircleOutlined
                  style={{ fontSize: "16px" }}
                  rev={undefined}
                />
              ),
              children: data.children,
            };
          } else if (data.dot === "Transfer") {
            return {
              dot: (
                <SwapOutlined
                  style={{ fontSize: "16px", color: "#52c41a" }}
                  rev={undefined}
                />
              ),
              label: data.label,
              children: data.children,
            };
          } else {
            return data;
          }
        }
      );
      this.setState({ timeLineData: dotRemoval });
    }
  }

  public updateApproval(
    status: string,
    ApprovalType: string,
    Data: DataType
  ): void {
    const { reasonForRejection, postAttachments, refNumber } = this.state;
    const { context, self, getPaymentRequest } = this.props;
    const {
      ID,
      BusinessApprover,
      BusinessApproverLimit,
      DepartmentHeadApprover,
      FinanceSecretaryApprover,
      CashTeamApprover,
      CashHeadApprover,
      ARTeamApprover,
      ARHeadApprover,
      APTeamApprover,
      APHeadApprover,
      ApprovalProcess,
      FinanceControllerApprover,
      FinanceControllerLimit,
      VPFinanceApprover,
      CFO,
      CEO,
      Amount,
      RejectedBy,
      Approvers,
      Rejectors,
    } = Data;
    const headers: any = {
      "X-HTTP-Method": "MERGE",
      "If-Match": "*",
    };
    const updateApproval = async (Body: any) => {
      const spHttpClintOptions: ISPHttpClientOptions = {
        headers,
        body: JSON.stringify(Body),
      };
      const postResponse = await context.spHttpClient.post(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('PaymentRequest')/items('${ID}')`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      );
      if (postResponse.ok) {
        console.log("User Updated", postResponse);
        getPaymentRequest(ID);
        this.setState({ reasonForRejection: "" });
      } else {
        this.setState({
          isError: true,
          errorMessage: "Failed to update Approval Status",
        });
        console.log("Post Failed", postResponse);
      }
    };
    if (ApprovalProcess === "Business Approval") {
      let timeLine = [];
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });
      if (status === "Approved") {
        timeLine = [
          ...Data.TimeLine,
          {
            color: "green",
            label: `${moment(new Date().toString())?.format(
              "Do MMM YYYY"
            )} ${moment(new Date().toString())?.format("h:mm a")}`,
            children: `Payment Request has been Approved by ${context.pageContext.user.displayName}.`,
          },
          {
            dot: "Clock",
            children:
              parseInt(Amount) <= parseInt(BusinessApproverLimit)
                ? "Waiting for Finance Secretary Approval"
                : "Waiting for Department Head Approval",
          },
        ];
      } else {
        timeLine = [
          ...Data.TimeLine,
          {
            color: "red",
            label: `${moment(new Date().toString())?.format(
              "Do MMM YYYY"
            )} ${moment(new Date().toString())?.format("h:mm a")}`,
            children: `Payment Request has been Rejected by ${context.pageContext.user.displayName}.`,
          },
        ];
      }

      const Body = {
        PendingWith:
          status === "Approved"
            ? parseInt(Amount) <= parseInt(BusinessApproverLimit)
              ? FinanceSecretaryApprover
              : DepartmentHeadApprover
            : "Closed",
        PendingDepartment:
          status === "Approved"
            ? parseInt(Amount) <= parseInt(BusinessApproverLimit)
              ? "Finance Secretary"
              : "Department Head"
            : "Closed",
        BusinessApproval: status,
        DepartmentHeadApproval:
          parseInt(Amount) <= parseInt(BusinessApproverLimit)
            ? status
            : "Pending",
        ApprovalProcess:
          status === "Approved"
            ? parseInt(Amount) <= parseInt(BusinessApproverLimit)
              ? "Finance Secretary"
              : "Department Head"
            : "Rejected By Business Approver",
        BusinessApprovalTime: new Date().toString(),
        DepartmentHeadApprovalTime: new Date().toString(),
        Status:
          status === "Approved" ? "Open" : `Rejected By Business Approver`,
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
        TimeLine: JSON.stringify(timeLine),
      };
      updateApproval(Body);
    }
    if (ApprovalProcess === "Department Head") {
      let timeLine = [];
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });
      if (status === "Approved") {
        timeLine = [
          ...Data.TimeLine,
          {
            color: "green",
            label: `${moment(new Date().toString())?.format(
              "Do MMM YYYY"
            )} ${moment(new Date().toString())?.format("h:mm a")}`,
            children: `Payment Request has been Approved by ${context.pageContext.user.displayName}.`,
          },
          {
            dot: "Clock",
            children: "Waiting for Finance Secretary Approval",
          },
        ];
      } else {
        timeLine = [
          ...Data.TimeLine,
          {
            color: "red",
            label: `${moment(new Date().toString())?.format(
              "Do MMM YYYY"
            )} ${moment(new Date().toString())?.format("h:mm a")}`,
            children: `Payment Request has been Rejected by ${context.pageContext.user.displayName}.`,
          },
        ];
      }
      const Body = {
        PendingWith:
          status === "Approved" ? FinanceSecretaryApprover : BusinessApprover,
        PendingDepartment:
          status === "Approved" ? "Finance Secretary" : "Business Approver",
        DepartmentHeadApproval: status,
        ApprovalProcess:
          status === "Approved" ? "Finance Secretary" : "Business Approval",
        DepartmentHeadApprovalTime: new Date().toString(),
        Status: status === "Approved" ? "Open" : "Open",
        BusinessApproval: status === "Approved" ? "Approved" : "Pending",
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
        TimeLine: JSON.stringify(timeLine),
      };
      updateApproval(Body);
    }
    if (ApprovalProcess === "Finance Secretary") {
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });

      const timeLine = [
        ...Data.TimeLine,
        {
          dot: "Transfer",
          label: `${moment(new Date().toString())?.format(
            "Do MMM YYYY"
          )} ${moment(new Date().toString())?.format("h:mm a")}`,
          children: `Payment Request has been Tranfered to ${status} by ${context.pageContext.user.displayName}.`,
        },
        {
          dot: "Clock",
          children: `Waiting for ${status} Approval`,
        },
      ];

      const Body = {
        PendingWith:
          status === "Cash Team"
            ? CashTeamApprover
            : status === "AR Team"
            ? ARTeamApprover
            : APTeamApprover,
        PendingDepartment:
          status === "Cash Team"
            ? "Cash Team"
            : status === "AR Team"
            ? "AR Team"
            : "AP Team",
        FinanceSecretaryApproval: status,
        ApprovalProcess: status,
        FinanceSecretaryApprovalTime: new Date().toString(),
        Status: "Open",
        Approvers: JSON.stringify([
          ...Approvers,
          { name: context.pageContext.user.displayName },
        ]),
        TimeLine: JSON.stringify(timeLine),
      };
      updateApproval(Body);
    }
    if (ApprovalType === "Transfer Team") {
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });
      const timeLine = [
        ...Data.TimeLine,
        {
          dot: "Transfer",
          label: `${moment(new Date().toString())?.format(
            "Do MMM YYYY"
          )} ${moment(new Date().toString())?.format("h:mm a")}`,
          children: `Payment Request has been Tranfered to ${status} by ${context.pageContext.user.displayName}.`,
        },
        {
          dot: "Clock",
          children: `Waiting for ${status} Approval`,
        },
      ];
      const Body = {
        PendingWith:
          status === "Cash Team"
            ? CashTeamApprover
            : status === "AR Team"
            ? ARTeamApprover
            : APTeamApprover,
        PendingDepartment:
          status === "Cash Team"
            ? "Cash Team"
            : status === "AR Team"
            ? "AR Team"
            : "AP Team",
        FinanceSecretaryApproval: status,
        ApprovalProcess: status,
        FinanceSecretaryApprovalTime: new Date().toString(),
        Status: "Open",
        TimeLine: JSON.stringify(timeLine),
      };
      updateApproval(Body);
    }
    if (ApprovalType === "Transfer Head") {
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });
      const timeLine = [
        ...Data.TimeLine,
        {
          dot: "Transfer",
          label: `${moment(new Date().toString())?.format(
            "Do MMM YYYY"
          )} ${moment(new Date().toString())?.format("h:mm a")}`,
          children: `Payment Request has been Tranfered to ${status} by ${context.pageContext.user.displayName}.`,
        },
        {
          dot: "Clock",
          children: `Waiting for ${status} Approval`,
        },
      ];
      const Body = {
        PendingWith:
          status === "Cash Head"
            ? CashTeamApprover
            : status === "AR Head"
            ? ARTeamApprover
            : APTeamApprover,
        PendingDepartment:
          status === "Cash Head"
            ? "Cash Head"
            : status === "AR Head"
            ? "AR Head"
            : "AP Head",
        ApprovalProcess: status,
        Status: "Open",
        TimeLine: JSON.stringify(timeLine),
      };
      updateApproval(Body);
    }
    if (ApprovalType === "Update Team") {
      let timeLine = [];
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });
      if (status === "Approved") {
        timeLine = [
          ...Data.TimeLine,
          {
            color: "green",
            label: `${moment(new Date().toString())?.format(
              "Do MMM YYYY"
            )} ${moment(new Date().toString())?.format("h:mm a")}`,
            children: `Payment Request has been Approved by ${context.pageContext.user.displayName}.`,
          },
          {
            dot: "Clock",
            children: `Waiting for ${
              ApprovalProcess === "Cash Team"
                ? "Cash Head"
                : ApprovalProcess === "AP Team"
                ? "AP Head"
                : "AR Head"
            } Approval`,
          },
        ];
      } else {
        timeLine = [
          ...Data.TimeLine,
          {
            color: "red",
            label: `${moment(new Date().toString())?.format(
              "Do MMM YYYY"
            )} ${moment(new Date().toString())?.format("h:mm a")}`,
            children: `Payment Request has been Rejected by ${context.pageContext.user.displayName}.`,
          },
        ];
      }
      const Body = {
        PendingWith:
          status === "Approved"
            ? ApprovalProcess === "Cash Team"
              ? CashHeadApprover
              : ApprovalProcess === "AP Team"
              ? APHeadApprover
              : ARHeadApprover
            : BusinessApprover,
        PendingDepartment:
          status === "Approved"
            ? ApprovalProcess === "Cash Team"
              ? "Cash Head"
              : ApprovalProcess === "AP Team"
              ? "AP Head"
              : "AR Head"
            : "Business Approver",
        CashTeamApproval:
          status === "Approved"
            ? ApprovalProcess === "Cash Team"
              ? "Approved"
              : ApprovalProcess === "AP Team"
              ? "Approved By AP Team"
              : "Approved By AR Team"
            : `Rejected by ${Data.PendingDepartment}`,
        APTeamApproval:
          status === "Approved"
            ? ApprovalProcess === "AP Team"
              ? "Approved"
              : ApprovalProcess === "Cash Team"
              ? "Approved By Cash Team"
              : "Approved By AR Team"
            : `Rejected by ${Data.PendingDepartment}`,
        ARTeamApproval:
          status === "Approved"
            ? ApprovalProcess === "AR Team"
              ? "Approved"
              : ApprovalProcess === "AP Team"
              ? "Approved By AP Team"
              : "Approved By Cash Team"
            : `Rejected by ${Data.PendingDepartment}`,
        ApprovalProcess:
          status === "Approved"
            ? ApprovalProcess === "Cash Team"
              ? "Cash Head"
              : ApprovalProcess === "AP Team"
              ? "AP Head"
              : "AR Head"
            : "Business Approval",
        CashTeamApprovalTime: new Date().toString(),
        APTeamApprovalTime: new Date().toString(),
        ARTeamApprovalTime: new Date().toString(),
        Status: status === "Approved" ? "Open" : "Open",
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
        TimeLine: JSON.stringify(timeLine),
      };
      updateApproval(Body);
    }
    if (ApprovalType === "Update Head") {
      let timeLine = [];
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });
      if (status === "Approved") {
        timeLine = [
          ...Data.TimeLine,
          {
            color: "green",
            label: `${moment(new Date().toString())?.format(
              "Do MMM YYYY"
            )} ${moment(new Date().toString())?.format("h:mm a")}`,
            children: `Payment Request has been Approved by ${context.pageContext.user.displayName}.`,
          },
          {
            dot: "Clock",
            children: `Waiting for Finance Controller Approval`,
          },
        ];
      } else {
        timeLine = [
          ...Data.TimeLine,
          {
            color: "red",
            label: `${moment(new Date().toString())?.format(
              "Do MMM YYYY"
            )} ${moment(new Date().toString())?.format("h:mm a")}`,
            children: `Payment Request has been Rejected by ${context.pageContext.user.displayName}.`,
          },
        ];
      }
      const Body = {
        PendingWith:
          status === "Approved" ? FinanceControllerApprover : BusinessApprover,
        PendingDepartment:
          status === "Approved" ? "Finance Controller" : "Business Approver",
        CashHeadApproval:
          status === "Approved"
            ? ApprovalProcess === "Cash Head"
              ? "Approved"
              : ApprovalProcess === "AP Head"
              ? "Approved By AP Head"
              : "Approved By AR Head"
            : `Rejected by ${Data.PendingDepartment}`,
        APHeadApproval:
          status === "Approved"
            ? ApprovalProcess === "AP Head"
              ? "Approved"
              : ApprovalProcess === "Cash Head"
              ? "Approved By Cash Head"
              : "Approved By AR Head"
            : `Rejected by ${Data.PendingDepartment}`,
        ARHeadApproval:
          status === "Approved"
            ? ApprovalProcess === "AR Head"
              ? "Approved"
              : ApprovalProcess === "AP Head"
              ? "Approved By AP Head"
              : "Approved By Cash Head"
            : `Rejected by ${Data.PendingDepartment}`,
        ApprovalProcess:
          status === "Approved" ? "Finance Controller" : "Business Approval",
        CashHeadApprovalTime: new Date().toString(),
        APHeadApprovalTime: new Date().toString(),
        ARHeadApprovalTime: new Date().toString(),
        Status: status === "Approved" ? "Open" : "Open",
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
        TimeLine: JSON.stringify(timeLine),
      };
      updateApproval(Body);
    }
    if (ApprovalProcess === "Finance Controller") {
      let timeLine = [];
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });
      if (status === "Approved") {
        timeLine = [
          ...Data.TimeLine,
          {
            color: "green",
            label: `${moment(new Date().toString())?.format(
              "Do MMM YYYY"
            )} ${moment(new Date().toString())?.format("h:mm a")}`,
            children: `Payment Request has been Approved by ${context.pageContext.user.displayName}.`,
          },
          {
            dot: "Clock",
            children: `Waiting for ${
              ApprovalType === "Approve & Pay" ? "Treasury" : "VP Finance"
            } Approval`,
          },
        ];
      } else {
        timeLine = [
          ...Data.TimeLine,
          {
            color: "red",
            label: `${moment(new Date().toString())?.format(
              "Do MMM YYYY"
            )} ${moment(new Date().toString())?.format("h:mm a")}`,
            children: `Payment Request has been Rejected by ${context.pageContext.user.displayName}.`,
          },
        ];
      }
      const Body = {
        PendingWith:
          status === "Approved"
            ? ApprovalType === "Approve & Pay"
              ? Data.TreasuryApproverName
              : VPFinanceApprover
            : BusinessApprover,
        PendingDepartment:
          status === "Approved"
            ? ApprovalType === "Approve & Pay"
              ? "Treasury"
              : "VP Finance"
            : "Business Approver",
        ApprovalProcess:
          status === "Approved"
            ? ApprovalType === "Approve & Pay"
              ? "Transfered to Treasury"
              : "VP Finance"
            : "Business Approval",
        Status:
          status === "Approved"
            ? parseInt(Amount) <= parseInt(FinanceControllerLimit)
              ? "Open"
              : "Open"
            : "Open",
        FinanceControllerApprovalTime: new Date().toString(),
        FinanceControllerApproval: status,
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
        TimeLine: JSON.stringify(timeLine),
      };
      updateApproval(Body);
    }
    if (ApprovalProcess === "VP Finance") {
      let timeLine = [];
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });
      if (status === "Approved") {
        timeLine = [
          ...Data.TimeLine,
          {
            color: "green",
            label: `${moment(new Date().toString())?.format(
              "Do MMM YYYY"
            )} ${moment(new Date().toString())?.format("h:mm a")}`,
            children: `Payment Request has been Approved by ${context.pageContext.user.displayName}.`,
          },
          {
            dot: "Clock",
            children: `Waiting for ${
              ApprovalType === "Approve & Pay" ? "Treasury" : "CFO"
            }`,
          },
        ];
      } else {
        timeLine = [
          ...Data.TimeLine,
          {
            color: "red",
            label: `${moment(new Date().toString())?.format(
              "Do MMM YYYY"
            )} ${moment(new Date().toString())?.format("h:mm a")}`,
            children: `Payment Request has been Rejected by ${context.pageContext.user.displayName}.`,
          },
        ];
      }
      const Body = {
        PendingWith:
          status === "Approved"
            ? ApprovalType === "Approve & Pay"
              ? Data.TreasuryApproverName
              : CFO
            : BusinessApprover,
        PendingDepartment:
          status === "Approved"
            ? ApprovalType === "Approve & Pay"
              ? "Treasury"
              : "CFO"
            : "Business Approver",
        ApprovalProcess:
          status === "Approved"
            ? ApprovalType === "Approve & Pay"
              ? "Transfered to Treasury"
              : "CFO"
            : "Business Approval",
        Status:
          status === "Approved"
            ? ApprovalType === "Approve & Pay"
              ? "Open"
              : "Open"
            : "Open",
        VPFinanceApprovalTime: new Date().toString(),
        VPFinanceApproval: status,
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
        TimeLine: JSON.stringify(timeLine),
      };
      updateApproval(Body);
    }
    if (ApprovalProcess === "CFO") {
      let timeLine = [];
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });
      if (status === "Approved") {
        timeLine = [
          ...Data.TimeLine,
          {
            color: "green",
            label: `${moment(new Date().toString())?.format(
              "Do MMM YYYY"
            )} ${moment(new Date().toString())?.format("h:mm a")}`,
            children: `Payment Request has been Approved by ${context.pageContext.user.displayName}.`,
          },
          {
            dot: "Clock",
            children: `Waiting for ${
              ApprovalType === "Approve & Pay" ? "Treasury" : "CEO"
            }`,
          },
        ];
      } else {
        timeLine = [
          ...Data.TimeLine,
          {
            color: "red",
            label: `${moment(new Date().toString())?.format(
              "Do MMM YYYY"
            )} ${moment(new Date().toString())?.format("h:mm a")}`,
            children: `Payment Request has been Rejected by ${context.pageContext.user.displayName}.`,
          },
        ];
      }
      const Body = {
        PendingWith:
          status === "Approved"
            ? ApprovalType === "Approve & Pay"
              ? Data.TreasuryApproverName
              : CEO
            : BusinessApprover,
        PendingDepartment:
          status === "Approved"
            ? ApprovalType === "Approve & Pay"
              ? "Treasury"
              : "CEO"
            : "Business Approver",
        ApprovalProcess:
          status === "Approved"
            ? ApprovalType === "Approve & Pay"
              ? "Transfered to Treasury"
              : "CEO"
            : "Business Approval",
        Status:
          status === "Approved"
            ? ApprovalType === "Approve & Pay"
              ? "Open"
              : "Open"
            : "Open",
        CFOApprovalTime: new Date().toString(),
        CFOApproval: status,
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
        TimeLine: JSON.stringify(timeLine),
      };
      updateApproval(Body);
    }
    if (ApprovalProcess === "CEO") {
      let timeLine = [];
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });
      if (status === "Approved") {
        timeLine = [
          ...Data.TimeLine,
          {
            color: "green",
            label: `${moment(new Date().toString())?.format(
              "Do MMM YYYY"
            )} ${moment(new Date().toString())?.format("h:mm a")}`,
            children: `Payment Request has been Approved by ${context.pageContext.user.displayName}.`,
          },
          {
            dot: "Clock",
            children: `Waiting for Treasury`,
          },
        ];
      } else {
        timeLine = [
          ...Data.TimeLine,
          {
            color: "red",
            label: `${moment(new Date().toString())?.format(
              "Do MMM YYYY"
            )} ${moment(new Date().toString())?.format("h:mm a")}`,
            children: `Payment Request has been Rejected by ${context.pageContext.user.displayName}.`,
          },
        ];
      }
      const Body = {
        PendingWith:
          status === "Approved" ? Data.TreasuryApproverName : BusinessApprover,
        ApprovalProcess:
          status === "Approved"
            ? "Transfered to Treasury"
            : "Business Approval",
        PendingDepartment:
          status === "Approved" ? "Treasury" : "Business Approval",
        Status: status === "Approved" ? "Open" : "Open",
        CEOApprovalTime: new Date().toString(),
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
        CEOApproval: status,
        TimeLine: JSON.stringify(timeLine),
      };
      updateApproval(Body);
    }
    if (ApprovalProcess === "Transfered to Treasury") {
      console.log("IN TREASURY UPDATE", ApprovalProcess, status);
      let timeLine = [];
      const attachmentFiles = [...postAttachments.Treasury];
      const attachmentJSON = attachmentFiles?.map(
        (data: { name: string; attachmentTarget: string }) => {
          return {
            name: data.name,
            targetName: data.attachmentTarget,
            refNumber: refNumber.Treasury,
          };
        }
      );
      const attachmentJSONStringfy = JSON.stringify(attachmentJSON);
      self.setState({
        isDataLoading: true,
        loadingText: "Updating Approval Status....",
      });
      if (status === "Approved") {
        timeLine = [
          ...Data.TimeLine,
          {
            color: "green",
            label: `${moment(new Date().toString())?.format(
              "Do MMM YYYY"
            )} ${moment(new Date().toString())?.format("h:mm a")}`,
            children: `Payment Request has been Paid by Treasury.`,
          },
        ];
      } else {
        timeLine = [
          ...Data.TimeLine,
          {
            color: "red",
            label: `${moment(new Date().toString())?.format(
              "Do MMM YYYY"
            )} ${moment(new Date().toString())?.format("h:mm a")}`,
            children: `Payment Request has been Rejected by Treasury.`,
          },
        ];
      }
      const Body = {
        PendingWith: status === "Approved" ? "Closed" : BusinessApprover,
        ApprovalProcess: status === "Approved" ? "Closed" : "Business Approval",
        PendingDepartment:
          status === "Approved" ? "Closed" : "Business Approval",
        Status: status === "Approved" ? "Closed" : `Open`,
        TreasuryApprovalTime: new Date().toString(),
        TreasuryApproval: status,
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
        TimeLine: JSON.stringify(timeLine),
        TreasuryJSON: attachmentJSONStringfy,
      };

      const uploadAttachment = async (ID: number, Attachment: any) => {
        console.log("In Attachment Post", this.props);
        let web = new Web(this.props.context.pageContext.web.absoluteUrl);
        const postResponse = await web.lists
          .getByTitle("PaymentRequest")
          .items.getById(ID)
          .attachmentFiles.addMultiple(Attachment);
        console.log("Attachment Post Status", postResponse);
        updateApproval(Body);
        this.setState({
          attachments: {
            Treasury: [],
          },
          postAttachments: {
            Treasury: [],
          },
          refNumber: {
            Treasury: "",
          },
        });
      };
      uploadAttachment(ID, attachmentFiles);
    }
  }

  private deleteFiles(files: string, ID: number) {
    console.log("Deleting");
    const { context } = this.props;
    let web = new Web(context.pageContext.web.absoluteUrl);
    web.lists
      .getByTitle("PaymentRequest")
      .items.getById(ID)
      .attachmentFiles.getByName(files)
      .delete();
  }

  public render(): React.ReactElement<IPaymentRequestViewProps> {
    const {
      modalOpen,
      handleClose,
      modalData,
      isDataLoading,
      context,
      modalDataError,
      loadingText,
      fetchData,
    } = this.props;

    const {
      openRejectComments,
      reasonForRejection,
      isError,
      errorMessage,
      updationType,
      timeLineData,
      attachments,
      postAttachments,
      refNumber,
      refNumberError,
    } = this.state;

    const Print = require("../viewForms/assets/Print.svg");

    const handleChange = (event: { target: { name: any; files: any } }) => {
      console.log(`Attachment ${event.target.name}`, event.target.files);
      let inputArr = event.target.files;
      let arrLength = event.target.files?.length;
      const targetName = event.target.name;
      let fileData: any = [];
      for (let i = 0; i < arrLength; i++) {
        console.log(`In for loop ${i} times`);
        var file = inputArr[i];
        const fileName = inputArr[i].name;
        console.log("fileName", fileName);
        const regex = /\.(pdf|PDF)$/i;
        if (!regex.test(fileName)) {
          this.setState({
            isError: true,
            errorMessage: "Please select an PDF file.",
          });
        } else {
          this.setState({
            attachments: {
              ...attachments,
              [event.target.name]: event.target.files,
            },
          });
          modalData[0]?.AttachmentFiles?.map((data: { FileName: string }) => {
            if (data.FileName?.toLowerCase().match(fileName?.toLowerCase())) {
              this.deleteFiles(fileName, modalData[0]?.ID);
            }
          });
          var reader = new FileReader();
          reader.onload = (function (file) {
            return function (e) {
              fileData.push({
                name: file.name,
                content: e.target?.result,
                attachmentTarget: targetName,
              });
            };
          })(file);
          reader.readAsArrayBuffer(file);
        }
        console.log("fileData Attachment", fileData);
        this.setState({
          postAttachments: {
            ...postAttachments,
            [event.target.name]: fileData,
          },
        });
      }
    };

    const handleRef = (event: { target: { name: string; value: string } }) => {
      this.setState({
        refNumber: {
          ...refNumber,
          [event.target.name]: event.target.value,
        },
      });
      if (event.target.value?.length < 1) {
        this.setState({
          refNumberError: {
            ...refNumberError,
            [event.target.name]: "error",
          },
        });
      } else {
        this.setState({
          refNumberError: {
            ...refNumberError,
            [event.target.name]: "",
          },
        });
      }
    };

    return (
      <Modal
        title={`Payment Request ${modalData[0]?.ReferenceNumber}`}
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
            <h4 className="text-center">Payment Request</h4>
            {isDataLoading ? (
              <Loading loadingText={loadingText} />
            ) : (
              <>
                {modalDataError ? (
                  <DataNotFound />
                ) : (
                  <>
                    {modalData?.map((data: DataType) => (
                      <div>
                        {data.TreasuryApproval === "Approved" ? (
                          <a
                            href={`${context.pageContext.web.absoluteUrl}/SitePages/PaymentRequestPrint.aspx?paymentRequest=${data.ID}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-interception="off"
                            className="text-decoration-none text-dark d-flex justify-content-end"
                          >
                            <div className="d-flex gap-2 align-items-center text-danger">
                              <span className="" style={{ fontWeight: 600 }}>
                                Print
                              </span>
                              <img src={Print} height={24} />
                            </div>
                          </a>
                        ) : (
                          <></>
                        )}
                        <PaymentRequestFeilds
                          data={data}
                          context={context}
                          timeLineData={timeLineData}
                        />
                        {openRejectComments ? (
                          <Reject
                            self={this}
                            data={data}
                            updationType={updationType}
                            reasonForRejection={reasonForRejection}
                          />
                        ) : (
                          <>
                            {data.Status === "Open" ? (
                              <>
                                {data.ApprovalProcess ===
                                "Finance Secretary" ? (
                                  <FinanceSecretay
                                    data={data}
                                    context={context}
                                    self={this}
                                  />
                                ) : (
                                  <>
                                    {data.ApprovalProcess === "Cash Team" ? (
                                      <CashTeam
                                        data={data}
                                        context={context}
                                        self={this}
                                      />
                                    ) : (
                                      <>
                                        {data.ApprovalProcess === "AR Team" ? (
                                          <ARTeam
                                            data={data}
                                            context={context}
                                            self={this}
                                          />
                                        ) : (
                                          <>
                                            {data.ApprovalProcess ===
                                            "AP Team" ? (
                                              <APTeam
                                                data={data}
                                                context={context}
                                                self={this}
                                              />
                                            ) : (
                                              <>
                                                {data.ApprovalProcess ===
                                                "Cash Head" ? (
                                                  <CashHead
                                                    data={data}
                                                    context={context}
                                                    self={this}
                                                  />
                                                ) : (
                                                  <>
                                                    {data.ApprovalProcess ===
                                                    "AR Head" ? (
                                                      <ARHead
                                                        data={data}
                                                        context={context}
                                                        self={this}
                                                      />
                                                    ) : (
                                                      <>
                                                        {data.ApprovalProcess ===
                                                        "AP Head" ? (
                                                          <APHead
                                                            data={data}
                                                            context={context}
                                                            self={this}
                                                          />
                                                        ) : (
                                                          <>
                                                            {data.ApprovalProcess ===
                                                            "VP Finance" ? (
                                                              <VPFinance
                                                                data={data}
                                                                context={
                                                                  context
                                                                }
                                                                self={this}
                                                              />
                                                            ) : (
                                                              <>
                                                                {data.ApprovalProcess ===
                                                                "CFO" ? (
                                                                  <CFO
                                                                    data={data}
                                                                    context={
                                                                      context
                                                                    }
                                                                    self={this}
                                                                  />
                                                                ) : (
                                                                  <>
                                                                    {data.ApprovalProcess ===
                                                                    "Transfered to Treasury" ? (
                                                                      <>
                                                                        {data.PendingWith?.split(
                                                                          ";"
                                                                        ).filter(
                                                                          (
                                                                            item
                                                                          ) =>
                                                                            item ===
                                                                            context
                                                                              .pageContext
                                                                              .user
                                                                              .displayName
                                                                        )
                                                                          ?.length >
                                                                        0 ? (
                                                                          <div className="d-flex justify-content-end mt-3 gap-3">
                                                                            <Col className="w-50">
                                                                              <div
                                                                                className="py-2"
                                                                                style={{
                                                                                  fontSize:
                                                                                    "1rem",
                                                                                  fontWeight:
                                                                                    "600",
                                                                                }}
                                                                              >
                                                                                Treasury
                                                                              </div>
                                                                              <div className="mt-2">
                                                                                <div
                                                                                  style={{
                                                                                    paddingBottom:
                                                                                      "8px",
                                                                                  }}
                                                                                >
                                                                                  Ref#
                                                                                </div>
                                                                                <Input
                                                                                  name="Treasury"
                                                                                  onChange={
                                                                                    handleRef
                                                                                  }
                                                                                  value={
                                                                                    refNumber.Treasury
                                                                                  }
                                                                                  status={
                                                                                    refNumberError.Treasury
                                                                                  }
                                                                                />
                                                                              </div>
                                                                              <div
                                                                                className={`d-flex align-items-center mt-2 gap-3`}
                                                                              >
                                                                                <button
                                                                                  className={`${styles.newsAttachmentButton}`}
                                                                                  type="button"
                                                                                >
                                                                                  <img
                                                                                    src={require("./assets/attachment.svg")}
                                                                                    alt=""
                                                                                    height="20px"
                                                                                    width="20px"
                                                                                    className={`${styles.img}`}
                                                                                  />
                                                                                  <label
                                                                                    className={`px-2 ${styles.newsAttachment}`}
                                                                                    htmlFor="Treasury"
                                                                                  >
                                                                                    Attach
                                                                                    Files
                                                                                  </label>
                                                                                  <input
                                                                                    type="file"
                                                                                    name="Treasury"
                                                                                    id="Treasury"
                                                                                    accept="application/pdf"
                                                                                    multiple={
                                                                                      false
                                                                                    }
                                                                                    style={{
                                                                                      display:
                                                                                        "none",
                                                                                    }}
                                                                                    onChange={
                                                                                      handleChange
                                                                                    }
                                                                                  ></input>
                                                                                </button>

                                                                                <div
                                                                                  className={`ms-3 ${styles.title}`}
                                                                                >
                                                                                  {`${
                                                                                    attachments
                                                                                      .Treasury
                                                                                      ?.length ==
                                                                                    0
                                                                                      ? `No`
                                                                                      : attachments
                                                                                          .Treasury
                                                                                          ?.length
                                                                                  } ${
                                                                                    attachments
                                                                                      .Treasury
                                                                                      ?.length ==
                                                                                    1
                                                                                      ? `File`
                                                                                      : `Files`
                                                                                  } Chosen`}
                                                                                </div>
                                                                              </div>

                                                                              <div className="mt-3">
                                                                                {attachments
                                                                                  .Treasury
                                                                                  ?.length >
                                                                                  0 && (
                                                                                  <div
                                                                                    className={`p-2 mb-3 d-flex justify-content-between align-items-center ${styles.fileInfo}`}
                                                                                  >
                                                                                    <div
                                                                                      className={
                                                                                        styles.fileName
                                                                                      }
                                                                                    >
                                                                                      {
                                                                                        attachments
                                                                                          .Treasury[0]
                                                                                          ?.name
                                                                                      }
                                                                                    </div>
                                                                                    <div
                                                                                      style={{
                                                                                        cursor:
                                                                                          "pointer",
                                                                                      }}
                                                                                      className="text-danger px-2 fw-bold"
                                                                                      onClick={() => {
                                                                                        this.setState(
                                                                                          {
                                                                                            attachments:
                                                                                              {
                                                                                                ...attachments,
                                                                                                Treasury:
                                                                                                  [],
                                                                                              },
                                                                                            postAttachments:
                                                                                              {
                                                                                                ...postAttachments,
                                                                                                Treasury:
                                                                                                  [],
                                                                                              },
                                                                                          }
                                                                                        );
                                                                                      }}
                                                                                    >
                                                                                      X
                                                                                    </div>
                                                                                  </div>
                                                                                )}
                                                                              </div>
                                                                              <div className="d-flex justify-content-end mt-3 gap-3">
                                                                                <button
                                                                                  type="submit"
                                                                                  className="text-white bg-success px-3 py-2 rounded"
                                                                                  style={{
                                                                                    border:
                                                                                      "none",
                                                                                  }}
                                                                                  onClick={() => {
                                                                                    if (
                                                                                      attachments
                                                                                        .Treasury
                                                                                        ?.length ===
                                                                                        1 &&
                                                                                      refNumber
                                                                                        .Treasury
                                                                                        ?.length >=
                                                                                        1
                                                                                    ) {
                                                                                      this.updateApproval(
                                                                                        "Approved",
                                                                                        "Treasury",
                                                                                        data
                                                                                      );
                                                                                    } else {
                                                                                      this.setState(
                                                                                        {
                                                                                          isError:
                                                                                            true,
                                                                                          errorMessage:
                                                                                            "Please add Attachment and Ref Number",
                                                                                        }
                                                                                      );
                                                                                    }
                                                                                  }}
                                                                                >
                                                                                  Finalize
                                                                                  Payment
                                                                                </button>
                                                                                <button
                                                                                  type="submit"
                                                                                  className="text-white bg-danger px-3 py-2 rounded"
                                                                                  style={{
                                                                                    border:
                                                                                      "none",
                                                                                  }}
                                                                                  onClick={() => {
                                                                                    this.setState(
                                                                                      {
                                                                                        openRejectComments:
                                                                                          true,
                                                                                      }
                                                                                    );
                                                                                  }}
                                                                                >
                                                                                  Reject
                                                                                </button>
                                                                              </div>
                                                                            </Col>
                                                                          </div>
                                                                        ) : (
                                                                          <></>
                                                                        )}
                                                                      </>
                                                                    ) : (
                                                                      <>
                                                                        {data.ApprovalProcess ===
                                                                        "Finance Controller" ? (
                                                                          <FinanceController
                                                                            data={
                                                                              data
                                                                            }
                                                                            context={
                                                                              context
                                                                            }
                                                                            self={
                                                                              this
                                                                            }
                                                                          />
                                                                        ) : (
                                                                          <ApproveReject
                                                                            data={
                                                                              data
                                                                            }
                                                                            context={
                                                                              context
                                                                            }
                                                                            self={
                                                                              this
                                                                            }
                                                                            handleClose={
                                                                              handleClose
                                                                            }
                                                                            getPaymentRequest={
                                                                              fetchData
                                                                            }
                                                                          />
                                                                        )}
                                                                      </>
                                                                    )}
                                                                  </>
                                                                )}
                                                              </>
                                                            )}
                                                          </>
                                                        )}
                                                      </>
                                                    )}
                                                  </>
                                                )}
                                              </>
                                            )}
                                          </>
                                        )}
                                      </>
                                    )}
                                  </>
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
            {isError && <Error self={this} errorMessage={errorMessage} />}
          </div>
        </div>
      </Modal>
    );
  }
}
