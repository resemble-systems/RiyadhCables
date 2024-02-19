import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { Modal } from "antd";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
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

  public componentDidMount(): void {
    this.getEmployeeID();
  }

  public async getEmployeeID() {
    try {
      const { context } = this.props;

      const graphClient = await context.msGraphClientFactory.getClient("3");

      const user = await graphClient
        .api(`/users/${context.pageContext.user.email}`)
        .version("v1.0")
        .select("employeeId,displayName,jobTitle,department")
        .get();
      console.log("USER DETAILS", user);
      this.setState({
        userRecords: new User(
          user.employeeId,
          user.displayName,
          user.jobTitle,
          user.department
        ),
      });
      const employeeID = user.employeeId?.toString();
      if (employeeID) this.getMyData(employeeID, "Number");
      else this.getMyData(user.displayName, "Name");
      console.log("Employee ID:", employeeID);
    } catch (error) {
      console.error("Error fetching employee ID:", error);
    }
  }

  private async fetchData(apiUrl: string): Promise<any> {
    const { context } = this.props;
    const res: SPHttpClientResponse = await context.spHttpClient.get(
      apiUrl,
      SPHttpClient.configurations.v1
    );
    if (!res.ok) {
      throw new Error(`HTTP request failed with status ${res.status}`);
    }
    return res.json();
  }

  public async getMyData(employeeID: string, columnName: string) {
    const { context } = this.props;
    console.log("Employe ID", employeeID);
    try {
      const apiUrl = `${context.pageContext.site.absoluteUrl}/_api/web/lists/GetByTitle('OrganizationChart')/items?$top=4999&$select=* &$filter= ${columnName} eq '${employeeID}'`;
      const listItems = await this.fetchData(apiUrl);
      console.log("OrganizationChart listItems", listItems);

      if (listItems.value?.length > 0) {
        const myManager = listItems.value[0].ManagerNumber;
        const myNumber = listItems.value[0].Number;
        this.getMyManager(myManager);
        this.getMyDirectReports(myNumber);
        this.setState({ userDetails: listItems.value[0] });
      }
    } catch (error) {
      console.error("Error in componentDidMount:", error);
    }
  }

  public async getMyManager(Manager: string) {
    const { context } = this.props;
    try {
      const apiUrl = `${context.pageContext.site.absoluteUrl}/_api/web/lists/GetByTitle('OrganizationChart')/items?$top=4999&$select=* &$filter= Number eq '${Manager}'`;
      const listItems: any = await this.fetchData(apiUrl);
      console.log("getMyManager listItems", listItems);
      if (listItems.value?.length > 0) {
        this.setState({ directManager: listItems.value[0] });
      }
    } catch (error) {
      console.error("Error in componentDidMount:", error);
    }
  }

  public async getMyDirectReports(MyNumber: string) {
    const { context } = this.props;
    try {
      const apiUrl = `${context.pageContext.site.absoluteUrl}/_api/web/lists/GetByTitle('OrganizationChart')/items?$top=4999&$select=* &$filter= ManagerNumber eq '${MyNumber}'`;
      const listItems: any = await this.fetchData(apiUrl);
      console.log("getMyDirectReports listItems", listItems);
      const sortedItems = listItems.value?.sort(function (
        a: { Name: string },
        b: { Name: string }
      ) {
        const nameA = a.Name.toLowerCase();
        const nameB = b.Name.toLowerCase();

        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
      this.setState({ directReports: sortedItems });
    } catch (error) {
      console.error("Error in componentDidMount:", error);
    }
  }

  public render(): React.ReactElement<ITopbarProps> {
    const chevron = require("../../assets/chevron-down.svg");
    const { context } = this.props;
    const { userDetails, directManager, userRecords } = this.state;

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

    const items: MenuProps["items"] = [
      {
        label: (
          <div className="d-flex p-2">
            <div className="me-2">
              <div className="mb-2">
                <img
                  src={`${context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?AccountName=${context.pageContext.user.email}`}
                  width="100px"
                  height="100px"
                  className="rounded-circle"
                />
              </div>
              <div
                className="d-flex justify-content-center align-items-center p-2 rounded text-white"
                style={{
                  backgroundColor: " rgb(181, 77, 38)",
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
                {`${
                  userRecords?.displayName
                    ? userRecords.displayName
                    : "Sharepoint Developer"
                }`}
              </div>
              <div className="fs-6">{`${
                userRecords?.jobTitle ? userRecords.jobTitle : ""
              }`}</div>
              <div className="fs-6">{`${context.pageContext.user.email}`}</div>
              <div className="fs-6">{`${
                userRecords?.department ? userRecords.department : ""
              }`}</div>
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
                <img
                  src={`${context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?AccountName=${context.pageContext.user.email}`}
                  width="60px"
                  height="60px"
                  className="rounded-circle"
                  style={{ cursor: "pointer" }}
                />
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
            {/* <div className="d-flex justify-content-end align-items-center">
              <img
                src={`${context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?AccountName=${context.pageContext.user.email}`}
                width="60px"
                height="60px"
                className="rounded-circle"
                style={{ cursor: "pointer" }}
              />
              <div className="d-flex justify-content-between ps-2">
                <div>
                  <div>
                    <small>Welcome</small>
                  </div>
                  <div className="fw-bold">
                    {context.pageContext.user.displayName}
                  </div>
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
            </div> */}
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
              fontFamily: "Avenir Next",
            }}
          >
            {Object.keys(directManager)?.length > 0 && (
              <>
                <div className="d-flex justify-content-center">
                  <div
                    className="d-flex p-2 border border-info"
                    style={{ width: "max-content" }}
                  >
                    <div className="me-2">
                      <div className="">
                        <img
                          src={`${context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?AccountName=${directManager?.Email}`}
                          width="100px"
                          height="100px"
                          className="rounded-circle"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="fs-6" style={{ fontWeight: "600" }}>
                        {`${directManager?.Name && directManager.Name}`}
                      </div>
                      <div className="">{`${
                        directManager?.Job_x0020_Title
                          ? directManager.Job_x0020_Title
                          : ""
                      }`}</div>
                      <div className="">{`${
                        directManager?.Email ? directManager.Email : ""
                      }`}</div>
                      <div className="">{`${
                        directManager?.Department
                          ? directManager.Department
                          : ""
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
                  <div className="">
                    <img
                      src={`${context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?AccountName=${context.pageContext.user.email}`}
                      width="100px"
                      height="100px"
                      className="rounded-circle"
                    />
                  </div>
                </div>
                <div>
                  <div className="fs-6" style={{ fontWeight: "600" }}>
                    {`${
                      userDetails?.Name
                        ? userDetails.Name
                        : "Sharepoint Developer"
                    }`}
                  </div>
                  <div className="">{`${
                    userDetails?.Job_x0020_Title
                      ? userDetails.Job_x0020_Title
                      : ""
                  }`}</div>
                  <div className="">{`${
                    userDetails?.Email ? userDetails.Email : ""
                  }`}</div>
                  <div className="">{`${
                    userDetails?.Department ? userDetails.Department : ""
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
                      <div className="">
                        <img
                          src={`${context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?AccountName=${orgData?.Email}`}
                          width="60px"
                          height="60px"
                          className="rounded-circle"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="fs-6" style={{ fontWeight: "600" }}>
                        {orgData.Name}
                      </div>
                      <div className="">{orgData.Job_x0020_Title}</div>
                    </div>
                  </div>
                ))
              ) : (
                <></>
              )}
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
                <></>
              )} */}
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
      </>
    );
  }
}
