import * as React from "react";
import { Row, Col } from "antd";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import style from "./Birthday.module.sass";
import CommonLayout from "../../../../commonComponents/layout/Layout";
import EmptyCard from "../../../../commonComponents/emptyCard/EmptyCard";
import BirthdayCard from "../../../../commonComponents/birthdayCard/BirthdayCard";

interface IBirthdayProps {
  context: WebPartContext;
  marginRight: boolean;
}

interface IBirthdayState {
  birthdayAsRecent: any;
}

export default class Birthday extends React.Component<
  IBirthdayProps,
  IBirthdayState
> {
  public constructor(props: IBirthdayProps, state: IBirthdayState) {
    super(props);
    this.state = {
      birthdayAsRecent: [],
    };
  }
  public componentDidMount(): void {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('BirthDay')/items?$top=1000&$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(`Error in Birthday Fetch ${res.status}`);
          return;
        }
      })
      .then((listItems: { value: any }) => {
        console.log("Birthday Fetch", listItems);
        const sortedItems: any = listItems.value.sort(
          (a: { Created: string }, b: { Created: string }) =>
            new Date(b.Created).getTime() - new Date(a.Created).getTime()
        );
        const currentMonth = new Date().getMonth() + 1;
        const nullFilter = sortedItems.filter((item: any) => {
          return item.Date !== null;
        });
        const currentMonthBirthday = nullFilter.filter((item: any) => {
          var month = item.Date.split("-")[1];
          return currentMonth === +month;
        });
        const sortedItemsByDate: any = currentMonthBirthday.sort(
          (a: { Date: string }, b: { Date: string }) =>
            new Date(a.Date).getDate() - new Date(b.Date).getDate()
        );
        this.setState({ birthdayAsRecent: sortedItemsByDate });
      });
  }

  public render(): React.ReactElement<IBirthdayProps> {
    const cake = require("./cake.svg");
    const nameOfMonth = new Date().toLocaleString("default", { month: "long" });
    const { birthdayAsRecent } = this.state;
    const { context } = this.props;
    const birthdayCount = birthdayAsRecent.length;

    return (
      <CommonLayout lg={24} xl={24} classNames="shadow-lg">
        <Row className="cardContainer">
          <Col xs={24} sm={24} md={8} lg={6} xl={6} xxl={6}>
            <div
              className="d-flex align-items-center"
              style={{ height: "250px", fontFamily: "Avenir Next" }}
            >
              <div className={`${style.cardOne}`}>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ fontSize: "42px", fontWeight: "700" }}
                >
                  {nameOfMonth}
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <img src={cake} alt="F" />
                </div>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ fontSize: "22px", fontWeight: "700" }}
                >
                  {`${birthdayCount} Birthdays`}
                </div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={16} lg={18} xl={18} xxl={18}>
            {birthdayAsRecent?.length > 0 ? (
              <div
                className={`d-md-flex align-items-center ms-3 scroll ${style.cardTwo}`}
                style={{
                  scrollbarWidth: "thin",
                }}
              >
                {birthdayAsRecent.map(
                  (birthday: {
                    ID: number;
                    AttachmentFiles: any[];
                    Title: string;
                    Date: string;
                    Achievements: string;
                  }) => {
                    return (
                      <BirthdayCard
                        context={context}
                        cardItem={birthday}
                        dateVisible={true}
                        achievements={false}
                      />
                    );
                  }
                )}
              </div>
            ) : (
              <EmptyCard />
            )}
          </Col>
        </Row>
      </CommonLayout>
    );
  }
}
