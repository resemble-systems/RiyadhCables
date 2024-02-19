import * as React from "react";
import { Carousel, Badge } from "antd";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import { Modal } from "antd";
import EmptyCard from "../../../../commonComponents/emptyCard/EmptyCard";
import { UserConsumer } from "../../../../service/UserContext";
import CommonLayout from "../../../../commonComponents/layout/Layout";
import CommonCard from "../../../../commonComponents/commonCard";

interface INewJoineeProps {
  context: WebPartContext;
  marginRight: boolean;
}

interface INewJoineeState {
  employeeAsRecent: any;
  pointerEvents: any;
  isModalOpen: boolean;
  ModalData: any;
}

export default class NewJoinee extends React.Component<
  INewJoineeProps,
  INewJoineeState
> {
  public constructor(props: INewJoineeProps, state: INewJoineeState) {
    super(props);
    this.state = {
      employeeAsRecent: [],
      pointerEvents: true,
      isModalOpen: false,
      ModalData: {},
    };
  }

  public componentDidMount(): void {
    this.getNewJoinees();
  }

  public getNewJoinees: any = () => {
    const { context } = this.props;

    context.spHttpClient

      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('NewJoinee')/items?$top=1000&$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )

      .then((res: SPHttpClientResponse) => {
        console.log("listItems Success");
        return res.json();
      })

      .then((listItems: any) => {
        console.log("Res listItems", listItems);
        const sortedItems: any = listItems.value.sort(
          (a: any, b: any) =>
            new Date(b.Created).getTime() - new Date(a.Created).getTime()
        );

        const filteredEmployee: any = sortedItems.filter((item: any) => {
          return (
            new Date(item.Date) >=
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          );
        });
        console.log("filteredEmployee", filteredEmployee);
        console.log("employeeAsRecent", sortedItems);
        this.setState({ employeeAsRecent: filteredEmployee });
      });
  };

  public updateItem = (employeeResponse: any, ID: any) => {
    const { context } = this.props;
    const headers: any = {
      "X-HTTP-Method": "MERGE",
      "If-Match": "*",
    };
    const spHttpClintOptions: ISPHttpClientOptions = {
      headers,
      body: JSON.stringify({
        Congratulations: employeeResponse,
      }),
    };
    context.spHttpClient
      .post(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('NewJoinee')/items('${ID}')`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      )
      .then((r) => {
        console.log(r, "Post Response");
        this.getNewJoinees();
      });
  };

  public congratulationsCount: any = (congratulationData: any) => {
    console.log(
      congratulationData,
      "congratulationData",
      JSON.parse(congratulationData)
    );

    if (
      !JSON.parse(congratulationData) ||
      JSON.parse(congratulationData)?.length === 0
    )
      return 0;
    else return JSON.parse(congratulationData).length;
  };

  public checkCurrentPersonWish: any = (personWish: any) => {
    const { context } = this.props;
    let parsedPersonWish: any = JSON.parse(personWish);

    console.log(parsedPersonWish, "parsedPersonWish");
    let filteredParsedPersonWish: any = [];
    if (parsedPersonWish) {
      filteredParsedPersonWish = parsedPersonWish.filter((wish: any) => {
        return wish.RespondantName === context.pageContext.user.displayName;
      });
    }
    console.log(
      context.pageContext.user.displayName,
      filteredParsedPersonWish,
      "filteredParsedPersonWish"
    );
    if (filteredParsedPersonWish.length > 0) return true;
    else return false;
  };

  public handleSubmit = (ID: any, NAME: any, CONGRATULATION: any) => {
    const { context } = this.props;
    let result = {
      RespondantName: context.pageContext.user.displayName,
      RespondantEmail: context.pageContext.user.email,
    };

    let congratulationArray = JSON.parse(CONGRATULATION);
    console.log(congratulationArray, "TEST");

    let isUserExist: any = [];
    if (congratulationArray) {
      isUserExist = congratulationArray.filter(
        (item: any) =>
          item.RespondantName === context.pageContext.user.displayName &&
          item.RespondantEmail === context.pageContext.user.email
      );
    }
    console.log(isUserExist, "isUserExist");
    if (!congratulationArray) {
      console.log(
        "!congratulationArray || congratulationArray.length===0",
        !congratulationArray
      );
      let employeeResult = [result];
      let employeeResponse = JSON.stringify(employeeResult);
      console.log("employeeResult", employeeResult);
      console.log("employeeResponse", employeeResponse);
      this.updateItem(employeeResponse, ID);
    }
    if (isUserExist.length > 0) {
      console.log("isUserExist.length > 0", isUserExist.length > 0);
      let employeeResult = [...congratulationArray];
      console.log("employeeResult", employeeResult);
      let employeeResponse = JSON.stringify(employeeResult);
      this.updateItem(employeeResponse, ID);
    } else {
      let employeeResult = [...congratulationArray, result];
      console.log("employeeResultElse", employeeResult);
      let employeeResponse = JSON.stringify(employeeResult);
      this.updateItem(employeeResponse, ID);
    }
  };

  public render(): React.ReactElement<INewJoineeProps> {
    const left = require("../../assets/left.png");
    const right = require("../../assets/right.png");
    const userImg = require("./assets/userImg.jpg");
    const { employeeAsRecent, isModalOpen, ModalData } = this.state;
    const { context, marginRight } = this.props;
    const handleModel = () => {
      this.setState({ isModalOpen: false });
    };

    let carouselAction: any = {};

    return (
      <UserConsumer>
        {(UserDetails: {
          name: string;
          email: string;
          isAdmin: boolean;
          isSmallScreen: boolean;
        }) => {
          return (
            <CommonLayout
              lg={8}
              xl={8}
              classNames={`${marginRight && "marginRight"}`}
            >
              <CommonCard
                cardIcon={require("../../assets/calender.svg")}
                cardTitle={"New Joinee's"}
                footerText={""}
                footerVisible={false}
                rightPanelVisible={false}
                redirectionLink={``}
                rightPanelElement={<></>}
              >
                {employeeAsRecent?.length > 0 ? (
                  <div className="my-5" style={{ position: "relative" }}>
                    <Carousel
                      autoplay
                      dots={false}
                      ref={(ref) => {
                        carouselAction = ref;
                      }}
                    >
                      {employeeAsRecent.map((employee: any) => {
                        console.log(
                          this.checkCurrentPersonWish(employee.Congratulations),
                          "checkCurrentPersonWish"
                        );
                        return (
                          <>
                            <div
                              className="d-flex justify-content-center align-items-center"
                              key={employee.ID}
                            >
                              <div>
                                <div className="d-flex justify-content-center mb-2">
                                  {employee?.AttachmentFiles.length > 0 ? (
                                    <img
                                      src={
                                        context.pageContext.web.absoluteUrl
                                          .split("/")
                                          .slice(0, 3)
                                          .join("/") +
                                        employee?.AttachmentFiles[0]
                                          ?.ServerRelativeUrl
                                      }
                                      className="rounded-circle"
                                      width="170px"
                                      height="170px"
                                      alt="Employee"
                                    />
                                  ) : (
                                    <img
                                      src={userImg}
                                      className="rounded-circle"
                                      width="170px"
                                      height="170px"
                                      alt="Employee"
                                    />
                                  )}
                                </div>
                                <div
                                  className={`d-flex justify-content-center`}
                                  style={{
                                    fontSize: "28px",
                                    fontWeight: "500",
                                    color: "#002c8b",
                                  }}
                                >
                                  <span
                                    className="d-inline-block text-truncate text-center"
                                    style={{ width: "200px" }}
                                  >
                                    {employee.Title}
                                  </span>{" "}
                                </div>
                                <div
                                  className="d-flex justify-content-center mb-3"
                                  style={{
                                    fontSize: "20px",
                                    fontWeight: "500",
                                    color: "rgba(74, 74, 74, 0.45)",
                                  }}
                                >
                                  {employee.Designation}
                                </div>
                                {context.pageContext.user.displayName.toLowerCase() ===
                                employee.Title.toLowerCase() ? (
                                  <div
                                    className={`d-flex justify-content-center border border-3 rounded-pill border-secondary p-2`}
                                    style={{
                                      fontSize: "20px",
                                      cursor: "pointer",
                                      fontWeight: "600",
                                    }}
                                    onClick={() => {
                                      this.setState({
                                        isModalOpen: true,
                                        ModalData: {
                                          Title: employee.Title,
                                          Congratulations:
                                            employee.Congratulations,
                                        },
                                      });
                                    }}
                                  >
                                    {console.log(
                                      context.pageContext.user.displayName.toLowerCase(),
                                      employee.Title.toLowerCase(),
                                      "context.pageContext.user.displayName.toLowerCase"
                                    )}
                                    View Wishes
                                  </div>
                                ) : (
                                  <div>
                                    <div
                                      className={`d-flex justify-content-center border border-3 rounded-pill ${
                                        this.checkCurrentPersonWish(
                                          employee.Congratulations
                                        )
                                          ? "border-secondary"
                                          : "border-dark"
                                      }`}
                                      style={{
                                        fontSize: "20px",
                                        fontWeight: this.checkCurrentPersonWish(
                                          employee.Congratulations
                                        )
                                          ? "600"
                                          : "600",
                                        cursor: "pointer",
                                        pointerEvents:
                                          this.checkCurrentPersonWish(
                                            employee.Congratulations
                                          )
                                            ? "none"
                                            : "auto",
                                        backgroundColor:
                                          this.checkCurrentPersonWish(
                                            employee.Congratulations
                                          )
                                            ? "rgb(184, 78, 38)"
                                            : "none",
                                      }}
                                      onClick={() => {
                                        this.handleSubmit(
                                          employee.ID,
                                          employee.Title,
                                          employee.Congratulations
                                        );
                                      }}
                                    >
                                      <Badge
                                        count={this.congratulationsCount(
                                          employee.Congratulations
                                        )}
                                        overflowCount={10}
                                        className="p-3"
                                      >
                                        <span
                                          className={`${
                                            this.checkCurrentPersonWish(
                                              employee.Congratulations
                                            )
                                              ? "text-white "
                                              : "text-dark "
                                          }`}
                                        >
                                          Congratulations
                                        </span>
                                      </Badge>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </Carousel>
                    <div
                      className="d-flex justify-content-between"
                      style={{
                        position: "absolute",
                        left: "0",
                        right: "0",
                        top: "35%",
                      }}
                    >
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => carouselAction.prev()}
                      >
                        <img src={left} alt="<" width={"50px"} />
                      </div>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => carouselAction.next()}
                      >
                        <img src={right} alt=">" width={"50px"} />
                      </div>
                    </div>
                    <Modal
                      title="Greetings"
                      open={isModalOpen}
                      onOk={handleModel}
                      onCancel={handleModel}
                      footer={null}
                    >
                      <div
                        style={{
                          height: "300px",
                          overflowY: "scroll",
                          scrollbarWidth: "thin",
                        }}
                      >
                        {ModalData &&
                          ModalData.Congratulations?.length > 0 &&
                          JSON.parse(ModalData.Congratulations).map(
                            (items: any, index: any) => (
                              <div
                                style={{ fontSize: "16px", fontWeight: "500" }}
                              >
                                {index + 1}. {items.RespondantName} welcomed
                                you.
                              </div>
                            )
                          )}
                      </div>
                    </Modal>
                  </div>
                ) : (
                  <EmptyCard />
                )}
              </CommonCard>
            </CommonLayout>
          );
        }}
      </UserConsumer>
    );
  }
}
