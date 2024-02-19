import { Col, Row, Timeline } from "antd";
import * as React from "react";
import styles from "../Forms.module.sass";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface DataType {
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
  TimeLine: any;
  TreasuryApproval: string;
  TreasuryApprovalTime: string;
  TreasuryApproverName: string;
  ReferenceNumber: string;
  TreasuryJSON: any;
  Currency: string;
  Comments: string;
}

interface IPaymentRequestFeildsState {
  editableFeild: boolean;
}

export interface IPaymentRequestFeildsProps {
  data: DataType;
  context: WebPartContext;
  timeLineData: any;
}

export default class PaymentRequestFeilds extends React.Component<
  IPaymentRequestFeildsProps,
  IPaymentRequestFeildsState
> {
  public constructor(
    props: IPaymentRequestFeildsProps,
    state: IPaymentRequestFeildsState
  ) {
    super(props);
    this.state = { editableFeild: false };
  }
  public componentDidMount(): void {}
  public render(): React.ReactElement<IPaymentRequestFeildsProps> {
    const { data, context, timeLineData } = this.props;

    return (
      <div className="d-flex flex-column gap-3 formData">
        <div>
          <div>Reference Number</div>
          <input value={data.ReferenceNumber} disabled />
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
          <div className="flex-fill">
            <div>Employee Name</div>
            <input value={data.Title} disabled />
          </div>
          <div className="flex-fill">
            <div>Email</div>
            <input value={data.Email} disabled />
          </div>
        </div>
        <div className="d-md-flex gap-3">
          <div className="flex-fill">
            <div>Job Title</div>
            <input value={data.JobTitle} disabled />
          </div>
          <div className="flex-fill">
            <div>Ext</div>
            <input value={data.Ext} disabled />
          </div>
        </div>
        <div>
          <div>Attachments</div>
          <Row gutter={[16, 16]}>
            {data.AttachmentsJSON?.filter(
              (item: { targetName: string }) =>
                item.targetName !== "ObtainedAttached"
            ).map(
              (attachment: {
                refNumber: string;
                targetName: string;
                name: string;
              }) => (
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <div className="mb-1">
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
                  </div>
                  <input
                    className="mb-2"
                    value={attachment.refNumber}
                    disabled
                  />
                  <a
                    href={`${context.pageContext.web.absoluteUrl}/Lists/PaymentRequest/Attachments/${data.key}/${attachment.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-interception="off"
                    className="text-decoration-none text-dark"
                  >
                    <div
                      className={`p-2 mb-1 d-flex justify-content-between align-items-center ${styles.fileInfo}`}
                    >
                      <div className={styles.fileName}>{attachment.name}</div>
                      <div style={{ cursor: "pointer" }} className="px-2">
                        <img
                          src={require("../assets/view.svg")}
                          width={"24px"}
                          height={"24px"}
                        />
                      </div>
                    </div>
                  </a>
                </Col>
              )
            )}
          </Row>
        </div>
        <div className="d-md-flex gap-3">
          <div className="flex-fill">
            <div>Payment Type</div>
            <input value={data.PaymentType} disabled />
          </div>
          {data.BeneficiaryName && (
            <div className="flex-fill">
              <div>Beneficiary Name</div>
              <input value={data.BeneficiaryName} disabled />
            </div>
          )}
        </div>
        {data.BeneficiaryIBAN && data.BeneficiaryBank ? (
          <div className="d-md-flex gap-3">
            <div className="flex-fill">
              <div>Beneficiary Bank</div>
              <input value={data.BeneficiaryBank} disabled />
            </div>
            <div className="flex-fill">
              <div>Beneficiary IBAN</div>
              <input value={data.BeneficiaryIBAN} disabled />
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="d-md-flex gap-3">
          {data.SAPVendor && (
            <div className="flex-fill">
              <div>SAP Vendor</div>
              <input value={data.SAPVendor} disabled />
            </div>
          )}
          <div className="flex-fill">
            <div>Include VAT</div>
            <input value={data.VAT} disabled />
          </div>
        </div>
        <div className="d-md-flex gap-3">
          <div className="flex-fill">
            <div>Amount</div>
            <input
              value={data.Amount?.concat(`${" "}${data.Currency}`)}
              disabled
            />
          </div>
          <div className="flex-fill">
            <div>Total</div>
            <input
              value={data.Total?.concat(`${" "}${data.Currency}`)}
              disabled
            />
          </div>
        </div>
        <div>
          <div>Amount in words</div>
          <input
            value={data.AmountInWords?.concat(`${" "}${data.Currency}`)}
            disabled
          />
        </div>
        <div>
          <div>Purpose & Comments</div>
          <input value={data.Comments} disabled />
        </div>
        <div>
          <div>Previous Approval</div>
          {data.PreviousApproval === "No previous Approval" ? (
            <input value={data.PreviousApproval} disabled />
          ) : (
            <Row gutter={[16, 16]}>
              {data.AttachmentsJSON?.filter(
                (item: { targetName: string }) =>
                  item.targetName === "ObtainedAttached"
              )?.map(
                (attachment: {
                  refNumber: string;
                  targetName: string;
                  name: string;
                }) => (
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <input
                      className="mb-2 d-none"
                      value={attachment.refNumber}
                      disabled
                    />
                    <a
                      href={`${context.pageContext.web.absoluteUrl}/Lists/PaymentRequest/Attachments/${data.key}/${attachment.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-interception="off"
                      className="text-decoration-none text-dark"
                    >
                      <div
                        className={`p-2 mb-1 d-flex justify-content-between align-items-center ${styles.fileInfo}`}
                      >
                        <div className={styles.fileName}>{attachment.name}</div>
                        <div style={{ cursor: "pointer" }} className="px-2">
                          <img
                            src={require("../assets/view.svg")}
                            width={"24px"}
                            height={"24px"}
                          />
                        </div>
                      </div>
                    </a>
                  </Col>
                )
              )}
            </Row>
          )}
        </div>

        {data.PendingWith !== "Closed" && (
          <div>
            <div>Pending With</div>
            <input value={data.PendingWith?.split(";").join(", ")} disabled />
          </div>
        )}
        {(data.BusinessApproval === "Approved" ||
          data.BusinessApproval === "Rejected") && (
          <div className="d-md-flex gap-3">
            <div className="flex-fill">
              <div>Business Approver</div>
              <input
                value={data.BusinessApprover?.split(";").join(", ")}
                disabled
              />
            </div>
            <div className="flex-fill">
              <div>Business Approval</div>
              <input value={data.BusinessApproval} disabled />
            </div>
          </div>
        )}
        {(data.DepartmentHeadApproval === "Approved" ||
          data.DepartmentHeadApproval === "Rejected") && (
          <div className="d-md-flex gap-3">
            <div className="flex-fill">
              <div>Department Head Approver</div>
              <input
                value={data.DepartmentHeadApprover?.split(";").join(", ")}
                disabled
              />
            </div>
            <div className="flex-fill">
              <div>Department Head Approval</div>
              <input value={data.DepartmentHeadApproval} disabled />
            </div>
          </div>
        )}
        {data.FinanceSecretaryApproval !== "Pending" && (
          <div className="d-md-flex gap-3">
            <div className="flex-fill">
              <div>Finance Secretary Approver</div>
              <input
                value={data.FinanceSecretaryApprover?.split(";").join(", ")}
                disabled
              />
            </div>
            <div className="flex-fill">
              <div>Finance Secretary Approval</div>
              <input
                value={`Transfered to ${data.FinanceSecretaryApproval}`}
                disabled
              />
            </div>
          </div>
        )}
        {(data.CashTeamApproval === "Approved" ||
          data.CashTeamApproval === "Rejected") && (
          <div className="d-md-flex gap-3">
            <div className="flex-fill">
              <div>Cash Team Approver</div>
              <input
                value={data.CashTeamApprover?.split(";").join(", ")}
                disabled
              />
            </div>
            <div className="flex-fill">
              <div>Cash Team Approval</div>
              <input value={data.CashTeamApproval} disabled />
            </div>
          </div>
        )}
        {(data.ARTeamApproval === "Approved" ||
          data.ARTeamApproval === "Rejected") && (
          <div className="d-md-flex gap-3">
            <div className="flex-fill">
              <div>AR Team Approver</div>
              <input
                value={data.ARTeamApprover?.split(";").join(", ")}
                disabled
              />
            </div>
            <div className="flex-fill">
              <div>AR Team Approval</div>
              <input value={data.ARTeamApproval} disabled />
            </div>
          </div>
        )}
        {(data.APTeamApproval === "Approved" ||
          data.APTeamApproval === "Rejected") && (
          <div className="d-md-flex gap-3">
            <div className="flex-fill">
              <div>AP Team Approver</div>
              <input
                value={data.APTeamApprover?.split(";").join(", ")}
                disabled
              />
            </div>
            <div className="flex-fill">
              <div>AP Team Approval</div>
              <input value={data.APTeamApproval} disabled />
            </div>
          </div>
        )}
        {(data.CashHeadApproval === "Approved" ||
          data.CashHeadApproval === "Rejected") && (
          <div className="d-md-flex gap-3">
            <div className="flex-fill">
              <div>Cash Head Approver</div>
              <input
                value={data.CashHeadApprover?.split(";").join(", ")}
                disabled
              />
            </div>
            <div className="flex-fill">
              <div>Cash Head Approval</div>
              <input value={data.CashHeadApproval} disabled />
            </div>
          </div>
        )}
        {(data.ARHeadApproval === "Approved" ||
          data.ARHeadApproval === "Rejected") && (
          <div className="d-md-flex gap-3">
            <div className="flex-fill">
              <div>AR Head Approver</div>
              <input
                value={data.ARHeadApprover?.split(";").join(", ")}
                disabled
              />
            </div>
            <div className="flex-fill">
              <div>AR Head Approval</div>
              <input value={data.ARHeadApproval} disabled />
            </div>
          </div>
        )}
        {(data.APHeadApproval === "Approved" ||
          data.APHeadApproval === "Rejected") && (
          <div className="d-md-flex gap-3">
            <div className="flex-fill">
              <div>AP Head Approver</div>
              <input
                value={data.APHeadApprover?.split(";").join(", ")}
                disabled
              />
            </div>
            <div className="flex-fill">
              <div>AP Head Approval</div>
              <input value={data.APHeadApproval} disabled />
            </div>
          </div>
        )}
        {(data.FinanceControllerApproval === "Approved" ||
          data.FinanceControllerApproval === "Rejected") && (
          <div className="d-md-flex gap-3">
            <div className="flex-fill">
              <div>Finance Controller Approver</div>
              <input
                value={data.FinanceControllerApprover?.split(";").join(", ")}
                disabled
              />
            </div>
            <div className="flex-fill">
              <div>Finance Controller Approval</div>
              <input value={data.FinanceControllerApproval} disabled />
            </div>
          </div>
        )}
        {(data.VPFinanceApproval === "Approved" ||
          data.VPFinanceApproval === "Rejected") && (
          <div className="d-md-flex gap-3">
            <div className="flex-fill">
              <div>VP Finance Approver</div>
              <input
                value={data.VPFinanceApprover?.split(";").join(", ")}
                disabled
              />
            </div>
            <div className="flex-fill">
              <div>VP Finance Approval</div>
              <input value={data.VPFinanceApproval} disabled />
            </div>
          </div>
        )}
        {(data.CFOApproval === "Approved" ||
          data.CFOApproval === "Rejected") && (
          <div className="d-md-flex gap-3">
            <div className="flex-fill">
              <div>CFO</div>
              <input value={data.CFO?.split(";").join(", ")} disabled />
            </div>
            <div className="flex-fill">
              <div>CFO Approval</div>
              <input value={data.CFOApproval} disabled />
            </div>
          </div>
        )}
        {(data.CEOApproval === "Approved" ||
          data.CEOApproval === "Rejected") && (
          <div className="d-md-flex gap-3">
            <div className="flex-fill">
              <div>CEO</div>
              <input value={data.CEO?.split(";").join(", ")} disabled />
            </div>
            <div className="flex-fill">
              <div>CEO Approval</div>
              <input value={data.CEOApproval} disabled />
            </div>
          </div>
        )}
        {(data.TreasuryApproval === "Approved" ||
          data.TreasuryApproval === "Rejected") && (
          <div className="d-md-flex gap-3">
            <div className="flex-fill">
              <div>Treasury Approvers</div>
              <input
                value={data.TreasuryApproverName?.split(";").join(", ")}
                disabled
              />
            </div>
            <div className="flex-fill">
              <div>Treasury Approval</div>
              <input value={data.TreasuryApproval} disabled />
            </div>
          </div>
        )}
        {data.ReasonForRejection && (
          <div>
            <div>Reason For Rejection</div>
            <input value={data.ReasonForRejection} disabled />
          </div>
        )}
        {data.TreasuryJSON?.length !== 0 && (
          <div>
            <div>Treasury Documents</div>
            <Row gutter={[16, 16]}>
              {data.TreasuryJSON?.map(
                (attachment: {
                  refNumber: string;
                  targetName: string;
                  name: string;
                }) => (
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <input
                      className="mb-2"
                      value={attachment.refNumber}
                      disabled
                    />
                    <a
                      href={`${context.pageContext.web.absoluteUrl}/Lists/PaymentRequest/Attachments/${data.key}/${attachment.name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-interception="off"
                      className="text-decoration-none text-dark"
                    >
                      <div
                        className={`p-2 mb-1 d-flex justify-content-between align-items-center ${styles.fileInfo}`}
                      >
                        <div className={styles.fileName}>{attachment.name}</div>
                        <div style={{ cursor: "pointer" }} className="px-2">
                          <img
                            src={require("../assets/view.svg")}
                            width={"24px"}
                            height={"24px"}
                          />
                        </div>
                      </div>
                    </a>
                  </Col>
                )
              )}
            </Row>
          </div>
        )}

        <div>
          <div className="text-center mb-3">Approval Process</div>
          <Timeline mode={"left"} items={timeLineData} />
        </div>
      </div>
    );
  }
}
