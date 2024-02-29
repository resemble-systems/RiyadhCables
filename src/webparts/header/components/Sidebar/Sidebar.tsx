import * as React from "react";
import { Drawer } from "antd";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Modal } from "antd";

interface ISidebarProps {
  context: WebPartContext;
}
interface ISidebarState {
  openDrawer: boolean;
  userPhoto: any;
  userDetails: any;
  displayProfile: boolean;
  mobileDisplayProfile: boolean;
  notificationDisplay: boolean;
  mobileNotificationDisplay: boolean;
  notificationData: any;
  value: string;
  modalOpen: boolean;
  directReports: any;
  directManager: any;
}
export default class Sidebar extends React.Component<
  ISidebarProps,
  ISidebarState
> {
  public constructor(props: ISidebarProps, state: ISidebarState) {
    super(props);
    this.state = {
      openDrawer: false,
      userPhoto: null,
      userDetails: null,
      displayProfile: false,
      mobileDisplayProfile: false,
      notificationDisplay: false,
      mobileNotificationDisplay: false,
      notificationData: [],
      value: "",
      modalOpen: false,
      directReports: null,
      directManager: {},
    };
  }
  public async componentDidMount() {
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
  public showDrawer: any = () => {
    this.setState({ openDrawer: true });
  };

  public onClose: any = () => {
    this.setState({ openDrawer: false });
  };

  public render(): React.ReactElement<{}> {
    const { context } = this.props;
    const menu: any = require("../../assets/menu.svg");
    const { userDetails, directManager } = this.state;
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
    return (
      <div style={{ fontFamily: "Avenir Next" }}>
        <div onClick={() => this.showDrawer()}>
          <img src={menu} />
        </div>
        <Drawer
          placement="right"
          onClose={() => this.onClose()}
          open={this.state.openDrawer}
          title={
            <div className="d-flex justify-content-start align-items-center p-2 pt-0">
              <a href="https://myaccount.microsoft.com/?ref=MeControl">
                {userImage("60px", "60px", context.pageContext.user.email)}
              </a>
              <div className="d-flex justify-content-between ps-2">
                <div>
                  <div>
                    <small>Welcome</small>
                  </div>
                  <div className="fw-bold">
                    {context.pageContext.user.displayName}
                  </div>
                </div>
              </div>
            </div>
          }
        >
          <div
            className="fs-5 p-2 border-bottom border-2 pt-0"
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
              href={`${context.pageContext.web.absoluteUrl
                .split("/")
                .slice(0, 5)
                .join("/")}/SitePages/Home.aspx`}
            >
              Home
            </a>
          </div>
          {/* <div
            className="fs-5 p-2"
            style={{ fontWeight: "500", cursor: "pointer" }}
          >
            <a
              style={{
                textDecoration: "none",
                color: "#000000",
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
            className="fs-5 p-2"
            style={{ fontWeight: "500", cursor: "pointer" }}
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
              Chat
            </a>
          </div>
          <div
            className="fs-5 p-2"
            style={{ fontWeight: "500", cursor: "pointer" }}
            onClick={() => this.setState({ modalOpen: true })}
          >
            Organization Chart
          </div>
          <a
            className="text-decoration-none text-white"
            href={`${context.pageContext.web.absoluteUrl}/_layouts/15/SignOut.aspx`}
          >
            <div
              className="fs-5 p-2 rounded text-white text-center"
              style={{
                fontWeight: "500",
                cursor: "pointer",
                backgroundColor: " rgb(181, 77, 38)",
              }}
            >
              Logout
            </div>
          </a>
        </Drawer>
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
                      userDetails?.displayName
                        ? userDetails.displayName
                        : "Sharepoint Developer"
                    }`}
                  </div>
                  <div className="fs-6">{`${
                    userDetails?.jobTitle ? userDetails.jobTitle : ""
                  }`}</div>
                  <div className="fs-6">{`${
                    userDetails?.mail ? userDetails.mail : ""
                  }`}</div>
                  <div className="fs-6">{`${
                    userDetails?.mobilePhone ? userDetails.mobilePhone : ""
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
              {this.state.directReports?.length > 0 ? (
                this.state.directReports.map((orgData: any, i: any) => (
                  <div
                    className="d-flex p-2 border border-info bg-light"
                    style={{ width: "max-content", height: "max-content" }}
                  >
                    <div className="me-2">
                      <div className="mb-2">
                        {userImage("60px", "60px", orgData?.email)}
                      </div>
                    </div>
                    <div>
                      <div className="fs-5" style={{ fontWeight: "600" }}>
                        {orgData.displayName}
                      </div>
                      <div className="fs-6">{orgData.jobTitle}</div>
                    </div>
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}
