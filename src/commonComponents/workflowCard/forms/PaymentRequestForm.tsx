import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Row,
  Select,
  Space,
} from "antd";
import * as React from "react";
import "./index.css";
import TextArea from "antd/es/input/TextArea";
import styles from "./Forms.module.sass";
import moment from "moment";
import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";
import { Web } from "sp-pnp-js";
import { DataType } from "../viewForms/components/DataType";
export interface IPaymentRequestFormProps {
  self: any;
  title: string;
  toWords: any;
  context: WebPartContext;
  modalOpen: boolean;
  handleClose: () => void;
  PaymentRequestDepartments: any;
  paymentCreationApprovers: any;
  selectedPersonDetails: {
    name: string;
    email: string;
    department: string;
    jobTitle: string;
    businessPhones: string;
  };
  editForm: boolean;
  editData: DataType;
}

interface JSON {
  targetName: string;
  refNumber: string;
  name: string;
}

interface IPaymentRequestFormState {
  amount: number;
  vat: number;
  total: number;
  listId: number;
  isError: boolean;
  errorMessage: string;
  submittingText: string;
  isSubmitting: boolean;
  amountInWord: string;
  modalEditData: any;
  attachmentCheckbox: {
    Invoice: boolean;
    Aggrement: boolean;
    SAPPO: boolean;
    SAPGR: boolean;
    ApprovalDocument: boolean;
    ObtainedAttached: boolean;
    NoPreviousApproval: boolean;
  };
  attachments: {
    Invoice: any;
    Aggrement: any;
    SAPPO: any;
    SAPGR: any;
    ApprovalDocument: any;
    ObtainedAttached: any;
  };
  postAttachments: {
    Invoice: any;
    Aggrement: any;
    SAPPO: any;
    SAPGR: any;
    ApprovalDocument: any;
    ObtainedAttached: any;
  };
  uploadAttachments: any;
  uploadEditAttachment: any;
  renderInvoice: any;
  nameOptions: any;
  dummyNameOption: any;
  nameSelected: string;
  benificiaryDetails: {
    name: string;
    bank: string;
    IBAN: string;
  };
  benificiaryAddDetails: {
    name: string;
    bank: string;
    IBAN: string;
  };
  benificiaryError: {
    name: "" | "error";
    bank: "" | "error";
    IBAN: "" | "error";
  };
  refNumber: {
    Invoice: string;
    Aggrement: string;
    SAPPO: string;
    SAPGR: string;
    ApprovalDocument: string;
    ObtainedAttached: string;
  };
  refNumberError: {
    Invoice: "" | "error";
    Aggrement: "" | "error";
    SAPPO: "" | "error";
    SAPGR: "" | "error";
    ApprovalDocument: "" | "error";
    ObtainedAttached: "" | "error";
  };
  attachmentError: {
    Invoice: string;
    Aggrement: string;
    SAPPO: string;
    SAPGR: string;
    ApprovalDocument: string;
    ObtainedAttached: string;
  };
  isNotificationOpen: boolean;
  currencySelected: string;
  includeVAT: boolean;
  attachmentPresent: {
    Invoice: boolean;
    Aggrement: boolean;
    SAPPO: boolean;
    SAPGR: boolean;
    ApprovalDocument: boolean;
    ObtainedAttached: boolean;
    NoPreviousApproval: boolean;
  };
  currencyOption: any;
  newCurrency: string;
  vatPercentage: number;
}

interface FieldType {}

export default class PaymentRequestForm extends React.Component<
  IPaymentRequestFormProps,
  IPaymentRequestFormState
