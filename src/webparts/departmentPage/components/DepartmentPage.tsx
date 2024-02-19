import * as React from "react";
import { SPComponentLoader } from "@microsoft/sp-loader";
import "antd/dist/reset.css";
import "./style.css";
import { Col, Row } from "antd";
import { IDepartmentPageProps } from "./IDepartmentPageProps";
import { UserProvider } from "../../../service/UserContext";
import QuickPolls from "./quickPolls/QuickPolls";
import News from "./news/News";
import Announcement from "./announcement/Announcement";
import Survey from "./survey/Survey";
import DocumentStructure from "./documentsLibrary/DocumentStructure";
interface IDepartmentPageState {
  screenWidth: number;
  isAdmin: boolean;
}

export default class DepartmentPage extends React.Component<
  IDepartmentPageProps,
  IDepartmentPageState
> {
  public scrollRef: any;
  public constructor(props: IDepartmentPageProps, state: IDepartmentPageState) {
    super(props);
    this.state = {
      screenWidth: 800,
      isAdmin: false,
    };
    this.scrollRef = React.createRef();
  }
  public componentDidMount(): void {
    setTimeout(() => {
      console.log("scrollRef", this.scrollRef);
      if (this.scrollRef)
        this.scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1000);
    let ScreenWidth: any = window.screen.width;
    console.log(ScreenWidth, "ScreenWidth");
    this.setState({ screenWidth: ScreenWidth });
  }

  public render(): React.ReactElement<IDepartmentPageProps> {
    console.log(
      "this.props.context.pageContext",
      this.props.context.pageContext
    );
    const bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    const fa =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
    let Avenir = `${this.props.context.pageContext.site.absoluteUrl}/SiteAssets/font/styles.css`;
    /* const Montserrat =
    "https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Open+Sans:wght@600&display=swap";
  const Roboto =
    "https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"; */
    SPComponentLoader.loadCss(bootstarp5CSS);
    SPComponentLoader.loadCss(fa);
    SPComponentLoader.loadCss(Avenir);
    /*  SPComponentLoader.loadCss(Montserrat);
  SPComponentLoader.loadCss(Roboto); */
    const { context } = this.props;
    const { isAdmin, screenWidth } = this.state;
    const UserName = context.pageContext.user.displayName;
    const UserEmail = context.pageContext.user.email;
    const pageURl = context.pageContext.web.absoluteUrl;
    const currentName = pageURl.split("/");
    const length = currentName.length;
    const departmentName = currentName[length - 1];
    const folder = require("../assets/folderOpen.svg");
    console.log("departmentName", departmentName);
    const isSmallScreen = screenWidth < 767 ? true : false;

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
          className="mx-4 detailsContainer"
          style={{
            paddingRight: "0px",
            paddingLeft: "0px",
            fontFamily: "Avenir Next",
          }}
        >
          <Row ref={this.scrollRef}>
            <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
              <div
                className={`border rounded mb-4 shadow-lg bg-white p-4 ${
                  !isSmallScreen && "me-3"
                }`}
                style={{ height: "125px", fontFamily: "Avenir Next" }}
              >
                <div className="d-flex justify-content-between align-items-center h-100">
                  <div className="d-flex justify-content-start align-items-center">
                    <div>
                      <img src={folder} />
                    </div>
                    <div
                      className="ps-3"
                      style={{ fontSize: "20px", fontWeight: "700" }}
                    >
                      Department
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={16} lg={16} xl={16} xxl={16}>
              <div
                className="border rounded mb-4 shadow-lg bg-white p-4"
                style={{ height: "125px", fontFamily: "Avenir Next" }}
              >
                <div className="d-flex align-items-center h-100">
                  <div>
                    <div
                      className="d-flex  ps-3"
                      style={{ fontSize: "20px", fontWeight: "700" }}
                    >
                      Department
                    </div>
                    <div
                      className="d-flex  ps-3"
                      style={{ fontSize: "16px", fontWeight: "500" }}
                    >
                      {departmentName}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <QuickPolls context={context} />
            <News context={context} />
            <Announcement context={context} />
            <Survey context={context} />
            <DocumentStructure
              context={context}
              listName="Documents"
              cardTitle="Shared Documents"
              cardIcon={require("../assets/document.svg")}
              footerText={"View All"}
              footerVisible={true}
              rightPanelVisible={true}
              redirectionLink={`${context.pageContext.web.absoluteUrl}/SitePages/Document.aspx`}
              rightPanelElement={<></>}
            />
          </Row>
        </main>
      </UserProvider>
    );
  }
}
