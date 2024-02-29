import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { Modal } from "antd";
import Logo from "../Logo/Logo";

interface ITopbarProps {
  context: WebPartContext;
}

class User {
  employeeId: string;
  displayName: string;
  department: string;
  jobTitle: string;

  constructor(
    employeeId: string,
    displayName: string,
    department: string,
    jobTitle: string
  ) {
    this.employeeId = employeeId;
    this.displayName = displayName;
    this.department = department;
    this.jobTitle = jobTitle;
  }
}

interface ITopbarState {
  displayProfile: boolean;
  mobileDisplayProfile: boolean;
  notificationDisplay: boolean;
  mobileNotificationDisplay: boolean;
  notificationData: any;
  value: string;
  userPhoto: any;
  userDetails: any;
  modalOpen: boolean;
  directReports: any;
  directManager: any;
  userRecords: User;
}

export default class Topbar extends React.Component<
  ITopbarProps,
  ITopbarState
> {
  public constructor(props: ITopbarProps, state: ITopbarState) {
    super(props);
    this.state = {
      displayProfile: false,
      mobileDisplayProfile: false,
      notificationDisplay: false,
      mobileNotificationDisplay: false,
      notificationData: [],
      value: "",
      userPhoto: null,
      userDetails: null,
      modalOpen: false,
      directReports: null,
      directManager: {},
      userRecords: new User("", "", "", ""),
    };
  }

  public async componentDidMount(): Promise<void> {
    const { context } = this.props;
    try {
      const graphClient =
        await this.props.context.msGraphClientFactory.getClient("3");
      const userResponse = await graphClient
        .api("/me")
        .version("v1.0")
        .select("displayName,jobTitle,mail,mobilePhone")
        .get();

      const userDetails = userResponse;
      this.setState({ userDetails });

      const directReportsResponse = await graphClient
        .api(`/users/${context.pageContext.user.email}/directReports`)
        .version("v1.0")
        .select("*")
        .get();

      const directReports = directReportsResponse.value;
      console.log();
      this.setState({ directReports });

      const directManagerResponse = await graphClient
        .api("/me/manager")
        .version("v1.0")
        .select("*")
        .get();

      const directManager = directManagerResponse;
      this.setState({ directManager });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  public render(): React.ReactElement<ITopbarProps> {
    const chevron = require("../../assets/chevron-down.svg");
    const { context } = this.props;
    const { userDetails, userRecords, directReports, directManager } =
      this.state;

    const CurrentPage = window.location.pathname;
    const ActivePage = CurrentPage.split("/SitePages");

    const HomePage =
      ActivePage[1] === "/Home.aspx" ||
      window.location.pathname.split("/").length === 3
        ? true
        : false;
    const AboutPage = ActivePage[1] === "/About.aspx" ? true : false;
    const OrganizationPage =
      ActivePage[1] === "/OrganizationPage.aspx" ? true : false;

    console.log(HomePage, AboutPage, OrganizationPage);

    const userImage = (width: string, height: string, email: string) => {
      return (
        <img
          src={`${context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?AccountName=${email}`}
          width={width}
          height={height}
          className="rounded-circle"
          style={{ cursor: "pointer" }}
        />
      );
    };

    const items: MenuProps["items"] = [
      {
        label: (
          <div className="d-flex p-2 gap-2">
            <div className="">
              <div className="mb-2">
                {userImage("100px", "100px", context.pageContext.user.email)}
              </div>
              <div
                className="d-flex justify-content-center align-items-center p-2 rounded text-white"
                style={{
                  backgroundColor: "#f75b52",
                  fontWeight: "600",
                }}
              >
                <a
                  className="text-decoration-none text-white"
                  href={`${context.pageContext.web.absoluteUrl}/_layouts/15/SignOut.aspx`}
                >
                  Sign Out
                </a>
              </div>
            </div>
            <div>
              <div className="fs-5" style={{ fontWeight: "600" }}>
                {`${userDetails?.displayName || "Sharepoint Developer"}`}
              </div>
              <div className="fs-6">{`${userDetails?.jobTitle || ""}`}</div>
              <div className="fs-6">{`${userDetails?.mail || ""}`}</div>
              <div className="fs-6">{`${userDetails?.mobilePhone || ""}`}</div>
            </div>
          </div>
        ),
        key: "0",
      },
    ];

    return (
      <>
        <div
          className="d-flex justify-content-between border-bottom border-2 w-100 px-2"
          style={{ fontFamily: "Avenir Next" }}
        >
          <div
            className="d-flex justify-content-between w-100"
            style={{ height: "80px" }}
          >
            <div className="d-flex justify-content-between align-items-center flex-fill">
              <Logo context={context} />
              <div
                className="px-4 py-3 fs-6"
                style={{
                  backgroundColor: HomePage ? " rgb(181, 77, 38)" : "none",
                  fontWeight: "500",
                  cursor: "pointer",
                  color: "#f4f4f4f4",
                }}
              >
                <a
                  style={{
                    textDecoration: "none",
                    color: HomePage ? "#ffffff" : "#000000",
                  }}
                  href={`${context.pageContext.site.absoluteUrl}/SitePages/Home.aspx`}
                >
                  Home
                </a>
              </div>
              {/* <div
                className="px-4 py-3 fs-6"
                style={{
                  fontWeight: "500",
                  cursor: "pointer",
                  backgroundColor: AboutPage ? " rgb(181, 77, 38)" : "none",
                }}
              >
                <a
                  style={{
                    textDecoration: "none",
                    color: AboutPage ? "#ffffff" : "#000000",
                  }}
                  href={`${context.pageContext.web.absoluteUrl
                    .split("/")
                    .slice(0, 5)
                    .join("/")}/SitePages/About.aspx`}
                >
                  About
                </a>
              </div> */}
              <div
                className="px-4 py-3 fs-6"
                style={{
                  fontWeight: "500",
                  cursor: "pointer",
                }}
              >
                <a
                  style={{
                    textDecoration: "none",
                    color: "#000000",
                  }}
                  href="https://teams.microsoft.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  MS Teams
                </a>
              </div>
              <div
                className="px-4 py-3 fs-6"
                style={{
                  fontWeight: "500",
                  cursor: "pointer",
                  backgroundColor: OrganizationPage
                    ? " rgb(181, 77, 38)"
                    : "none",
                  /* pointerEvents: "none", */
                }}
                onClick={() => this.setState({ modalOpen: true })}
              >
                Organization Chart
              </div>
              <div className="d-flex align-items-center">
                {userImage("60px", "60px", context.pageContext.user.email)}
                <div className="d-flex justify-content-between ps-2">
                  <div>
                    <div>
                      <small>Welcome</small>
                    </div>
                    <div className="fw-bold">{userRecords?.displayName}</div>
                  </div>
                  <div
                    className="ps-2 d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                  >
                    <Dropdown menu={{ items }} placement="bottomRight">
                      <a onClick={(e) => e.preventDefault()}>
                        <Space>
                          <img src={chevron} />
                        </Space>
                      </a>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          title="Organization Chart"
          centered
          open={this.state.modalOpen}
          onOk={() => this.setState({ modalOpen: false })}
          onCancel={() => this.setState({ modalOpen: false })}
          footer={false}
          width={"95vw"}
        >
          <div
            className="py-5"
            style={{
              height: "80vh",
              overflowY: "scroll",
              scrollbarWidth: "thin",
            }}
          >
            {Object.keys(directManager)?.length && (
              <>
                <div className="d-flex justify-content-center">
                  <div
                    className="d-flex p-2 border border-info"
                    style={{ width: "max-content" }}
                  >
                    {directManager?.userPrincipalName && (
                      <div className="me-2">
                        <div className="mb-2">
                          {userImage(
                            "100px",
                            "100px",
                            directManager?.userPrincipalName
                          )}
                        </div>
                      </div>
                    )}
                    <div>
                      <div className="fs-5" style={{ fontWeight: "600" }}>
                        {`${directManager?.displayName}`}
                      </div>
                      <div className="fs-6">{`${
                        directManager?.jobTitle || ""
                      }`}</div>
                      <div className="fs-6">{`${
                        directManager?.mail || ""
                      }`}</div>
                      <div className="fs-6">{`${
                        directManager?.mobilePhone || ""
                      }`}</div>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-center ">
                  <div
                    className="bg-dark"
                    style={{ height: "6vh", width: "4px" }}
                  />
                </div>
              </>
            )}
            <div className="d-flex justify-content-center">
              <div
                className="d-flex p-2 border border-info"
                style={{ width: "max-content" }}
              >
                <div className="me-2">
                  <div className="mb-2">
                    {userImage(
                      "100px",
                      "100px",
                      context.pageContext.user.email
                    )}
                  </div>
                </div>
                <div>
                  <div className="fs-5" style={{ fontWeight: "600" }}>
                    {`${
                      userDetails?.displayName ||
                      context.pageContext.user.displayName
                    }`}
                  </div>
                  <div className="fs-6">{`${userDetails?.jobTitle || ""}`}</div>
                  <div className="fs-6">{`${
                    userDetails?.mail || context.pageContext.user.email
                  }`}</div>
                  <div className="fs-6">{`${
                    userDetails?.mobilePhone || ""
                  }`}</div>
                </div>
              </div>
            </div>
            <div className="d-flex justify-content-center ">
              <div
                className="bg-dark"
                style={{ height: "6vh", width: "4px" }}
              />
            </div>
            <hr className="mt-0"></hr>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              {directReports?.length > 0 &&
                directReports.map((orgData: any, i: any) => (
                  <div
                    className="d-flex p-2 border border-info bg-light"
                    style={{ width: "max-content", height: "max-content" }}
                  >
                    <div className="mb-2 me-2">
                      {userImage("60px", "60px", orgData?.email)}
                    </div>
                    <div>
                      <div className="fs-5" style={{ fontWeight: "600" }}>
                        {orgData.displayName}
                      </div>
                      <div className="fs-6">{orgData.jobTitle}</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </Modal>
      </>
    );
  }
}
