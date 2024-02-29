import * as React from "react";
import "../../../../node_modules/antd/dist/reset.css";
import { IHomePageProps } from "./IHomePageProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { Row } from "antd";
import Announcement from "./announcement/Announcement";
import { UserProvider } from "../../../service/UserContext";
import Application from "./application/Application";
import DocumentStructure from "./documentsLibrary/DocumentStructure";
import QuickPolls from "./quickPolls/QuickPolls";
import CalenderNew from "./calender/CalenderNew";
import Survey from "./survey/Survey";
import Gallery from "./mediaGallery/Gallery";
import PersonalEmail from "./personalEmails/PersonalEmail";
import VipStatement from "./vipStatement/VipStatement";
import PersonalTask from "./personalTasks/PersonalTask";
import FeedBack from "./feedBack/FeedBack";
import EmployeOfMonth from "./employeOfMonth/EmployeOfMonth";
import News from "./news/News";
import Loader from "../../../commonComponents/loader/Loader";
import "../../global.scss";

interface IHomePageState {
  isAdmin: boolean;
  screenWidth: number;
  isLoading: boolean;
  isArabic: any;
}

export default class HomePage extends React.Component<
  IHomePageProps,
  IHomePageState
> {
  public constructor(props: IHomePageProps, state: IHomePageState) {
    super(props);
    this.state = {
      isAdmin: false,
      screenWidth: window.screen.availWidth,
      isLoading: true,
      isArabic: localStorage.getItem("isArabic"),
    };
  }

  public componentDidMount(): void {
    this.getUserDetails();
    let ScreenWidth: any = window.screen.availWidth;
    console.log(ScreenWidth, "ScreenWidth");
    this.setState({ screenWidth: ScreenWidth });
    setTimeout(() => this.setState({ isLoading: false }), 2000);
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
        console.log("ADMIN LIST ITEM", adminList);
        if (adminList.length > 0) {
          let filteredAdminList = adminList.filter(
            (item: string) =>
              item.toLowerCase() ===
              context.pageContext.user.email.toLowerCase()
          );
          if (filteredAdminList.length === 0) {
            this.setState({ isAdmin: false });
          } else {
            this.setState({ isAdmin: true });
          }
          console.log(
            "ADMIN LIST ITEM",
            adminList,
            filteredAdminList,
            filteredAdminList.length === 0
          );
        } else {
          console.log("Admin Not Found");
        }
      });
  }

  public render(): React.ReactElement<IHomePageProps> {
    const bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    const fa =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
    let Avenir = `${this.props.context.pageContext.site.absoluteUrl}/SiteAssets/font/styles.css`;
    console.log(
      "Avenir Link",
      `${this.props.context.pageContext.site.absoluteUrl}/SiteAssets/font/styles.css`
    );
    SPComponentLoader.loadCss(bootstarp5CSS);
    SPComponentLoader.loadCss(fa);
    SPComponentLoader.loadCss(Avenir);
    const { context } = this.props;
    const { isAdmin, screenWidth, isLoading } = this.state;
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
        {isLoading ? (
          <Loader row={2} avatar={false} skeletonCount={1} />
        ) : (
          <main
            className="mx-4 mainContainer"
            style={{
              paddingRight: "0px",
              paddingLeft: "0px",
              fontFamily: "Avenir Next",
            }}
          >
            <Row>
              <Application context={context} marginRight={true} />
              <News context={context} marginRight={true} />
              <Announcement context={context} marginRight={false} />
              <EmployeOfMonth context={context} marginRight={false} />
              <DocumentStructure
                context={context}
                listName="Documents"
                cardTitle="Documents Library"
                marginRight={true}
                cardIcon={require("../assets/folderIcon.png")}
                footerText={"View All"}
                footerVisible={true}
                rightPanelVisible={false}
                redirectionLink={`${context.pageContext.web.absoluteUrl}/SitePages/Document.aspx`}
                rightPanelElement={<></>}
              />
              <DocumentStructure
                context={context}
                listName="PolicesProcedures"
                cardTitle="Polices & Procedures"
                marginRight={true}
                cardIcon={require("../assets/folderIcon.png")}
                footerText={"View All"}
                footerVisible={true}
                rightPanelVisible={false}
                redirectionLink={`${context.pageContext.web.absoluteUrl}/SitePages/PolicesProcedures.aspx`}
                rightPanelElement={<></>}
              />
              <DocumentStructure
                context={context}
                listName="Publication"
                cardTitle="Company Reports"
                marginRight={false}
                cardIcon={require("../assets/folderIcon.png")}
                footerText={"View All"}
                footerVisible={true}
                rightPanelVisible={false}
                redirectionLink={`${context.pageContext.web.absoluteUrl}/SitePages/CompanyReports.aspx`}
                rightPanelElement={<></>}
              />
              <PersonalTask marginRight={true} context={context} />
              <PersonalEmail context={context} marginRight={true} />
              <CalenderNew context={context} marginRight={false} />
              <Survey context={context} marginRight={true} />
              <FeedBack context={context} marginRight={true} />
              <QuickPolls context={context} marginRight={false} />
              <VipStatement marginRight={true} context={context} />
              <Gallery context={context} marginRight={false} />
            </Row>
          </main>
        )}
      </UserProvider>
    );
  }
}
