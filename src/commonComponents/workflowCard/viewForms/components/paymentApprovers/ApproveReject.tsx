import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { DataType } from "../DataType";
import PaymentRequestForm from "../../../forms/PaymentRequestForm";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

export interface IApproveRejectProps {
  self: any;
  context: WebPartContext;
  data: DataType;
  handleClose: () => void;
  getPaymentRequest: any;
}
interface IApproveRejectState {
  paymentRequestModalOpen: boolean;
  selectedPersonDetails: {
    name: string;
    email: string;
    department: string;
    jobTitle: string;
    businessPhones: string;
  };
  paymentCreationApprovers: any;
  PaymentRequestDepartments: any;
}

export default class ApproveReject extends React.Component<
  IApproveRejectProps,
  IApproveRejectState
> {
  public constructor(props: IApproveRejectProps, state: IApproveRejectState) {
    super(props);
    this.state = {
      paymentRequestModalOpen: false,
      selectedPersonDetails: {
        name: "",
        email: "",
        department: "",
        jobTitle: "",
        businessPhones: "",
      },
      paymentCreationApprovers: [],
      PaymentRequestDepartments: [],
    };
  }
  public componentDidMount(): void {
    const { data } = this.props;
    this.getApprovars();
    this.getPaymentRequestDepartments();
    this.setState({
      selectedPersonDetails: {
        name: data.Title,
        email: data.Email,
        department: data.Department,
        jobTitle: data.JobTitle,
        businessPhones: data.Ext,
      },
    });
  }
  public componentDidUpdate(
    prevProps: Readonly<IApproveRejectProps>,
    prevState: Readonly<IApproveRejectState>
  ): void {
    const { data } = this.props;
    if (prevProps.data !== data) {
      this.setState({
        selectedPersonDetails: {
          name: data.Title,
          email: data.Email,
          department: data.Department,
          jobTitle: data.JobTitle,
          businessPhones: data.Ext,
        },
      });
    }
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
        const paymentCreationApproversArray = listItems.value?.filter(
          (approver) => approver.Title === "Payment Request Approver"
        );
        const paymentCreationApprovers = paymentCreationApproversArray[0];
        this.setState({
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

  public render(): React.ReactElement<IApproveRejectProps> {
    const { data, context, self, handleClose, getPaymentRequest } = this.props;
    const {
      paymentRequestModalOpen,
      selectedPersonDetails,
      paymentCreationApprovers,
      PaymentRequestDepartments,
    } = this.state;

    const handleModalClose = () => {
      getPaymentRequest();
      this.setState({ paymentRequestModalOpen: false });
    };

    const toWords = (s: any) => {
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
      s = s?.toString();
      s = s?.replace(/[\, ]/g, "");
      if (s != parseFloat(s)) return "Enter valid amount...";
      var x = s.indexOf(".");
      if (x == -1) x = s.length;
      if (x > 15) return "Maximum limit exceeded";
      var n = s.split("");
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
      if (x != s.length) {
        var y = s.length;
        str += "point ";
        for (var i: number = x + 1; i < y; i++) str += dg[n[i]] + " ";
      }
      const amountInWords = str.replace(/\s+/g, " ");
      const firstChar = amountInWords.charAt(0).toUpperCase();
      const remainingChars = amountInWords.slice(1);
      return `${firstChar}${remainingChars}`;
    };

    return (
      <>
        {data.PendingWith?.split(";").filter(
          (item) => item === context.pageContext.user.displayName
        )?.length > 0 ? (
          <div className="d-flex justify-content-end mt-3 gap-3">
            <div
              className="py-2"
              style={{
                fontSize: "1rem",
                fontWeight: "600",
              }}
            >
              {data.ApprovalProcess}
            </div>
            <button
              type="submit"
              className="text-white bg-success px-3 py-2 rounded"
              style={{
                border: "none",
              }}
              onClick={() => {
                self.updateApproval("Approved", "Update", data);
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
                self.setState({
                  openRejectComments: true,
                });
              }}
            >
              Reject
            </button>
            {data.BusinessApprover?.split(";").filter(
              (item) => item === context.pageContext.user.displayName
            )?.length > 0 && data.ApprovalProcess === "Business Approval" ? (
              <>
                <button
                  type="button"
                  className="text-white bg-danger px-3 py-2 rounded"
                  style={{
                    border: "none",
                  }}
                  onClick={() => {
                    handleClose();
                    this.setState({
                      paymentRequestModalOpen: true,
                    });
                  }}
                >
                  Edit
                </button>
                {paymentRequestModalOpen && (
                  <PaymentRequestForm
                    self={this}
                    PaymentRequestDepartments={PaymentRequestDepartments}
                    editData={data}
                    editForm={true}
                    toWords={toWords}
                    context={context}
                    handleClose={handleModalClose}
                    modalOpen={paymentRequestModalOpen}
                    selectedPersonDetails={selectedPersonDetails}
                    paymentCreationApprovers={paymentCreationApprovers}
                    title={`Payment Request Edit Form (${data.ReferenceNumber})`}
                  />
                )}
              </>
            ) : (
              <></>
            )}
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
}
