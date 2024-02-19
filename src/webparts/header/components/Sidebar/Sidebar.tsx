import * as React from "react";
import { Drawer } from "antd";
import { MSGraphClientV3 } from "@microsoft/sp-http";
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
    };
  }
  public componentDidMount(): void {
    this.props.context.msGraphClientFactory
      .getClient("3")
      .then((grahpClient: MSGraphClientV3): void => {
        grahpClient
          .api("/me/photo/$value")
          .version("v1.0")
          /* .responseType("blob") */
          .get((error: any, photo: Blob, rawResponse?: any) => {
            if (error) {
              console.log("User Photo Error Msg:", error);
              return;
            }
            console.log("photo", photo);
            const url = URL.createObjectURL(photo);
            console.log("URL PHOTO", url);
            this.setState({ userPhoto: url });
            console.log("rawResponse==>>", rawResponse);
          });

        let mail: any;
        grahpClient
          .api("/me")
          .version("v1.0")
          .select("*")
          .get(
            (
              error: any,
              user: any /* : MicrosoftGraph.User, */,
              rawResponse?: any
            ) => {
              if (error) {
                console.log("User Error Msg:", error);
                return;
              }
              console.log("user", user);
              mail = user.mail;
              console.log("mail", mail);
              this.setState({ userDetails: user });
              console.log("rawResponse", rawResponse);
            }
          );

        grahpClient
          .api("/me/directReports")
          .version("v1.0")
          .select("*")
          .get((error: any, directReports: any, rawResponse?: any) => {
            if (error) {
              console.log("directReports Error Msg:", error);
              return;
            }
            console.log("[MyProfile] directReports", directReports);
            this.setState({ directReports: directReports.value });
            console.log("directReports rawResponse==>>", rawResponse);
          });
      });
  }
  public showDrawer: any = () => {
    this.setState({ openDrawer: true });
  };

  public onClose: any = () => {
    this.setState({ openDrawer: false });
  };

  public render(): React.ReactElement<{}> {
    const { context } = this.props;
    const userImg: any = require("../../assets/userImg.jpg");
    const menu: any = require("../../assets/menu.svg");
    const { userPhoto, userDetails } = this.state;
    /* const chevron: any = require("../../assets/chevron-down.svg"); */
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
                <img
                  src={this.state.userPhoto ? this.state.userPhoto : userImg}
                  width="60px"
                  height="60px"
                  className="rounded-circle"
                  style={{ cursor: "pointer" }}
                  title="View Account"
                />
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
                {/* <div
                  className="ps-2 d-flex align-items-center"
                  style={{ cursor: "pointer" }}
                >
                  <img src={chevron} />
                </div> */}
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
          <div
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
          </div>
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
            <div className="d-flex justify-content-center">
              <div
                className="d-flex p-2 border border-info"
                style={{ width: "max-content" }}
              >
                <div className="me-2">
                  <div className="mb-2">
                    <img
                      src={userPhoto ? userPhoto : userImg}
                      width="100px"
                      height="100px"
                      className="rounded-circle"
                    />
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
              {/* {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map(() => (
                <div
                  className="d-flex p-2 border border-info bg-light"
                  style={{ width: "max-content", height: "max-content" }}
                >
                  <div className="me-2">
                    <div className="mb-2">
                      <img
                        src={userImg}
                        width="60px"
                        height="60px"
                        className="rounded-circle"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="fs-5" style={{ fontWeight: "600" }}>
                      Hari Ajith
                    </div>
                    <div className="fs-6">Associate Software Developer</div>
                  </div>
                </div>
              ))} */}
              {this.state.directReports?.length > 0 ? (
                this.state.directReports.map((orgData: any, i: any) => (
                  <div
                    className="d-flex p-2 border border-info bg-light"
                    style={{ width: "max-content", height: "max-content" }}
                  >
                    <div className="me-2">
                      <div className="mb-2">
                        <img
                          src={userImg}
                          width="60px"
                          height="60px"
                          className="rounded-circle"
                        />
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

            {/* {this.state.directReports?.length > 0 ? (
              this.state.directReports.map((orgData: any, i: any) => (
                  <div
                  className="d-flex p-2 border border-info bg-light"
                  style={{ minWidth: "320px", height: "max-content" }}
                >
                  <div className="me-2">
                    <div className="mb-2">
                      <img
                        src={userImg}
                        width="60px"
                        height="60px"
                        className="rounded-circle"
                      />
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
              <Row className="w-100">
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div className="d-flex w-100 justify-content-center align-items-center">
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <span className="text-secondary">No Data</span>
                      }
                    ></Empty>
                  </div>
                </Col>
              </Row>
            )} */}
          </div>
        </Modal>
      </div>
    );
  }
}
