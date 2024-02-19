import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { UserConsumer } from "../../../../service/UserContext";
import CommonLayout from "../../../../commonComponents/layout/Layout";
import CommonCard from "../../../../commonComponents/commonCard";
import styles from "../HomePage.module.scss";
import EmptyCard from "../../../../commonComponents/emptyCard/EmptyCard";
import Loader from "../../../../commonComponents/loader/Loader";
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
export interface IPersonalEmailProps {
  context: WebPartContext;
  marginRight: boolean;
}
export interface IPersonalEmailState {
  mailData: Array<MailData>;
  isLoading: boolean;
}

export default class PersonalEmail extends React.Component<
  IPersonalEmailProps,
  IPersonalEmailState
> {
  public constructor(props: IPersonalEmailProps, state: IPersonalEmailState) {
    super(props);
    this.state = {
      mailData: [],
      isLoading: true,
    };
  }
  public componentDidMount(): void {
    const { context } = this.props;
    context.msGraphClientFactory
      .getClient("3")
      .then((grahpClient: MSGraphClientV3): void => {
        grahpClient
          .api(`me/messages`)
          .version("v1.0")
          .select("*")
          .top(20)
          .get((error: any, mail: any, rawResponse?: any) => {
            if (error) {
              console.log("Mail messages Error", error);
              return;
            }
            console.log("Mail Response", mail);
            console.log(
              "Mail Read",
              mail.value.filter((data: { isRead: any }) => data.isRead && data)
            );
            const filterDraft = mail.value?.filter(
              (mail: { isDraft: boolean }) => !mail.isDraft && mail
            );
            this.setState({ isLoading: false, mailData: filterDraft });
          });
      });
  }
  public nameTrimmer(name: Array<string>): string {
    const checkedName = name?.filter((str: string) =>
      RegExp(/^[A-Za-z]+$/).test(str) ? str : null
    );
    return checkedName?.join("").toUpperCase();
  }

  public render(): React.ReactElement<IPersonalEmailProps> {
    const { mailData, isLoading } = this.state;
    const { marginRight, context } = this.props;
    const moment = require("moment");
    return (
      <UserConsumer>
        {(UserDetails: {
          name: string;
          email: string;
          isAdmin: boolean;
          isSmallScreen: boolean;
        }) => {
          const { isAdmin, email } = UserDetails;
          return (
            <CommonLayout
              lg={8}
              xl={8}
              classNames={`${marginRight && "marginRight"}`}
            >
              <CommonCard
                cardIcon={require("../../assets/email.png")}
                cardTitle={"Personal Emails"}
                footerText={"View All"}
                footerVisible={true}
                rightPanelVisible={isAdmin}
                redirectionLink={`https://outlook.office.com/mail/`}
                rightPanelElement={<></>}
              >
                <div
                  style={{
                    height: "410px",
                    overflowY: "scroll",
                    scrollbarWidth: "thin",
                    fontFamily: "Avenir Next",
                  }}
                >
                  {!isLoading ? (
                    <>
                      {mailData?.length > 0 ? (
                        mailData.map((mailBody: MailData, index: number) => {
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
                              <div className="d-flex gap-3 border-top border-3 py-3">
                                <div className="d-flex justify-content-center align-items-center h-100">
                                  <div
                                    className="rounded-circle d-flex justify-content-center align-items-center text-white"
                                    style={{
                                      width: "44px",
                                      height: "44px",
                                      backgroundColor: " rgb(181, 77, 38)",
                                      fontFamily: "Avenir Next",
                                    }}
                                  >
                                    {mailBody.from?.emailAddress?.address?.split(
                                      "@"
                                    )[1] === email?.split("@")[1] ? (
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
                                        fontSize: "14px",
                                        fontFamily: "Avenir Next",
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
                                          fontFamily: "Avenir Next",
                                      }}
                                    >
                                      {moment(mailBody.receivedDateTime).format(
                                        "DD/MM/YYYY"
                                      )}
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
                                      fontSize: "14px",
                                      fontFamily: "Avenir Next",
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
                        <EmptyCard />
                      )}
                    </>
                  ) : (
                    <Loader row={2} avatar={true} skeletonCount={3} />
                  )}
                </div>
              </CommonCard>
            </CommonLayout>
          );
        }}
      </UserConsumer>
    );
  }
}
