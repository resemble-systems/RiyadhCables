import * as React from "react";
import CommonLayout from "../layout/Layout";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import NewUserForm from "./forms/NewUserForm";
import LoanRequestForm from "./forms/LoanRequestForm";
import PaymentRequestForm from "./forms/PaymentRequestForm";
import { DataType } from "./viewForms/components/DataType";
export interface IWorkflowCardProps {
  lg: number;
  xl: number;
  md: number;
  Title: string;
  marginRight: boolean;
  context: WebPartContext;
  getWorkFlow: () => void;
  getNewUser: () => void;
  selectedPersonDetails: {
    name: string;
    email: string;
    department: string;
    jobTitle: string;
    businessPhones: string;
    manager: string;
    managerEmail: string;
  };
  isAdmin: boolean;
}
export interface IWorkflowCardState {
  userModalOpen: boolean;
  loanRequestModalOpen: boolean;
  paymentRequestModalOpen: boolean;
  userCreationApprovers: any;
  LoanCreationApprovers: any;
  paymentCreationApprovers: any;
  PaymentRequestDepartments: any;
}
export default class WorkflowCard extends React.Component<
  IWorkflowCardProps,
  IWorkflowCardState
> {
  public constructor(props: IWorkflowCardProps, state: IWorkflowCardState) {
    super(props);
    this.state = {
      userModalOpen: false,
      loanRequestModalOpen: false,
      paymentRequestModalOpen: false,
      userCreationApprovers: {},
      LoanCreationApprovers: {},
      paymentCreationApprovers: {},
      PaymentRequestDepartments: [],
    };
  }

  public componentDidMount(): void {
    this.getApprovars();
    this.getPaymentRequestDepartments();
  }

  public getApprovars(): void {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Approvers')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(`Error in Approvers Fetch ${res.status}`);
          return;
        }
      })
      .then((listItems: { value: any[] }) => {
        console.log("Approvers", listItems.value);
        const userCreationApproversArray = listItems.value?.filter(
          (approver) => approver.Title === "User Request Approver"
        );
        const userCreationApprovers = userCreationApproversArray[0];
        const LoanCreationApproversArray = listItems.value?.filter(
          (approver) => approver.Title === "Loan Request Approver"
        );
        const LoanCreationApprovers = LoanCreationApproversArray[0];
        const paymentCreationApproversArray = listItems.value?.filter(
          (approver) => approver.Title === "Payment Request Approver"
        );
        const paymentCreationApprovers = paymentCreationApproversArray[0];
        this.setState({
          userCreationApprovers: userCreationApprovers,
          LoanCreationApprovers: LoanCreationApprovers,
          paymentCreationApprovers: paymentCreationApprovers,
        });
      });
  }

  public getPaymentRequestDepartments() {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('PaymentRequestDepartments')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        console.log("PaymentRequestDepartments Success");
        return res.json();
      })
      .then((listItems: any) => {
        console.log("Res PaymentRequestDepartments", listItems);
        this.setState({ PaymentRequestDepartments: listItems.value });
      });
  }

  public componentDidUpdate(
    prevProps: Readonly<IWorkflowCardProps>,
    prevState: Readonly<IWorkflowCardState>
  ): void {
    const { userModalOpen, loanRequestModalOpen, paymentRequestModalOpen } =
      this.state;
    if (prevState.userModalOpen !== userModalOpen) this.props.getNewUser();
    if (prevState.loanRequestModalOpen !== loanRequestModalOpen)
      this.props.getNewUser();
    if (prevState.paymentRequestModalOpen !== paymentRequestModalOpen)
      this.props.getNewUser();
  }

  public render(): React.ReactElement<IWorkflowCardProps> {
    const {
      lg,
      xl,
      md,
      Title,
      marginRight,
      context,
      getNewUser,
      selectedPersonDetails,
      isAdmin
    } = this.props;
    const {
      userModalOpen,
      loanRequestModalOpen,
      paymentRequestModalOpen,
      userCreationApprovers,
      LoanCreationApprovers,
      paymentCreationApprovers,
      PaymentRequestDepartments,
    } = this.state;

    let editDummyData: DataType = {
      ID: 0,
      key: 0,
      Title: "",
      Status: "",
      Department: "",
      Date: "",
      JobTitle: "",
      Email: "",
      Ext: "",
      Amount: "",
      AmountInWords: "",
      CreatedBy: "",
      PendingWith: "",
      Created: "",
      PaymentType: "",
      PreviousApproval: "",
      AttachmentRef: undefined,
      AttachmentsJSON: undefined,
      SAPVendor: "",
      Total: "",
      VAT: "",
      BeneficiaryName: "",
      BeneficiaryIBAN: "",
      BeneficiaryBank: "",
      BusinessApprover: "",
      BusinessApproval: "",
      BusinessApprovalTime: "",
      DepartmentHeadApprover: "",
      DepartmentHeadApproval: "",
      DepartmentHeadApprovalTime: "",
      FinanceSecretaryApprover: "",
      FinanceSecretaryApproval: "",
      FinanceSecretaryApprovalTime: "",
      CashTeamApprover: "",
      CashTeamApproval: "",
      CashTeamApprovalTime: "",
      CashHeadApprover: "",
      CashHeadApproval: "",
      CashHeadApprovalTime: "",
      APTeamApprover: "",
      APTeamApproval: "",
      APTeamApprovalTime: "",
      APHeadApprover: "",
      APHeadApproval: "",
      APHeadApprovalTime: "",
      ARTeamApprover: "",
      ARTeamApproval: "",
      ARTeamApprovalTime: "",
      ARHeadApprover: "",
      ARHeadApproval: "",
      ARHeadApprovalTime: "",
      FinanceControllerApprover: "",
      FinanceControllerApproval: "",
      FinanceControllerApprovalTime: "",
      VPFinanceApprover: "",
      VPFinanceApproval: "",
      VPFinanceApprovalTime: "",
      CFO: "",
      CFOApproval: "",
      CFOApprovalTime: "",
      CEO: "",
      CEOApproval: "",
      CEOApprovalTime: "",
      ReasonForRejection: "",
      BusinessApproverLimit: "",
      CashTeamLimit: "",
      ARTeamLimit: "",
      APTeamLimit: "",
      FinanceControllerLimit: "",
      ApprovalProcess: "",
      TimeLine: undefined,
      TreasuryApproval: "",
      TreasuryApprovalTime: "",
      TreasuryApproverName: "",
      ReferenceNumber: "",
      TreasuryJSON: undefined,
      Currency: "",
      Comments: "",
      PendingDepartment: "",
      AttachmentFiles: [],
      RejectedBy: "",
      Approvers: [],
      Rejectors: [],
      VATPercentage: 15,
    };

    const handleClose = () => {
      this.setState({
        userModalOpen: false,
        loanRequestModalOpen: false,
        paymentRequestModalOpen: false,
      });
      getNewUser();
    };

    const toWords = (s: any) => {
      console.log("s", s);
      var th = ["", "thousand", "million", "billion", "trillion"];
      var dg = [
        "zero",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
      ];
      var tn = [
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
      ];
      var tw = [
        "twenty",
        "thirty",
        "fourty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
      ];
      console.log("s", s);
      s = s?.toString();
      console.log("s", s);
      s = s?.replace(/[\, ]/g, "");
      if (s != parseFloat(s)) return "Enter valid amount...";
      var x = s.indexOf(".");
      console.log("s", s);
      console.log("x", x);
      if (x == -1) x = s.length;
      if (x > 15) return "Maximum limit exceeded";
      var n = s.split("");
      console.log("n", n);
      var str = "";
      var sk = 0;
      for (var i = 0; i < x; i++) {
        if ((x - i) % 3 == 2) {
          if (n[i] == "1") {
            str += tn[Number(n[i + 1])] + " ";
            i++;
            sk = 1;
          } else if (n[i] != 0) {
            str += tw[n[i] - 2] + " ";
            sk = 1;
          }
        } else if (n[i] != 0) {
          str += dg[n[i]] + " ";
          if ((x - i) % 3 == 0) str += "hundred ";
          sk = 1;
        }
        if ((x - i) % 3 == 1) {
          if (sk) str += th[(x - i - 1) / 3] + " ";
          sk = 0;
        }
      }
      console.log("str", str);
      if (x != s.length) {
        var y = s.length;
        console.log("str", str);
        str.trim();
        str += ", ";
        for (var i: number = x + 1; i < y; i++)
          if ((y - i) % 3 == 2) {
            if (n[i] == "1") {
              str += tn[Number(n[i + 1])];
              i++;
              sk = 1;
            } else if (n[i] != 0) {
              str += tw[n[i] - 2] + " ";
              sk = 1;
            }
          } else if (n[i] != 0) {
            str += dg[n[i]] + " ";
            if ((y - i) % 3 == 0) str += "hundred ";
            sk = 1;
          }
      }
      console.log("str", str);
      const amountInWords = str.replace(/\s+/g, " ");
      console.log("amountInWords", amountInWords);
      const firstChar = amountInWords.charAt(0).toUpperCase();
      const remainingChars = amountInWords.slice(1);
      const toWords = `${firstChar}${remainingChars}`.split(",");
      let toWordAfterTrim = "";
      toWords?.forEach((data, index) => {
        if (index === 0) {
          toWordAfterTrim = data.trim();
        } else {
          toWordAfterTrim = toWordAfterTrim + ", " + data.trim();
        }
        console.log("toWordAfterTrim", toWordAfterTrim);
      });
      return toWordAfterTrim;
    };

    return (
      <CommonLayout
        md={md}
        lg={lg}
        xl={xl}
        heigth="125px"
        classNames={`${marginRight && "marginRight"}`}
      >
        <div
          className="d-flex justify-content-center align-items-center flex-column gap-3 h-100"
          style={{ fontFamily: "Avenir Next" }}
        >
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ fontSize: "18px", fontWeight: "600" }}
          >
            {Title}
          </div>
          <button
            onClick={() => {
              if (Title === "New User Creation Request")
                this.setState({ userModalOpen: true });
              else if (Title === "New Loan Request")
                this.setState({ loanRequestModalOpen: true });
              else if (Title === "Payment Request")
                this.setState({ paymentRequestModalOpen: true });
            }}
            style={{
              border: "none",
              backgroundColor: " rgb(181, 77, 38)",
            }}
            className="text-white py-2 px-3 rounded d-flex justify-content-center align-items-center gap-2"
          >
            <img
              src={require("./assets/add.png")}
              width={"24px"}
              height={"24px"}
            />
            <span style={{ fontSize: "16px" }}>Create New</span>
          </button>
          <NewUserForm
            self={this}
            title={Title}
            context={context}
            modalOpen={userModalOpen}
            handleClose={handleClose}
            headerLogo={""}
            userCreationApprovers={userCreationApprovers}
            selectedPersonDetails={selectedPersonDetails}
          />
          <LoanRequestForm
            self={this}
            title={Title}
            toWords={toWords}
            context={context}
            isAdmin={isAdmin}
            modalOpen={loanRequestModalOpen}
            handleClose={handleClose}
            headerLogo={""}
            selectedPersonDetails={selectedPersonDetails}
            LoanCreationApprovers={LoanCreationApprovers}
          />
          <PaymentRequestForm
            self={this}
            title={Title}
            toWords={toWords}
            context={context}
            modalOpen={paymentRequestModalOpen}
            handleClose={handleClose}
            PaymentRequestDepartments={PaymentRequestDepartments}
            selectedPersonDetails={selectedPersonDetails}
            paymentCreationApprovers={paymentCreationApprovers}
            editForm={false}
            editData={editDummyData}
          />
        </div>
      </CommonLayout>
    );
  }
}
