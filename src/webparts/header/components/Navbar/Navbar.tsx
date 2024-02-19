import * as React from "react";
import DateTime from "../Date/DateTime";
import Logo from "../Logo/Logo";
import Prayer from "../Prayer/Prayer";
import Topbar from "../Topbar/Topbar";
import Weather from "../Weather/Weather";
import type { MenuProps } from "antd";
import "../../../global.css";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { Row, Col, Dropdown, Space, Badge, Tabs } from "antd";
import Sidebar from "../Sidebar/Sidebar";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import EmptyCard from "../../../../commonComponents/emptyCard/EmptyCard";
import styles from "../Header.module.scss";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

interface INavbarProps {
  context: WebPartContext;
  AdminUser: boolean;
}
interface INavbarState {
  languageSelected: string;
  isArabic: boolean;
  mailData: any;
  unreadMail: number;
  calendarMeetingData: any;
  sharePriceData: any;
  newUserData: any;
  loanRequestData: any;
  PaymentRequestData: any;
  AllRequestData: any;
}

interface MailData {
  webLink: string;
  from: {
    emailAddress: {
      address: string;
      name: string;
    };
  };
  receivedDateTime: string;
  bodyPreview: string;
  isRead: boolean;
}

export default class Navbar extends React.Component<
  INavbarProps,
  INavbarState