> {
  public formRef: any;
  public constructor(
    props: IPaymentRequestFormProps,
    state: IPaymentRequestFormState
  ) {
    super(props);
    this.state = {
      amount: 0,
      vat: 0,
      total: 0,
      listId: 0,
      isError: false,
      errorMessage: "",
      submittingText: "",
      isSubmitting: false,
      amountInWord: "",
      modalEditData: [],
      attachmentCheckbox: {
        Invoice: false,
        Aggrement: false,
        SAPPO: false,
        SAPGR: false,
        ApprovalDocument: false,
        ObtainedAttached: false,
        NoPreviousApproval: false,
      },
      attachments: {
        Invoice: [],
        Aggrement: [],
        SAPPO: [],
        SAPGR: [],
        ApprovalDocument: [],
        ObtainedAttached: [],
      },
      postAttachments: {
        Invoice: [],
        Aggrement: [],
        SAPPO: [],
        SAPGR: [],
        ApprovalDocument: [],
        ObtainedAttached: [],
      },
      uploadAttachments: [],
      uploadEditAttachment: [],
      renderInvoice: [],
      nameSelected: "",
      nameOptions: [],
      dummyNameOption: [],
      benificiaryDetails: {
        name: "",
        bank: "",
        IBAN: "",
      },
      benificiaryAddDetails: {
        name: "",
        bank: "",
        IBAN: "",
      },
      benificiaryError: {
        name: "",
        bank: "",
        IBAN: "",
      },
      refNumber: {
        Invoice: "",
        Aggrement: "",
        SAPPO: "",
        SAPGR: "",
        ApprovalDocument: "",
        ObtainedAttached: "ObtainedAttached",
      },
      refNumberError: {
        Invoice: "",
        Aggrement: "",
        SAPPO: "",
        SAPGR: "",
        ApprovalDocument: "",
        ObtainedAttached: "",
      },
      isNotificationOpen: false,
      currencySelected: "SAR",
      includeVAT: false,
      attachmentPresent: {
        Invoice: false,
        Aggrement: false,
        SAPPO: false,
        SAPGR: false,
        ApprovalDocument: false,
        ObtainedAttached: false,
        NoPreviousApproval: false,
      },
      attachmentError: {
        Invoice: "",
        Aggrement: "",
        SAPPO: "",
        SAPGR: "",
        ApprovalDocument: "",
        ObtainedAttached: "",
      },
      currencyOption: [],
      newCurrency: "",
      vatPercentage: 15,
    };
    this.formRef = React.createRef();
  }
  public componentDidMount(): void {
    const {
      paymentCreationApprovers,
      editData,
      selectedPersonDetails,
      editForm,
    } = this.props;
    const { attachmentCheckbox } = this.state;
    this.getBeneficiaryNames();
    this.getCurrency();
    console.log(
      "Edit Form Datas",
      editData,
      paymentCreationApprovers,
      selectedPersonDetails
    );

    if (editForm) {
      const checkedAttachment = (
        AttachmentsJSON: Array<{
          name: string;
          targetName: string;
          refNumber: string;
        }>,
        Target: string
      ) => {
        const isAvailable =
          AttachmentsJSON?.filter((data) => {
            if (data.targetName === Target) {
              return data;
            }
          })?.length === 1;
        return isAvailable;
      };

      const refAttachment = (
        AttachmentsJSON: Array<{
          name: string;
          targetName: string;
          refNumber: string;
        }>,
        Target: string
      ) => {
        const isAvailable = AttachmentsJSON?.filter((data) => {
          if (data.targetName === Target) {
            return data;
          }
        });

        return isAvailable[0]?.refNumber ? isAvailable[0]?.refNumber : "";
      };

      const Attachment = (
        AttachmentsJSON: Array<{
          name: string;
          targetName: string;
          refNumber: string;
        }>,
        Target: string
      ) => {
        const isAvailable = AttachmentsJSON?.filter((data) => {
          if (data.targetName === Target) {
            return data;
          }
        });
        return isAvailable;
      };

      const attachmentNames = (
        AttachmentsJSON: Array<{
          name: string;
          targetName: string;
          refNumber: string;
        }>
      ) => {
        const nameArray = AttachmentsJSON?.map((data) => {
          if (data.targetName !== "ObtainedAttached") {
            return data.targetName;
          }
        });
        return nameArray;
      };

      this.formRef?.current.setFieldValue("PaymentType", editData?.PaymentType);
      this.formRef?.current.setFieldValue("SAPVendor", editData?.SAPVendor);
      this.formRef?.current.setFieldValue("Amount", parseInt(editData?.Amount));
      /*  this.formRef?.current.setFieldValue("IncludeVAT", editData.VAT); */
      this.setState({
        includeVAT: editData.VAT === "No",
        vatPercentage: editData.VATPercentage ? editData.VATPercentage : 15,
      });
      this.formRef?.current.setFieldValue(
        "Attachments",
        attachmentNames(editData.AttachmentsJSON)
      );
      this.formRef?.current.setFieldValue(
        "PreviousApproval",
        editData.PreviousApproval
      );
      this.formRef?.current.setFieldValue(
        "BeneficiaryName",
        editData.BeneficiaryName
      );
      this.formRef?.current.setFieldValue(
        "PurposeComments",
        editData?.Comments
      );
      this.setState({
        amount: parseInt(editData.Amount),
        total: parseInt(editData.Total),
        amountInWord: editData.AmountInWords,
        nameSelected: editData.BeneficiaryName,
        benificiaryDetails: {
          name: editData.BeneficiaryName,
          bank: editData.BeneficiaryBank,
          IBAN: editData.BeneficiaryIBAN,
        },
        currencySelected: editData.Currency,
        includeVAT: editData.VAT == "Yes" ? false : true,
        attachmentCheckbox: {
          ...attachmentCheckbox,
          ObtainedAttached:
            editData.PreviousApproval === "No previous Approval" ? false : true,
          NoPreviousApproval:
            editData.PreviousApproval === "No previous Approval" ? true : false,
          Aggrement: checkedAttachment(editData.AttachmentsJSON, "Aggrement"),
          Invoice: checkedAttachment(editData.AttachmentsJSON, "Invoice"),
          SAPGR: checkedAttachment(editData.AttachmentsJSON, "SAPGR"),
          SAPPO: checkedAttachment(editData.AttachmentsJSON, "SAPPO"),
          ApprovalDocument: checkedAttachment(
            editData.AttachmentsJSON,
            "ApprovalDocument"
          ),
        },
        refNumber: {
          Aggrement: refAttachment(editData.AttachmentsJSON, "Aggrement"),
          Invoice: refAttachment(editData.AttachmentsJSON, "Invoice"),
          SAPGR: refAttachment(editData.AttachmentsJSON, "SAPGR"),
          SAPPO: refAttachment(editData.AttachmentsJSON, "SAPPO"),
          ApprovalDocument: refAttachment(
            editData.AttachmentsJSON,
            "ApprovalDocument"
          ),
          ObtainedAttached: "ObtainedAttached",
        },
        attachments: {
          Aggrement: Attachment(editData.AttachmentsJSON, "Aggrement"),
          Invoice: Attachment(editData.AttachmentsJSON, "Invoice"),
          SAPGR: Attachment(editData.AttachmentsJSON, "SAPGR"),
          SAPPO: Attachment(editData.AttachmentsJSON, "SAPPO"),
          ApprovalDocument: Attachment(
            editData.AttachmentsJSON,
            "ApprovalDocument"
          ),
          ObtainedAttached: Attachment(
            editData.AttachmentsJSON,
            "ObtainedAttached"
          ),
        },
      });
    }
  }

  public componentDidUpdate(
    prevProps: Readonly<IPaymentRequestFormProps>,
    prevState: Readonly<IPaymentRequestFormState>
  ): void {
    const { toWords, selectedPersonDetails } = this.props;
    const { total, attachments } = this.state;
    if (prevState.total !== total) {
      this.setState({ amountInWord: toWords(total) });
    }
    if (prevState.attachments !== attachments) {
      console.log("Attcahment", attachments);
    }
    if (prevProps.selectedPersonDetails !== selectedPersonDetails) {
      this.getBeneficiaryNames();
    }
  }

  public getBeneficiaryNames() {
    const { context, selectedPersonDetails } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('BeneficiaryDetails')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(`Error in Beneficiary Details Fetch ${res.status}`);
          return;
        }
      })
      .then((listItems: { value: any[] }) => {
        console.log("Beneficiary Details", listItems.value);
        const nameData = listItems.value?.map((data) => {
          return {
            value: data.Title,
            label: data.Title,
            BeneficiaryBank: data.BeneficiaryBank,
            BeneficiaryIBAN: data.BeneficiaryIBAN,
            Department: data.Department,
          };
        });
        console.log("Beneficiary Details Before Filter", nameData);
        console.log("Beneficiary Selected Person", selectedPersonDetails);
        const departmentFilter = nameData?.filter((data) => {
          if (data.Department === selectedPersonDetails.department) {
            return data;
          }
        });
        console.log("Beneficiary Details Data", departmentFilter);
        this.setState({
          nameOptions: departmentFilter,
          dummyNameOption: departmentFilter,
        });
      });
  }

  public async addBenificiaryDetails() {
    const { context, selectedPersonDetails } = this.props;
    const { name, bank, IBAN } = this.state.benificiaryAddDetails;
    const headers: any = {
      "X-HTTP-Method": "POST",
      "If-Match": "*",
    };
    const spHttpClintOptions: ISPHttpClientOptions = {
      headers,
      body: JSON.stringify({
        Title: name,
        BeneficiaryBank: bank,
        BeneficiaryIBAN: IBAN,
        Department: selectedPersonDetails.department,
      }),
    };
    const postResponse = await context.spHttpClient.post(
      `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('BeneficiaryDetails')/items`,
      SPHttpClient.configurations.v1,
      spHttpClintOptions
    );
    if (postResponse.ok) {
      const postData = await postResponse.json();
      console.log("Benificiary Created", postData);
      this.setState({
        submittingText: "Benificiary has been added successfully",
        isSubmitting: false,
        benificiaryAddDetails: {
          name: "",
          bank: "",
          IBAN: "",
        },
      });
      this.getBeneficiaryNames();
    } else {
      alert("Benificiary Creation Failed.");
      console.log("Benificiary Failed", postResponse);
    }
  }

  public getCurrency() {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('PaymentRequestCurrency')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(`Error in PaymentRequestCurrency Fetch ${res.status}`);
          return;
        }
      })
      .then((listItems: { value: any[] }) => {
        console.log("PaymentRequestCurrency Details", listItems.value);
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
      `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('PaymentRequestCurrency')/items`,
      SPHttpClient.configurations.v1,
      spHttpClintOptions
    );
    if (postResponse.ok) {
      const postData = await postResponse.json();
      console.log("Payment Request Currency Created", postData);
      this.setState({
        submittingText: "Currency has been added successfully",
        isSubmitting: false,
        newCurrency: "",
      });
      this.getCurrency();
    } else {
      alert("Payment Request Currency Creation Failed.");
      console.log("PaymentRequestCurrency Failed", postResponse);
    }
  }

  public async upload(ID: number, Attachment: any, CreatorDepartment: string) {
    console.log("In Attachment Post", Attachment);
    const uniqueAttachmentData = Attachment.reduce((acc: any, curr: any) => {
      if (!acc.find((item: { name: string }) => item.name === curr.name)) {
        acc.push(curr);
      }
      return acc;
    }, []);
    console.log("uniqueAttachmentData", uniqueAttachmentData);
    let web = new Web(this.props.context.pageContext.web.absoluteUrl);
    const postResponse = await web.lists
      .getByTitle("PaymentRequest")
      .items.getById(ID)
      .attachmentFiles.addMultiple(uniqueAttachmentData);
    console.log("Attachment Post Status", postResponse);
    console.log("Form Element", this.formRef);
    this.getPaymentRequest(ID, CreatorDepartment);
    this.setState({
      attachments: {
        Invoice: [],
        Aggrement: [],
        SAPPO: [],
        SAPGR: [],
        ApprovalDocument: [],
        ObtainedAttached: [],
      },
      postAttachments: {
        Invoice: [],
        Aggrement: [],
        SAPPO: [],
        SAPGR: [],
        ApprovalDocument: [],
        ObtainedAttached: [],
      },
      attachmentCheckbox: {
        Invoice: false,
        Aggrement: false,
        SAPPO: false,
        SAPGR: false,
        ApprovalDocument: false,
        ObtainedAttached: false,
        NoPreviousApproval: false,
      },
    });
  }

  public async getPaymentRequest(ID: number, CreatorDepartment: string) {
    const { context } = this.props;
    const Response = await context.spHttpClient.get(
      `${
        context.pageContext.web.absoluteUrl
      }/_api/web/lists/GetByTitle('PaymentRequest')/items?$select=ID,Date,Department,ReferenceNumber${
        CreatorDepartment
          ? `${`&$filter=Department eq '${CreatorDepartment}'`}`
          : ""
      }`,
      SPHttpClient.configurations.v1
    );
    if (Response.ok) {
      const ResponseData = await Response.json();
      console.log("Payment ResponseData", ResponseData.value);
      if (ResponseData.value?.length > 0) {
        const monthFilter = ResponseData.value?.filter(
          (data: { Date: string | number }) =>
            new Date(data.Date).getMonth() === new Date().getMonth()
        );
        const TotalCount = monthFilter?.length + 1;
        this.mergePaymentRequest(ID, CreatorDepartment, TotalCount);
      } else {
        this.mergePaymentRequest(ID, CreatorDepartment, 1);
      }
    } else {
      console.log(`Error in PaymentRequest Fetch ${Response.status}`);
    }
  }

  public async mergePaymentRequest(
    ID: number,
    CreatorDepartment: string,
    TotalCount: number
  ) {
    const { context, editForm } = this.props;
    const emptyState = (refNumber: string) => {
      this.setState({
        submittingText: `Payment Request has been ${
          editForm ? "Updated" : "Created"
        }.${refNumber === "" ? "" : `(${refNumber})`}`,
        isSubmitting: false,
        amount: 0,
        vat: 0,
        total: 0,
        listId: 0,
        amountInWord: "",
        attachmentCheckbox: {
          Invoice: false,
          Aggrement: false,
          SAPPO: false,
          SAPGR: false,
          ApprovalDocument: false,
          ObtainedAttached: false,
          NoPreviousApproval: false,
        },
        attachments: {
          Invoice: [],
          Aggrement: [],
          SAPPO: [],
          SAPGR: [],
          ApprovalDocument: [],
          ObtainedAttached: [],
        },
        postAttachments: {
          Invoice: [],
          Aggrement: [],
          SAPPO: [],
          SAPGR: [],
          ApprovalDocument: [],
          ObtainedAttached: [],
        },
        uploadAttachments: [],
        renderInvoice: [],
        nameSelected: "",
        benificiaryDetails: {
          name: "",
          bank: "",
          IBAN: "",
        },
        benificiaryAddDetails: {
          name: "",
          bank: "",
          IBAN: "",
        },
        benificiaryError: {
          name: "",
          bank: "",
          IBAN: "",
        },
        refNumber: {
          Invoice: "",
          Aggrement: "",
          SAPPO: "",
          SAPGR: "",
          ApprovalDocument: "",
          ObtainedAttached: "ObtainedAttached",
        },
        refNumberError: {
          Invoice: "",
          Aggrement: "",
          SAPPO: "",
          SAPGR: "",
          ApprovalDocument: "",
          ObtainedAttached: "",
        },
        isNotificationOpen: true,
        currencySelected: "SAR",
        includeVAT: false,
        attachmentError: {
          Invoice: "",
          Aggrement: "",
          SAPPO: "",
          SAPGR: "",
          ApprovalDocument: "",
          ObtainedAttached: "",
        },
        vatPercentage: 15,
      });
    };
    if (editForm) {
      setTimeout(() => {
        console.log("Payment Request Created");
        this.formRef?.current.resetFields();
        emptyState("");
      }, 2000);
    } else {
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
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('PaymentRequest')/items('${ID}')`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      );
      if (postResponse.ok) {
        setTimeout(() => {
          console.log("Payment Request Created");
          console.log("Payment Updated", postResponse);
          emptyState(refNumber);
          this.formRef?.current.resetFields();
        }, 1000);
      } else {
        this.setState({
          isError: true,
          errorMessage: "Payment Request Creation Failed.",
        });
        console.log("Post Failed", postResponse);
      }
    }
  }

  private deleteFiles(files: string) {
    console.log("Deleting");
    const { context, editData } = this.props;
    let web = new Web(context.pageContext.web.absoluteUrl);
    web.lists
      .getByTitle("PaymentRequest")
      .items.getById(editData.ID)
      .attachmentFiles.getByName(files)
      .delete();
  }

  public render(): React.ReactElement<IPaymentRequestFormProps> {
    const {
      modalOpen,
      title,
      handleClose,
      selectedPersonDetails,
      paymentCreationApprovers,
      editForm,
      editData,
      context,
    } = this.props;

    const {
      amount,
      total,
      isError,
      nameSelected,
      nameOptions,
      errorMessage,
      isSubmitting,
      amountInWord,
      attachmentCheckbox,
      attachments,
      postAttachments,
      dummyNameOption,
      benificiaryDetails,
      benificiaryAddDetails,
      benificiaryError,
      isNotificationOpen,
      submittingText,
      currencySelected,
      refNumber,
      refNumberError,
      uploadEditAttachment,
      attachmentError,
      vatPercentage,
    } = this.state;

    const {
      Invoice,
      Aggrement,
      SAPGR,
      SAPPO,
      ApprovalDocument,
      ObtainedAttached,
      NoPreviousApproval,
    } = attachmentCheckbox;

    console.log("Form Ref", this.formRef);

    const onFinish = (values: any) => {
      const attachmentFiles = [
        ...postAttachments.Aggrement,
        ...postAttachments.ApprovalDocument,
        ...postAttachments.Invoice,
        ...postAttachments.SAPGR,
        ...postAttachments.SAPPO,
        ...postAttachments.ObtainedAttached,
      ];

      const attachmentRef = attachmentFiles?.map((data) => {
        return {
          ...data,
          refNumber:
            data.attachmentTarget === "Aggrement"
              ? refNumber.Aggrement
              : data.attachmentTarget === "ApprovalDocument"
              ? refNumber.ApprovalDocument
              : data.attachmentTarget === "Invoice"
              ? refNumber.Invoice
              : data.attachmentTarget === "SAPGR"
              ? refNumber.SAPGR
              : data.attachmentTarget === "SAPPO"
              ? refNumber.SAPPO
              : data.attachmentTarget === "ObtainedAttached"
              ? refNumber.ObtainedAttached
              : "",
        };
      });

      console.log("Edit Attachment Speard", uploadEditAttachment);
      const attachmentCheck = (
        isChecked: boolean,
        hasAttachment: boolean,
        hasRef: boolean
      ): boolean => {
        if (isChecked) {
          if (hasAttachment && hasRef) return true;
          else return false;
        } else return true;
      };

      console.log("Success:", values);

      if (
        attachmentCheck(
          attachmentCheckbox.Aggrement,
          postAttachments.Aggrement?.length === 1 ||
            attachments.Aggrement?.length === 1,
          refNumber.Aggrement?.length >= 1
        ) &&
        attachmentCheck(
          attachmentCheckbox.ApprovalDocument,
          postAttachments.ApprovalDocument?.length === 1 ||
            attachments.ApprovalDocument?.length === 1,
          refNumber.ApprovalDocument?.length >= 1
        ) &&
        attachmentCheck(
          attachmentCheckbox.Invoice,
          postAttachments.Invoice?.length === 1 ||
            attachments.Invoice?.length === 1,
          refNumber.Invoice?.length >= 1
        ) &&
        attachmentCheck(
          attachmentCheckbox.ObtainedAttached,
          postAttachments.ObtainedAttached?.length === 1 ||
            attachments.ObtainedAttached?.length === 1,
          refNumber.ObtainedAttached?.length >= 1
        ) &&
        attachmentCheck(
          attachmentCheckbox.SAPPO,
          postAttachments.SAPPO?.length === 1 ||
            attachments.SAPPO?.length === 1,
          refNumber.SAPPO?.length >= 1
        ) &&
        attachmentCheck(
          attachmentCheckbox.SAPGR,
          postAttachments.SAPGR?.length === 1 ||
            attachments.SAPGR?.length === 1,
          refNumber.SAPGR?.length >= 1
        )
      ) {
        if (
          attachmentCheckbox.Aggrement ||
          attachmentCheckbox.ApprovalDocument ||
          attachmentCheckbox.Invoice ||
          attachmentCheckbox.SAPGR ||
          attachmentCheckbox.SAPPO
        ) {
          if (
            attachmentCheckbox.NoPreviousApproval ||
            attachmentCheckbox.ObtainedAttached
          ) {
            if (currencySelected === "") {
              this.setState({
                isError: true,
                errorMessage: "Please select the Currency.",
              });
            } else {
              if (editForm) {
                let Invoice: JSON;
                let Aggrement: JSON;
                let ApprovalDocument: JSON;
                let ObtainedAttached: JSON;
                let SAPPO: JSON;
                let SAPGR: JSON;
                let JSONattachment: Array<JSON> = [];
                if (attachmentCheckbox.Invoice) {
                  Invoice = {
                    targetName: "Invoice",
                    refNumber: refNumber.Invoice,
                    name:
                      postAttachments.Invoice?.length === 1
                        ? postAttachments.Invoice[0]?.name
                        : attachments.Invoice[0]?.name,
                  };
                  JSONattachment = [...JSONattachment, Invoice];
                }
                if (attachmentCheckbox.Aggrement) {
                  Aggrement = {
                    targetName: "Aggrement",
                    refNumber: refNumber.Aggrement,
                    name:
                      postAttachments.Aggrement?.length === 1
                        ? postAttachments.Aggrement[0]?.name
                        : attachments.Aggrement[0]?.name,
                  };
                  JSONattachment = [...JSONattachment, Aggrement];
                }
                if (attachmentCheckbox.ApprovalDocument) {
                  ApprovalDocument = {
                    targetName: "ApprovalDocument",
                    refNumber: refNumber.ApprovalDocument,
                    name:
                      postAttachments.ApprovalDocument?.length === 1
                        ? postAttachments.ApprovalDocument[0]?.name
                        : attachments.ApprovalDocument[0]?.name,
                  };
                  JSONattachment = [...JSONattachment, ApprovalDocument];
                }
                if (attachmentCheckbox.ObtainedAttached) {
                  ObtainedAttached = {
                    targetName: "ObtainedAttached",
                    refNumber: refNumber.ObtainedAttached,
                    name:
                      postAttachments.ObtainedAttached?.length === 1
                        ? postAttachments.ObtainedAttached[0]?.name
                        : attachments.ObtainedAttached[0]?.name,
                  };
                  JSONattachment = [...JSONattachment, ObtainedAttached];
                }
                if (attachmentCheckbox.SAPGR) {
                  SAPGR = {
                    targetName: "SAPGR",
                    refNumber: refNumber.SAPGR,
                    name:
                      postAttachments.SAPGR?.length === 1
                        ? postAttachments.SAPGR[0]?.name
                        : attachments.SAPGR[0]?.name,
                  };
                  JSONattachment = [...JSONattachment, SAPGR];
                }
                if (attachmentCheckbox.SAPPO) {
                  SAPPO = {
                    targetName: "SAPPO",
                    refNumber: refNumber.SAPPO,
                    name:
                      postAttachments.SAPPO?.length === 1
                        ? postAttachments.SAPPO[0]?.name
                        : attachments.SAPPO[0]?.name,
                  };
                  JSONattachment = [...JSONattachment, SAPPO];
                }
                console.log("JSONattachment", JSONattachment);
                this.setState({
                  isSubmitting: true,
                  isNotificationOpen: true,
                  submittingText: "Updating Payment Request.",
                });
                updatePaymentRequest(
                  editData.ID,
                  values,
                  attachmentRef,
                  JSONattachment
                );
              } else {
                this.setState({
                  isSubmitting: true,
                  isNotificationOpen: true,
                  submittingText: "Creating Payment Request.",
                });
                postUser(values, attachmentRef);
              }
            }
          } else {
            this.setState({
              isError: true,
              errorMessage: "Please select Previous Approval.",
            });
          }
        } else {
          this.setState({
            isError: true,
            errorMessage: "Please add the attachments.",
          });
        }
      } else {
        let errorItem = attachmentCheck(
          attachmentCheckbox.Invoice,
          postAttachments.Invoice?.length === 1 ||
            attachments.Invoice?.length === 1,
          refNumber.Invoice?.length >= 1
        )
          ? attachmentCheck(
              attachmentCheckbox.Aggrement,
              postAttachments.Aggrement?.length === 1 ||
                attachments.Aggrement?.length === 1,
              refNumber.Aggrement?.length >= 1
            )
            ? attachmentCheck(
                attachmentCheckbox.SAPPO,
                postAttachments.SAPPO?.length === 1 ||
                  attachments.SAPPO?.length === 1,
                refNumber.SAPPO?.length >= 1
              )
              ? attachmentCheck(
                  attachmentCheckbox.SAPGR,
                  postAttachments.SAPGR?.length === 1 ||
                    attachments.SAPGR?.length === 1,
                  refNumber.SAPGR?.length >= 1
                )
                ? attachmentCheck(
                    attachmentCheckbox.ApprovalDocument,
                    postAttachments.ApprovalDocument?.length === 1 ||
                      attachments.ApprovalDocument?.length === 1,
                    refNumber.ApprovalDocument?.length >= 1
                  )
                  ? attachmentCheck(
                      attachmentCheckbox.ObtainedAttached,
                      postAttachments.ObtainedAttached?.length === 1 ||
                        attachments.ObtainedAttached?.length === 1,
                      refNumber.ObtainedAttached?.length >= 1
                    )
                    ? ""
                    : "Obtained & Attached"
                  : "Approval Document"
                : "SAP GR"
              : "SAP PO"
            : "Agreement / Contract"
          : "Invoice / Proposal";

        const errorMessage = (errorMessage: string): string => {
          let error: string = "";
          if (errorMessage === "Invoice / Proposal") {
            if (
              postAttachments.Invoice?.length === 0 &&
              refNumber.Invoice?.length < 1
            ) {
              this.setState({
                attachmentError: {
                  ...attachmentError,
                  Invoice: "Please select attachments.",
                },
                refNumberError: { ...refNumberError, Invoice: "error" },
              });
              error = "Invoice / Proposal attachments and Ref#.";
            } else if (postAttachments.Invoice?.length === 0) {
              this.setState({
                attachmentError: {
                  ...attachmentError,
                  Invoice: "Please select attachments.",
                },
              });
              error = "Invoice / Proposal attachments.";
            } else if (refNumber.Invoice?.length < 1) {
              this.setState({
                refNumberError: { ...refNumberError, Invoice: "error" },
              });
              error = "Invoice / Proposal Ref#.";
            }
          } else if (errorMessage === "Agreement / Contract") {
            if (
              postAttachments.Aggrement?.length === 0 &&
              refNumber.Aggrement?.length < 1
            ) {
              this.setState({
                attachmentError: {
                  ...attachmentError,
                  Aggrement: "Please select attachments.",
                },
                refNumberError: { ...refNumberError, Aggrement: "error" },
              });
              error = "Agreement / Contract attachments and Ref#.";
            } else if (postAttachments.Aggrement?.length === 0) {
              this.setState({
                attachmentError: {
                  ...attachmentError,
                  Aggrement: "Please select attachments.",
                },
              });
              error = "Agreement / Contract attachments.";
            } else if (refNumber.Aggrement?.length < 1) {
              this.setState({
                refNumberError: { ...refNumberError, Aggrement: "error" },
              });
              error = "Agreement / Contract Ref#.";
            }
          } else if (errorMessage === "SAP PO") {
            if (
              postAttachments.SAPPO?.length === 0 &&
              refNumber.SAPPO?.length < 1
            ) {
              this.setState({
                attachmentError: {
                  ...attachmentError,
                  SAPPO: "Please select attachments.",
                },
                refNumberError: { ...refNumberError, SAPPO: "error" },
              });
              error = "SAP PO attachments and Ref#.";
            } else if (postAttachments.SAPPO?.length === 0) {
              this.setState({
                attachmentError: {
                  ...attachmentError,
                  SAPPO: "Please select attachments.",
                },
              });
              error = "SAP PO attachments.";
            } else if (refNumber.SAPPO?.length < 1) {
              this.setState({
                refNumberError: { ...refNumberError, SAPPO: "error" },
              });
              error = "SAP PO Ref#.";
            }
          } else if (errorMessage === "SAP GR") {
            if (
              postAttachments.SAPGR?.length === 0 &&
              refNumber.SAPGR?.length < 1
            ) {
              this.setState({
                attachmentError: {
                  ...attachmentError,
                  SAPGR: "Please select attachments.",
                },
                refNumberError: { ...refNumberError, SAPGR: "error" },
              });
              error = "SAP GR attachments and Ref#.";
            } else if (postAttachments.SAPGR?.length === 0) {
              this.setState({
                attachmentError: {
                  ...attachmentError,
                  SAPGR: "Please select attachments.",
                },
              });
              error = "SAP GR attachments.";
            } else if (refNumber.SAPGR?.length < 1) {
              this.setState({
                refNumberError: { ...refNumberError, SAPGR: "error" },
              });
              error = "SAP GR Ref#.";
            }
          } else if (errorMessage === "Approval Document") {
            if (
              postAttachments.ApprovalDocument?.length === 0 &&
              refNumber.ApprovalDocument?.length < 1
            ) {
              this.setState({
                attachmentError: {
                  ...attachmentError,
                  ApprovalDocument: "Please select attachments.",
                },
                refNumberError: {
                  ...refNumberError,
                  ApprovalDocument: "error",
                },
              });
              error = "Approval Document attachments and Ref#.";
            } else if (postAttachments.ApprovalDocument?.length === 0) {
              this.setState({
                attachmentError: {
                  ...attachmentError,
                  ApprovalDocument: "Please select attachments.",
                },
              });
              error = "Approval Document attachments.";
            } else if (refNumber.ApprovalDocument?.length < 1) {
              this.setState({
                refNumberError: {
                  ...refNumberError,
                  ApprovalDocument: "error",
                },
              });
              error = "Approval Document Ref#.";
            }
          } else if (errorMessage === "Obtained & Attached") {
            if (
              postAttachments.ObtainedAttached?.length === 0 &&
              refNumber.ObtainedAttached?.length < 1
            ) {
              this.setState({
                attachmentError: {
                  ...attachmentError,
                  ObtainedAttached: "Please select attachments.",
                },
                refNumberError: {
                  ...refNumberError,
                  ObtainedAttached: "error",
                },
              });
              error = "Obtained & Attached attachments and Ref#.";
            } else if (postAttachments.ObtainedAttached?.length === 0) {
              this.setState({
                attachmentError: {
                  ...attachmentError,
                  ObtainedAttached: "Please select attachments.",
                },
              });
              error = "Obtained & Attached attachments.";
            } else if (refNumber.ObtainedAttached?.length < 1) {
              this.setState({
                refNumberError: {
                  ...refNumberError,
                  ObtainedAttached: "error",
                },
              });
              error = "Obtained & Attached Ref#.";
            }
          }
          return error;
        };

        this.setState({
          isError: true,
          errorMessage: `Please add the ${errorMessage(errorItem)}`,
        });
        console.log("On Attachment", attachmentRef);
      }
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log("Failed:", errorInfo);
    };

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
            errorMessage: "Please select an PDF File.",
          });
        } else {
          this.setState({
            attachments: {
              ...attachments,
              [event.target.name]: event.target.files,
            },
            attachmentError: {
              ...attachmentError,
              [event.target.name]: "",
            },
          });
          if (editForm) {
            editData.AttachmentFiles?.map((data) => {
              if (data.FileName?.toLowerCase().match(fileName?.toLowerCase())) {
                this.deleteFiles(fileName);
              }
            });
          }
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
          console.log("fileData Attachment", fileData);
          this.setState({
            postAttachments: {
              ...postAttachments,
              [event.target.name]: fileData,
            },
          });
        }
      }
    };

    const handleSearch = (newValue: string) => {
      console.log("nameSearch", newValue);
      if (newValue?.length >= 1) {
        const filteredOption = dummyNameOption?.filter(
          (data: { label: string }) =>
            data.label?.toLowerCase().match(newValue?.toLowerCase())
        );
        this.setState({ nameOptions: filteredOption });
      } else {
        this.setState({ nameOptions: dummyNameOption });
      }
    };

    const handleNameChange = (newValue: string) => {
      console.log("newValue", newValue);
      const selectedBeneficiary = nameOptions?.filter(
        (data: { value: string }) => {
          return data.value === newValue;
        }
      );
      this.setState({
        nameSelected: newValue,
        benificiaryDetails: {
          name: selectedBeneficiary[0].value,
          bank: selectedBeneficiary[0].BeneficiaryBank,
          IBAN: selectedBeneficiary[0].BeneficiaryIBAN,
        },
      });
    };

    const addBenificiary = () => {
      if (benificiaryAddDetails.name?.length < 3) {
        this.setState({
          benificiaryError: { ...benificiaryError, name: "error" },
          isError: true,
          errorMessage: "Enter Valid Name",
        });
      } else if (benificiaryAddDetails.bank?.length < 3) {
        this.setState({
          benificiaryError: { ...benificiaryError, bank: "error" },
          isError: true,
          errorMessage: "Enter Valid Bank Name",
        });
      } else if (benificiaryAddDetails.IBAN?.length < 3) {
        this.setState({
          benificiaryError: { ...benificiaryError, IBAN: "error" },
          isError: true,
          errorMessage: "Enter Valid IBAN",
        });
      } else {
        this.setState({
          isNotificationOpen: true,
          submittingText: "Updating Beneficiary....",
        });
        this.addBenificiaryDetails();
      }
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

    const handleAddBenificiary = (event: {
      target: { name: string; value: string };
    }) => {
      this.setState({
        benificiaryAddDetails: {
          ...benificiaryAddDetails,
          [event.target.name]: event.target.value,
        },
      });
      if (event.target.value?.length < 3) {
        this.setState({
          benificiaryError: {
            ...benificiaryError,
            [event.target.name]: "error",
          },
        });
      } else {
        this.setState({
          benificiaryError: {
            ...benificiaryError,
            [event.target.name]: "",
          },
        });
      }
    };

    const handleAddCurrency = (event: { target: { value: string } }) => {
      this.setState({
        newCurrency: event.target.value,
      });
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

    const postUser = async (values: any, attachmentFiles: any) => {
      const { context, PaymentRequestDepartments, selectedPersonDetails } =
        this.props;
      const { includeVAT } = this.state;
      const { PaymentType, SAPVendor, PurposeComments, Amount } = values;
      const PaymentDepartment = PaymentRequestDepartments?.filter(
        (data: { Creator: string }) => {
          if (selectedPersonDetails.name === data.Creator) {
            return data;
          }
        }
      );
      const CreatorDepartment = PaymentDepartment?.length
        ? PaymentDepartment[0].Title
        : selectedPersonDetails.department;
      const MidManager = PaymentDepartment?.length
        ? PaymentDepartment[0].MidManager
        : paymentCreationApprovers.BusinessApprover;
      const DepartmentHead = PaymentDepartment?.length
        ? PaymentDepartment[0].DepartmentHead
        : paymentCreationApprovers.DepartmentHead;
      const MidManagerEmail = PaymentDepartment?.length
        ? PaymentDepartment[0].MidManagerEmail
        : paymentCreationApprovers.BusinessApprover;
      const DepartmentHeadEmail = PaymentDepartment?.length
        ? PaymentDepartment[0].DepartmentHeadEmail
        : paymentCreationApprovers.DepartmentHead;
      console.log(
        "MidManager, DepartmentHead",
        MidManager,
        DepartmentHead,
        MidManagerEmail,
        DepartmentHeadEmail
      );

      const attachmentJSON = attachmentFiles?.map(
        (data: { refNumber: any; name: string; attachmentTarget: string }) => {
          return {
            name: data.name,
            targetName: data.attachmentTarget,
            refNumber: data.refNumber,
          };
        }
      );
      console.log("attachmentJSON", attachmentJSON);
      const attachmentJSONStringfy = JSON.stringify(attachmentJSON);

      const headers: any = {
        "X-HTTP-Method": "POST",
        "If-Match": "*",
      };
      const spHttpClintOptions: ISPHttpClientOptions = {
        headers,
        body: JSON.stringify({
          Title: selectedPersonDetails.name,
          Date: new Date().toString(),
          Department: CreatorDepartment,
          JobTitle: selectedPersonDetails.jobTitle,
          Email: selectedPersonDetails.email,
          Ext: selectedPersonDetails.businessPhones,
          PaymentType: PaymentType,
          BeneficiaryName: benificiaryDetails.name,
          BeneficiaryBank: benificiaryDetails.bank,
          BeneficiaryIBAN: benificiaryDetails.IBAN,
          SAPVendor: SAPVendor,
          Comments: PurposeComments,
          Amount: Amount.toString(),
          VAT: !includeVAT ? "Yes" : "No",
          Total: total.toString(),
          Currency: currencySelected,
          AmountInWords: amountInWord,
          PreviousApproval: NoPreviousApproval
            ? "No previous Approval"
            : "Obtained & Attached",
          AttachmentsJSON: attachmentJSONStringfy,
          CreatedBy: context.pageContext.user.displayName,
          PendingWith: MidManager,
          BusinessApprover: MidManager,
          DepartmentHeadApprover: DepartmentHead,
          FinanceSecretaryApprover: paymentCreationApprovers.FinanceSecretary,
          CashTeamApprover: paymentCreationApprovers.CashTeam,
          CashHeadApprover: paymentCreationApprovers.CashHead,
          APTeamApprover: paymentCreationApprovers.APTeam,
          APHeadApprover: paymentCreationApprovers.APHead,
          ARTeamApprover: paymentCreationApprovers.ARTeam,
          ARHeadApprover: paymentCreationApprovers.ARHead,
          FinanceControllerApprover: paymentCreationApprovers.FinanceController,
          VPFinanceApprover: paymentCreationApprovers.VPFinance,
          CFO: paymentCreationApprovers.CFO,
          CEO: paymentCreationApprovers.CEO,
          BusinessApproverLimit: paymentCreationApprovers.BusinessApproverLimit,
          CashTeamLimit: paymentCreationApprovers.CashTeamLimit,
          ARTeamLimit: paymentCreationApprovers.ARTeamLimit,
          APTeamLimit: paymentCreationApprovers.APTeamLimit,
          FinanceControllerLimit:
            paymentCreationApprovers.FinanceControllerLimit,
          TimeLine: JSON.stringify([
            {
              label: `${moment(new Date().toString())?.format(
                "Do MMM YYYY"
              )} ${moment(new Date().toString())?.format("h:mm a")}`,
              children: `${context.pageContext.user.displayName} created a Payment Request`,
              color: "green",
            },
            {
              dot: "Clock",
              children: "Payment Request has been send for Business Approval.",
            },
          ]),
          ApprovalProcess: "Business Approval",
          TreasuryApproverName: paymentCreationApprovers.TreasuryApproverName,
          PendingDepartment: "Business Approver",
          VATPercentage: vatPercentage,
        }),
      };
      const postResponse = await context.spHttpClient.post(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('PaymentRequest')/items`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      );
      if (postResponse.ok) {
        const postData = await postResponse.json();
        console.log("Payment Request Created", postData);
        this.upload(postData.ID, attachmentFiles, CreatorDepartment);
      } else {
        this.setState({
          isError: true,
          isNotificationOpen: false,
          isSubmitting: false,
          errorMessage: "Payment Request Creation Failed.",
        });
        console.log("Post Failed", postResponse);
      }
    };

    const updatePaymentRequest = async (
      ID: number,
      values: any,
      attachmentFiles: any,
      attachmentJSON: Array<JSON>
    ) => {
      const { includeVAT } = this.state;
      const { PaymentRequestDepartments } = this.props;
      const { PaymentType, SAPVendor, PurposeComments, Amount } = values;
      const PaymentDepartment = PaymentRequestDepartments?.filter(
        (data: { Creator: string }) => {
          if (
            selectedPersonDetails.name.toLowerCase() ===
            data.Creator.toLowerCase()
          ) {
            return data;
          }
        }
      );
      console.log("Payment Department", PaymentDepartment);
      const CreatorDepartment = PaymentDepartment?.length
        ? PaymentDepartment[0].Title
        : selectedPersonDetails.department;
      const MidManager = PaymentDepartment?.length
        ? PaymentDepartment[0].MidManager
        : paymentCreationApprovers.BusinessApprover;
      const DepartmentHead = PaymentDepartment?.length
        ? PaymentDepartment[0].DepartmentHead
        : paymentCreationApprovers.DepartmentHead;
      const MidManagerEmail = PaymentDepartment?.length
        ? PaymentDepartment[0].MidManagerEmail
        : paymentCreationApprovers.BusinessApprover;
      const DepartmentHeadEmail = PaymentDepartment?.length
        ? PaymentDepartment[0].DepartmentHeadEmail
        : paymentCreationApprovers.DepartmentHead;
      console.log(
        "MidManager, DepartmentHead",
        MidManager,
        DepartmentHead,
        MidManagerEmail,
        DepartmentHeadEmail
      );
      const timeLine = [
        ...editData.TimeLine,
        {
          label: `${moment(new Date().toString())?.format(
            "Do MMM YYYY"
          )} ${moment(new Date().toString())?.format("h:mm a")}`,
          children: `${context.pageContext.user.displayName} updated the Payment Request`,
          color: "green",
        },
        {
          dot: "Clock",
          children: `Payment Request has been send for  ${
            Amount <= parseInt(paymentCreationApprovers.BusinessApproverLimit)
              ? "Finance Secretary Approval."
              : "Department Head Approval."
          }`,
        },
      ];
      const attachmentJSONStringfy = JSON.stringify(attachmentJSON);
      const headers: any = {
        "X-HTTP-Method": "MERGE",
        "If-Match": "*",
      };
      const spHttpClintOptions: ISPHttpClientOptions = {
        headers,
        body: JSON.stringify({
          PaymentType: PaymentType,
          BeneficiaryName: benificiaryDetails.name,
          BeneficiaryBank: benificiaryDetails.bank,
          BeneficiaryIBAN: benificiaryDetails.IBAN,
          SAPVendor: SAPVendor,
          Comments: PurposeComments,
          Amount: Amount.toString(),
          VAT: !includeVAT ? "Yes" : "No",
          Total: total.toString(),
          Currency: currencySelected,
          AmountInWords: amountInWord,
          PreviousApproval: NoPreviousApproval
            ? "No previous Approval"
            : "Obtained & Attached",
          AttachmentsJSON: attachmentJSONStringfy,
          PendingWith:
            Amount <= parseInt(paymentCreationApprovers.BusinessApproverLimit)
              ? paymentCreationApprovers.FinanceSecretary
              : DepartmentHead,
          BusinessApprover: MidManager,
          DepartmentHeadApprover: DepartmentHead,
          FinanceSecretaryApprover: paymentCreationApprovers.FinanceSecretary,
          CashTeamApprover: paymentCreationApprovers.CashTeam,
          CashHeadApprover: paymentCreationApprovers.CashHead,
          APTeamApprover: paymentCreationApprovers.APTeam,
          APHeadApprover: paymentCreationApprovers.APHead,
          ARTeamApprover: paymentCreationApprovers.ARTeam,
          ARHeadApprover: paymentCreationApprovers.ARHead,
          FinanceControllerApprover: paymentCreationApprovers.FinanceController,
          VPFinanceApprover: paymentCreationApprovers.VPFinance,
          CFO: paymentCreationApprovers.CFO,
          CEO: paymentCreationApprovers.CEO,
          BusinessApproverLimit: paymentCreationApprovers.BusinessApproverLimit,
          CashTeamLimit: paymentCreationApprovers.CashTeamLimit,
          ARTeamLimit: paymentCreationApprovers.ARTeamLimit,
          APTeamLimit: paymentCreationApprovers.APTeamLimit,
          FinanceControllerLimit:
            paymentCreationApprovers.FinanceControllerLimit,
          TimeLine: JSON.stringify(timeLine),
          ApprovalProcess:
            Amount <= parseInt(paymentCreationApprovers.BusinessApproverLimit)
              ? "Finance Secretary"
              : "Department Head",
          TreasuryApproverName: paymentCreationApprovers.TreasuryApproverName,
          PendingDepartment:
            Amount <= parseInt(paymentCreationApprovers.BusinessApproverLimit)
              ? "Finance Secretary"
              : "Department Head",
          BusinessApproval: "Approved",
          BusinessApprovalTime: new Date().toString(),
          DepartmentHeadApproval:
            Amount <= parseInt(paymentCreationApprovers.BusinessApproverLimit)
              ? "Approved"
              : "Pending",
          FinanceSecretaryApproval: "Pending",
          Approvers: JSON.stringify([
            ...editData.Approvers,
            { name: context.pageContext.user.displayName },
          ]),
          ReasonForRejection: "",
        }),
      };
      const postResponse = await context.spHttpClient.post(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('PaymentRequest')/items('${ID}')`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      );
      if (postResponse.ok) {
        if (attachmentFiles?.length > 0) {
          this.upload(editData.ID, attachmentFiles, CreatorDepartment);
        } else {
          this.getPaymentRequest(editData.ID, CreatorDepartment);
        }
      } else {
        this.setState({
          isError: true,
          isNotificationOpen: false,
          isSubmitting: false,
          errorMessage: "Payment Request Creation Failed.",
        });
        console.log("Post Failed", postResponse);
      }
    };

    const selectAfter = (
      <Select
        style={{ width: 150 }}
        aria-required
        defaultValue={editForm ? editData.Currency : currencySelected}
        value={currencySelected}
        onChange={(newValue: string) => {
          this.setState({ currencySelected: newValue });
        }}
        options={this.state.currencyOption?.map(
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

    const viewElement = (Name: string) => {
      const element = (
        <a
          href={`${context.pageContext.web.absoluteUrl}/Lists/PaymentRequest/Attachments/${editData.key}/${Name}`}
          target="_blank"
          rel="noopener noreferrer"
          data-interception="off"
          className="text-decoration-none text-dark"
        >
          <img
            src={require("./assets/view.svg")}
            width={"24px"}
            height={"24px"}
          />
        </a>
      );
      return element;
    };

    console.log("benificiaryAddDetails", benificiaryAddDetails);
    console.log("postAttachments", postAttachments);
    console.log("refNumber", refNumber);
    console.log("attachment Erro", attachmentError);
    console.log("Selected Person Details", selectedPersonDetails);
    console.log("Post Attachment", postAttachments);

    return (
      <Modal
        title={`${title} ${editForm ? "" : "Form"}`}
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
            <h4 className="text-center  pt-3">Payment Request</h4>
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
              <Row gutter={[16, 0]} className="mb-3">
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={12}
                  xl={12}
                  className="marginBottom"
                >
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
                name="PaymentType"
                label="Payment Type"
                rules={[
                  {
                    required: true,
                    message: "Please select Payment Type",
                  },
                ]}
              >
                <Radio.Group value={editData?.PaymentType}>
                  <Radio value="Cash payment">Cash payment</Radio>
                  <Radio value="Bank Transfer">Bank Transfer</Radio>
                  <Radio value="Bank Draft/ Cheque">Bank Draft/ Cheque</Radio>
                  <Radio value="Credit Note">Credit Note</Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item<FieldType>
                name="Attachments"
                label="Attachments"
                rules={[
                  {
                    required: false,
                    message: "Please select Attachments",
                  },
                ]}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Checkbox
                      checked={attachmentCheckbox.Invoice}
                      defaultChecked={attachmentCheckbox.Invoice}
                      onChange={(e) => {
                        console.log("Invoice / Proposal", e.target.checked);
                        this.setState({
                          attachmentCheckbox: {
                            ...attachmentCheckbox,
                            Invoice: e.target.checked,
                          },
                        });
                        if (!e.target.checked) {
                          this.setState({
                            attachments: {
                              ...attachments,
                              Invoice: [],
                            },
                            postAttachments: {
                              ...postAttachments,
                              Invoice: [],
                            },
                            refNumber: {
                              ...refNumber,
                              Invoice: "",
                            },
                            refNumberError: {
                              ...refNumberError,
                              Invoice: "",
                            },
                          });
                        }
                      }}
                    >
                      Invoice / Proposal
                    </Checkbox>
                    {Invoice && (
                      <>
                        <div className="mt-2">
                          <div style={{ paddingBottom: "8px" }}>Ref#</div>
                          <Input
                            name="Invoice"
                            onChange={handleRef}
                            value={refNumber.Invoice}
                            status={refNumberError.Invoice}
                          />
                        </div>
                        <div className={`d-flex align-items-center mt-2 gap-3`}>
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
                              htmlFor="Invoice"
                            >
                              Attach Files
                            </label>
                            <input
                              type="file"
                              name="Invoice"
                              id="Invoice"
                              multiple={false}
                              accept="application/pdf"
                              style={{ display: "none" }}
                              onChange={handleChange}
                            ></input>
                          </button>

                          <div className={`ms-3 ${styles.title}`}>
                            {`${
                              attachments.Invoice?.length == 0
                                ? `No`
                                : attachments.Invoice?.length
                            } ${
                              attachments.Invoice?.length == 1
                                ? `File`
                                : `Files`
                            } Chosen`}
                          </div>
                        </div>

                        <div className="mt-3">
                          <p style={{ color: "#ff4d4f" }}>
                            {attachmentError.Invoice}
                          </p>
                          {attachments.Invoice?.length > 0 && (
                            <div
                              className={`p-2 mb-3 d-flex justify-content-between align-items-center ${styles.fileInfo}`}
                            >
                              <div className={styles.fileName}>
                                {attachments.Invoice[0]?.name}
                              </div>
                              <div className="d-flex align-items-center gap-3">
                                {editForm &&
                                  viewElement(attachments.Invoice[0]?.name)}
                                <div
                                  style={{ cursor: "pointer" }}
                                  className="text-danger px-2 fw-bold"
                                  onClick={() => {
                                    if (editForm) {
                                      this.deleteFiles(
                                        attachments.Invoice[0]?.name
                                      );
                                    }
                                    this.setState({
                                      attachments: {
                                        ...attachments,
                                        Invoice: [],
                                      },
                                      postAttachments: {
                                        ...postAttachments,
                                        Invoice: [],
                                      },
                                    });
                                  }}
                                >
                                  X
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Checkbox
                      checked={attachmentCheckbox.Aggrement}
                      defaultChecked={attachmentCheckbox.Aggrement}
                      onChange={(e) => {
                        console.log("Agreement / Contract", e.target.checked);
                        this.setState({
                          attachmentCheckbox: {
                            ...attachmentCheckbox,
                            Aggrement: e.target.checked,
                          },
                        });
                        if (!e.target.checked) {
                          this.setState({
                            attachments: {
                              ...attachments,
                              Aggrement: [],
                            },
                            postAttachments: {
                              ...postAttachments,
                              Aggrement: [],
                            },
                            refNumber: {
                              ...refNumber,
                              Aggrement: "",
                            },
                            refNumberError: {
                              ...refNumberError,
                              Aggrement: "",
                            },
                          });
                        }
                      }}
                    >
                      Agreement / Contract
                    </Checkbox>
                    {Aggrement && (
                      <>
                        <div className="mt-2">
                          <div style={{ paddingBottom: "8px" }}>Ref#</div>
                          <Input
                            name="Aggrement"
                            onChange={handleRef}
                            value={refNumber.Aggrement}
                            status={refNumberError.Aggrement}
                          />
                        </div>
                        <div className={`d-flex align-items-center mt-2 gap-3`}>
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
                              htmlFor="Aggrement"
                            >
                              Attach Files
                            </label>
                            <input
                              type="file"
                              name="Aggrement"
                              id="Aggrement"
                              accept="application/pdf"
                              multiple={false}
                              style={{ display: "none" }}
                              onChange={handleChange}
                            ></input>
                          </button>

                          <div className={`ms-3 ${styles.title}`}>
                            {`${
                              attachments.Aggrement?.length == 0
                                ? `No`
                                : attachments.Aggrement?.length
                            } ${
                              attachments.Aggrement?.length == 1
                                ? `File`
                                : `Files`
                            } Chosen`}
                          </div>
                        </div>

                        <div className="mt-3">
                          <p style={{ color: "#ff4d4f" }}>
                            {attachmentError.Aggrement}
                          </p>
                          {attachments.Aggrement?.length > 0 && (
                            <div
                              className={`p-2 mb-3 d-flex justify-content-between align-items-center ${styles.fileInfo}`}
                            >
                              <div className={styles.fileName}>
                                {attachments.Aggrement[0]?.name}
                              </div>
                              <div className="d-flex align-items-center gap-3">
                                {editForm &&
                                  viewElement(attachments.Aggrement[0]?.name)}
                                <div
                                  style={{ cursor: "pointer" }}
                                  className="text-danger px-2 fw-bold"
                                  onClick={() => {
                                    if (editForm) {
                                      this.deleteFiles(
                                        attachments.Aggrement[0]?.name
                                      );
                                    }
                                    this.setState({
                                      attachments: {
                                        ...attachments,
                                        Aggrement: [],
                                      },
                                      postAttachments: {
                                        ...postAttachments,
                                        Aggrement: [],
                                      },
                                    });
                                  }}
                                >
                                  X
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Checkbox
                      checked={attachmentCheckbox.SAPPO}
                      defaultChecked={attachmentCheckbox.SAPPO}
                      onChange={(e) => {
                        console.log("SAP PO", e.target.checked);
                        this.setState({
                          attachmentCheckbox: {
                            ...attachmentCheckbox,
                            SAPPO: e.target.checked,
                          },
                        });
                        if (!e.target.checked) {
                          this.setState({
                            attachments: {
                              ...attachments,
                              SAPPO: [],
                            },
                            postAttachments: {
                              ...postAttachments,
                              SAPPO: [],
                            },
                            refNumber: {
                              ...refNumber,
                              SAPPO: "",
                            },
                            refNumberError: {
                              ...refNumberError,
                              SAPPO: "",
                            },
                          });
                        }
                      }}
                    >
                      SAP PO
                    </Checkbox>
                    {SAPPO && (
                      <>
                        <div className="mt-2">
                          <div style={{ paddingBottom: "8px" }}>Ref#</div>
                          <Input
                            name="SAPPO"
                            onChange={handleRef}
                            value={refNumber.SAPPO}
                            status={refNumberError.SAPPO}
                          />
                        </div>
                        <div className={`d-flex align-items-center mt-2 gap-3`}>
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
                              htmlFor="SAPPO"
                            >
                              Attach Files
                            </label>
                            <input
                              type="file"
                              name="SAPPO"
                              id="SAPPO"
                              accept="application/pdf"
                              multiple={false}
                              style={{ display: "none" }}
                              onChange={handleChange}
                            ></input>
                          </button>

                          <div className={`ms-3 ${styles.title}`}>
                            {`${
                              attachments.SAPPO?.length == 0
                                ? `No`
                                : attachments.SAPPO?.length
                            } ${
                              attachments.SAPPO?.length == 1 ? `File` : `Files`
                            } Chosen`}
                          </div>
                        </div>

                        <div className="mt-3">
                          <p style={{ color: "#ff4d4f" }}>
                            {attachmentError.SAPPO}
                          </p>
                          {attachments.SAPPO?.length > 0 && (
                            <div
                              className={`p-2 mb-3 d-flex justify-content-between align-items-center ${styles.fileInfo}`}
                            >
                              <div className={styles.fileName}>
                                {attachments.SAPPO[0]?.name}
                              </div>
                              <div className="d-flex align-items-center gap-3">
                                {editForm &&
                                  viewElement(attachments.SAPPO[0]?.name)}
                                <div
                                  style={{ cursor: "pointer" }}
                                  className="text-danger px-2 fw-bold"
                                  onClick={() => {
                                    if (editForm) {
                                      this.deleteFiles(
                                        attachments.SAPPO[0]?.name
                                      );
                                    }
                                    this.setState({
                                      attachments: {
                                        ...attachments,
                                        SAPPO: [],
                                      },
                                      postAttachments: {
                                        ...postAttachments,
                                        SAPPO: [],
                                      },
                                    });
                                  }}
                                >
                                  X
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Checkbox
                      checked={attachmentCheckbox.SAPGR}
                      defaultChecked={attachmentCheckbox.SAPGR}
                      onChange={(e) => {
                        console.log("SAP GR", e.target.checked);
                        this.setState({
                          attachmentCheckbox: {
                            ...attachmentCheckbox,
                            SAPGR: e.target.checked,
                          },
                        });
                        if (!e.target.checked) {
                          this.setState({
                            attachments: {
                              ...attachments,
                              SAPGR: [],
                            },
                            postAttachments: {
                              ...postAttachments,
                              SAPGR: [],
                            },
                            refNumber: {
                              ...refNumber,
                              SAPGR: "",
                            },
                            refNumberError: {
                              ...refNumberError,
                              SAPGR: "",
                            },
                          });
                        }
                      }}
                    >
                      SAP GR
                    </Checkbox>
                    {SAPGR && (
                      <>
                        <div className="mt-2">
                          <div style={{ paddingBottom: "8px" }}>Ref#</div>
                          <Input
                            name="SAPGR"
                            onChange={handleRef}
                            value={refNumber.SAPGR}
                            status={refNumberError.SAPGR}
                          />
                        </div>
                        <div className={`d-flex align-items-center mt-2 gap-3`}>
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
                              htmlFor="SAPGR"
                            >
                              Attach Files
                            </label>
                            <input
                              type="file"
                              name="SAPGR"
                              id="SAPGR"
                              accept="application/pdf"
                              multiple={false}
                              style={{ display: "none" }}
                              onChange={handleChange}
                            ></input>
                          </button>

                          <div className={`ms-3 ${styles.title}`}>
                            {`${
                              attachments.SAPGR?.length == 0
                                ? `No`
                                : attachments.SAPGR?.length
                            } ${
                              attachments.SAPGR?.length == 1 ? `File` : `Files`
                            } Chosen`}
                          </div>
                        </div>

                        <div className="mt-3">
                          <p style={{ color: "#ff4d4f" }}>
                            {attachmentError.SAPGR}
                          </p>
                          {attachments.SAPGR?.length > 0 && (
                            <div
                              className={`p-2 mb-3 d-flex justify-content-between align-items-center ${styles.fileInfo}`}
                            >
                              <div className={styles.fileName}>
                                {attachments.SAPGR[0]?.name}
                              </div>
                              <div className="d-flex align-items-center gap-3">
                                {editForm &&
                                  viewElement(attachments.Aggrement[0]?.name)}
                                <div
                                  style={{ cursor: "pointer" }}
                                  className="text-danger px-2 fw-bold"
                                  onClick={() => {
                                    if (editForm) {
                                      this.deleteFiles(
                                        attachments.SAPGR[0]?.name
                                      );
                                    }
                                    this.setState({
                                      attachments: {
                                        ...attachments,
                                        SAPGR: [],
                                      },
                                      postAttachments: {
                                        ...postAttachments,
                                        SAPGR: [],
                                      },
                                    });
                                  }}
                                >
                                  X
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                    <Checkbox
                      checked={attachmentCheckbox.ApprovalDocument}
                      defaultChecked={attachmentCheckbox.ApprovalDocument}
                      onChange={(e) => {
                        console.log("Approval Document", e.target.checked);
                        this.setState({
                          attachmentCheckbox: {
                            ...attachmentCheckbox,
                            ApprovalDocument: e.target.checked,
                          },
                        });
                        if (!e.target.checked) {
                          this.setState({
                            attachments: {
                              ...attachments,
                              ApprovalDocument: [],
                            },
                            postAttachments: {
                              ...postAttachments,
                              ApprovalDocument: [],
                            },
                            refNumber: {
                              ...refNumber,
                              ApprovalDocument: "",
                            },
                            refNumberError: {
                              ...refNumberError,
                              ApprovalDocument: "",
                            },
                          });
                        }
                      }}
                    >
                      Approval Document
                    </Checkbox>
                    {ApprovalDocument && (
                      <>
                        <div className="mt-2">
                          <div style={{ paddingBottom: "8px" }}>Ref#</div>
                          <Input
                            name="ApprovalDocument"
                            onChange={handleRef}
                            value={refNumber.ApprovalDocument}
                            status={refNumberError.ApprovalDocument}
                          />
                        </div>
                        <div className={`d-flex align-items-center mt-2 gap-3`}>
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
                              htmlFor="ApprovalDocument"
                            >
                              Attach Files
                            </label>
                            <input
                              type="file"
                              name="ApprovalDocument"
                              id="ApprovalDocument"
                              accept="application/pdf"
                              multiple={false}
                              style={{ display: "none" }}
                              onChange={handleChange}
                            ></input>
                          </button>

                          <div className={`ms-3 ${styles.title}`}>
                            {`${
                              attachments.ApprovalDocument?.length == 0
                                ? `No`
                                : attachments.ApprovalDocument?.length
                            } ${
                              attachments.ApprovalDocument?.length == 1
                                ? `File`
                                : `Files`
                            } Chosen`}
                          </div>
                        </div>

                        <div className="mt-3">
                          <p style={{ color: "#ff4d4f" }}>
                            {attachmentError.ApprovalDocument}
                          </p>
                          {attachments.ApprovalDocument?.length > 0 && (
                            <div
                              className={`p-2 mb-3 d-flex justify-content-between align-items-center ${styles.fileInfo}`}
                            >
                              <div className={styles.fileName}>
                                {attachments.ApprovalDocument[0]?.name}
                              </div>
                              <div className="d-flex align-items-center gap-3">
                                {editForm &&
                                  viewElement(attachments.Aggrement[0]?.name)}
                                <div
                                  style={{ cursor: "pointer" }}
                                  className="text-danger px-2 fw-bold"
                                  onClick={() => {
                                    if (editForm) {
                                      this.deleteFiles(
                                        attachments.ApprovalDocument[0]?.name
                                      );
                                    }
                                    this.setState({
                                      attachments: {
                                        ...attachments,
                                        ApprovalDocument: [],
                                      },
                                      postAttachments: {
                                        ...postAttachments,
                                        ApprovalDocument: [],
                                      },
                                    });
                                  }}
                                >
                                  X
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item<FieldType>
                name="BeneficiaryName"
                label="Beneficiary Name"
                rules={[
                  {
                    required: false,
                    message: "Please select Beneficiary Name",
                  },
                ]}
              >
                <Select
                  className="flex-fill"
                  id="AssignedTo"
                  showSearch
                  value={nameSelected}
                  placeholder="Beneficiary Name...."
                  defaultActiveFirstOption={false}
                  showArrow={true}
                  filterOption={false}
                  onSearch={handleSearch}
                  onChange={handleNameChange}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Divider style={{ margin: "8px 0" }} />
                      <Space style={{ padding: "0 8px 4px" }}>
                        <Input
                          required
                          name="name"
                          value={benificiaryAddDetails.name}
                          placeholder="Please enter Name"
                          status={benificiaryError.name}
                          onChange={handleAddBenificiary}
                        />
                        <Input
                          required
                          name="bank"
                          value={benificiaryAddDetails.bank}
                          placeholder="Please enter Bank Name"
                          status={benificiaryError.bank}
                          onChange={handleAddBenificiary}
                        />
                        <Input
                          required
                          name="IBAN"
                          value={benificiaryAddDetails.IBAN}
                          placeholder="Please enter IBAN"
                          status={benificiaryError.IBAN}
                          onChange={handleAddBenificiary}
                        />
                        <Button danger onClick={addBenificiary}>
                          Add Benificiary
                        </Button>
                      </Space>
                    </>
                  )}
                  options={nameOptions?.map(
                    (data: { value: string; label: string }) => ({
                      value: data.value,
                      label: data.label,
                    })
                  )}
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
                  <div style={{ paddingBottom: "8px" }}>Beneficiary Bank</div>
                  <Input disabled value={benificiaryDetails?.bank} />
                </Col>
              </Row>

              <Row gutter={[16, 0]} className="mb-3">
                <Col
                  xs={24}
                  sm={24}
                  md={24}
                  lg={24}
                  xl={24}
                  className="marginBottom"
                >
                  <div style={{ paddingBottom: "8px" }}>Beneficiary IBAN</div>
                  <Input disabled value={benificiaryDetails?.IBAN} />
                </Col>
              </Row>

              <Form.Item<FieldType>
                label="SAP Vendor"
                name="SAPVendor"
                rules={[
                  {
                    required: false,
                    message: "Please enter SAP Vendor!",
                  },
                ]}
              >
                <Input placeholder="Enter SAP Vendor...." />
              </Form.Item>

              <Form.Item<FieldType>
                label="Purpose & Comments"
                name="PurposeComments"
                rules={[
                  {
                    required: true,
                    message: "Please enter Purpose & Comments!",
                  },
                ]}
              >
                <TextArea style={{ height: 120 }} maxLength={500} showCount />
              </Form.Item>

              <Row gutter={[16, 0]}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Form.Item<FieldType>
                    label="Amount"
                    name="Amount"
                    rules={[
                      {
                        required: true,
                        message: "Please enter Amount!",
                        pattern: new RegExp(/^[1-9]\d*(\.\d+)?$/),
                      },
                    ]}
                  >
                    <InputNumber
                      placeholder="Enter Amount...."
                      style={{ width: "100%" }}
                      value={amount}
                      min={0}
                      max={999999999999999}
                      addonAfter={selectAfter}
                      onChange={(value: number) => {
                        this.setState({
                          amount: parseFloat(Number(value).toFixed(2)),
                        });
                        if (!this.state.includeVAT) {
                          this.setState({
                            total: parseFloat(
                              Number(
                                parseFloat(Number(value).toFixed(2)) +
                                  (parseFloat(Number(value).toFixed(2)) *
                                    vatPercentage) /
                                    100
                              ).toFixed(2)
                            ),
                          });
                        } else {
                          this.setState({
                            total: parseFloat(Number(value).toFixed(2)),
                          });
                        }
                      }}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Form.Item label="Total">
                    <input
                      style={{
                        width: "100%",
                        padding: "0.2rem",
                        border: "1px solid #d1d1d1",
                      }}
                      className="px-2 rounded-2"
                      value={total}
                      onChange={(e) => {
                        e.stopPropagation();
                        this.setState({ total: total });
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]} className="mb-3">
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                  className="marginBottom"
                >
                  <div style={{ paddingBottom: "8px" }}>Include VAT</div>
                  <div className="d-flex gap-1">
                    <Radio
                      value="Yes"
                      checked={!this.state.includeVAT}
                      defaultChecked={true}
                      onClick={() => {
                        this.setState({
                          includeVAT: false,
                          total: parseFloat(
                            Number(
                              amount + (amount * vatPercentage) / 100
                            ).toFixed(2)
                          ),
                        });
                      }}
                    >
                      Yes
                    </Radio>
                    <Radio
                      value="No"
                      checked={this.state.includeVAT}
                      onClick={() => {
                        this.setState({ includeVAT: true, total: amount });
                      }}
                    >
                      No
                    </Radio>
                  </div>
                </Col>
                <Col
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                  className="marginBottom"
                >
                  <div style={{ paddingBottom: "8px" }}>VAT Percentage</div>
                  <div className="d-flex gap-1">
                    <Radio
                      value="15%"
                      checked={vatPercentage === 15}
                      defaultChecked={true}
                      onClick={() => {
                        this.setState({ vatPercentage: 15 });
                        if (!this.state.includeVAT) {
                          this.setState({
                            total: parseFloat(
                              Number(amount + (amount * 15) / 100).toFixed(2)
                            ),
                          });
                        }
                      }}
                    >
                      15%
                    </Radio>
                    <Radio
                      value="5%"
                      checked={vatPercentage === 5}
                      onClick={() => {
                        this.setState({ vatPercentage: 5 });
                        if (!this.state.includeVAT) {
                          this.setState({
                            total: parseFloat(
                              Number(amount + (amount * 5) / 100).toFixed(2)
                            ),
                          });
                        }
                      }}
                    >
                      5%
                    </Radio>
                  </div>
                </Col>
              </Row>

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

              <Form.Item<FieldType>
                name="PreviousApproval"
                label="Previous Approval"
                rules={[
                  {
                    required: true,
                    message: "Please select Previous Approval",
                  },
                ]}
              >
                <Row>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Checkbox
                      checked={ObtainedAttached}
                      onChange={(e) => {
                        console.log("Obtained & Attached", e.target.checked);
                        if (!e.target.checked) {
                          this.setState({
                            attachments: {
                              ...attachments,
                              ObtainedAttached: [],
                            },
                            postAttachments: {
                              ...postAttachments,
                              ObtainedAttached: [],
                            },
                            refNumber: {
                              ...refNumber,
                              ObtainedAttached: "ObtainedAttached",
                            },
                            refNumberError: {
                              ...refNumberError,
                              ObtainedAttached: "",
                            },
                          });
                        } else {
                          this.setState({
                            attachmentCheckbox: {
                              ...attachmentCheckbox,
                              ObtainedAttached: e.target.checked,
                              NoPreviousApproval: false,
                            },
                          });
                        }
                      }}
                    >
                      Obtained & Attached
                    </Checkbox>
                    {ObtainedAttached && (
                      <>
                        <div className="mt-2 d-none">
                          <div style={{ paddingBottom: "8px" }}>Ref#</div>
                          <Input
                            name="ObtainedAttached"
                            onChange={handleRef}
                            value={refNumber.ObtainedAttached}
                            status={refNumberError.ObtainedAttached}
                          />
                        </div>
                        <div className={`d-flex align-items-center mt-2 gap-3`}>
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
                              htmlFor="ObtainedAttached"
                            >
                              Attach Files
                            </label>
                            <input
                              type="file"
                              name="ObtainedAttached"
                              id="ObtainedAttached"
                              accept="application/pdf"
                              multiple={false}
                              style={{ display: "none" }}
                              onChange={handleChange}
                            ></input>
                          </button>

                          <div className={`ms-3 ${styles.title}`}>
                            {`${
                              attachments.ObtainedAttached?.length == 0
                                ? `No`
                                : attachments.ObtainedAttached?.length
                            } ${
                              attachments.ObtainedAttached?.length == 1
                                ? `File`
                                : `Files`
                            } Chosen`}
                          </div>
                        </div>

                        <div className="mt-3">
                          <p style={{ color: "#ff4d4f" }}>
                            {attachmentError.ObtainedAttached}
                          </p>
                          {attachments.ObtainedAttached?.length > 0 && (
                            <div
                              className={`p-2 mb-3 d-flex justify-content-between align-items-center ${styles.fileInfo}`}
                            >
                              <div className={styles.fileName}>
                                {attachments.ObtainedAttached[0]?.name}
                              </div>
                              <div className="d-flex align-items-center gap-3">
                                {editForm &&
                                  viewElement(
                                    attachments.ObtainedAttached[0]?.name
                                  )}
                                <div
                                  style={{ cursor: "pointer" }}
                                  className="text-danger px-2 fw-bold"
                                  onClick={() => {
                                    if (editForm) {
                                      this.deleteFiles(
                                        attachments.ObtainedAttached[0]?.name
                                      );
                                    }
                                    this.setState({
                                      attachments: {
                                        ...attachments,
                                        ObtainedAttached: [],
                                      },
                                      postAttachments: {
                                        ...postAttachments,
                                        ObtainedAttached: [],
                                      },
                                    });
                                  }}
                                >
                                  X
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Checkbox
                      checked={NoPreviousApproval}
                      onChange={(e) => {
                        console.log("No Previous Approval", e.target.checked);
                        this.setState({
                          attachmentCheckbox: {
                            ...attachmentCheckbox,
                            ObtainedAttached: false,
                            NoPreviousApproval: e.target.checked,
                          },
                          attachments: {
                            ...attachments,
                            ObtainedAttached: [],
                          },
                          postAttachments: {
                            ...postAttachments,
                            ObtainedAttached: [],
                          },
                        });
                      }}
                    >
                      No Previous Approval
                    </Checkbox>
                  </Col>
                </Row>
              </Form.Item>

              <Form.Item>
                <>
                  {!isSubmitting ? (
                    <div className="d-flex gap-2 justify-content-end">
                      {!editForm && (
                        <button
                          type="button"
                          className="text-white px-3 py-2 rounded"
                          style={{
                            border: "none",
                            backgroundColor: " rgb(181, 77, 38)",
                          }}
                          onClick={() => {
                            this.formRef?.current.resetFields();
                            this.setState({
                              isError: false,
                              errorMessage: "",
                              amount: 0,
                              vat: 0,
                              total: 0,
                              listId: 0,
                              submittingText: "",
                              isSubmitting: false,
                              amountInWord: "",
                              attachmentCheckbox: {
                                Invoice: false,
                                Aggrement: false,
                                SAPPO: false,
                                SAPGR: false,
                                ApprovalDocument: false,
                                ObtainedAttached: false,
                                NoPreviousApproval: false,
                              },
                              attachments: {
                                Invoice: [],
                                Aggrement: [],
                                SAPPO: [],
                                SAPGR: [],
                                ApprovalDocument: [],
                                ObtainedAttached: [],
                              },
                              postAttachments: {
                                Invoice: [],
                                Aggrement: [],
                                SAPPO: [],
                                SAPGR: [],
                                ApprovalDocument: [],
                                ObtainedAttached: [],
                              },
                              uploadAttachments: [],
                              renderInvoice: [],
                              nameSelected: "",
                              benificiaryDetails: {
                                name: "",
                                bank: "",
                                IBAN: "",
                              },
                              benificiaryAddDetails: {
                                name: "",
                                bank: "",
                                IBAN: "",
                              },
                              benificiaryError: {
                                name: "",
                                bank: "",
                                IBAN: "",
                              },
                              refNumber: {
                                Invoice: "",
                                Aggrement: "",
                                SAPPO: "",
                                SAPGR: "",
                                ApprovalDocument: "",
                                ObtainedAttached: "ObtainedAttached",
                              },
                              refNumberError: {
                                Invoice: "",
                                Aggrement: "",
                                SAPPO: "",
                                SAPGR: "",
                                ApprovalDocument: "",
                                ObtainedAttached: "",
                              },
                              attachmentError: {
                                Invoice: "",
                                Aggrement: "",
                                SAPPO: "",
                                SAPGR: "",
                                ApprovalDocument: "",
                                ObtainedAttached: "",
                              },
                              isNotificationOpen: false,
                              currencySelected: "SAR",
                              includeVAT: false,
                            });
                          }}
                        >
                          Reset Form
                        </button>
                      )}
                      <button
                        type="submit"
                        className="text-white px-3 py-2 rounded"
                        style={{
                          border: "none",
                          backgroundColor: " rgb(181, 77, 38)",
                        }}
                      >
                        {editForm ? "Update and Approve" : "Submit"}
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
                {submittingText === "Updating Beneficiary...." ||
                submittingText === "Creating Payment Request." ||
                submittingText === "Updating Payment Request." ? (
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
