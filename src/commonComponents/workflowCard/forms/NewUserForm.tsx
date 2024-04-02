import { WebPartContext } from "@microsoft/sp-webpart-base";
import * as React from "react";
import "./index.css";
import { Col, Form, Input, Modal, Radio, Row, Select } from "antd";
import { SPHttpClient, ISPHttpClientOptions } from "@microsoft/sp-http";

export interface INewUserFormProps {
  self: any;
  title: string;
  context: WebPartContext;
  modalOpen: boolean;
  handleClose: () => void;
  headerLogo: any;
  userCreationApprovers: any;
  selectedPersonDetails: {
    name: string;
    email: string;
    department: string;
    jobTitle: string;
    businessPhones: string;
    manager: string;
    managerEmail: string;
  };
}
interface INewUserFormState {
  user: any;
  isSubmitting: boolean;
  isNotificationOpen: boolean;
  submittingText: string;
  EmployeeType: string;
  EmailSyntax: string;
  RequestType: {
    Email: boolean;
    VPN: boolean;
  };
  EmailCopy: string;
  VPNAccess: boolean;
  isError: boolean;
  errorMessage: string;
  validEmployeeNo: boolean;
  validEmployeeUserName: string;
}
interface FieldType {
  department: string;
  date: string;
  email: string;
  loginName: string;
  EmailType: string;
  InternetAccess: string;
  remarks: string;
  ITSM: string;
}
export default class NewUserForm extends React.Component<
  INewUserFormProps,
  INewUserFormState