> {
  public constructor(props: INavbarProps, state: INavbarState) {
    super(props);
    this.state = {
      languageSelected: "English",
      isArabic: false,
      mailData: [],
      unreadMail: 0,
      calendarMeetingData: [],
      sharePriceData: {},
      newUserData: [],
      loanRequestData: [],
      PaymentRequestData: [],
      AllRequestData: [],
    };
  }

  public componentDidMount(): void {
    const { isArabic } = this.state;
    this.getSharePrice();
    this.getMail();
    this.getMeetings();
    this.getNewUser();
    this.getLoanRequest();
    this.getPaymentRequest();
    localStorage.setItem("isArabic", JSON.stringify(isArabic));
    const IsArabicFromLocal = localStorage.getItem("isArabic");
    if (IsArabicFromLocal) {
      console.log("IsArabicFromLocal", IsArabicFromLocal);
    }
  }

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
        const approvalAssigned = sortedItems?.filter(
          (data) =>
            data.PendingWith?.split(";").filter(
              (item: string) => item === context.pageContext.user.displayName
            )?.length > 0
        );
        const typeAddition = approvalAssigned?.map((data) => {
          return {
            ...data,
            Type: "userCreation",
          };
        });
        this.setState({
          newUserData: typeAddition,
        });
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
        console.log("NewUser", listItems.value);
        const sortedItems: any[] = listItems.value?.sort(
          (a: { Created: string }, b: { Created: string }) =>
            new Date(b.Created).getTime() - new Date(a.Created).getTime()
        );
        const approvalAssigned = sortedItems?.filter(
          (data) =>
            data.PendingWith?.split(";").filter(
              (item: string) => item === context.pageContext.user.displayName
            )?.length > 0
        );
        const typeAddition = approvalAssigned?.map((data) => {
          return {
            ...data,
            Type: "loanRequest",
          };
        });
        this.setState({
          loanRequestData: typeAddition,
        });
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
        const approvalAssigned = sortedItems?.filter(
          (data) =>
            data.PendingWith?.split(";").filter(
              (item: string) => item === context.pageContext.user.displayName
            )?.length > 0
        );
        const typeAddition = approvalAssigned?.map((data) => {
          return {
            ...data,
            Type: "paymentRequest",
          };
        });
        this.setState({
          PaymentRequestData: typeAddition,
        });
      });
  };

  public componentDidUpdate(
    prevProps: Readonly<INavbarProps>,
    prevState: Readonly<INavbarState>
  ): void {
    const {
      isArabic,
      AllRequestData,
      newUserData,
      loanRequestData,
      PaymentRequestData,
    } = this.state;
    if (prevState.isArabic !== isArabic) {
      localStorage.setItem("isArabic", JSON.stringify(isArabic));
      const IsArabicFromLocal = localStorage.getItem("isArabic");
      if (IsArabicFromLocal) {
        console.log("IsArabicFromLocal white Update", IsArabicFromLocal);
      }
    }
    if (prevState.newUserData !== newUserData) {
      this.setState({
        AllRequestData: [
          ...newUserData,
          ...loanRequestData,
          ...PaymentRequestData,
        ],
      });
    }
    if (prevState.loanRequestData !== loanRequestData) {
      this.setState({
        AllRequestData: [
          ...newUserData,
          ...loanRequestData,
          ...PaymentRequestData,
        ],
      });
    }
    if (prevState.PaymentRequestData !== PaymentRequestData) {
      this.setState({
        AllRequestData: [
          ...newUserData,
          ...loanRequestData,
          ...PaymentRequestData,
        ],
      });
    }
    if (prevState.AllRequestData !== AllRequestData) {
      const sortedItems: any[] = AllRequestData?.sort(
        (a: { Created: string }, b: { Created: string }) =>
          new Date(b.Created).getTime() - new Date(a.Created).getTime()
      );
      console.log("Sorted All Requset Data", sortedItems);
      this.setState({ AllRequestData: sortedItems });
    }
  }

  public getMail() {
    const { context } = this.props;
    context.msGraphClientFactory
      .getClient("3")
      .then((grahpClient: MSGraphClientV3): void => {
        grahpClient
          .api(`me/messages`)
          .version("v1.0")
          .select("*")
          .get((error: any, mail: any, rawResponse?: any) => {
            if (error) {
              console.log("Mail messages Error", error);
              return;
            }
            console.log("Mail Response", mail);
            const unRead = mail?.value?.filter(
              (data: { isRead: any }) => !data.isRead && data
            );
            console.log("Mail Response unRead", unRead);
            this.setState({ mailData: unRead, unreadMail: unRead?.length });
          });
      });
  }

  public getMeetings() {
    this.props.context.msGraphClientFactory
      .getClient("3")
      .then((grahpClient: MSGraphClientV3): void => {
        grahpClient
          .api(`me/events`)
          .version("v1.0")
          .select("*")
          .top(100)
          .get((error: any, calendar: any, rawResponse?: any) => {
            if (error) {
              console.log("Calender Error", error);
              return;
            }
            const dateBuilder = (date: any) => {
              let Year = date.getFullYear();
              let Month = date.getMonth() + 1;
              let Date = date.getDate();
              const fullDate = Year + "-" + Month + "-" + Date;
              return fullDate;
            };
            const meetingToday = calendar.value?.filter(
              (meeting: { start: { dateTime: string | number } }) => {
                let today = dateBuilder(new Date());
                let startDate = dateBuilder(new Date(meeting.start.dateTime));
                if (today === startDate) return meeting;
                else return;
              }
            );
            console.log("calendarMeetingData", meetingToday);
            this.setState({ calendarMeetingData: meetingToday });
          });
      });
  }

  public async getSharePrice() {
    const sharePriceUrl =
      "https://tools.euroland.com/tools/pricefeed/?companycode=SA-RCGC&format=json";
    const shareResponse = await fetch(sharePriceUrl);
    const sharePriceData = await shareResponse.json();
    if (shareResponse.ok) {
      const sharePrice = Object.keys(sharePriceData).map((key) => [
        sharePriceData[key],
      ]);
      this.setState({
        sharePriceData: sharePrice[0][0],
      });
      console.log("sharePriceData", sharePrice[0][0]);
    } else {
      console.log("shareResponse", shareResponse);
    }
  }

  public nameTrimmer(name: Array<string>): string {
    const checkedName = name?.filter((str: string) =>
      RegExp(/^[A-Za-z]+$/).test(str) ? str : null
    );
    return checkedName?.join("").toUpperCase();
  }

  public render(): React.ReactElement<INavbarProps> {
    const { context } = this.props;
    const {
      // languageSelected,
      unreadMail,
      mailData,
      calendarMeetingData,
      sharePriceData,
      AllRequestData,
    } = this.state;
    console.log("sharePriceData", sharePriceData);
    const moment = require("moment");

    /* const hanfleChange = (language: string) => {
      this.setState({
        languageSelected: language,
        isArabic: language === "Arabic",
      });
    }; */
    const onChange = (key: string) => {
      console.log(key);
    };

    const items: MenuProps["items"] = [
      {
        label: (
          <div>
            <Tabs
              onChange={onChange}
              type="card"
              items={[
                {
                  label: `Mail`,
                  key: "1",
                  children: (
                    <div
                      style={{
                        height: "300px",
                        overflowY: "scroll",
                        fontFamily: "Avenir Next",
                      }}
                    >
                      {mailData?.length > 0 ? (
                        mailData
                          ?.slice(0, 5)
                          ?.map((mailBody: MailData, index: number) => {
                            return (
                              <a
                                href={mailBody.webLink}
                                className="text-decoration-none"
                                target="_blank"
                                rel="noopener noreferrer"
                                data-interception="off"
                                style={{ color: "inherit" }}
                                key={index}
                              >
                                <div
                                  className={`d-flex gap-3 py-3 ${
                                    index === 0 ? "" : "border-top border-3"
                                  }`}
                                  style={{ width: "400px" }}
                                >
                                  <div className="d-flex justify-content-center align-items-center h-100">
                                    <div
                                      className="rounded-circle d-flex justify-content-center align-items-center text-white"
                                      style={{
                                        width: "44px",
                                        height: "44px",
                                        backgroundColor: " rgb(181, 77, 38)",
                                      }}
                                    >
                                      {mailBody.from?.emailAddress?.address?.split(
                                        "@"
                                      )[1] ===
                                      context.pageContext.user.email?.split(
                                        "@"
                                      )[1] ? (
                                        <img
                                          className="rounded-circle"
                                          width="44px"
                                          height="44px"
                                          src={`${context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?AccountName=${mailBody.from?.emailAddress?.address}`}
                                        />
                                      ) : (
                                        <>
                                          {this.nameTrimmer(
                                            mailBody.from?.emailAddress?.name
                                              ?.split(" ")
                                              ?.map((letter: any) =>
                                                letter.charAt(0)
                                              )
                                              .slice(0, 2)
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <div style={{ width: "80%" }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                      <div
                                        style={{
                                          color: "#414141",
                                          fontWeight: "600",
                                        }}
                                      >
                                        {mailBody.from?.emailAddress?.name
                                          ?.split(" ")
                                          .slice(0, 2)
                                          .join(" ")}
                                      </div>
                                      {!mailBody.isRead && (
                                        <span
                                          style={{
                                            width: "8px",
                                            height: "8px",
                                            backgroundColor: "#32CD32",
                                          }}
                                          className="rounded-circle ms-1"
                                        />
                                      )}
                                      <div
                                        className="flex-fill d-flex justify-content-end"
                                        style={{
                                          fontSize: "12px",
                                          fontWeight: "600",
                                          color: mailBody.isRead
                                            ? "#84908E"
                                            : "#00000",
                                        }}
                                      >
                                        {moment(
                                          mailBody.receivedDateTime
                                        ).format("DD/MM/YYYY")}
                                      </div>
                                    </div>
                                    <div
                                      className={`${styles.description}`}
                                      style={{
                                        color: mailBody.isRead
                                          ? "#84908E"
                                          : "#00000",
                                        fontWeight: mailBody.isRead
                                          ? "500"
                                          : "600",
                                      }}
                                    >
                                      {mailBody.bodyPreview}
                                    </div>
                                  </div>
                                </div>
                              </a>
                            );
                          })
                      ) : (
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ height: "200px", width: "400px" }}
                        >
                          <EmptyCard />
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  label: `Meetings`,
                  key: "2",
                  children: (
                    <div
                      style={{
                        height: "300px",
                        overflowY: "scroll",
                        fontFamily: "Avenir Next",
                      }}
                    >
                      {calendarMeetingData?.length > 0 ? (
                        calendarMeetingData
                          ?.slice(0, 5)
                          ?.map((meeting: any, index: number) => {
                            return (
                              <div
                                className={`d-flex justify-content-between py-3 ${
                                  index === 0 ? "" : "border-top border-3"
                                }`}
                                style={{ width: "400px" }}
                              >
                                <div>
                                  <div
                                    className="fs-6"
                                    style={{
                                      color: "#414141",
                                      fontWeight: "600",
                                    }}
                                  >
                                    {meeting.subject}
                                  </div>

                                  <div
                                    style={{
                                      fontSize: "12px",
                                      fontWeight: "500",
                                    }}
                                  >
                                    Organised By:{" "}
                                    {meeting.organizer.emailAddress.name}
                                  </div>
                                </div>
                                <div className="d-flex justify-content-center align-items-center">
                                  <a
                                    href={meeting.onlineMeeting?.joinUrl}
                                    className="text-decoration-none py-2 px-3 text-white fw-semibold"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-interception="off"
                                    style={{
                                      backgroundColor: "#525ab2",
                                    }}
                                    key={index}
                                  >
                                    Join
                                  </a>
                                </div>
                              </div>
                            );
                          })
                      ) : (
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ height: "200px", width: "400px" }}
                        >
                          <EmptyCard />
                        </div>
                      )}
                    </div>
                  ),
                },
                {
                  label: `Pending Approvals`,
                  key: "3",
                  children: (
                    <div
                      style={{
                        height: "300px",
                        overflowY: "scroll",
                        fontFamily: "Avenir Next",
                      }}
                    >
                      {AllRequestData?.length > 0 ? (
                        AllRequestData?.map((Request: any, index: number) => {
                          return (
                            <div
                              className={`d-flex justify-content-between py-3 ${
                                index === 0 ? "" : "border-top border-3"
                              }`}
                              style={{ width: "400px" }}
                            >
                              <div>
                                <div
                                  className=""
                                  style={{
                                    color: "#414141",
                                  }}
                                >
                                  {Request.Type === "loanRequest"
                                    ? "Loan Request"
                                    : Request.Type === "paymentRequest"
                                    ? "Payment Request"
                                    : "User Creation Request"}
                                </div>
                                <div
                                  className="fs-6"
                                  style={{
                                    color: "#414141",
                                    fontWeight: "600",
                                  }}
                                >
                                  {Request.ReferenceNumber}
                                </div>
                              </div>
                              <div className="d-flex justify-content-center align-items-center">
                                <a
                                  href={`${context.pageContext.site.absoluteUrl}/SitePages/Workflow.aspx?${Request.Type}=${Request.ID}`}
                                  className="text-decoration-none py-2 px-3 text-white fw-semibold"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  data-interception="off"
                                  style={{
                                    backgroundColor: "rgb(181, 77, 38)",
                                  }}
                                  key={index}
                                >
                                  View
                                </a>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div
                          className="d-flex justify-content-center align-items-center"
                          style={{ height: "200px", width: "400px" }}
                        >
                          <EmptyCard />
                        </div>
                      )}
                    </div>
                  ),
                },
              ]}
            />
          </div>
        ),
        key: "0",
      },
    ];

    return (
      <div style={{ fontFamily: "Avenir Next" }}>
        <Row>
          <Col xs={0} sm={0} md={0} lg={24}>
            <div className="w-100 shadow" style={{ height: "150px" }}>
              <div className="h-100">
                <div className="d-flex align-items-center h-100 gap-4">
                  {/* <Logo context={context} /> */}
                  <div className="flex-fill h-100 ">
                    <Topbar context={context} />
                    <div
                      className="d-flex justify-content-between align-items-center px-2"
                      style={{ height: "70px" }}
                    >
                      <DateTime />
                      <Weather />
                      <Prayer />
                      <div style={{ fontFamily: "Avenir Next" }}>
                        <div>
                          <div>
                            <small style={{ fontWeight: "600" }}>
                              Share Price
                            </small>
                          </div>
                          {sharePriceData && (
                            <div
                              className="fw-bold"
                              style={{ color: "rgb(181, 77, 38)" }}
                            >
                              {Number(sharePriceData?.Last)?.toFixed(2)} SAR
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="d-flex fw-bold bg-light align-items-center me-3">
                        {/* <span
                          className={`${
                            languageSelected === "English"
                              ? "text-white"
                              : "text-dark"
                          } p-2`}
                          onClick={() => hanfleChange("English")}
                          id="isArabicEN"
                          style={{
                            backgroundColor:
                              languageSelected === "English"
                                ? " rgb(181, 77, 38)"
                                : "",
                            cursor: "pointer",
                          }}
                        >
                          EN
                        </span>
                        <span
                          className={`${
                            languageSelected === "Arabic"
                              ? "text-white"
                              : "text-dark"
                          } p-2`}
                          onClick={() => hanfleChange("Arabic")}
                          id="isArabicAR"
                          style={{
                            backgroundColor:
                              languageSelected === "Arabic"
                                ? " rgb(181, 77, 38)"
                                : "",
                            cursor: "pointer",
                          }}
                        >
                          AR
                        </span> */}
                        <span
                          className=""
                          onClick={() => {
                            this.getMail();
                            this.getMeetings();
                            this.getNewUser();
                            this.getLoanRequest();
                            this.getPaymentRequest();
                          }}
                        >
                          <Dropdown
                            menu={{ items }}
                            placement="bottomRight"
                            trigger={["click"]}
                          >
                            <a onClick={(e) => e.preventDefault()}>
                              <Space>
                                <Badge
                                  count={
                                    unreadMail +
                                    calendarMeetingData?.length +
                                    AllRequestData?.length
                                  }
                                  overflowCount={10}
                                  showZero
                                >
                                  <img
                                    src={require("./notification.svg")}
                                    height={"25px"}
                                    width={"25px"}
                                  />
                                </Badge>
                              </Space>
                            </a>
                          </Dropdown>
                        </span>
                      </div>
                      {/* {AdminUser ? (
                        <div>
                          <a
                            href={`${context.pageContext.web.absoluteUrl}/_layouts/15/viewlsts.aspx`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <img src={settings} width="40px" height="40px" />
                          </a>
                        </div>
                      ) : (
                        console.log("Not Admin User")
                      )} */}
                      {/* <div>
                        <a
                          className="text-decoration-none text-dark"
                          href="https://www.google.com/"
                        >
                          <img src={search} />
                        </a>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        {/* Mobile View */}
        <Row>
          <Col xs={24} sm={24} md={24} lg={0}>
            <div className="w-100 shadow" style={{ height: "100px" }}>
              <div className="container h-100">
                <div className=" d-flex align-items-center justify-content-between h-100">
                  <Logo context={context} />
                  <Sidebar context={context} />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
