import * as React from "react";
import "./index.css";
import { SPComponentLoader } from "@microsoft/sp-loader";
import type { IPaymentRequestPrintProps } from "./IPaymentRequestPrintProps";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import * as PDFLib from "pdf-lib";
import {
  Page,
  Document,
  StyleSheet,
  pdf,
  View,
  Text,
  Image,
} from "@react-pdf/renderer";
import Loading from "../../../commonComponents/workflowCard/viewForms/components/Loading";
import { Row } from "antd";

interface IPaymentRequestPrintState {
  paymentData: any;
  Logo: any;
  pdfFile: string;
  isLoading: boolean;
}

declare global {
  interface Window {
    arrayOfPdf: any;
  }
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
}

export default class PaymentRequestPrint extends React.Component<
  IPaymentRequestPrintProps,
  IPaymentRequestPrintState
> {
  public constructor(
    props: IPaymentRequestPrintProps,
    state: IPaymentRequestPrintState
  ) {
    super(props);
    this.state = {
      paymentData: [],
      Logo: [],
      pdfFile: "",
      isLoading: true,
    };
  }

  public componentDidMount(): void {
    this.getLogo();
    window.arrayOfPdf = [];
    const searchElement = window.location.search;
    const qurreyList = window.location.search?.split("=")[0];
    const qurreyString = window.location.search?.split("=")[1];
    if (searchElement) {
      if (qurreyList === "?paymentRequest") {
        this.getPaymentRequest(qurreyString);
      }
    }
  }

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
            JobTitle: data.JobTitle,
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
            AttachmentFiles: data.AttachmentFiles,
          }));
          return tableData;
        };
        if (listItems.value?.length > 0) {
          const urlElement = listItems.value[0]?.AttachmentFiles.map(
            (data: any) => {
              return data.ServerRelativeUrl;
            }
          );
          this.setState({
            paymentData: getPaymentContent(listItems.value),
          });
          setTimeout(() => {
            this.generatePdf(urlElement);
          }, 1000);
        } else {
          setTimeout(() => {
            console.log("Data not found");
          }, 1000);
        }
      });
  };

  public mergePDFFiles = async (urlElement: any) => {
    await Promise.all(
      urlElement?.map(async (uri: string) => {
        await fetch(`${uri}`, {
          method: "GET",
          headers: {
            Accept: "application/json;odata=verbose",
          },
        })
          .then((resp) => {
            console.log("Arraybuffer", resp);
            return resp.arrayBuffer();
          })
          .then((r) => {
            console.log("Arraybuffer", r);
            const file = new Blob([r], { type: "application/pdf" });
            var promise = new Promise(this.getBuffer(file));
            promise
              .then(function (data) {
                window.arrayOfPdf.push({
                  bytes: data,
                  name: `${uri.split("/").pop()}.pdf`,
                });
              })
              .catch(function (err) {
                console.log("Error: ", err);
              });
          })
          .catch(function (err) {
            console.log("Error: ", err);
          });
      })
    );
    setTimeout(() => {
      this.joinPdf();
    }, 2000);
  };

  public getBuffer = (fileData: any) => {
    console.log("filedata", fileData);
    return function (resolve: any) {
      var reader = new FileReader();
      reader.readAsArrayBuffer(fileData);
      reader.onload = function () {
        var arrayBuffer: any = reader.result;
        var bytes = new Uint8Array(arrayBuffer);
        resolve(bytes);
      };
    };
  };

  public joinPdf = async () => {
    console.log("window.arrayOfPdf", window.arrayOfPdf);
    const mergedPdf = await PDFLib.PDFDocument.create();
    for (let document of window.arrayOfPdf) {
      document = await PDFLib.PDFDocument.load(document.bytes);
      const copiedPages = await mergedPdf.copyPages(
        document,
        document.getPageIndices()
      );
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    var pdfBytes = await mergedPdf.save();
    console.log("window.arrayOfPdf", pdfBytes);
    var pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    var pdfLink = URL.createObjectURL(pdfBlob);
    /*  var pdfFiles = "data:application/pdf;base64," + pdfBytes; */
    this.setState({ pdfFile: pdfLink, isLoading: false });
  };

  public getLogo() {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Logo')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        console.log("Logo Success");
        return res.json();
      })
      .then((listItems: any) => {
        console.log("Res Logo", listItems);
        const headerLogo: any = listItems.value.filter(
          (item: any) => item.Title.toLowerCase() === "header"
        );
        this.setState({ Logo: headerLogo });
      });
  }

  public MyDocument = () => {
    const { paymentData } = this.state;
    const styles = StyleSheet.create({
      page: {
        backgroundColor: "white",
      },
      section: {
        margin: 10,
        padding: 10,
      },
      body: {
        paddingTop: 35,
        paddingBottom: 65,
        marginHorizontal: 35,
      },
      header: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
      },
      textCenter: {
        textAlign: "center",
      },
      textStyle: {
        fontSize: "12px",
        borderBottom: "1px solid gray",
        flexGrow: 1,
        flexDirection: "row",
      },
      borderRight: {
        borderRight: "1px solid gray",
      },
      borderLeft: {
        borderRight: "1px solid gray",
      },
      borderTop: {
        borderRight: "1px solid gray",
      },
      borderBottom: {
        borderRight: "1px solid gray",
      },
    });

    const TextElement = (Feild: string, Value: string, DateString?: any) => {
      return (
        <Row
          style={{
            flexDirection: "row",
            fontSize: "10px",
            borderBottom: "1px solid gray",
          }}
        >
          <Text
            style={{
              width: "30%",
              padding: "5px",
              borderRight: "1px solid gray",
            }}
          >
            {Feild}
          </Text>
          <Text
            style={{
              width: "30%",
              padding: "5px",
              borderRight: "1px solid gray",
              backgroundColor: "#f0e5a1",
            }}
          >
            {Value?.split(";").join(", ")}
          </Text>
          <Row style={{ flexDirection: "row" }}>
            <Text
              style={{
                width: "15%",
                padding: "5px",
                borderRight: "1px solid gray",
              }}
            >
              Date
            </Text>
            <Text
              style={{
                width: "25%",
                padding: "5px",
              }}
            >
              {new Date(DateString).toLocaleDateString()}{" "}
              {new Date(DateString).toLocaleTimeString()}
            </Text>
          </Row>
        </Row>
      );
    };

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.body}>
            <Text
              style={{
                textAlign: "center",
                marginBottom: 0,
                padding: 0,
              }}
            >
              <Image
                src={require("../assets/RcLogo.png")}
                style={{ width: 80, height: 60 }}
              />
            </Text>
            <Text
              style={{
                textAlign: "center",
                padding: "5px",
                fontSize: "12px",
                paddingTop: "0px",
              }}
            >
              Payment Request
            </Text>
            {paymentData?.map((data: PaymentData) => (
              <View
                style={{
                  width: "100%",
                  border: "1px solid gray",
                }}
              >
                <Text
                  style={{
                    padding: "5px",
                    fontSize: "10px",
                    borderBottom: "1px solid gray",
                  }}
                >
                  Requesters Information
                </Text>
                <Row
                  style={{
                    flexDirection: "row",
                    fontSize: "10px",
                    width: "100%",
                  }}
                >
                  <View style={{ borderRight: "1px solid gray", width: "50%" }}>
                    <Row
                      style={{
                        flexDirection: "row",
                        borderBottom: "1px solid gray",
                        width: "100%",
                      }}
                    >
                      <Text
                        style={{
                          width: "30%",
                          padding: "5px",
                          borderRight: "1px solid gray",
                        }}
                      >
                        Department
                      </Text>
                      <View
                        style={{
                          padding: "5px",
                          width: "70%",
                          backgroundColor: "#f0e5a1",
                        }}
                      >
                        <Text>{data.Department}</Text>
                      </View>
                    </Row>

                    <Row
                      style={{
                        flexDirection: "row",
                        borderBottom: "1px solid gray",
                        width: "100%",
                      }}
                    >
                      <Text
                        style={{
                          width: "30%",
                          padding: "5px",
                          borderRight: "1px solid gray",
                        }}
                      >
                        Requestor
                      </Text>

                      <View
                        style={{
                          backgroundColor: "#f0e5a1",
                          padding: "5px",
                          width: "70%",
                        }}
                      >
                        <Text>{data.Title}</Text>
                      </View>
                    </Row>
                  </View>
                  <View style={{ width: "50%" }}>
                    <Row
                      style={{
                        flexDirection: "row",
                        borderBottom: "1px solid gray",
                        width: "100%",
                        flexGrow: 1,
                      }}
                    >
                      <Text
                        style={{
                          width: "30%",
                          padding: "5px",
                          borderRight: "1px solid gray",
                        }}
                      >
                        Date
                      </Text>
                      <Text
                        style={{
                          backgroundColor: "#f0e5a1",
                          padding: "5px",
                          width: "70%",
                        }}
                      >
                        {new Date(data.Date).toLocaleDateString()}{" "}
                        {new Date(data.Date).toLocaleTimeString()}
                      </Text>
                    </Row>
                    <Row
                      style={{
                        flexDirection: "row",
                        borderBottom: "1px solid gray",
                        width: "100%",
                        flexGrow: 1,
                      }}
                    >
                      <Text
                        style={{
                          width: "30%",
                          padding: "5px",
                          borderRight: "1px solid gray",
                        }}
                      >
                        Ref #
                      </Text>
                      <Text
                        style={{
                          backgroundColor: "#f0e5a1",
                          padding: "5px",
                          width: "70%",
                        }}
                      >
                        {data.ReferenceNumber}
                      </Text>
                    </Row>
                  </View>
                </Row>
                <Row
                  style={{
                    flexDirection: "row",
                    fontSize: "10px",
                    borderBottom: "1px solid gray",
                  }}
                >
                  <Text
                    style={{
                      width: "30%",
                      padding: "5px",
                      borderRight: "1px solid gray",
                    }}
                  >
                    Payment Type
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#f0e5a1",
                      padding: "5px",
                      width: "70%",
                    }}
                  >
                    <Text>{data.PaymentType}</Text>
                  </View>
                </Row>
                <Row
                  style={{
                    flexDirection: "row",
                    fontSize: "10px",
                    borderBottom: "1px solid gray",
                  }}
                >
                  <Text
                    style={{
                      width: "30%",
                      padding: "5px",
                      borderRight: "1px solid gray",
                    }}
                  >
                    Attachments
                  </Text>

                  <View style={{ width: "70%" }}>
                    {data.AttachmentsJSON?.filter(
                      (item: { targetName: string }) =>
                        item.targetName !== "ObtainedAttached"
                    )?.map(
                      (
                        attachment: {
                          refNumber: string;
                          targetName: string;
                          name: string;
                        },
                        index: number
                      ) => (
                        <Row
                          style={{
                            flexDirection: "row",
                            flexGrow: 1,
                            borderBottom:
                              data.AttachmentsJSON?.filter(
                                (item: { targetName: string }) =>
                                  item.targetName !== "ObtainedAttached"
                              )?.length -
                                1 ==
                              index
                                ? "none"
                                : "1px solid gray",
                          }}
                          key={index}
                        >
                          <Text
                            style={{
                              borderRight: "1px solid gray",
                              padding: "5px",
                              width: "50%",
                            }}
                          >
                            {attachment.targetName === "Aggrement"
                              ? "Agreement / Contract"
                              : attachment.targetName === "ApprovalDocument"
                              ? "Approval Document"
                              : attachment.targetName === "Invoice"
                              ? "Invoice / Proposal"
                              : attachment.targetName === "SAPGR"
                              ? "SAP GR"
                              : attachment.targetName === "SAPPO"
                              ? "SAP PO"
                              : attachment.targetName === "ObtainedAttached"
                              ? "Obtained & Attached"
                              : ""}
                          </Text>
                          <Text
                            style={{
                              backgroundColor: "#f0e5a1",
                              padding: "5px",
                              width: "50%",
                            }}
                          >
                            {attachment.refNumber}
                          </Text>
                        </Row>
                      )
                    )}
                  </View>
                </Row>
                <Row
                  style={{
                    flexDirection: "row",
                    fontSize: "10px",
                    borderBottom: "1px solid gray",
                  }}
                >
                  <Text
                    style={{
                      width: "30%",
                      padding: "5px",
                      borderRight: "1px solid gray",
                    }}
                  >
                    Benificiary Name
                  </Text>

                  <View style={{ padding: "5px" }}>
                    <Text>{data.BeneficiaryName}</Text>
                  </View>
                </Row>
                <Row
                  style={{
                    flexDirection: "row",
                    fontSize: "10px",
                    borderBottom: "1px solid gray",
                  }}
                >
                  <Text
                    style={{
                      width: "30%",
                      padding: "5px",
                      borderRight: "1px solid gray",
                    }}
                  >
                    Benificiary Bank
                  </Text>

                  <View style={{ padding: "5px" }}>
                    <Text>{data.BeneficiaryBank}</Text>
                  </View>
                </Row>
                <Row
                  style={{
                    flexDirection: "row",
                    fontSize: "10px",
                    borderBottom: "1px solid gray",
                  }}
                >
                  <Text
                    style={{
                      width: "30%",
                      padding: "5px",
                      borderRight: "1px solid gray",
                    }}
                  >
                    Benificiary IBAN
                  </Text>

                  <View style={{ padding: "5px" }}>
                    <Text>{data.BeneficiaryIBAN}</Text>
                  </View>
                </Row>
                {data.SAPVendor && (
                  <Row
                    style={{
                      flexDirection: "row",
                      fontSize: "10px",
                      borderBottom: "1px solid gray",
                    }}
                  >
                    <Text
                      style={{
                        width: "30%",
                        padding: "5px",
                        borderRight: "1px solid gray",
                      }}
                    >
                      SAP Vendor #
                    </Text>
                    <View style={{ padding: "5px" }}>
                      <Text>{data.BeneficiaryIBAN}</Text>
                    </View>
                  </Row>
                )}
                <Row
                  style={{
                    flexDirection: "row",
                    fontSize: "10px",
                    borderBottom: "1px solid gray",
                  }}
                >
                  <Text
                    style={{
                      width: "30%",
                      padding: "5px",
                      borderRight: "1px solid gray",
                    }}
                  >
                    Purpose & Comments
                  </Text>
                  <View style={{ width: "70%" }}>
                    <Row
                      style={{
                        flexDirection: "row",
                        flexGrow: 1,
                      }}
                    >
                      <Text
                        style={{
                          backgroundColor: "#f0e5a1",
                          borderRight: "1px solid gray",
                          padding: "5px",
                          width: "50%",
                          flexDirection: "row",
                          flexWrap: "wrap",
                        }}
                      >
                        {data.Comments}
                      </Text>
                      <View style={{ width: "50%" }}>
                        <Row
                          style={{
                            flexDirection: "row",
                            borderBottom: "1px solid gray",
                            width: "100%",
                          }}
                        >
                          <Text
                            style={{
                              borderRight: "1px solid gray",
                              padding: "5px",
                              width: "50%",
                            }}
                          >
                            Currency
                          </Text>
                          <Text
                            style={{
                              padding: "5px",
                              width: "50%",
                              color: "#2a57fa",
                              textAlign: "right",
                            }}
                          >
                            {data.Currency}
                          </Text>
                        </Row>
                        <Row
                          style={{
                            flexDirection: "row",
                            borderBottom: "1px solid gray",
                            width: "100%",
                          }}
                        >
                          <Text
                            style={{
                              borderRight: "1px solid gray",
                              padding: "5px",
                              width: "50%",
                            }}
                          >
                            Amount
                          </Text>
                          <Text
                            style={{
                              padding: "5px",
                              width: "50%",
                              color: "#2a57fa",
                              textAlign: "right",
                            }}
                          >
                            {parseFloat(Number(data.Amount).toFixed(2))}
                          </Text>
                        </Row>
                        <Row
                          style={{
                            flexDirection: "row",
                            borderBottom: "1px solid gray",
                            width: "100%",
                          }}
                        >
                          <Text
                            style={{
                              borderRight: "1px solid gray",
                              padding: "5px",
                              width: "50%",
                            }}
                          >
                            VAT
                          </Text>
                          <Text
                            style={{
                              padding: "5px",
                              width: "50%",
                              color: "#2a57fa",
                              textAlign: "right",
                            }}
                          >
                            {parseFloat(
                              Number(
                                parseFloat(data.Total) - parseFloat(data.Amount)
                              ).toFixed(2)
                            )}
                          </Text>
                        </Row>
                        <Row
                          style={{
                            flexDirection: "row",
                            width: "100%",
                          }}
                        >
                          <Text
                            style={{
                              borderRight: "1px solid gray",
                              padding: "5px",
                              width: "50%",
                            }}
                          >
                            Total
                          </Text>
                          <Text
                            style={{
                              padding: "5px",
                              width: "50%",
                              color: "#2a57fa",
                              textAlign: "right",
                            }}
                          >
                            {parseFloat(Number(data.Total).toFixed(2))}
                          </Text>
                        </Row>
                      </View>
                    </Row>
                  </View>
                </Row>
                <Row
                  style={{
                    flexDirection: "row",
                    fontSize: "10px",
                    borderBottom: "1px solid gray",
                  }}
                >
                  <Text
                    style={{
                      width: "30%",
                      padding: "5px",
                      borderRight: "1px solid gray",
                    }}
                  >
                    Amount in words
                  </Text>
                  <View
                    style={{
                      backgroundColor: "#f0e5a1",
                      padding: "5px",
                      width: "70%",
                    }}
                  >
                    <Text>{data.AmountInWords}</Text>
                  </View>
                </Row>
                <Row
                  style={{
                    flexDirection: "row",
                    fontSize: "10px",
                    borderBottom: "1px solid gray",
                  }}
                >
                  <Text
                    style={{
                      width: "30%",
                      padding: "5px",
                      borderRight: "1px solid gray",
                    }}
                  >
                    Previous Approval
                  </Text>
                  <View style={{ padding: "5px" }}>
                    <Text>{data.PreviousApproval}</Text>
                  </View>
                </Row>
                <Row
                  style={{
                    flexDirection: "row",
                    fontSize: "10px",
                    borderBottom: "1px solid gray",
                  }}
                >
                  <Text
                    style={{
                      width: "30%",
                      padding: "5px",
                      borderRight: "1px solid gray",
                    }}
                  >
                    Prepared By
                  </Text>
                  <Text
                    style={{
                      width: "30%",
                      padding: "5px",
                      borderRight: "1px solid gray",
                      backgroundColor: "#f0e5a1",
                    }}
                  >
                    {data.Title}
                  </Text>
                  <Row style={{ flexDirection: "row" }}>
                    <Text
                      style={{
                        width: "15%",
                        padding: "5px",
                        borderRight: "1px solid gray",
                      }}
                    >
                      Date
                    </Text>
                    <Text
                      style={{
                        width: "25%",
                        padding: "5px",
                      }}
                    >
                      {new Date(data.Date).toLocaleDateString()}{" "}
                      {new Date(data.Date).toLocaleTimeString()}
                    </Text>
                  </Row>
                </Row>
                {data.BusinessApproval === "Approved" &&
                  TextElement(
                    "Mid Level Manager",
                    data.BusinessApprover,
                    data.BusinessApprovalTime
                  )}
                {data.DepartmentHeadApproval === "Approved" &&
                  TextElement(
                    "Department Head",
                    data.DepartmentHeadApprover,
                    data.DepartmentHeadApprovalTime
                  )}
                {data.ARTeamApproval === "Approved" &&
                  TextElement(
                    "AR Team",
                    data.ARTeamApprover,
                    data.ARTeamApprovalTime
                  )}
                {data.APTeamApproval === "Approved" &&
                  TextElement(
                    "AP Team",
                    data.APTeamApprover,
                    data.APTeamApprovalTime
                  )}
                {data.CashTeamApproval === "Approved" &&
                  TextElement(
                    "Cash Team",
                    data.CashTeamApprover,
                    data.CashTeamApprovalTime
                  )}
                {data.APHeadApproval === "Approved" &&
                  TextElement(
                    "AP Head",
                    data.APHeadApprover,
                    data.APHeadApprovalTime
                  )}
                {data.ARHeadApproval === "Approved" &&
                  TextElement(
                    "AR Head",
                    data.ARHeadApprover,
                    data.ARHeadApprovalTime
                  )}
                {data.CashHeadApprover === "Approved" &&
                  TextElement(
                    "Cash Head",
                    data.CashHeadApprover,
                    data.CashHeadApprovalTime
                  )}
                {data.FinanceSecretaryApproval === "Approved" &&
                  TextElement(
                    "Finance Controller",
                    data.FinanceControllerApprover,
                    data.FinanceControllerApprovalTime
                  )}
                {data.VPFinanceApproval === "Approved" &&
                  TextElement(
                    "VP Finance",
                    data.VPFinanceApprover,
                    data.VPFinanceApprovalTime
                  )}
                {data.CFOApproval === "Approved" &&
                  TextElement("CFO", data.CFO, data.CFOApprovalTime)}
                {data.CEOApproval === "Approved" &&
                  TextElement("CEO", data.CEO, data.CEOApprovalTime)}
                {data.TreasuryApproval === "Approved" &&
                  TextElement(
                    "Treasury",
                    data.TreasuryApproverName,
                    data.TreasuryApprovalTime
                  )}
                <Text
                  style={{ color: "red", padding: "5px", fontSize: "10px" }}
                >
                  * All approvals are signed electronically
                </Text>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );
  };

  public generatePdf = async (urlElement: any) => {
    const blob = await pdf(<this.MyDocument />).toBlob();
    var promise = new Promise(this.getBuffer(blob));
    promise
      .then(function (data) {
        window.arrayOfPdf.push({
          bytes: data,
          name: `PaymentRequest.pdf`,
        });
      })
      .catch(function (err) {
        console.log("Error: ", err);
      });
    this.mergePDFFiles(urlElement);
  };

  public render(): React.ReactElement<IPaymentRequestPrintProps> {
    const bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    const fa =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
    let Avenir = `${this.props.context.pageContext.site.absoluteUrl}/SiteAssets/font/styles.css`;
    SPComponentLoader.loadCss(bootstarp5CSS);
    SPComponentLoader.loadCss(fa);
    SPComponentLoader.loadCss(Avenir);

    const { pdfFile, isLoading } = this.state;

    return (
      <div>
        {isLoading ? (
          <Loading loadingText={"Please wait for the file to be merged"} />
        ) : (
          <div
            style={{ overflowY: "hidden", backgroundColor: "#525659" }}
            className="iFrameContainer"
          >
            <iframe src={pdfFile} width={"100%"} height={700}></iframe>
          </div>
        )}
      </div>
    );
  }
}