> {
  public formRef: any;
  public constructor(props: INewUserFormProps, state: INewUserFormState) {
    super(props);
    this.state = {
      user: {
        department: "",
        email: "",
        date: "",
        loginName: "",
        emailType: { internal: false, internalExternal: false },
        internetAccess: { Yes: false, No: false },
        remarks: "",
        itsm: "",
      },
      EmailSyntax: "@riyadh-cables.com",
      EmployeeType: "",
      isSubmitting: false,
      submittingText: "User is being created.....",
      isNotificationOpen: false,
      RequestType: {
        Email: false,
        VPN: false,
      },
      EmailCopy: "",
      VPNAccess: false,
      isError: false,
      errorMessage: "",
      validEmployeeNo: false,
      validEmployeeUserName: ""
    };
    this.formRef = React.createRef();
  }
  public componentDidMount(): void {}

  public render(): React.ReactElement<INewUserFormProps> {
    const {
      modalOpen,
      title,
      handleClose,
      userCreationApprovers,
      selectedPersonDetails,
    } = this.props;
    const {
      isSubmitting,
      submittingText,
      isNotificationOpen,
      EmailSyntax,
      EmployeeType,
      RequestType,
      VPNAccess,
      isError,
      errorMessage,
      validEmployeeUserName
    } = this.state;
    console.log("userCreationApprovers", userCreationApprovers);

    const handleEmployeeType = (Type: string) => {
      this.setState({ EmployeeType: Type });
      if (Type === "External User") {
        this.setState({ VPNAccess: true });
      }
    };

    const domainOptions = [
      { value: "@riyadh-cables.com", label: "@riyadh-cables.com" },
      { value: "@nci.com", label: "@nci.com" },
      { value: "@alrowadcable.com", label: "@alrowadcable.com" },
    ];

    const postUser = async (values: any) => {
      const { context } = this.props;
      const {
        department,
        email,
        loginName,
        InternetAccess,
        remarks,
        ITSM,
        EmployeeNo,
        VPN,
        VPNAccess,
        EmailAddress,
      } = values;
      const CreatorDepartment =
        department == undefined ? selectedPersonDetails.department : department;
      const headers: any = {
        "X-HTTP-Method": "POST",
        "If-Match": "*",
      };
      const spHttpClintOptions: ISPHttpClientOptions = {
        headers,
        body: JSON.stringify({
          Title: EmployeeType === "External User" ? VPN : email? email + EmailSyntax : VPN? VPN : EmployeeNo,
          LoginName: loginName,
          Date: new Date().toString(),
          Department: CreatorDepartment,
          ITSM: ITSM ? ITSM : "",
          Remarks: remarks ? remarks : "",
          EmployeeType: EmployeeType,
          EmployeeNo: EmployeeType !== "External User" ? EmployeeNo : "",
          InternetAccess:
            EmployeeType !== "External User" ? InternetAccess : "",
          VPN: VPN,
          BusinessApprovarEmail:
            selectedPersonDetails.managerEmail === ""
              ? userCreationApprovers.BusinessApproverEmail
              : selectedPersonDetails.managerEmail,
          IsEmail: EmployeeType !== "External User" ? EmailAddress : "",
          IsVPN: EmployeeType === "External User" ? "Yes": VPNAccess,
          CreatedBy: context.pageContext.user.displayName,
          PendingWith:
            selectedPersonDetails.manager === ""
              ? userCreationApprovers?.BusinessApprover
              : selectedPersonDetails.manager,
          BusinessApprovar:
            selectedPersonDetails.manager === ""
              ? userCreationApprovers?.BusinessApprover
              : selectedPersonDetails.manager,
          ITApprovar: userCreationApprovers?.ITApprover,
          AdditionalITApprovar: userCreationApprovers?.AdditionalITApprovar,
          ITTechnician: userCreationApprovers?.ITTechnicianName,
          PendingDepartment: "Business Approver",
        }),
      };
      const postResponse = await context.spHttpClient.post(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('NewUser')/items`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      );
      if (postResponse.ok) {
        const postData = await postResponse?.json();
        getNewUserRequest(postData.ID, CreatorDepartment);
      } else {
        this.setState({
          isSubmitting: false,
          errorMessage: "User creation failed! Please try again.",
          isError: true,
          isNotificationOpen: false
        })
        console.log("Post Failed", postResponse);
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
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('NewUser')/items('${ID}')`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      );
      if (postResponse.ok) {
        console.log("Form Element", this.formRef);
        setTimeout(() => {
          console.log("User Created");
          this.setState({
            isSubmitting: false,
            submittingText: `The request is created`,
            isError: false,
            isNotificationOpen: true,
          });
          this.formRef?.current.resetFields();
          this.setState({
            EmployeeType: "",
            validEmployeeUserName: "",
            RequestType: {VPN: false, Email:false} 
          });
        }, 1000);
      } else {
        // alert("New User Creation Failed.");
        this.setState({
          isSubmitting: false,
          errorMessage: `Unknown Error! Please refresh the page.`,
          isError: true,
          isNotificationOpen: false
        });
        console.log("Post Failed", postResponse);
      }
    };

    const checkIfValidEmployeeNo = async(EmployeeNo: string) => {
      let regex = new RegExp(/^\d{6}$/);
      let alreadyRequested = false;
      let errorType = "";
      if(EmployeeNo && EmployeeNo.length != 6) {
        this.setState({
          validEmployeeNo: false,
          validEmployeeUserName: "-- Invalid User --"
        });
      }
      if(regex.test(EmployeeNo) && EmployeeType !== "External User"){
        try {
          const graphClient =
            await this.props.context.msGraphClientFactory.getClient("3");
          const userEmpID = await graphClient
            .api("/users")
            .version("v1.0")
            .select("displayName,department,jobTitle,mail,mobilePhone,employeeId")
            .filter(`employeeId eq '${EmployeeNo}'`)
            .get();
          if (userEmpID.value && userEmpID.value.length > 0) {
            if(userEmpID.value[0].department === selectedPersonDetails.department){
              this.setState({
                validEmployeeNo: true,
                validEmployeeUserName: userEmpID.value[0].displayName + ` (${userEmpID.value[0].department})`
              });
            }
            else{
              alreadyRequested = true;
              errorType =  "Employee does not belong to your Department";
              this.setState({
                validEmployeeNo: false,
                validEmployeeUserName: userEmpID.value[0].displayName + ` (${userEmpID.value[0].department})`
              });
            }
          }
          else {
            alreadyRequested = true;
            errorType =  "Employee No is invalid";
            this.setState({
              validEmployeeNo: false,
              validEmployeeUserName: "-- Invalid User --"
            });
          }
        } catch (error) {
          console.error("Error in FetchUser:", error);
          alreadyRequested = true;
          errorType =  "Failed to Connect to server!";
          this.setState({
            validEmployeeNo: false,
            validEmployeeUserName: "-- Failed to Connect --"
          });
        }
      }
      return {alreadyRequested, errorType};
    }

    const getNewUserRequest = async (ID: number, CreatorDepartment: string) => {
      const { context } = this.props;
      const Response = await context.spHttpClient.get(
        `${
          context.pageContext.web.absoluteUrl
        }/_api/web/lists/GetByTitle('NewUser')/items?$select=ID,Date,Department,ReferenceNumber${
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
          mergeRef(ID, CreatorDepartment, TotalCount);
        } else {
          mergeRef(ID, CreatorDepartment, 1);
        }
      } else {
        console.log(`Error in PaymentRequest Fetch ${Response.status}`);
      }
    };

    const getUserByID = async (
      EmployeeNo: string,
      Email: string,
      values: {
        InternetAccess: string;
        VPNAccess: string;
        EmailAddress: string;
      },
      emailid: string
    ) => {
      const { context } = this.props;
      let alreadyRequested = false;
      let errorType = "";

      try {
        const filterQuery =
        "&$filter=(Status eq 'Open' or Status eq 'User Created') and " +
          (EmployeeType === "External User"
            ? `(Title eq '${encodeURIComponent(Email)}')`
            : `(EmployeeNo eq ${encodeURIComponent(EmployeeNo)})${emailid?` or (Title eq '${encodeURIComponent(emailid + EmailSyntax)}')`:""}${Email?` or (VPN eq '${encodeURIComponent(Email)}')`:""}`);

        const apiUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('NewUser')/items?$select=Title,EmployeeNo,EmployeeType,IsEmail,IsVPN,VPN,InternetAccess${filterQuery}`;
            
        let EmployeeValidation = await checkIfValidEmployeeNo(EmployeeNo);

        alreadyRequested = EmployeeValidation.alreadyRequested;
        errorType = EmployeeValidation.errorType;

        if(EmployeeType !== "External User" && emailid && !alreadyRequested) {
          const graphClient =
            await this.props.context.msGraphClientFactory.getClient("3");
          const userDetails = await graphClient
            .api("/users")
            .version("v1.0")
            .select("displayName,jobTitle,mail,mobilePhone,employeeId")
            .filter("startswith(userPrincipalName, '" + emailid + "')")
            .get();
          // const userEmpID = await graphClient
          //   .api("/users")
          //   .version("v1.0")
          //   .select("displayName,jobTitle,mail,mobilePhone,employeeId")
          //   .filter("startswith(employeeId, '" + EmployeeNo + "')")
          //   .get();
          // console.log("userEmpDetails", userEmpID);
          if (userDetails.value?.length > 0) {
            if (userDetails.value.find((user: any) => user.mail.toLowerCase() === (emailid + EmailSyntax).toLowerCase() && EmployeeNo == user.employeeId)) {
              alreadyRequested = true;
              errorType = "Requested Email already exist in Active Directory for the same user!";
            }
            else if (userDetails.value.find((user: any) => user.mail.toLowerCase() === (emailid + EmailSyntax).toLowerCase())) {
              alreadyRequested = true;
              errorType = "User Email already exist in Active Directory for another user!";
            }
          }
          // if (userEmpID.value?.length > 0) {
          //   if (userEmpID.value.find((user: any) => user.mail.toLowerCase() === emailid.toLowerCase())) {
          //     alreadyRequested = true;
          //     errorType = "User Email already exist in Active Directory for this Employee Number!";
          //   }
          // }
        }

        console.log("EmailValue", Email, alreadyRequested);
        if(EmployeeType !== "External User" && Email && Email.length > 0 && !alreadyRequested) {
          const graphClient =
          await this.props.context.msGraphClientFactory.getClient("3");
          const userDetailsforVpn = await graphClient
            .api("/users")
            .version("v1.0")
            .select("displayName,jobTitle,mail,mobilePhone,employeeId")
            .filter("startswith(userPrincipalName, '" + Email + "')")
            .get();

          if (userDetailsforVpn.value?.length > 0) {
            if (userDetailsforVpn.value.find((user: any) => user.mail.toLowerCase() === (Email).toLowerCase())) {
              alreadyRequested = true;
              errorType = "Requested VPN Email already exist in Active Directory!";
            }
          }
        }

        let regex = new RegExp(
          /^([a-zA-Z0-9\._]{3,})+@riyadh-cables.com$|@nci.com$|@alrowadcable.com$/
        )
        
        if (EmployeeType === "External User" && Email && regex.test(Email) && !alreadyRequested) {
          alreadyRequested = true;
          errorType =
            "VPN Address cannot contain Company domains. Kindly use an external email address";
        }
        else if(!alreadyRequested) {
          const userResponse = await context.spHttpClient.get(
            apiUrl,
            SPHttpClient.configurations.v1
          );
          const userData = await userResponse.json();
          console.log("USER EXISTING", userData);
          if (userData.value?.length) {

            if (EmployeeType === "External User") {
              alreadyRequested = true;
              errorType = "User Creation Limit Exceeded.";
            } else {
              let userDataFinal = {
                IsEmail: "No",
                IsVPN: "No",
                InternetAccess: "No",
                VPNAddresstaken: "No"
              }
              userData.value.map((user:any) => {
                if(user.IsEmail == "Yes" && EmployeeNo == user.EmployeeNo){
                  userDataFinal.IsEmail = "Yes";
                }
                if(user.IsVPN == "Yes" && EmployeeNo == user.EmployeeNo){
                  userDataFinal.IsVPN = "Yes";
                }
                if(user.InternetAccess == "Yes" && EmployeeNo == user.EmployeeNo){
                  userDataFinal.InternetAccess = "Yes";
                }
                if(user.VPN == Email){
                  userDataFinal.VPNAddresstaken = "Yes";
                }
              })
              const { IsEmail, IsVPN, InternetAccess, VPNAddresstaken } = userDataFinal;

              const {
                InternetAccess: userInternetAccess,
                EmailAddress: userEmail,
                VPNAccess: userVPNAccess,
              } = values;

              if(userEmail == "Yes" &&  userData.value.find((request: any) => request.Title.toLowerCase() === (emailid + EmailSyntax).toLowerCase())) {
                alreadyRequested = true;
                errorType =
                  "Request for this Email Address already exist.";
              }

              if (userInternetAccess === "Yes" && InternetAccess === "Yes") {
                alreadyRequested = true;
                errorType =
                  "Internet Access has already been requested for this employee.";
              } else if (userEmail === "Yes" && IsEmail === "Yes" && EmployeeType == "New Employee") {
                alreadyRequested = true;
                errorType =
                  "Email Address has already been requested for this employee.";
              } else if (userVPNAccess === "Yes" && !regex.test(Email)) {
                alreadyRequested = true;
                errorType =
                  "VPN Address must be a valid local domain.";
              } else if (userVPNAccess === "Yes" && IsVPN === "Yes") {
                alreadyRequested = true;
                errorType =
                  "VPN Address has already been requested for this employee.";
              } else if (userVPNAccess === "Yes" && VPNAddresstaken == "Yes") {
                alreadyRequested = true;
                errorType =
                  "VPN Address is already requested by another employee.";
              }
            }
            return {
              alreadyRequested,
              errorType,
            };
          } 
        }
        
        return {
          alreadyRequested,
          errorType,
        };
      } catch (error) {
        console.error("Error in FetchUser:", error);
        alreadyRequested = true;
        errorType = "Unknown Error!";
        return {
          alreadyRequested,
          errorType,
        };
      }
    };

    const onFinish = async (values: any) => {
      console.log("Success:", values, EmailSyntax, EmployeeType);
      this.setState({
        isSubmitting: true,
        isNotificationOpen: true,
        isError: false,
        submittingText: "User is being created....."
      })
      const existingCheck = await getUserByID(
        values.EmployeeNo,
        values.VPN,
        values,
        values.email
      );
      console.log("CHECK", existingCheck);
      if (existingCheck.alreadyRequested) {
        this.setState({
          isError: true,
          errorMessage: existingCheck.errorType,
          isSubmitting: false,
          isNotificationOpen: false
        });
      } else if (
        values.EmailAddress === "No" &&
        values.VPNAccess === "No" &&
        values.InternetAccess === "No"
      ) {
        this.setState({
          isError: true,
          errorMessage: "Must select one request type,",
          isNotificationOpen: false,
          isSubmitting: false,
        });
      } else {
        this.setState({
          isSubmitting: true,
          isError: false,
          isNotificationOpen: true,
          submittingText: "User is being created....." 
        });
        postUser(values);
      }
    };

    const onFinishFailed = (errorInfo: any) => {
      console.log("Failed:", errorInfo);
    };

    const selectAfter = (
      <Select
        style={{ width: 250 }}
        aria-required
        defaultValue={"@riyadh-cables.com"}
        value={EmailSyntax}
        onChange={(newValue: string) => {
          this.setState({ EmailSyntax: newValue });
        }}
        options={domainOptions?.map(
          (data: { value: string; label: string }) => ({
            value: data.value,
            label: data.label,
          })
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
            <h4 className="text-center  pt-3">New User Creation Request</h4>
            <Form
              name="basic"
              layout="vertical"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              ref={this.formRef}
              autoComplete="off"
              style={{
                padding: "1rem",
              }}
            >
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Form.Item<FieldType>
                    label="Department"
                    name="department"
                    rules={[
                      {
                        required: false,
                        message: "Please enter your Department!",
                      },
                    ]}
                  >
                    <Input
                      placeholder="Enter Your Department...."
                      disabled
                      defaultValue={selectedPersonDetails.department}
                    />
                  </Form.Item>
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

              <Form.Item<FieldType>
                name="RequestFor"
                label="Request For"
                rules={[
                  {
                    required: true,
                    message: "Please select Request For",
                  },
                ]}
              >
                <Radio.Group>
                  <Radio
                    value="New Employee"
                    onClick={() => {
                      handleEmployeeType("New Employee");
                    }}
                  >
                    New Employee
                  </Radio>
                  <Radio
                    value="Existing Employee"
                    onClick={() => {
                      handleEmployeeType("Existing Employee");
                    }}
                  >
                    Existing Employee
                  </Radio>
                  <Radio
                    value="External User"
                    onClick={() => {
                      handleEmployeeType("External User");
                    }}
                  >
                    External User
                  </Radio>
                </Radio.Group>
              </Form.Item>

              <Form.Item<FieldType>
                label="Requester name"
                name="loginName"
                rules={[
                  {
                    required: true,
                    message: "Please enter Requester name!",
                  },
                ]}
              >
                <Input placeholder="Enter Requester name...." />
              </Form.Item>

              {EmployeeType === "Existing Employee" ||
              EmployeeType === "New Employee" ? (
                <>
                  <Row gutter={[16, 0]}>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <Form.Item<FieldType>
                        label="Employee No"
                        name="EmployeeNo"
                        rules={[
                          {
                            required: true,
                            message: "Please enter valid Employee No!",
                            pattern: new RegExp(/^\d{6}$/),
                          },
                        ]}
                      >
                        <Input onChange={(event: any) => checkIfValidEmployeeNo(event.target.value)} placeholder="Enter Employee No...." />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                        <div className="pb-2">
                          <label>Employee Name</label>
                        </div>
                        <Input
                          readOnly={true}
                          value={validEmployeeUserName}
                        />
                    </Col>
                  </Row>

                  <Form.Item<FieldType>
                    name="RequestType"
                    label="Request Type"
                    rules={[
                      {
                        required: false,
                        message: "Please select Request Type",
                      },
                    ]}
                  >
                    <Row gutter={[16, 16]}>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item<FieldType>
                          name="EmailAddress"
                          label="Email Address"
                          rules={[
                            {
                              required: true,
                              message: "Please select Email Address",
                            },
                          ]}
                        >
                          <Radio.Group>
                            <Radio
                              value="Yes"
                              onClick={() => {
                                this.setState({
                                  RequestType: { ...RequestType, Email: true },
                                });
                              }}
                            >
                              Yes
                            </Radio>
                            <Radio
                              value="No"
                              onClick={() => {
                                this.setState({
                                  RequestType: { ...RequestType, Email: false },
                                });
                              }}
                            >
                              No
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                        {RequestType.Email && (
                          <Form.Item<FieldType>
                            label="Email Address"
                            name="email"
                            rules={[
                              {
                                required: true,
                                message: "Please Enter Valid Email Addres!",
                                pattern: new RegExp(/^([a-zA-Z0-9\._]{3,})+$/),
                              },
                            ]}
                          >
                            <Input
                              addonAfter={selectAfter}
                              placeholder="Enter Email Display Name...."
                            />
                          </Form.Item>
                        )}
                      </Col>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <Form.Item<FieldType>
                          name="VPNAccess"
                          label="VPN Access"
                          rules={[
                            {
                              required: true,
                              message: "Please select VPN Access",
                            },
                          ]}
                        >
                          <Radio.Group>
                            <Radio
                              value="Yes"
                              onClick={() => {
                                this.setState({
                                  RequestType: { ...RequestType, VPN: true },
                                });
                              }}
                            >
                              Yes
                            </Radio>
                            <Radio
                              value="No"
                              onClick={() => {
                                this.setState({
                                  RequestType: { ...RequestType, VPN: false },
                                });
                              }}
                            >
                              No
                            </Radio>
                          </Radio.Group>
                        </Form.Item>
                        {RequestType.VPN && (
                          <Form.Item<FieldType>
                            label="Local Email Address"
                            name="VPN"
                            rules={[
                              {
                                required: true,
                                message:
                                  "Please Enter Valid Local Email Address!",
                                pattern: new RegExp(
                                  /^([a-zA-Z0-9\._]{3,})+@riyadh-cables.com$|@nci.com$|@alrowadcable.com$/
                                ),
                              },
                            ]}
                          >
                            <Input placeholder="Enter Local Email Address...." />
                          </Form.Item>
                        )}
                      </Col>
                    </Row>
                  </Form.Item>
                </>
              ) : (
                <>
                  {EmployeeType === "External User" && (
                    <Form.Item<FieldType>
                      name="RequestType"
                      label="Request Type"
                      rules={[
                        {
                          required: false,
                          message: "Please select Request Type",
                        },
                      ]}
                    >
                      <Row gutter={[16, 16]}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          <Form.Item<FieldType>
                            name="VPNAccess"
                            label="VPN Access"
                            rules={[
                              {
                                required: false,
                                message: "Please select VPN Access",
                              },
                            ]}
                          >
                            <Radio
                              value="Yes"
                              checked={true}
                              defaultChecked={true}
                              onClick={() => {
                                this.setState({
                                  VPNAccess: true,
                                });
                              }}
                            >
                              Yes
                            </Radio>
                          </Form.Item>
                          {VPNAccess && (
                            <Form.Item<FieldType>
                              label="External Email Address"
                              name="VPN"
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Please Enter Valid External Email Address!",
                                  pattern: new RegExp(
                                    /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
                                  ),
                                },
                              ]}
                            >
                              <Input placeholder="Enter External Email Address...." />
                            </Form.Item>
                          )}
                        </Col>
                      </Row>
                    </Form.Item>
                  )}
                </>
              )}

              {EmployeeType === "Existing Employee" ||
              EmployeeType === "New Employee" ? (
                <Form.Item<FieldType>
                  name="InternetAccess"
                  label="Internet Access"
                  rules={[
                    {
                      required: true,
                      message: "Please select Internet Access",
                    },
                  ]}
                >
                  <Radio.Group>
                    <Radio value="Yes">Yes</Radio>
                    <Radio value="No">No</Radio>
                  </Radio.Group>
                </Form.Item>
              ) : (
                <></>
              )}

              <Form.Item<FieldType>
                label="Remarks"
                name="remarks"
                rules={[
                  {
                    required: false,
                    message: "Please enter Remarks!",
                  },
                ]}
              >
                <Input placeholder="Enter Remarks...." />
              </Form.Item>

              <Form.Item<FieldType>
                label="ITSM"
                name="ITSM"
                rules={[
                  {
                    required: false,
                    message: "Please enter ITSM!",
                  },
                ]}
              >
                <Input placeholder="Enter ITSM...." />
              </Form.Item>

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
                          this.setState({ 
                            EmployeeType: "",
                            validEmployeeUserName: "",
                            RequestType: {VPN: false, Email:false}
                          });
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
                {submittingText === "User is being created....." ? (
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
