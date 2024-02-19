import * as React from "react";
import { Space, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import NewUserFormView from "./viewForms/NewUserFormView";
import LoanRequestFormView from "./viewForms/LoanRequestFormView";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import PaymentRequestView from "./viewForms/PaymentRequestView";

export interface IWorkflowTableProps {
  self: any;
  selectedStatus: string;
  context: WebPartContext;
  workFlowData: any;
  selectDashboard: string;
  selectedStartDate: string;
  newUserData: any;
  selectTable: string;
  getNewUser: any;
  getLoanRequest: any;
  PaymentRequestData: any;
  getPaymentRequest: any;
  exportAsPdf: boolean;
  downloadExcel: any;
  selectedDepartment: string;
}
export interface IWorkflowTableState {
  data: any;
  loading: boolean;
  tableData: any;
  modalOpen: boolean;
  modalData: any;
  isDataLoading: boolean;
  newUserData: any;
  loanRequestData: any;
  modalDataError: boolean;
  loadingText: string;
  Column: ColumnsType<DataType>;
  SelectedTable: string;
  paginationData: any;
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
  RejectedBy: string;
}

interface UserData {
  ID: number;
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
  ReasonForRejection: string;
  AdditionalITApprovar: string;
  ApprovalBy: string;
  ITTechnician: string;
  ITTechnicianApprovalTime: string;
  ITTechnicianApproval: string;
  PendingDepartment: string;
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

interface LoanData {
  ID: number;
  Title: string;
  Status: string;
  Department: string;
  Date: string;
  JobTitle: string;
  EmpID: string;
  EmpExt: string;
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
  PendingDepartment: string;
  ReferenceNumber: string;
  Currency: string;
  EmployeeID: string;
  RejectedBy: string;
  Approvers: any;
  Rejectors: any;
}

interface PaymentData {
  ID: number;
  key: number;
  Title: string;
  Status: string;
  Department: string;
  Date: string;
  JobTitle: string;
  Email: string;
  Ext: string;
  Amount: string;
  AmountInWords: string;
  CreatedBy: string;
  PendingWith: string;
  Created: string;
  PaymentType: string;
  PreviousApproval: string;
  AttachmentRef: any;
  AttachmentsJSON: any;
  SAPVendor: string;
  Total: string;
  VAT: string;
  BeneficiaryName: string;
  BeneficiaryIBAN: string;
  BeneficiaryBank: string;
  BusinessApprover: string;
  BusinessApproval: string;
  BusinessApprovalTime: string;
  DepartmentHeadApprover: string;
  DepartmentHeadApproval: string;
  DepartmentHeadApprovalTime: string;
  FinanceSecretaryApprover: string;
  FinanceSecretaryApproval: string;
  FinanceSecretaryApprovalTime: string;
  CashTeamApprover: string;
  CashTeamApproval: string;
  CashTeamApprovalTime: string;
  CashHeadApprover: string;
  CashHeadApproval: string;
  CashHeadApprovalTime: string;
  APTeamApprover: string;
  APTeamApproval: string;
  APTeamApprovalTime: string;
  APHeadApprover: string;
  APHeadApproval: string;
  APHeadApprovalTime: string;
  ARTeamApprover: string;
  ARTeamApproval: string;
  ARTeamApprovalTime: string;
  ARHeadApprover: string;
  ARHeadApproval: string;
  ARHeadApprovalTime: string;
  FinanceControllerApprover: string;
  FinanceControllerApproval: string;
  FinanceControllerApprovalTime: string;
  VPFinanceApprover: string;
  VPFinanceApproval: string;
  VPFinanceApprovalTime: string;
  CFO: string;
  CFOApproval: string;
  CFOApprovalTime: string;
  CEO: string;
  CEOApproval: string;
  CEOApprovalTime: string;
  ReasonForRejection: string;
  BusinessApproverLimit: string;
  CashTeamLimit: string;
  ARTeamLimit: string;
  APTeamLimit: string;
  FinanceControllerLimit: string;
  ApprovalProcess: string;
  TimeLine: string;
  TreasuryApproval: string;
  TreasuryApprovalTime: string;
  TreasuryApproverName: string;
  ReferenceNumber: string;
  TreasuryJSON: any;
  Currency: string;
  Comments: string;
  PendingDepartment: string;
  AttachmentFiles: Array<{ FileName: string }>;
  RejectedBy: string;
  Approvers: any;
  Rejectors: any;
  VATPercentage: number;
}

export default class WorkflowTable extends React.Component<
  IWorkflowTableProps,
  IWorkflowTableState
> {
  public constructor(props: IWorkflowTableProps, state: IWorkflowTableState) {
    super(props);
    this.state = {
      data: null,
      loading: false,
      tableData: [],
      modalOpen: false,
      modalData: [],
      isDataLoading: true,
      newUserData: [],
      loanRequestData: [],
      modalDataError: false,
      loadingText: "Loading....",
      Column: [],
      SelectedTable: "",
      paginationData: {
        pagination: {
          current: 1,
          pageSize: 10,
        },
      },
    };
  }

  public componentDidMount(): void {
    this.setState({ Column: this.columns });
    console.log("workFlowData", this.props.workFlowData);
    console.log("window", window.location);
    const { self, selectTable } = this.props;
    if (selectTable === "") {
    }
    const searchElement = window.location.search;
    const qurreyList = window.location.search?.split("=")[0];
    const qurreyString = window.location.search?.split("=")[1];
    if (searchElement) {
      if (qurreyList === "?userCreation") {
        self.setState({ selectedTable: "New User Creation" });
        this.getNewUser(qurreyString);
      }
      if (qurreyList === "?loanRequest") {
        self.setState({ selectedTable: "New Loan Request" });
        this.getLoanRequest(qurreyString);
      }
      if (qurreyList === "?paymentRequest") {
        self.setState({ selectedTable: "Payment Request" });
        this.getPaymentRequest(qurreyString);
      }
      setTimeout(() => {
        this.setState({ modalOpen: true });
      }, 1000);
    }
  }

  public getNewUser = (ID: string) => {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('NewUser')/items?$select=*&$expand=AttachmentFiles&$filter=Id eq ${ID}`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((listItems: { value: any[] }) => {
        console.log("NewUser", listItems.value);
        const getTableContent = (tableContent: Array<UserData>) => {
          const tableData = tableContent?.map((data) => ({
            key: data.ID,
            Title: data.Title,
            LoginName: data.LoginName,
            Department: data.Department,
            Date: data.Date,
            DateFromat: new Date(data.Date).toLocaleDateString("en-GB"),
            Status: data.Status,
            EmailType: data.EmailType,
            InternetAccess: data.InternetAccess,
            Remarks: data.Remarks,
            ITSM: data.ITSM,
            CreatedBy: data.CreatedBy,
            PendingWith: data.PendingWith,
            BusinessApproval: data.BusinessApproval,
            ITApproval: data.ITApproval,
            Created: data.Created,
            BusinessApprovalTime: data.BusinessApprovalTime,
            ITApprovalTime: data.ITApprovalTime,
            BusinessApprovar: data.BusinessApprovar,
            ITApprovar: data.ITApprovar,
            AdditionalITApprovar: data.AdditionalITApprovar,
            ReasonForRejection: data.ReasonForRejection,
            ApprovalBy: data.ApprovalBy,
            ITTechnician: data.ITTechnician,
            ITTechnicianApprovalTime: data.ITTechnicianApprovalTime,
            ITTechnicianApproval: data.ITTechnicianApproval,
            PendingDepartment: data.PendingDepartment,
            ReferenceNumber: data.ReferenceNumber,
            EmployeeType: data.EmployeeType,
            EmployeeNo: data.EmployeeNo,
            UserCreatedBy: data.UserCreatedBy,
            VPN: data.VPN,
            IsVPN: data.IsVPN,
            IsEmail: data.IsEmail,
            RejectedBy: data.RejectedBy,
            Approvers: data.Approvers ? JSON.parse(data.Approvers) : [],
            Rejectors: data.Rejectors ? JSON.parse(data.Rejectors) : [],
          }));
          return tableData;
        };
        if (listItems?.value?.length > 0) {
          this.setState({
            isDataLoading: false,
            modalData: getTableContent(listItems.value),
            loadingText: "Loading....",
          });
        } else {
          setTimeout(() => {
            this.setState({
              isDataLoading: false,
              modalDataError: true,
              loadingText: "Loading....",
            });
          }, 1000);
        }
      });
  };

  public getLoanRequest = (ID: string) => {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('LoanRequest')/items?$select=*&$expand=AttachmentFiles&$filter=Id eq ${ID}`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((listItems: { value: any[] }) => {
        console.log("Loan", listItems.value);
        const getLoanTableContent = (tableContent: Array<LoanData>) => {
          const tableData = tableContent.map((data) => ({
            key: data.ID,
            Title: data.Title,
            Status: data.Status,
            Department: data.Department,
            Date: data.Date,
            DateFromat: new Date(data.Date).toLocaleDateString("en-GB"),
            JobTitle: data.JobTitle,
            EmployeeID: data.EmpID,
            EmployeeExt: data.EmpExt,
            TableTotal: `${data.AmountInDigits} ${data.Currency}`,
            AmountInDigits: data.AmountInDigits,
            AmountInWords: data.AmountInWords,
            CreatedBy: data.CreatedBy,
            PendingWith: data.PendingWith,
            BusinessApproval: data.BusinessApproval,
            HRApproval: data.HRApproval,
            Created: data.Created,
            BusinessApprovalTime: data.BusinessApprovalTime,
            HRApprovalTime: data.HRApprovalTime,
            BusinessApprovar: data.BusinessApprovar,
            HRApprovar: data.HRApprovar,
            FinanceApproval: data.FinanceApproval,
            FinanceApprovalTime: data.FinanceApprovalTime,
            LoanType: data.LoanType,
            FinanceApprovar: data.FinanceApprovar,
            PayrollApprovar: data.PayrollApprovar,
            PayrollApprovalBeforeHR: data.PayrollApprovalBeforeHR,
            PayrollApprovalAfterHR: data.PayrollApprovalAfterHR,
            PayrollApprovalAfterHRTime: data.PayrollApprovalAfterHRTime,
            PayrollApprovalBeforeHRTime: data.PayrollApprovalBeforeHRTime,
            ReasonForRejection: data.ReasonForRejection,
            PendingDepartment: data.PendingDepartment,
            ReferenceNumber: data.ReferenceNumber,
            Currency: data.Currency,
            EmployeeeID: data.EmployeeID,
            RejectedBy: data.RejectedBy,
            Approvers: data.Approvers ? JSON.parse(data.Approvers) : [],
            Rejectors: data.Rejectors ? JSON.parse(data.Rejectors) : [],
          }));
          return tableData;
        };
        if (listItems?.value?.length > 0) {
          this.setState({
            isDataLoading: false,
            modalData: getLoanTableContent(listItems.value),
          });
        } else {
          setTimeout(() => {
            this.setState({ isDataLoading: false, modalDataError: true });
          }, 1000);
        }
      });
  };

  public getPaymentRequest = (ID: string) => {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('PaymentRequest')/items?$select=*&$expand=AttachmentFiles&$filter=Id eq ${ID}`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(`Error in Payment Request Fetch ${res.status}`);
          return;
        }
      })
      .then((listItems: { value: any[] }) => {
        console.log("Payment Request", listItems.value);
        const getPaymentContent = (tableContent: Array<PaymentData>) => {
          const tableData = tableContent.map((data) => ({
            ID: data.ID,
            key: data.ID,
            Title: data.Title,
            Status: data.Status,
            Department: data.Department,
            Date: data.Date,
            DateFromat: new Date(data.Date).toLocaleDateString("en-GB"),
            JobTitle: data.JobTitle,
            TableTotal: `${data.Total} ${data.Currency}`,
            Email: data.Email,
            Ext: data.Ext,
            AmountInWords: data.AmountInWords,
            CreatedBy: data.CreatedBy,
            PendingWith: data.PendingWith,
            PaymentType: data.PaymentType,
            PreviousApproval: data.PreviousApproval,
            AttachmentsJSON: data.AttachmentsJSON
              ? JSON.parse(data.AttachmentsJSON)
              : [],
            SAPVendor: data.SAPVendor,
            Total: data.Total,
            VAT: data.VAT,
            Amount: data.Amount,
            BeneficiaryName: data.BeneficiaryName,
            BeneficiaryIBAN: data.BeneficiaryIBAN,
            BeneficiaryBank: data.BeneficiaryBank,
            BusinessApprover: data.BusinessApprover,
            BusinessApproval: data.BusinessApproval,
            BusinessApprovalTime: data.BusinessApprovalTime,
            DepartmentHeadApprover: data.DepartmentHeadApprover,
            DepartmentHeadApproval: data.DepartmentHeadApproval,
            DepartmentHeadApprovalTime: data.DepartmentHeadApprovalTime,
            FinanceSecretaryApprover: data.FinanceSecretaryApprover,
            FinanceSecretaryApproval: data.FinanceSecretaryApproval,
            FinanceSecretaryApprovalTime: data.FinanceSecretaryApprovalTime,
            CashTeamApprover: data.CashTeamApprover,
            CashTeamApproval: data.CashTeamApproval,
            CashTeamApprovalTime: data.CashTeamApprovalTime,
            CashHeadApprover: data.CashHeadApprover,
            CashHeadApproval: data.CashHeadApproval,
            CashHeadApprovalTime: data.CashHeadApprovalTime,
            APTeamApprover: data.APTeamApprover,
            APTeamApproval: data.APTeamApproval,
            APTeamApprovalTime: data.APTeamApprovalTime,
            APHeadApprover: data.APHeadApprover,
            APHeadApproval: data.APHeadApproval,
            APHeadApprovalTime: data.APHeadApprovalTime,
            ARTeamApprover: data.ARTeamApprover,
            ARTeamApproval: data.ARTeamApproval,
            ARTeamApprovalTime: data.ARTeamApprovalTime,
            ARHeadApprover: data.ARHeadApprover,
            ARHeadApproval: data.ARHeadApproval,
            ARHeadApprovalTime: data.ARHeadApprovalTime,
            FinanceControllerApprover: data.FinanceControllerApprover,
            FinanceControllerApproval: data.FinanceControllerApproval,
            FinanceControllerApprovalTime: data.FinanceControllerApprovalTime,
            VPFinanceApprover: data.VPFinanceApprover,
            VPFinanceApproval: data.VPFinanceApproval,
            VPFinanceApprovalTime: data.VPFinanceApprovalTime,
            CFO: data.CFO,
            CFOApproval: data.CFOApproval,
            CFOApprovalTime: data.CFOApprovalTime,
            CEO: data.CEO,
            CEOApproval: data.CEOApproval,
            CEOApprovalTime: data.CEOApprovalTime,
            ReasonForRejection: data.ReasonForRejection,
            BusinessApproverLimit: data.BusinessApproverLimit,
            CashTeamLimit: data.CashTeamLimit,
            ARTeamLimit: data.ARTeamLimit,
            APTeamLimit: data.APTeamLimit,
            FinanceControllerLimit: data.FinanceControllerLimit,
            ApprovalProcess: data.ApprovalProcess,
            TimeLine: data.TimeLine ? JSON.parse(data.TimeLine) : [],
            TreasuryApproval: data.TreasuryApproval,
            TreasuryApprovalTime: data.TreasuryApprovalTime,
            TreasuryApproverName: data.TreasuryApproverName,
            ReferenceNumber: data.ReferenceNumber,
            TreasuryJSON: data.TreasuryJSON
              ? JSON.parse(data.TreasuryJSON)
              : [],
            Currency: data.Currency,
            Comments: data.Comments,
            PendingDepartment: data.PendingDepartment,
            RejectedBy: data.RejectedBy,
            VATPercentage: data.VATPercentage,
            Approvers: data.Approvers ? JSON.parse(data.Approvers) : [],
            Rejectors: data.Rejectors ? JSON.parse(data.Rejectors) : [],
            AttachmentFiles: data.AttachmentFiles?.map((file) => {
              return {
                FileName: file.FileName,
              };
            }),
          }));
          return tableData;
        };
        if (listItems?.value?.length > 0) {
          this.setState({
            isDataLoading: false,
            modalData: getPaymentContent(listItems.value),
          });
        } else {
          setTimeout(() => {
            this.setState({ isDataLoading: false, modalDataError: true });
          }, 1000);
        }
      });
  };

  public componentDidUpdate(
    prevProps: Readonly<IWorkflowTableProps>,
    prevState: Readonly<IWorkflowTableState>
  ): void {
    const {
      context,
      selectDashboard,
      newUserData,
      selectTable,
      exportAsPdf,
      downloadExcel,
    } = this.props;
    const { tableData, paginationData } = this.state;

    const getTableContent = (tableContent: Array<UserData>) => {
      const tableData = tableContent?.map((data) => ({
        key: data.ID,
        Title: data.Title,
        LoginName: data.LoginName,
        Department: data.Department,
        Date: data.Date,
        DateFromat: new Date(data.Date).toLocaleDateString("en-GB"),
        Status: data.Status,
        EmailType: data.EmailType,
        InternetAccess: data.InternetAccess,
        Remarks: data.Remarks,
        ITSM: data.ITSM,
        CreatedBy: data.CreatedBy,
        PendingWith: data.PendingWith,
        BusinessApproval: data.BusinessApproval,
        ITApproval: data.ITApproval,
        Created: data.Created,
        BusinessApprovalTime: data.BusinessApprovalTime,
        ITApprovalTime: data.ITApprovalTime,
        BusinessApprovar: data.BusinessApprovar,
        ITApprovar: data.ITApprovar,
        AdditionalITApprovar: data.AdditionalITApprovar,
        ReasonForRejection: data.ReasonForRejection,
        ApprovalBy: data.ApprovalBy,
        ITTechnician: data.ITTechnician,
        ITTechnicianApprovalTime: data.ITTechnicianApprovalTime,
        ITTechnicianApproval: data.ITTechnicianApproval,
        PendingDepartment: data.PendingDepartment,
        ReferenceNumber: data.ReferenceNumber,
        EmployeeType: data.EmployeeType,
        EmployeeNo: data.EmployeeNo,
        UserCreatedBy: data.UserCreatedBy,
        VPN: data.VPN,
        IsVPN: data.IsVPN,
        IsEmail: data.IsEmail,
        RejectedBy: data.RejectedBy,
        Approvers: data.Approvers ? JSON.parse(data.Approvers) : [],
        Rejectors: data.Rejectors ? JSON.parse(data.Rejectors) : [],
      }));
      return tableData;
    };
    const getLoanTableContent = (tableContent: Array<LoanData>) => {
      const tableData = tableContent.map((data) => ({
        key: data.ID,
        Title: data.Title,
        Status: data.Status,
        Department: data.Department,
        Date: data.Date,
        DateFromat: new Date(data.Date).toLocaleDateString("en-GB"),
        JobTitle: data.JobTitle,
        EmployeeID: data.EmpID,
        EmployeeExt: data.EmpExt,
        AmountInDigits: data.AmountInDigits,
        TableTotal: `${data.AmountInDigits} ${data.Currency}`,
        AmountInWords: data.AmountInWords,
        CreatedBy: data.CreatedBy,
        PendingWith: data.PendingWith,
        BusinessApproval: data.BusinessApproval,
        HRApproval: data.HRApproval,
        Created: data.Created,
        BusinessApprovalTime: data.BusinessApprovalTime,
        HRApprovalTime: data.HRApprovalTime,
        BusinessApprovar: data.BusinessApprovar,
        HRApprovar: data.HRApprovar,
        FinanceApproval: data.FinanceApproval,
        FinanceApprovalTime: data.FinanceApprovalTime,
        LoanType: data.LoanType,
        FinanceApprovar: data.FinanceApprovar,
        PayrollApprovar: data.PayrollApprovar,
        PayrollApprovalBeforeHR: data.PayrollApprovalBeforeHR,
        PayrollApprovalAfterHR: data.PayrollApprovalAfterHR,
        PayrollApprovalAfterHRTime: data.PayrollApprovalAfterHRTime,
        PayrollApprovalBeforeHRTime: data.PayrollApprovalBeforeHRTime,
        ReasonForRejection: data.ReasonForRejection,
        PendingDepartment: data.PendingDepartment,
        ReferenceNumber: data.ReferenceNumber,
        Currency: data.Currency,
        EmployeeeID: data.EmployeeID,
        RejectedBy: data.RejectedBy,
        Approvers: data.Approvers ? JSON.parse(data.Approvers) : [],
        Rejectors: data.Rejectors ? JSON.parse(data.Rejectors) : [],
      }));
      return tableData;
    };
    const getPaymentRequestContent = (tableContent: Array<PaymentData>) => {
      const tableData = tableContent.map((data) => ({
        ID: data.ID,
        key: data.ID,
        Title: data.Title,
        Status: data.Status,
        Department: data.Department,
        Date: data.Date,
        DateFromat: new Date(data.Date).toLocaleDateString("en-GB"),
        JobTitle: data.JobTitle,
        Email: data.Email,
        Ext: data.Ext,
        AmountInWords: data.AmountInWords,
        CreatedBy: data.CreatedBy,
        PendingWith: data.PendingWith,
        PaymentType: data.PaymentType,
        PreviousApproval: data.PreviousApproval,
        Amount: data.Amount,
        AttachmentsJSON: data.AttachmentsJSON
          ? JSON.parse(data.AttachmentsJSON)
          : [],
        SAPVendor: data.SAPVendor,
        Total: data.Total,
        TableTotal: `${data.Total} ${data.Currency}`,
        VAT: data.VAT,
        BeneficiaryName: data.BeneficiaryName ? data.BeneficiaryName : "NA",
        BeneficiaryIBAN: data.BeneficiaryIBAN,
        BeneficiaryBank: data.BeneficiaryBank,
        BusinessApprover: data.BusinessApprover,
        BusinessApproval: data.BusinessApproval,
        BusinessApprovalTime: data.BusinessApprovalTime,
        DepartmentHeadApprover: data.DepartmentHeadApprover,
        DepartmentHeadApproval: data.DepartmentHeadApproval,
        DepartmentHeadApprovalTime: data.DepartmentHeadApprovalTime,
        FinanceSecretaryApprover: data.FinanceSecretaryApprover,
        FinanceSecretaryApproval: data.FinanceSecretaryApproval,
        FinanceSecretaryApprovalTime: data.FinanceSecretaryApprovalTime,
        CashTeamApprover: data.CashTeamApprover,
        CashTeamApproval: data.CashTeamApproval,
        CashTeamApprovalTime: data.CashTeamApprovalTime,
        CashHeadApprover: data.CashHeadApprover,
        CashHeadApproval: data.CashHeadApproval,
        CashHeadApprovalTime: data.CashHeadApprovalTime,
        APTeamApprover: data.APTeamApprover,
        APTeamApproval: data.APTeamApproval,
        APTeamApprovalTime: data.APTeamApprovalTime,
        APHeadApprover: data.APHeadApprover,
        APHeadApproval: data.APHeadApproval,
        APHeadApprovalTime: data.APHeadApprovalTime,
        ARTeamApprover: data.ARTeamApprover,
        ARTeamApproval: data.ARTeamApproval,
        ARTeamApprovalTime: data.ARTeamApprovalTime,
        ARHeadApprover: data.ARHeadApprover,
        ARHeadApproval: data.ARHeadApproval,
        ARHeadApprovalTime: data.ARHeadApprovalTime,
        FinanceControllerApprover: data.FinanceControllerApprover,
        FinanceControllerApproval: data.FinanceControllerApproval,
        FinanceControllerApprovalTime: data.FinanceControllerApprovalTime,
        VPFinanceApprover: data.VPFinanceApprover,
        VPFinanceApproval: data.VPFinanceApproval,
        VPFinanceApprovalTime: data.VPFinanceApprovalTime,
        CFO: data.CFO,
        CFOApproval: data.CFOApproval,
        CFOApprovalTime: data.CFOApprovalTime,
        CEO: data.CEO,
        CEOApproval: data.CEOApproval,
        CEOApprovalTime: data.CEOApprovalTime,
        ReasonForRejection: data.ReasonForRejection,
        BusinessApproverLimit: data.BusinessApproverLimit,
        CashTeamLimit: data.CashTeamLimit,
        ARTeamLimit: data.ARTeamLimit,
        APTeamLimit: data.APTeamLimit,
        FinanceControllerLimit: data.FinanceControllerLimit,
        ApprovalProcess: data.ApprovalProcess,
        TimeLine: data.TimeLine ? JSON.parse(data.TimeLine) : [],
        TreasuryApproval: data.TreasuryApproval,
        TreasuryApprovalTime: data.TreasuryApprovalTime,
        TreasuryApproverName: data.TreasuryApproverName,
        ReferenceNumber: data.ReferenceNumber,
        TreasuryJSON: data.TreasuryJSON ? JSON.parse(data.TreasuryJSON) : [],
        Currency: data.Currency,
        Comments: data.Comments,
        PendingDepartment: data.PendingDepartment,
        RejectedBy: data.RejectedBy,
        VATPercentage: data.VATPercentage,
        Approvers: data.Approvers ? JSON.parse(data.Approvers) : [],
        Rejectors: data.Rejectors ? JSON.parse(data.Rejectors) : [],
        AttachmentFiles: data.AttachmentFiles?.map((file) => {
          return {
            FileName: file.FileName,
          };
        }),
      }));
      return tableData;
    };
    const getAllRequest = (tableContent: any) => {
      const tableData = tableContent.map((data: any) => ({
        key: data.ID,
        Date: data.Date,
        DateFromat: new Date(data.Date).toLocaleDateString("en-GB"),
        Title: data.Title,
        JobTitle: data.JobTitle,
        Email: data.Email,
        Ext: data.Ext,
        Status: data.Status,
        CreatedBy: data.CreatedBy,
        Department: data.Department,
        ReferenceNumber: data.ReferenceNumber,
        PendingDepartment: data.PendingDepartment,
        RejectedBy: data.RejectedBy,
        FormType: data.FormType,
        Approvers: data.Approvers ? JSON.parse(data.Approvers) : [],
        Rejectors: data.Rejectors ? JSON.parse(data.Rejectors) : [],
        BeneficiaryName: data.BeneficiaryName ? data.BeneficiaryName : "NA",
        TableTotal: data.Total
          ? `${data.Total} ${data.Currency}`
          : data.AmountInDigits
          ? `${data.AmountInDigits} ${data.Currency}`
          : "NA",
        AmountInWords: data.AmountInWords,
        PendingWith: data.PendingWith,
        PaymentType: data.PaymentType,
        PreviousApproval: data.PreviousApproval,
        Amount: data.Amount,
        SAPVendor: data.SAPVendor,
        Total: data.Total,
        VAT: data.VAT,
        VATPercentage: data.VATPercentage,
        BeneficiaryIBAN: data.BeneficiaryIBAN,
        BeneficiaryBank: data.BeneficiaryBank,
        BusinessApprover: data.BusinessApprover,
        BusinessApproval: data.BusinessApproval,
        BusinessApprovalTime: data.BusinessApprovalTime,
        DepartmentHeadApprover: data.DepartmentHeadApprover,
        DepartmentHeadApproval: data.DepartmentHeadApproval,
        DepartmentHeadApprovalTime: data.DepartmentHeadApprovalTime,
        FinanceSecretaryApprover: data.FinanceSecretaryApprover,
        FinanceSecretaryApproval: data.FinanceSecretaryApproval,
        FinanceSecretaryApprovalTime: data.FinanceSecretaryApprovalTime,
        CashTeamApprover: data.CashTeamApprover,
        CashTeamApproval: data.CashTeamApproval,
        CashTeamApprovalTime: data.CashTeamApprovalTime,
        CashHeadApprover: data.CashHeadApprover,
        CashHeadApproval: data.CashHeadApproval,
        CashHeadApprovalTime: data.CashHeadApprovalTime,
        APTeamApprover: data.APTeamApprover,
        APTeamApproval: data.APTeamApproval,
        APTeamApprovalTime: data.APTeamApprovalTime,
        APHeadApprover: data.APHeadApprover,
        APHeadApproval: data.APHeadApproval,
        APHeadApprovalTime: data.APHeadApprovalTime,
        ARTeamApprover: data.ARTeamApprover,
        ARTeamApproval: data.ARTeamApproval,
        ARTeamApprovalTime: data.ARTeamApprovalTime,
        ARHeadApprover: data.ARHeadApprover,
        ARHeadApproval: data.ARHeadApproval,
        ARHeadApprovalTime: data.ARHeadApprovalTime,
        FinanceControllerApprover: data.FinanceControllerApprover,
        FinanceControllerApproval: data.FinanceControllerApproval,
        FinanceControllerApprovalTime: data.FinanceControllerApprovalTime,
        VPFinanceApprover: data.VPFinanceApprover,
        VPFinanceApproval: data.VPFinanceApproval,
        VPFinanceApprovalTime: data.VPFinanceApprovalTime,
        CFO: data.CFO,
        CFOApproval: data.CFOApproval,
        CFOApprovalTime: data.CFOApprovalTime,
        CEO: data.CEO,
        CEOApproval: data.CEOApproval,
        CEOApprovalTime: data.CEOApprovalTime,
        ReasonForRejection: data.ReasonForRejection,
        BusinessApproverLimit: data.BusinessApproverLimit,
        CashTeamLimit: data.CashTeamLimit,
        ARTeamLimit: data.ARTeamLimit,
        APTeamLimit: data.APTeamLimit,
        FinanceControllerLimit: data.FinanceControllerLimit,
        ApprovalProcess: data.ApprovalProcess,
        TreasuryApproval: data.TreasuryApproval,
        TreasuryApprovalTime: data.TreasuryApprovalTime,
        TreasuryApproverName: data.TreasuryApproverName,
        Currency: data.Currency,
        Comments: data.Comments,
        EmployeeID: data.EmpID,
        EmployeeExt: data.EmpExt,
        AmountInDigits: data.AmountInDigits,
        HRApproval: data.HRApproval,
        Created: data.Created,
        HRApprovalTime: data.HRApprovalTime,
        BusinessApprovar: data.BusinessApprovar,
        HRApprovar: data.HRApprovar,
        FinanceApproval: data.FinanceApproval,
        FinanceApprovalTime: data.FinanceApprovalTime,
        LoanType: data.LoanType,
        FinanceApprovar: data.FinanceApprovar,
        PayrollApprovar: data.PayrollApprovar,
        PayrollApprovalBeforeHR: data.PayrollApprovalBeforeHR,
        PayrollApprovalAfterHR: data.PayrollApprovalAfterHR,
        PayrollApprovalAfterHRTime: data.PayrollApprovalAfterHRTime,
        PayrollApprovalBeforeHRTime: data.PayrollApprovalBeforeHRTime,
        EmployeeeID: data.EmployeeID,
        LoginName: data.LoginName,
        EmailType: data.EmailType,
        InternetAccess: data.InternetAccess,
        Remarks: data.Remarks,
        ITSM: data.ITSM,
        ITApproval: data.ITApproval,
        ITApprovalTime: data.ITApprovalTime,
        ITApprovar: data.ITApprovar,
        AdditionalITApprovar: data.AdditionalITApprovar,
        ApprovalBy: data.ApprovalBy,
        ITTechnician: data.ITTechnician,
        ITTechnicianApprovalTime: data.ITTechnicianApprovalTime,
        ITTechnicianApproval: data.ITTechnicianApproval,
        EmployeeType: data.EmployeeType,
        EmployeeNo: data.EmployeeNo,
        UserCreatedBy: data.UserCreatedBy,
        VPN: data.VPN,
        IsVPN: data.IsVPN,
        IsEmail: data.IsEmail,
      }));
      return tableData;
    };
    const dataFilter = (tableContent: any[]) => {
      const data = tableContent?.filter(
        (data: {
          PendingWith: string;
          CreatedBy: string;
          Status: string;
          ITApproval: string;
          CEOApproval: string;
          FinanceApproval: string;
          PendingDepartment: string;
          TreasuryApproval: string;
          RejectedBy: string;
          VPFinanceApprover: string;
          Approvers: any;
          Rejectors: any;
        }) => {
          const treasuryStatus = (dataItems: any) => {
            const treasuryApprovers = dataItems.TreasuryApproverName?.split(
              ";"
            ).filter(
              (item: string) => item === context.pageContext.user.displayName
            );
            return treasuryApprovers?.length > 0 ? true : false;
          };
          const approvedByMe = (data: {
            Approvers: string;
            Status: string;
          }) => {
            let approversList = [];
            if (data.Approvers) {
              const nameList = JSON.parse(data.Approvers);
              approversList = nameList?.filter((data: { name: string }) => {
                if (
                  data.name
                    ?.toLowerCase()
                    .match(context.pageContext.user.displayName?.toLowerCase())
                )
                  return data;
              });
            }
            console.log("approversList", approversList);
            if (treasuryStatus(data))
              return approversList?.length > 0 || data.Status === "Closed";
            else return approversList?.length > 0;
          };
          const rejectedByMe = (data: { Rejectors: string }) => {
            let rejectorsList = [];
            if (data.Rejectors) {
              const nameList = JSON.parse(data.Rejectors);
              rejectorsList = nameList?.filter((data: { name: string }) => {
                if (
                  data.name
                    ?.toLowerCase()
                    .match(context.pageContext.user.displayName?.toLowerCase())
                )
                  return data;
              });
            }
            console.log("rejectorsList", rejectorsList);
            return rejectorsList?.length > 0;
          };
          const upperLevelFilter = (dataItems: any) => {
            const currentUser = context.pageContext.user.displayName;
            const isVPFinance =
              dataItems.VPFinanceApprover?.split(";").filter(
                (item: string) => item === currentUser
              )?.length > 0;
            console.log("isVPFinance", isVPFinance);
            const isCFO =
              dataItems.CFO?.split(";").filter(
                (item: string) => item === currentUser
              )?.length > 0;
            console.log("isCFO", isCFO);
            const isCEO =
              dataItems.CEO?.split(";").filter(
                (item: string) => item === currentUser
              )?.length > 0;
            console.log("isCEO", isCEO);
            const FinanceSecretaryApproval = dataItems.FinanceSecretaryApproval;
            const FinanceSecretaryApprovalStatus =
              FinanceSecretaryApproval === "Cash Team" ||
              FinanceSecretaryApproval === "AP Team" ||
              FinanceSecretaryApproval === "AR Team";
            const checkAllData = (DATA: any) => {
              const relatedData =
                DATA.PendingWith?.split(";").filter(
                  (item: string) => item === currentUser
                )?.length > 0 || DATA.CreatedBy === currentUser;
              console.log("relatedData", relatedData);
              console.log("approvedByMe(DATA)", approvedByMe(DATA));
              console.log("rejectedByMe(DATA)", rejectedByMe(DATA));
              return relatedData || approvedByMe(DATA) || rejectedByMe(DATA);
            };
            if (checkAllData(dataItems)) return dataItems;
            else if (isVPFinance && FinanceSecretaryApprovalStatus)
              return dataItems;
            else if (isCFO && dataItems.VPFinanceApproval === "Approved")
              return dataItems;
            else if (isCEO && dataItems.CFOApproval === "Approved")
              return dataItems;
          };
          const allApproversFilter = (item: any) => {
            const BusinessApprover = item.BusinessApprover
              ? item.BusinessApprover?.split(";")
              : [];
            const DepartmentHeadApprover = item.DepartmentHeadApprover
              ? item.DepartmentHeadApprover?.split(";")
              : [];
            const FinanceSecretaryApprover = item.FinanceSecretaryApprover
              ? item.FinanceSecretaryApprover?.split(";")
              : [];
            const CashTeamApprover = item.CashTeamApprover
              ? item.CashTeamApprover?.split(";")
              : [];
            const CashHeadApprover = item.CashHeadApprover
              ? item.CashHeadApprover?.split(";")
              : [];
            const APTeamApprover = item.APTeamApprover
              ? item.APTeamApprover?.split(";")
              : [];
            const APHeadApprover = item.APHeadApprover
              ? item.APHeadApprover?.split(";")
              : [];
            const ARTeamApprover = item.ARTeamApprover
              ? item.ARTeamApprover?.split(";")
              : [];
            const ARHeadApprover = item.ARHeadApprover
              ? item.ARHeadApprover?.split(";")
              : [];
            const FinanceControllerApprover = item.FinanceControllerApprover
              ? item.FinanceControllerApprover?.split(";")
              : [];
            const VPFinanceApprover = item.VPFinanceApprover
              ? item.VPFinanceApprover?.split(";")
              : [];
            const CFO = item.CFO ? item.CFO?.split(";") : [];
            const CEO = item.CEO ? item.CEO?.split(";") : [];
            const HRApprovar = item.HRApprovar
              ? item.HRApprovar?.split(";")
              : [];
            const FinanceApprovar = item.FinanceApprovar
              ? item.FinanceApprovar?.split(";")
              : [];
            const PayrollApprovar = item.PayrollApprovar
              ? item.PayrollApprovar?.split(";")
              : [];
            const ITApprovar = item.ITApprovar
              ? item.ITApprovar?.split(";")
              : [];
            const ITTechnician = item.ITTechnician
              ? item.ITTechnician?.split(";")
              : [];
            console.log("APPROVERS LIST DATA ITEM", item);
            let approversList = [
              ...BusinessApprover,
              ...DepartmentHeadApprover,
              ...FinanceSecretaryApprover,
              ...FinanceControllerApprover,
              ...VPFinanceApprover,
              ...CFO,
              ...CEO,
              ...HRApprovar,
              ...FinanceApprovar,
              ...PayrollApprovar,
              ...ITApprovar,
              ...ITTechnician,
            ];
            if (item.CashTeamApproval === "Approved")
              approversList = [...approversList, ...CashTeamApprover];
            else if (item.APTeamApproval === "Approved")
              approversList = [...approversList, ...APTeamApprover];
            else if (item.ARTeamApproval === "Approved")
              approversList = [...approversList, ...ARTeamApprover];
            else if (item.CashHeadApproval === "Approved")
              approversList = [...approversList, ...CashHeadApprover];
            else if (item.APHeadApproval === "Approved")
              approversList = [...approversList, ...APHeadApprover];
            else if (item.ARHeadApproval === "Approved")
              approversList = [...approversList, ...ARHeadApprover];
            console.log("APPROVERS LIST", approversList);

            const isApprover = approversList?.filter(
              (item: string) => item === context.pageContext.user.displayName
            );
            return isApprover?.length > 0;
          };
          if (selectDashboard === "Task Assigned to me") {
            return (
              data.PendingWith?.split(";").filter(
                (item) => item === context.pageContext.user.displayName
              )?.length > 0
            );
          } else if (selectDashboard === "Request Created by me") {
            return (
              data.CreatedBy?.split(";").filter(
                (item) => item === context.pageContext.user.displayName
              )?.length > 0
            );
          } else if (selectDashboard === "Open") {
            let approversList = [];
            if (data.Approvers) {
              const nameList = JSON.parse(data.Approvers);
              approversList = nameList?.filter((data: { name: string }) => {
                if (
                  data.name
                    ?.toLowerCase()
                    .match(context.pageContext.user.displayName?.toLowerCase())
                ) {
                  return data;
                }
              });
            }
            console.log("approversList", approversList);
            const openFilter = (item: {
              Status: string;
              PendingWith: string;
              CreatedBy: string;
            }) => {
              return (
                item.Status.split(" ")[0] === selectDashboard &&
                item.CreatedBy === context.pageContext.user.displayName
              );
            };
            if (treasuryStatus(data)) {
              return (
                ((approversList?.length > 0 && data.Status === "Open") ||
                  openFilter(data)) &&
                data
              );
            } else if (
              (allApproversFilter(data) && data.Status === "Open") ||
              openFilter(data)
            ) {
              return data;
            } else {
              return openFilter(data);
            }
          } else if (selectDashboard === "Rejected") {
            let rejectorsList = [];
            const isVpFinance = (vpData: string) => {
              console.log("vpData", vpData);
              var vpFinanceList = vpData?.split(";")?.filter((vpItem) => {
                if (
                  vpItem
                    ?.toLowerCase()
                    .match(context.pageContext.user.displayName?.toLowerCase())
                ) {
                  return vpItem;
                }
              });
              console.log("vpFinanceList", vpFinanceList);
              return vpFinanceList?.length > 0;
            };
            console.log("isVpFinance", isVpFinance(data.VPFinanceApprover));
            const financeLevelRejected = (flData: any) => {
              return flData.CashTeamApproval === "Rejected" ||
                flData.CashHeadApproval === "Rejected" ||
                flData.APTeamApproval === "Rejected" ||
                flData.APHeadApproval === "Rejected" ||
                flData.ARTeamApproval === "Rejected" ||
                flData.ARHeadApproval === "Rejected" ||
                flData.FinanceControllerApproval === "Rejected"
                ? true
                : false;
            };
            console.log("financeLevelRejected", financeLevelRejected(data));
            if (data.Rejectors) {
              const nameList = JSON.parse(data.Rejectors);
              rejectorsList = nameList?.filter((data: { name: string }) => {
                if (
                  data.name
                    ?.toLowerCase()
                    .match(context.pageContext.user.displayName?.toLowerCase())
                ) {
                  return data;
                }
              });
            }
            console.log("rejectorsList", rejectorsList);
            if (
              isVpFinance(data.VPFinanceApprover) &&
              financeLevelRejected(data)
            ) {
              return data;
            } else if (rejectorsList?.length > 0) {
              return data;
            }
          } else if (selectDashboard === "All Request") {
            return upperLevelFilter(data);
          } else if (selectDashboard === "Closed") {
            let approversList = [];
            if (data.Approvers) {
              const nameList = JSON.parse(data.Approvers);
              approversList = nameList?.filter((data: { name: string }) => {
                if (
                  data.name
                    ?.toLowerCase()
                    .match(context.pageContext.user.displayName?.toLowerCase())
                ) {
                  return data;
                }
              });
            }
            console.log("approversList", approversList);
            const closedFilter = (item: {
              Status: string;
              PendingWith: string;
              CreatedBy: string;
            }) => {
              return (
                (item.Status.split(" ")[0] === selectDashboard ||
                  item.PendingWith === "Closed" ||
                  item.Status === "User Created" ||
                  item.PendingWith === "None") &&
                item.CreatedBy === context.pageContext.user.displayName
              );
            };
            if (treasuryStatus(data)) {
              return (
                ((approversList?.length > 0 && data.Status === "Closed") ||
                  closedFilter(data)) &&
                data
              );
            } else if (
              (allApproversFilter(data) && data.Status === "Closed") ||
              closedFilter(data)
            ) {
              return data;
            } else {
              return closedFilter(data);
            }
          } else if (selectDashboard === "Approved") {
            let approversList = [];
            if (data.Approvers) {
              const nameList = JSON.parse(data.Approvers);
              approversList = nameList?.filter((data: { name: string }) => {
                if (
                  data.name
                    ?.toLowerCase()
                    .match(context.pageContext.user.displayName?.toLowerCase())
                ) {
                  return data;
                }
              });
            }
            console.log("approversList", approversList);
            if (treasuryStatus(data)) {
              return (
                (approversList?.length > 0 || data.Status === "Closed") && data
              );
            } else {
              return approversList?.length > 0 && data;
            }
          }
        }
      );
      return data;
    };

    if (prevState.tableData !== tableData) {
      this.setState({
        paginationData: {
          ...paginationData,
          pagination: {
            ...paginationData.pagination,
            total: tableData?.length,
          },
        },
      });
    }

    if (prevProps.newUserData !== newUserData) {
      console.log("selectTable", selectTable);
      if (selectTable === "All Requests") {
        const dataList = dataFilter(newUserData);
        const tableContent = getAllRequest(dataList);
        console.log("tableContent", tableContent);
        this.setState({
          tableData: tableContent,
          Column: this.AllRequestColumns,
        });
      }
      if (selectTable === "New User Creation") {
        const dataList = dataFilter(newUserData);
        const tableContent = getTableContent(dataList);
        console.log("tableContent", tableContent);
        this.setState({ tableData: tableContent, Column: this.columns });
      }
      if (selectTable === "New Loan Request") {
        const dataList = dataFilter(newUserData);
        const tableContent = getLoanTableContent(dataList);
        console.log("tableContent", tableContent);
        this.setState({ tableData: tableContent, Column: this.LoanColumns });
      }
      if (selectTable === "Payment Request") {
        const dataList = dataFilter(newUserData);
        const tableContent = getPaymentRequestContent(dataList);
        console.log("tableContent", tableContent);
        this.setState({ tableData: tableContent, Column: this.PaymentColumns });
      }
    }
    if (prevProps.selectTable !== selectTable) {
      console.log("selectTable", selectTable);
      if (selectTable === "All Requests") {
        const dataList = dataFilter(newUserData);
        const tableContent = getAllRequest(dataList);
        console.log("tableContent", tableContent);
        this.setState({
          tableData: tableContent,
          Column: this.AllRequestColumns,
        });
      }
      if (selectTable === "New User Creation") {
        const dataList = dataFilter(newUserData);
        const tableContent = getTableContent(dataList);
        console.log("tableContent", tableContent);
        this.setState({ tableData: tableContent, Column: this.columns });
      }
      if (selectTable === "New Loan Request") {
        const dataList = dataFilter(newUserData);
        const tableContent = getLoanTableContent(dataList);
        console.log("tableContent", tableContent);
        this.setState({ tableData: tableContent, Column: this.LoanColumns });
      }
      if (selectTable === "Payment Request") {
        const dataList = dataFilter(newUserData);
        const tableContent = getPaymentRequestContent(dataList);
        console.log("tableContent", tableContent);
        this.setState({ tableData: tableContent, Column: this.PaymentColumns });
      }
    }
    if (prevProps.selectDashboard !== selectDashboard) {
      console.log("selectDashboard", selectDashboard);
      if (selectTable === "All Requests") {
        const dataList = dataFilter(newUserData);
        const tableContent = getAllRequest(dataList);
        console.log("tableContent", tableContent);
        this.setState({
          tableData: tableContent,
          Column: this.AllRequestColumns,
        });
      }
      if (selectTable === "New User Creation") {
        const dataList = dataFilter(newUserData);
        const tableContent = getTableContent(dataList);
        console.log("tableContent", tableContent);
        this.setState({ tableData: tableContent, Column: this.columns });
      }
      if (selectTable === "New Loan Request") {
        const dataList = dataFilter(newUserData);
        const tableContent = getLoanTableContent(dataList);
        console.log("tableContent", tableContent);
        this.setState({ tableData: tableContent, Column: this.LoanColumns });
      }
      if (selectTable === "Payment Request") {
        const dataList = dataFilter(newUserData);
        const tableContent = getPaymentRequestContent(dataList);
        console.log("tableContent", tableContent);
        this.setState({ tableData: tableContent, Column: this.PaymentColumns });
      }
    }

    if (prevProps.exportAsPdf !== exportAsPdf) {
      if (exportAsPdf) {
        if (selectTable === "All Requests") {
          const excelData = tableData?.map((data: any) => {
            return {
              Date: data.Date,
              Title: data.Title,
              JobTitle: data.JobTitle,
              Email: data.Email,
              Ext: data.Ext,
              Status: data.Status,
              CreatedBy: data.CreatedBy,
              Department: data.Department,
              ReferenceNumber: data.ReferenceNumber,
              PendingDepartment: data.PendingDepartment,
              RejectedBy: data.RejectedBy,
              FormType: data.FormType,
              BeneficiaryName: data.BeneficiaryName ? data.BeneficiaryName : "",
              TableTotal: data.Total
                ? `${data.Total} ${data.Currency}`
                : data.AmountInDigits
                ? `${data.AmountInDigits} ${data.Currency}`
                : "",
              AmountInWords: data.AmountInWords,
              PendingWith: data.PendingWith,
              PaymentType: data.PaymentType,
              PreviousApproval: data.PreviousApproval,
              Amount: data.Amount,
              SAPVendor: data.SAPVendor,
              Total: data.Total,
              VAT: data.VAT,
              BeneficiaryIBAN: data.BeneficiaryIBAN,
              BeneficiaryBank: data.BeneficiaryBank,
              BusinessApprover: data.BusinessApprover,
              BusinessApproval: data.BusinessApproval,
              BusinessApprovalTime: data.BusinessApprovalTime,
              DepartmentHeadApprover: data.DepartmentHeadApprover,
              DepartmentHeadApproval: data.DepartmentHeadApproval,
              DepartmentHeadApprovalTime: data.DepartmentHeadApprovalTime,
              FinanceSecretaryApprover: data.FinanceSecretaryApprover,
              FinanceSecretaryApproval: data.FinanceSecretaryApproval,
              FinanceSecretaryApprovalTime: data.FinanceSecretaryApprovalTime,
              CashTeamApprover: data.CashTeamApprover,
              CashTeamApproval: data.CashTeamApproval,
              CashTeamApprovalTime: data.CashTeamApprovalTime,
              CashHeadApprover: data.CashHeadApprover,
              CashHeadApproval: data.CashHeadApproval,
              CashHeadApprovalTime: data.CashHeadApprovalTime,
              APTeamApprover: data.APTeamApprover,
              APTeamApproval: data.APTeamApproval,
              APTeamApprovalTime: data.APTeamApprovalTime,
              APHeadApprover: data.APHeadApprover,
              APHeadApproval: data.APHeadApproval,
              APHeadApprovalTime: data.APHeadApprovalTime,
              ARTeamApprover: data.ARTeamApprover,
              ARTeamApproval: data.ARTeamApproval,
              ARTeamApprovalTime: data.ARTeamApprovalTime,
              ARHeadApprover: data.ARHeadApprover,
              ARHeadApproval: data.ARHeadApproval,
              ARHeadApprovalTime: data.ARHeadApprovalTime,
              FinanceControllerApprover: data.FinanceControllerApprover,
              FinanceControllerApproval: data.FinanceControllerApproval,
              FinanceControllerApprovalTime: data.FinanceControllerApprovalTime,
              VPFinanceApprover: data.VPFinanceApprover,
              VPFinanceApproval: data.VPFinanceApproval,
              VPFinanceApprovalTime: data.VPFinanceApprovalTime,
              CFO: data.CFO,
              CFOApproval: data.CFOApproval,
              CFOApprovalTime: data.CFOApprovalTime,
              CEO: data.CEO,
              CEOApproval: data.CEOApproval,
              CEOApprovalTime: data.CEOApprovalTime,
              ReasonForRejection: data.ReasonForRejection,
              BusinessApproverLimit: data.BusinessApproverLimit,
              CashTeamLimit: data.CashTeamLimit,
              ARTeamLimit: data.ARTeamLimit,
              APTeamLimit: data.APTeamLimit,
              FinanceControllerLimit: data.FinanceControllerLimit,
              ApprovalProcess: data.ApprovalProcess,
              TreasuryApproval: data.TreasuryApproval,
              TreasuryApprovalTime: data.TreasuryApprovalTime,
              TreasuryApproverName: data.TreasuryApproverName,
              Currency: data.Currency,
              Comments: data.Comments,
              EmployeeID: data.EmpID,
              EmployeeExt: data.EmpExt,
              AmountInDigits: data.AmountInDigits,
              HRApproval: data.HRApproval,
              Created: data.Created,
              HRApprovalTime: data.HRApprovalTime,
              BusinessApprovar: data.BusinessApprovar,
              HRApprovar: data.HRApprovar,
              FinanceApproval: data.FinanceApproval,
              FinanceApprovalTime: data.FinanceApprovalTime,
              LoanType: data.LoanType,
              FinanceApprovar: data.FinanceApprovar,
              PayrollApprovar: data.PayrollApprovar,
              PayrollApprovalBeforeHR: data.PayrollApprovalBeforeHR,
              PayrollApprovalAfterHR: data.PayrollApprovalAfterHR,
              PayrollApprovalAfterHRTime: data.PayrollApprovalAfterHRTime,
              PayrollApprovalBeforeHRTime: data.PayrollApprovalBeforeHRTime,
              EmployeeeID: data.EmployeeID,
              LoginName: data.LoginName,
              EmailType: data.EmailType,
              InternetAccess: data.InternetAccess,
              Remarks: data.Remarks,
              ITSM: data.ITSM,
              ITApproval: data.ITApproval,
              ITApprovalTime: data.ITApprovalTime,
              ITApprovar: data.ITApprovar,
              AdditionalITApprovar: data.AdditionalITApprovar,
              ApprovalBy: data.ApprovalBy,
              ITTechnician: data.ITTechnician,
              ITTechnicianApprovalTime: data.ITTechnicianApprovalTime,
              ITTechnicianApproval: data.ITTechnicianApproval,
              EmployeeType: data.EmployeeType,
              EmployeeNo: data.EmployeeNo,
              UserCreatedBy: data.UserCreatedBy,
              VPN: data.VPN,
              IsVPN: data.IsVPN,
              IsEmail: data.IsEmail,
            };
          });
          downloadExcel(excelData);
        } else if (selectTable === "New User Creation") {
          const excelData = tableData?.map((data: any) => {
            return {
              Date: data.Date,
              Title: data.Title,
              LoginName: data.LoginName,
              Department: data.Department,
              Status: data.Status,
              EmailType: data.EmailType,
              InternetAccess: data.InternetAccess,
              Remarks: data.Remarks,
              ITSM: data.ITSM,
              CreatedBy: data.CreatedBy,
              PendingWith: data.PendingWith,
              BusinessApproval: data.BusinessApproval,
              ITApproval: data.ITApproval,
              Created: data.Created,
              BusinessApprovalTime: data.BusinessApprovalTime,
              ITApprovalTime: data.ITApprovalTime,
              BusinessApprovar: data.BusinessApprovar,
              ITApprovar: data.ITApprovar,
              AdditionalITApprovar: data.AdditionalITApprovar,
              ReasonForRejection: data.ReasonForRejection,
              ApprovalBy: data.ApprovalBy,
              ITTechnician: data.ITTechnician,
              ITTechnicianApprovalTime: data.ITTechnicianApprovalTime,
              ITTechnicianApproval: data.ITTechnicianApproval,
              PendingDepartment: data.PendingDepartment,
              ReferenceNumber: data.ReferenceNumber,
              EmployeeType: data.EmployeeType,
              EmployeeNo: data.EmployeeNo,
              UserCreatedBy: data.UserCreatedBy,
              VPN: data.VPN,
              IsVPN: data.IsVPN,
              IsEmail: data.IsEmail,
              RejectedBy: data.RejectedBy,
            };
          });
          downloadExcel(excelData);
        } else if (selectTable === "New Loan Request") {
          const excelData = tableData?.map((data: any) => {
            return {
              Title: data.Title,
              Status: data.Status,
              Department: data.Department,
              Date: data.Date,
              JobTitle: data.JobTitle,
              EmployeeID: data.EmpID,
              EmployeeExt: data.EmpExt,
              AmountInDigits: data.AmountInDigits,
              TableTotal: `${data.AmountInDigits} ${data.Currency}`,
              AmountInWords: data.AmountInWords,
              CreatedBy: data.CreatedBy,
              PendingWith: data.PendingWith,
              BusinessApproval: data.BusinessApproval,
              HRApproval: data.HRApproval,
              Created: data.Created,
              BusinessApprovalTime: data.BusinessApprovalTime,
              HRApprovalTime: data.HRApprovalTime,
              BusinessApprovar: data.BusinessApprovar,
              HRApprovar: data.HRApprovar,
              FinanceApproval: data.FinanceApproval,
              FinanceApprovalTime: data.FinanceApprovalTime,
              LoanType: data.LoanType,
              FinanceApprovar: data.FinanceApprovar,
              PayrollApprovar: data.PayrollApprovar,
              PayrollApprovalBeforeHR: data.PayrollApprovalBeforeHR,
              PayrollApprovalAfterHR: data.PayrollApprovalAfterHR,
              PayrollApprovalAfterHRTime: data.PayrollApprovalAfterHRTime,
              PayrollApprovalBeforeHRTime: data.PayrollApprovalBeforeHRTime,
              ReasonForRejection: data.ReasonForRejection,
              PendingDepartment: data.PendingDepartment,
              ReferenceNumber: data.ReferenceNumber,
              Currency: data.Currency,
              EmployeeeID: data.EmployeeID,
              RejectedBy: data.RejectedBy,
            };
          });
          downloadExcel(excelData);
        } else if (selectTable === "Payment Request") {
          const excelData = tableData?.map((data: any) => {
            return {
              Title: data.Title,
              Status: data.Status,
              Department: data.Department,
              Date: data.Date,
              JobTitle: data.JobTitle,
              Email: data.Email,
              Ext: data.Ext,
              AmountInWords: data.AmountInWords,
              CreatedBy: data.CreatedBy,
              PendingWith: data.PendingWith,
              PaymentType: data.PaymentType,
              PreviousApproval: data.PreviousApproval,
              Amount: data.Amount,
              SAPVendor: data.SAPVendor,
              Total: data.Total,
              TableTotal: `${data.Total} ${data.Currency}`,
              VAT: data.VAT,
              BeneficiaryName: data.BeneficiaryName,
              BeneficiaryIBAN: data.BeneficiaryIBAN,
              BeneficiaryBank: data.BeneficiaryBank,
              BusinessApprover: data.BusinessApprover,
              BusinessApproval: data.BusinessApproval,
              BusinessApprovalTime: data.BusinessApprovalTime,
              DepartmentHeadApprover: data.DepartmentHeadApprover,
              DepartmentHeadApproval: data.DepartmentHeadApproval,
              DepartmentHeadApprovalTime: data.DepartmentHeadApprovalTime,
              FinanceSecretaryApprover: data.FinanceSecretaryApprover,
              FinanceSecretaryApproval: data.FinanceSecretaryApproval,
              FinanceSecretaryApprovalTime: data.FinanceSecretaryApprovalTime,
              CashTeamApprover: data.CashTeamApprover,
              CashTeamApproval: data.CashTeamApproval,
              CashTeamApprovalTime: data.CashTeamApprovalTime,
              CashHeadApprover: data.CashHeadApprover,
              CashHeadApproval: data.CashHeadApproval,
              CashHeadApprovalTime: data.CashHeadApprovalTime,
              APTeamApprover: data.APTeamApprover,
              APTeamApproval: data.APTeamApproval,
              APTeamApprovalTime: data.APTeamApprovalTime,
              APHeadApprover: data.APHeadApprover,
              APHeadApproval: data.APHeadApproval,
              APHeadApprovalTime: data.APHeadApprovalTime,
              ARTeamApprover: data.ARTeamApprover,
              ARTeamApproval: data.ARTeamApproval,
              ARTeamApprovalTime: data.ARTeamApprovalTime,
              ARHeadApprover: data.ARHeadApprover,
              ARHeadApproval: data.ARHeadApproval,
              ARHeadApprovalTime: data.ARHeadApprovalTime,
              FinanceControllerApprover: data.FinanceControllerApprover,
              FinanceControllerApproval: data.FinanceControllerApproval,
              FinanceControllerApprovalTime: data.FinanceControllerApprovalTime,
              VPFinanceApprover: data.VPFinanceApprover,
              VPFinanceApproval: data.VPFinanceApproval,
              VPFinanceApprovalTime: data.VPFinanceApprovalTime,
              CFO: data.CFO,
              CFOApproval: data.CFOApproval,
              CFOApprovalTime: data.CFOApprovalTime,
              CEO: data.CEO,
              CEOApproval: data.CEOApproval,
              CEOApprovalTime: data.CEOApprovalTime,
              ReasonForRejection: data.ReasonForRejection,
              BusinessApproverLimit: data.BusinessApproverLimit,
              CashTeamLimit: data.CashTeamLimit,
              ARTeamLimit: data.ARTeamLimit,
              APTeamLimit: data.APTeamLimit,
              FinanceControllerLimit: data.FinanceControllerLimit,
              ApprovalProcess: data.ApprovalProcess,
              TreasuryApproval: data.TreasuryApproval,
              TreasuryApprovalTime: data.TreasuryApprovalTime,
              TreasuryApproverName: data.TreasuryApproverName,
              ReferenceNumber: data.ReferenceNumber,
              Currency: data.Currency,
              Comments: data.Comments,
              PendingDepartment: data.PendingDepartment,
              RejectedBy: data.RejectedBy,
            };
          });
          downloadExcel(excelData);
        }
      }
    }
  }

  public columns: ColumnsType<DataType> = [
    {
      title: `Ref Number`,
      dataIndex: `ReferenceNumber`,
      align: "center",
    },
    {
      title: "Date",
      dataIndex: "DateFromat",
      align: "center",
    },
    {
      title: "Department",
      dataIndex: "Department",
      align: "center",
    },
    {
      title: "Created By",
      align: "center",
      dataIndex: "CreatedBy",
    },
    {
      title: "Status",
      align: "center",
      dataIndex: "Status",
    },
    {
      title: "Pending With",
      dataIndex: "PendingDepartment",
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record: { key: React.Key }) => (
        <Space size="middle">
          <span
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => {
              const filterData = this.state.tableData?.filter(
                (data: any) => data.key === record.key
              );
              console.log("Modal data", filterData);
              this.setState({ modalData: filterData });
              if (filterData?.length > 0) {
                this.setState({ modalOpen: true, isDataLoading: false });
              }
              console.log("Table element", record.key);
            }}
          >
            View
          </span>
        </Space>
      ),
    },
  ];

  public LoanColumns: ColumnsType<DataType> = [
    {
      title: `Ref Number`,
      align: "center",
      dataIndex: `ReferenceNumber`,
    },
    {
      title: "Date",
      align: "center",
      dataIndex: "DateFromat",
    },
    {
      title: "Department",
      dataIndex: "Department",
      align: "center",
    },
    {
      title: "Created By",
      dataIndex: "CreatedBy",
      align: "center",
    },
    {
      title: "Status",
      align: "center",
      dataIndex: "Status",
    },
    {
      title: "Pending With",
      dataIndex: "PendingDepartment",
      align: "center",
    },
    {
      title: "Amount",
      dataIndex: "TableTotal",
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record: { key: React.Key }) => (
        <Space size="middle">
          <span
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => {
              const filterData = this.state.tableData?.filter(
                (data: any) => data.key === record.key
              );
              console.log("Modal data", filterData);
              this.setState({ modalData: filterData });
              if (filterData?.length > 0) {
                this.setState({ modalOpen: true, isDataLoading: false });
              }
              console.log("Table element", record.key);
            }}
          >
            View
          </span>
        </Space>
      ),
    },
  ];

  public AllRequestColumns: ColumnsType<DataType> = [
    {
      title: `Ref Number`,
      align: "center",
      dataIndex: `ReferenceNumber`,
    },
    {
      title: "Date",
      align: "center",
      dataIndex: "DateFromat",
    },
    {
      title: "Department",
      dataIndex: "Department",
      align: "center",
    },
    {
      title: "Beneficiary Name",
      align: "center",
      dataIndex: "BeneficiaryName",
    },
    {
      title: "Status",
      align: "center",
      dataIndex: "Status",
    },
    {
      title: "Pending With",
      dataIndex: "PendingDepartment",
      align: "center",
    },
    {
      title: "Amount",
      dataIndex: "TableTotal",
      align: "center",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record: any) => (
        <Space size="middle">
          <span
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => {
              this.setState({ SelectedTable: record.FormType });
              if (record.FormType === "USER FORM") {
                this.getNewUser(record.key);
              } else if (record.FormType === "LOAN FORM") {
                this.getLoanRequest(record.key);
              } else if (record.FormType === "PAYMENT FORM") {
                this.getPaymentRequest(record.key);
              }
              this.setState({ modalOpen: true, isDataLoading: false });
              console.log("Table element", record.key);
            }}
          >
            View
          </span>
        </Space>
      ),
    },
  ];

  public PaymentColumns: ColumnsType<DataType> = [
    {
      title: `Ref Number`,
      align: "center",
      dataIndex: `ReferenceNumber`,
    },
    {
      title: "Date",
      align: "center",
      dataIndex: "DateFromat",
    },
    {
      title: "Department",
      dataIndex: "Department",
      align: "center",
    },
    {
      title: "Beneficiary Name",
      align: "center",
      dataIndex: "BeneficiaryName",
    },
    {
      title: "Status",
      align: "center",
      dataIndex: "Status",
    },
    {
      title: "Pending With",
      dataIndex: "PendingDepartment",
      align: "center",
    },
    {
      title: "Amount",
      align: "center",
      dataIndex: "TableTotal",
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_, record: { key: React.Key }) => (
        <Space size="middle">
          <span
            className="text-primary"
            style={{ cursor: "pointer" }}
            onClick={() => {
              const filterData = this.state.tableData?.filter(
                (data: any) => data.key === record.key
              );
              console.log("Modal data", filterData);
              this.setState({ modalData: filterData });
              if (filterData?.length > 0) {
                this.setState({ modalOpen: true, isDataLoading: false });
              }
              console.log("Table element", record.key);
            }}
          >
            View
          </span>
        </Space>
      ),
    },
  ];

  public render(): React.ReactElement<IWorkflowTableProps> {
    const {
      tableData,
      modalOpen,
      modalData,
      isDataLoading,
      modalDataError,
      loadingText,
      Column,
      SelectedTable,
      paginationData,
    } = this.state;
    const {
      context,
      selectTable,
      getNewUser,
      getLoanRequest,
      getPaymentRequest,
    } = this.props;
    const handleClose = () => {
      this.setState({ modalOpen: false, modalDataError: false });
      if (selectTable === "New User Creation") getNewUser();
      if (selectTable === "New Loan Request") getLoanRequest();
      if (selectTable === "Payment Request") getPaymentRequest();
      if (selectTable === "All Requests") {
        getNewUser();
        getLoanRequest();
        getPaymentRequest();
      }
    };
    return (
      <>
        <Table
          columns={Column}
          dataSource={tableData}
          size="middle"
          pagination={paginationData}
          scroll={{ y: 300 }}
        />
        {(selectTable === "New User Creation" ||
          SelectedTable === "USER FORM") && (
          <NewUserFormView
            self={this}
            title={"User Approval Form"}
            context={context}
            modalOpen={modalOpen}
            modalData={modalData}
            handleClose={handleClose}
            isDataLoading={isDataLoading}
            modalDataError={modalDataError}
            getNewUser={this.getNewUser}
            loadingText={loadingText}
          />
        )}
        {(selectTable === "New Loan Request" ||
          SelectedTable === "LOAN FORM") && (
          <LoanRequestFormView
            self={this}
            title={"Loan Request Form"}
            context={context}
            modalOpen={modalOpen}
            modalData={modalData}
            handleClose={handleClose}
            isDataLoading={isDataLoading}
            modalDataError={modalDataError}
            getLoanRequest={this.getLoanRequest}
            loadingText={loadingText}
          />
        )}
        {(selectTable === "Payment Request" ||
          SelectedTable === "PAYMENT FORM") && (
          <PaymentRequestView
            self={this}
            title={"Payment Request Form"}
            context={context}
            modalOpen={modalOpen}
            modalData={modalData}
            handleClose={handleClose}
            isDataLoading={isDataLoading}
            modalDataError={modalDataError}
            getPaymentRequest={this.getPaymentRequest}
            loadingText={loadingText}
            fetchData={getPaymentRequest}
          />
        )}
      </>
    );
  }
}
