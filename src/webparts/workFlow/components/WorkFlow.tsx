import * as React from "react";
import { IWorkFlowProps } from "./IWorkFlowProps";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { UserProvider } from "../../../service/UserContext";
import { Col, Row } from "antd";
import WorkflowCard from "../../../commonComponents/workflowCard/WorkflowCard";
import WorkflowTask from "../../../commonComponents/workflowCard/WorkflowTask";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import "../../global.css";

interface IWorkFlowState {
  isAdmin: boolean;
  screenWidth: number;
  workFlowData: any;
  newUserData: any;
  loanRequestData: any;
  PaymentRequestData: any;
  PaymentRequestInitiators: boolean;
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

export default class WorkFlow extends React.Component<
  IWorkFlowProps,
  IWorkFlowState
> {
  public scrollRef: any;
  public constructor(props: IWorkFlowProps, state: IWorkFlowState) {
    super(props);
    this.state = {
      isAdmin: false,
      screenWidth: window.screen.availWidth,
      workFlowData: [],
      newUserData: [],
      loanRequestData: [],
      PaymentRequestData: [],
      PaymentRequestInitiators: false,
      selectedPersonDetails: {
        name: "",
        email: "",
        department: "",
        jobTitle: "",
        businessPhones: "",
        manager: "",
        managerEmail: "",
      },
    };
    this.scrollRef = React.createRef();
  }
  public componentDidMount(): void {
    setTimeout(() => {
      console.log("scrollRef", this.scrollRef);
      if (this.scrollRef)
        this.scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1000);

    this.getDetails();
    this.getUserDetails();
    this.getPaymentRequestInitiators();
    this.getNewUser();
    this.getLoanRequest();
    this.getPaymentRequest();
    let ScreenWidth: any = window.screen.availWidth;
    console.log(ScreenWidth, "ScreenWidth");
    this.setState({ screenWidth: ScreenWidth });
  }

  public getPaymentRequestInitiators() {
    const { context } = this.props;

    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('PaymentRequestDepartments')/items?$select=*`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        if (!res.ok) {
          throw new Error(`HTTP request failed with status ${res.status}`);
        }

        console.log("PaymentRequestInitiators Success");
        return res.json();
      })
      .then((listItems: any) => {
        console.log("Res PaymentRequestInitiators", listItems);

        const isPaymentInitiator = listItems.value?.filter(
          (data: { Creator: string }) =>
            data.Creator?.toLowerCase() ===
            context.pageContext.user.displayName.toLowerCase()
        );

        console.log("isPaymentInitiator", isPaymentInitiator);

        this.setState({
          PaymentRequestInitiators: isPaymentInitiator?.length > 0,
        });
      })
      .catch((error) => {
        console.error("Error fetching PaymentRequestInitiators", error);
      });
  }

  public getUserDetails(): void {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Admin')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(`Error in Admin Fetch ${res.status}`);
          return;
        }
      })
      .then((listItems: { value: any[] }) => {
        const approvedItems: Array<{ Title: string; ApprovalStatus: string }> =
          listItems.value.filter(
            (items: { ApprovalStatus: string }) =>
              items.ApprovalStatus === "Approved"
          );
        let adminList = approvedItems.map((item: any) => item.Title);
        if (adminList.length > 0) {
          let filteredAdminList = adminList.filter(
            (item: string) => item === context.pageContext.user.email
          );
          if (filteredAdminList.length === 0) {
            this.setState({ isAdmin: false });
          } else {
            this.setState({ isAdmin: true });
          }
        } else {
          console.log("Admin Not Found");
        }
      });
  }

  public getWorkFlow = () => {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('WorkFlow')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(`Error in WorkFlow Fetch ${res.status}`);
          return;
        }
      })
      .then((listItems: { value: any[] }) => {
        console.log("WorkFlow", listItems.value);
        this.setState({ workFlowData: listItems.value });
      });
  };

  public getNewUser = () => {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('NewUser')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(`Error in NewUser Fetch ${res.status}`);
          return;
        }
      })
      .then((listItems: { value: any[] }) => {
        console.log("NewUser", listItems.value);
        const sortedItems: any[] = listItems.value?.sort(
          (a: { Created: string }, b: { Created: string }) =>
            new Date(b.Created).getTime() - new Date(a.Created).getTime()
        );
        this.setState({ newUserData: sortedItems });
      });
  };

  public getLoanRequest = () => {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('LoanRequest')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(`Error in NewUser Fetch ${res.status}`);
          return;
        }
      })
      .then((listItems: { value: any[] }) => {
        console.log("Loan Request", listItems.value);
        const sortedItems: any[] = listItems.value?.sort(
          (a: { Created: string }, b: { Created: string }) =>
            new Date(b.Created).getTime() - new Date(a.Created).getTime()
        );
        this.setState({ loanRequestData: sortedItems });
      });
  };

  public getPaymentRequest = () => {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('PaymentRequest')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(`Error in PaymentRequest Fetch ${res.status}`);
          return;
        }
      })
      .then((listItems: { value: any[] }) => {
        console.log("PaymentRequest", listItems.value);
        const sortedItems: any[] = listItems.value?.sort(
          (a: { Created: string }, b: { Created: string }) =>
            new Date(b.Created).getTime() - new Date(a.Created).getTime()
        );
        this.setState({ PaymentRequestData: sortedItems });
        console.log(
          "AttachmenJson",
          JSON.parse(sortedItems[0].AttachmentsJSON)
        );
      });
  };

  public getDetails() {
    const { context } = this.props;
    context.msGraphClientFactory
      .getClient("3")
      .then((grahpClient: MSGraphClientV3): void => {
        grahpClient
          .api(`/users/${context.pageContext.user.email}`)
          .version("v1.0")
          .select(
            "department,jobTitle,businessPhones,displayName,userPrincipalName"
          )
          .get((error: any, user: any, rawResponse?: any) => {
            if (error) {
              console.log("User Error Msg:", error);
              return;
            }
            grahpClient
              .api("me/manager")
              .version("v1.0")
              .select("*")
              .get((error: any, directReports: any, rawResponse?: any) => {
                if (error) {
                  console.log("directManager Error Msg:", error);
                  console.log("Selected User Details", user);
                  this.setState({
                    selectedPersonDetails: {
                      name: user.displayName,
                      email: user.userPrincipalName,
                      department: user.department,
                      jobTitle: user.jobTitle,
                      businessPhones: user.businessPhones[0],
                      manager: "",
                      managerEmail: "",
                    },
                  });
                  return;
                } else {
                  console.log("Selected User Details", user);
                  this.setState({
                    selectedPersonDetails: {
                      name: user.displayName,
                      email: user.userPrincipalName,
                      department: user.department,
                      jobTitle: user.jobTitle,
                      businessPhones: user.businessPhones[0],
                      manager: directReports.displayName,
                      managerEmail: directReports.userPrincipalName,
                    },
                  });
                }
                console.log("directManager", directReports);
              });
          });
      });
  }

  public render(): React.ReactElement<IWorkFlowProps> {
    const bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    const fa =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
    let Avenir = `${this.props.context.pageContext.site.absoluteUrl}/SiteAssets/font/styles.css`;

    SPComponentLoader.loadCss(bootstarp5CSS);
    SPComponentLoader.loadCss(fa);
    SPComponentLoader.loadCss(Avenir);

    const { context } = this.props;
    const {
      isAdmin,
      screenWidth,
      workFlowData,
      newUserData,
      loanRequestData,
      PaymentRequestData,
      selectedPersonDetails,
      PaymentRequestInitiators,
    } = this.state;
    const workflow = require("../assets/workflow.png");
    const UserName = context.pageContext.user.displayName;
    const UserEmail = context.pageContext.user.email;

    return (
      <UserProvider
        value={{
          name: UserName,
          email: UserEmail,
          isAdmin: isAdmin,
          isSmallScreen: screenWidth < 767 ? true : false,
        }}
      >
        <main
          className="detailsContainer"
          style={{
            paddingRight: "0px",
            paddingLeft: "0px",
            fontFamily: "Avenir Next",
          }}
        >
          <Row ref={this.scrollRef}>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
              <div
                className={`border rounded mb-4 shadow-lg bg-white p-4`}
                style={{ height: "125px", fontFamily: "Avenir Next" }}
              >
                <div className="d-flex justify-content-between align-items-center h-100">
                  <div className="d-flex justify-content-start align-items-center">
                    <a href={`${context.pageContext.site.absoluteUrl}`}>
                      <img
                        src={require("../assets/arrow-left.svg")}
                        alt="folder"
                        height="20px"
                        width="50px"
                      />
                    </a>
                    <div>
                      <img src={workflow} width={"30px"} height={"30px"} />
                    </div>
                    <div
                      className="ps-3"
                      style={{ fontSize: "20px", fontWeight: "700" }}
                    >
                      Workflow
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <WorkflowCard
              md={24}
              lg={PaymentRequestInitiators ? 8 : 12}
              xl={PaymentRequestInitiators ? 8 : 12}
              Title="New User Creation Request"
              marginRight={true}
              context={context}
              getWorkFlow={this.getWorkFlow}
              getNewUser={this.getNewUser}
              selectedPersonDetails={selectedPersonDetails}
            />
            <WorkflowCard
              md={24}
              lg={PaymentRequestInitiators ? 8 : 12}
              xl={PaymentRequestInitiators ? 8 : 12}
              Title="New Loan Request"
              marginRight={PaymentRequestInitiators}
              context={context}
              getWorkFlow={this.getWorkFlow}
              getNewUser={this.getLoanRequest}
              selectedPersonDetails={selectedPersonDetails}
            />
            {PaymentRequestInitiators && (
              <WorkflowCard
                md={24}
                lg={PaymentRequestInitiators ? 8 : 12}
                xl={PaymentRequestInitiators ? 8 : 12}
                Title="Payment Request"
                marginRight={false}
                context={context}
                getWorkFlow={this.getWorkFlow}
                getNewUser={this.getPaymentRequest}
                selectedPersonDetails={selectedPersonDetails}
              />
            )}
            <WorkflowTask
              lg={24}
              xl={24}
              context={context}
              Title="Workflow Dashboard"
              marginRight={false}
              workFlowData={workFlowData}
              newUserData={newUserData}
              loanRequestData={loanRequestData}
              PaymentRequestData={PaymentRequestData}
              getNewUser={this.getNewUser}
              getLoanRequest={this.getLoanRequest}
              getPaymentRequest={this.getPaymentRequest}
              selectedPersonDetails={selectedPersonDetails}
            />
          </Row>
        </main>
      </UserProvider>
    );
  }
}
