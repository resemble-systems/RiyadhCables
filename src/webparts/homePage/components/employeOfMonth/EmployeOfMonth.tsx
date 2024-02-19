import * as React from "react";
import { Row, Col } from "antd";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import style from "./EmployeOfMonth.module.sass";
import CommonLayout from "../../../../commonComponents/layout/Layout";
import EmptyCard from "../../../../commonComponents/emptyCard/EmptyCard";
import BirthdayCard from "../../../../commonComponents/birthdayCard/BirthdayCard";

interface IEmployeOfMonthProps {
  context: WebPartContext;
  marginRight: boolean;
}

interface IEmployeOfMonthState {
  EmployeOfMonthAsRecent: any;
}

export default class EmployeOfMonth extends React.Component<
  IEmployeOfMonthProps,
  IEmployeOfMonthState
> {
  public constructor(props: IEmployeOfMonthProps, state: IEmployeOfMonthState) {
    super(props);
    this.state = {
      EmployeOfMonthAsRecent: [],
    };
  }
  public componentDidMount(): void {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('EOM')/items?$top=1000&$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(`Error in EmployeOfMonth Fetch ${res.status}`);
          return;
        }
      })
      .then((listItems: { value: any }) => {
        console.log("EmployeOfMonth Fetch", listItems);
        const sortedItems: any = listItems.value.sort(
          (a: { Order0: number }, b: { Order0: number }) =>
            new Date(a.Order0).getTime() - new Date(b.Order0).getTime()
        );
        const currentMonth: string = new Date().toLocaleString("default", {
          month: "long",
        });
        const currentYear: string = new Date().getFullYear().toString();
        const employeOfMonth: Array<{}> = sortedItems?.filter(
          (employe: { Month: string; Year: string }) =>
            employe.Month === currentMonth && employe.Year === currentYear
        );
        this.setState({ EmployeOfMonthAsRecent: employeOfMonth });
      });
  }

  public render(): React.ReactElement<IEmployeOfMonthProps> {
    const celebration = require("../../assets/celeb.png");
    const nameOfMonth = new Date().toLocaleString("default", { month: "long" });
    const { EmployeOfMonthAsRecent } = this.state;
    const { context } = this.props;

    return (
      <CommonLayout lg={24} xl={24} classNames="shadow-lg">
        <Row className="cardContainer">
          <Col xs={24} sm={24} md={8} lg={6} xl={6} xxl={6}>
            <div
              className="d-flex align-items-center"
              style={{ height: "270px", fontFamily: "Avenir Next" }}
            >
              <div className={`${style.cardOne}`}>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ fontSize: "42px", fontWeight: "700" }}
                >
                  Welcome
                </div>
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{ fontSize: "22px", fontWeight: "700" }}
                >
                  Onboardee {nameOfMonth}
                </div>
                <div className="d-flex justify-content-center align-items-center">
                  <img src={celebration} alt="F" width="50px" />
                </div>
                <div className="d-flex justify-content-center align-items-center"></div>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={16} lg={18} xl={18} xxl={18}>
            {EmployeOfMonthAsRecent?.length > 0 ? (
              <div
                className={`d-md-flex align-items-center ms-3 me-3 scroll ${style.cardTwo}`}
                style={{
                  scrollbarWidth: "thin",
                }}
              >
                {EmployeOfMonthAsRecent.map(
                  (EmployeOfMonth: {
                    ID: number;
                    AttachmentFiles: any[];
                    Title: string;
                    Designation: string;
                    Achievements: string;
                  }) => {
                    return (
                      <BirthdayCard
                        cardItem={EmployeOfMonth}
                        context={context}
                        dateVisible={false}
                        achievements={true}
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
