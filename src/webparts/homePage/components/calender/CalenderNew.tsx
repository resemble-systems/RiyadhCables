import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Calendar, Col, Row, Select, Tooltip } from "antd";
import "dayjs/locale/zh-cn";
import type { CalendarMode } from "antd/es/calendar/generateCalendar";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import styles from "./calendar.module.sass";
import "./style.css";
import CommonLayout from "../../../../commonComponents/layout/Layout";
import { UserConsumer } from "../../../../service/UserContext";

interface ICalenderNewProps {
  context: WebPartContext;
  marginRight: boolean;
}

interface ICalenderNewState {
  UserData: any;
  visibility: any;
  calendarMeetingData: any;
  eventsData: any;
}

export default class CalenderNew extends React.Component<
  ICalenderNewProps,
  ICalenderNewState
> {
  public constructor(props: ICalenderNewProps, state: ICalenderNewState) {
    super(props);
    this.state = {
      UserData: null,
      visibility: false,
      calendarMeetingData: null,
      eventsData: [],
    };
  }
  public componentDidMount() {
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
            this.setState({ calendarMeetingData: calendar.value });
          });
      });
  }

  public filteredMeeting = (value: any) => {
    const { calendarMeetingData } = this.state;
    var moment = require("moment");
    let startTime = moment(value.$d).startOf("day").utc().format();
    let endTime = moment(value.$d).endOf("day").utc().format();
    let filteredMeetingData =
      calendarMeetingData?.length > 0 &&
      calendarMeetingData.filter((data: any) => {
        if (
          new Date(data.start.dateTime).getTime() >=
            new Date(startTime).getTime() &&
          new Date(data.end.dateTime).getTime() <= new Date(endTime).getTime()
        )
          return data;
      });
    return filteredMeetingData;
  };

  public dateFullCellRender = (value: any) => {
    let colorPallet = ["#1E2B45", "#7C29C4", "#21A266", "#F7BD15", "#FC6273"];
    return (
      <div style={{ height: "55px" }}>
        <div className="w-100 d-flex justify-content-start align-items-center flex-wrap">
          {this.filteredMeeting(value)?.length > 0 ? (
            this.filteredMeeting(value).map((meet: any) => (
              <Tooltip
                placement="topLeft"
                title={
                  <div className={``}>
                    <div className={`${styles.meetTitle}`}>{meet.subject}</div>
                    <a
                      href={
                        meet?.onlineMeeting?.joinUrl
                          ? meet.onlineMeeting.joinUrl
                          : meet.webLink
                      }
                      target={`_blank`}
                      className={`${styles.meetLink}`}
                      style={{ fontFamily: "Avenir Next" }}
                    >
                      Join now
                    </a>
                  </div>
                }
                color={"#fff"}
                key={1}
              >
                <div
                  style={{
                    height: "6px",
                    width: "6px",
                    borderRadius: "7px",
                    backgroundColor:
                      colorPallet[
                        Math.floor(Math.random() * colorPallet.length)
                      ],
                    margin: ".5px .5px",
                    fontFamily: "Avenir Next",
                  }}
                ></div>
              </Tooltip>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    );
  };

  public render(): React.ReactElement<ICalenderNewProps> {
    const calenderImg = require("../../assets/calender.svg");
    const left = require("../../assets/left.png");
    const right = require("../../assets/right.png");
    const onPanelChange = (value: any, mode: CalendarMode) => {};

    return (
      <UserConsumer>
        {(UserDetails: {
          name: string;
          email: string;
          isAdmin: boolean;
          isSmallScreen: boolean;
        }) => {
          return (
            <CommonLayout lg={8} xl={8} classNames={``} heigth="520px">
              <div className="p-3 w-100" style={{ fontFamily: "Avenir Next" }}>
                <Calendar
                  fullscreen={false}
                  dateCellRender={(data) => this.dateFullCellRender(data)}
                  headerRender={({
                    value,
                    type,
                    onChange,
                    onTypeChange,
                  }: any) => {
                    const start = 0;
                    const end = 12;
                    const monthOptions = [];
                    let current = value.clone();
                    const localeData = value.localeData();
                    const months = [];
                    for (let i = 0; i < 12; i++) {
                      current = current.month(i);
                      months.push(localeData.monthsShort(current));
                    }
                    for (let i = start; i < end; i++) {
                      monthOptions.push(
                        <Select.Option key={i} value={i} className="month-item">
                          {months[i]}
                        </Select.Option>
                      );
                    }
                    const year = value.year();
                    const month = value.month();
                    console.log(month);

                    const options = [];
                    for (let i = year - 10; i < year + 10; i += 1) {
                      options.push(
                        <Select.Option key={i} value={i} className="year-item">
                          {i}
                        </Select.Option>
                      );
                    }
                    return (
                      <div className="d-flex mb-3 justify-content-between align-items-center">
                        <div className="d-flex justify-content-start align-items-center">
                          <div>
                            <img src={calenderImg} />
                          </div>
                          <div
                            className="ps-3"
                            style={{
                              fontSize: "20px",
                              fontWeight: "700",
                              fontFamily: "Avenir Next",
                            }}
                          >
                            My Calendar
                          </div>
                        </div>
                        <Row gutter={8}>
                          <Col>
                            <div
                              style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "end",
                                fontFamily: "Avenir Next",
                              }}
                            >
                              <span
                                className="d-flex align-items-center"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  onChange(
                                    value.clone().month(value.month() - 1)
                                  );
                                }}
                              >
                                <img src={left} alt="<" width={"18px"} />
                              </span>{" "}
                              <span
                                className="d-flex align-items-center px-2"
                                style={{
                                  fontSize: "10px",
                                  fontWeight: "700",
                                  fontFamily: "Avenir Next",
                                }}
                              >
                                {value.format("MMMM,YYYY")}{" "}
                              </span>
                              <span
                                className="d-flex align-items-center"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  onChange(
                                    value.clone().month(value.month() + 1)
                                  );
                                }}
                              >
                                <img src={right} alt="<" width={"18px"} />
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    );
                  }}
                  onPanelChange={onPanelChange}
                />
              </div>
            </CommonLayout>
          );
        }}
      </UserConsumer>
    );
  }
}
