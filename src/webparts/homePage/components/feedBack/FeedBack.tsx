import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";
import { UserConsumer } from "../../../../service/UserContext";
import CommonLayout from "../../../../commonComponents/layout/Layout";
import CommonCard from "../../../../commonComponents/commonCard";
import { Input, Modal, Pagination, PaginationProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import PageNumber from "../../../../commonComponents/pagination/Pagination";
import ModalPagination from "../../../../commonComponents/pagination/ModalPagination";
import EmptyCard from "../../../../commonComponents/emptyCard/EmptyCard";

export interface IFeedBackProps {
  context: WebPartContext;
  marginRight: boolean;
}

/* interface ModalElement {
  RespondantAnswer: {
    answerOne: string;
    answerTwo: string;
    answerThree: string;
  };
  RespondantEmail: string;
  RespondantName: string;
} */

export interface IFeedBackState {
  feedBackData: Array<any>;
  modalData: Array<any>;
  currentPage: number;
  feedBackAnswers: {
    answerOne: string;
    answerTwo: string;
    answerThree: string;
  };
  isModalOpen: boolean;
  currentModalData: {
    ID: number;
    Title: string;
    QuestionOne: string;
    QuestionTwo: string;
    QuestionThree: string;
    Answer: Array<{
      RespondantAnswer: {
        answerOne: string;
        answerTwo: string;
        answerThree: string;
      };
      RespondantEmail: string;
      RespondantName: string;
    }>;
  };
  modalCurrentPage: number;
  pageNumber: number;
}

export default class FeedBack extends React.Component<
  IFeedBackProps,
  IFeedBackState
> {
  public constructor(props: IFeedBackProps, state: IFeedBackState) {
    super(props);

    this.state = {
      feedBackData: [],
      modalData: [],
      currentPage: 1,
      feedBackAnswers: { answerOne: "", answerTwo: "", answerThree: "" },
      isModalOpen: false,
      modalCurrentPage: 1,
      currentModalData: {
        ID: 0,
        Title: "",
        QuestionOne: "",
        QuestionTwo: "",
        QuestionThree: "",
        Answer: [],
      },
      pageNumber: 1,
    };
  }

  public componentDidMount(): void {
    this.getFeedback();
  }

  public getFeedback() {
    const { context } = this.props;
    const { modalCurrentPage } = this.state;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Feedback')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        console.log("listItems Success");
        return res.json();
      })
      .then((listItems: any) => {
        console.log("Res listItems", listItems);
        const approvedItems: any = listItems.value;
        const sortedItems: any = approvedItems?.sort(
          (a: any, b: any) =>
            new Date(b.Created).getTime() - new Date(a.Created).getTime()
        );

        const feedbackResult = sortedItems.filter((data: { Answer: string }) =>
          data.Answer && JSON.parse(data.Answer).length
            ? JSON.parse(data.Answer).filter(
                (answer: { RespondantEmail: string }) =>
                  answer.RespondantEmail?.toLowerCase() ===
                  context.pageContext.user.email?.toLowerCase()
              ).length
              ? null
              : data
            : data
        );
        const modalAnswerData = sortedItems?.map(
          (data: {
            ID: number;
            Title: string;
            QuestionOne: string;
            QuestionTwo: string;
            QuestionThree: string;
            Answer: string;
          }) => {
            return {
              ID: data.ID,
              Title: data.Title,
              QuestionOne: data.QuestionOne,
              QuestionTwo: data.QuestionTwo,
              QuestionThree: data.QuestionThree,
              Answer: data.Answer ? JSON.parse(data.Answer) : null,
            };
          }
        );
        const answerFilter = modalAnswerData?.filter(
          (data: { Answer: any }) => data.Answer != null || undefined
        );
        console.log("modalAnswerData", answerFilter);
        this.setState({
          modalData: answerFilter,
          feedBackData: feedbackResult,
          currentModalData: answerFilter[modalCurrentPage - 1],
        });
      });
  }

  public componentDidUpdate(
    prevProps: Readonly<IFeedBackProps>,
    prevState: Readonly<IFeedBackState>
  ): void {
    const { modalCurrentPage, modalData } = this.state;
    if (prevState.modalCurrentPage !== modalCurrentPage) {
      this.setState({
        currentModalData: modalData[modalCurrentPage - 1],
      });
    }
  }

  public uploadFeedbackResult(Id: number, resultToBePosted: string) {
    const { context } = this.props;
    const headers: any = {
      "X-HTTP-Method": "MERGE",
      "If-Match": "*",
    };
    const spHttpClintOptions: ISPHttpClientOptions = {
      headers,
      body: JSON.stringify({
        Answer: resultToBePosted,
      }),
    };
    context.spHttpClient
      .post(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Feedback')/items('${Id}')`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      )
      .then((r) => {
        console.log(r, "Feedback Post Response");
        this.getFeedback();
        this.setState({
          feedBackAnswers: {
            answerOne: "",
            answerTwo: "",
            answerThree: "",
          },
        });
      });
  }

  public render(): React.ReactElement<IFeedBackProps> {
    const {
      feedBackData,
      currentPage,
      feedBackAnswers,
      isModalOpen,
      modalData,
      modalCurrentPage,
      currentModalData,
      pageNumber,
    } = this.state;
    const dataPerPage = 1;
    const numberOfElements = feedBackData?.length;
    const numberOfModalData = modalData?.length;
    const numberOfPages = Math.round(numberOfElements / dataPerPage);
    const numberOfModalPages = Math.round(numberOfModalData / dataPerPage);
    const indexOfLastPage = currentPage * dataPerPage;
    const indexOfFirstPage = indexOfLastPage - dataPerPage;
    const currentData = feedBackData.slice(indexOfFirstPage, indexOfLastPage);

    const left = require("../../assets/left.png");
    const right = require("../../assets/right.png");
    const { marginRight, context } = this.props;

    const handleModel = () => {
      this.setState({ isModalOpen: false });
    };
    const handleChange = (event: {
      target: { name: string; value: string };
    }) => {
      this.setState({
        feedBackAnswers: {
          ...feedBackAnswers,
          [event.target.name]: event.target.value,
        },
      });
    };
    const handleClick = (value: string) => {
      this.setState({
        feedBackAnswers: {
          ...feedBackAnswers,
          answerTwo: value,
        },
      });
    };
    const handleSubmit = (Id: number, prevAnswers: string) => {
      const { context } = this.props;
      if (
        feedBackAnswers.answerOne.length < 2 &&
        feedBackAnswers.answerThree.length < 2 &&
        feedBackAnswers.answerTwo.length < 2
      ) {
        alert("Enter valid Answer");
      } else {
        let answerToBePosted = {
          RespondantName: context.pageContext.user.displayName,
          RespondantEmail: context.pageContext.user.email,
          RespondantAnswer: feedBackAnswers,
        };
        const prevFeedBackResult = JSON.parse(prevAnswers ? prevAnswers : "[]");
        const feedBackResult = JSON.stringify([answerToBePosted]);
        if (!prevFeedBackResult) {
          const resultToBePosted = feedBackResult;
          this.uploadFeedbackResult(Id, resultToBePosted);
        } else {
          const resultToBePosted = JSON.stringify([
            ...prevFeedBackResult,
            answerToBePosted,
          ]);
          this.uploadFeedbackResult(Id, resultToBePosted);
        }
      }
    };
    console.log(feedBackAnswers, "feedBackAnswers");

    const onChange: PaginationProps["onChange"] = (page) => {
      this.setState({ pageNumber: page });
    };

    const answerBy: () => string = () => {
      return currentModalData?.Answer[pageNumber - 1]?.RespondantName;
    };
    const answerEmail: () => string = () => {
      return currentModalData?.Answer[pageNumber - 1]?.RespondantEmail;
    };
    const answerOne: () => string = () => {
      return currentModalData?.Answer[pageNumber - 1]?.RespondantAnswer
        ?.answerOne;
    };
    const answerTwo: () => string = () => {
      return currentModalData?.Answer[pageNumber - 1]?.RespondantAnswer
        ?.answerTwo;
    };
    const answerThree: () => string = () => {
      return currentModalData?.Answer[pageNumber - 1]?.RespondantAnswer
        ?.answerThree;
    };

    return (
      <UserConsumer>
        {(UserDetails: {
          name: string;
          email: string;
          isAdmin: boolean;
          isSmallScreen: boolean;
        }) => {
          const { isAdmin } = UserDetails;
          return (
            <CommonLayout
              lg={8}
              xl={8}
              classNames={`${marginRight && "marginRight"}`}
            >
              <CommonCard
                cardIcon={require("../../assets/feedBack.png")}
                cardTitle={"Feedback"}
                footerText={"View All"}
                footerVisible={false}
                rightPanelVisible={true}
                redirectionLink={``}
                rightPanelElement={
                  <PageNumber
                    self={this}
                    left={left}
                    right={right}
                    currentPage={currentPage}
                    numberOfPages={numberOfPages}
                  />
                }
                footerPanelVisible={isAdmin}
                footerPanelElement={
                  <div
                    onClick={() => {
                      this.setState({ isModalOpen: true });
                    }}
                  >
                    View Feedback
                  </div>
                }
              >
                <div
                  className="feedbackContainer"
                  style={{
                    height: "410px",
                    overflowY: "scroll",
                    scrollbarWidth: "thin",
                    fontFamily: "Avenir Next",
                  }}
                >
                  {currentData?.length > 0 ? (
                    <>
                      {currentData?.map((data) => {
                        return (
                          <div
                            className="d-flex flex-column gap-3"
                            style={{ fontFamily: "Avenir Next" }}
                          >
                            <div>{data.Title}</div>
                            <div>
                              <div className="mb-2">{data.QuestionOne}</div>
                              <Input
                                placeholder=""
                                type="text"
                                value={feedBackAnswers.answerOne}
                                name="answerOne"
                                onChange={handleChange}
                              />
                            </div>
                            <div>
                              <div className="mb-2">{data.QuestionTwo}</div>
                              <div className="d-flex gap-2">
                                <input
                                  type="button"
                                  value="Yes"
                                  name="answerTwo"
                                  onClick={() => handleClick("Yes")}
                                  className={`border-0 py-2 px-3 rounded ${
                                    feedBackAnswers.answerTwo === "Yes"
                                      ? "text-white"
                                      : ""
                                  }`}
                                  style={{
                                    backgroundColor:
                                      feedBackAnswers.answerTwo === "Yes"
                                        ? "rgb(181, 77, 38)"
                                        : "#dddddd",
                                  }}
                                />
                                <input
                                  type="button"
                                  value="No"
                                  name="answerTwo"
                                  onClick={() => handleClick("No")}
                                  className={`border-0 py-2 px-3 rounded ${
                                    feedBackAnswers.answerTwo === "No"
                                      ? "text-white"
                                      : ""
                                  }`}
                                  style={{
                                    backgroundColor:
                                      feedBackAnswers.answerTwo === "No"
                                        ? "rgb(181, 77, 38)"
                                        : "#dddddd",
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="mb-2">{data.QuestionThree}</div>
                              <TextArea
                                rows={4}
                                placeholder="Add Comments"
                                showCount
                                value={feedBackAnswers.answerThree}
                                name="answerThree"
                                onChange={handleChange}
                                maxLength={50}
                              />
                            </div>
                            <div className="d-flex justify-content-end mt-2">
                              <button
                                style={{
                                  border: "none",
                                  backgroundColor: " rgb(181, 77, 38)",
                                  fontSize: "16px",
                                }}
                                className="text-white py-2 px-3 rounded"
                                onClick={() =>
                                  handleSubmit(data.ID, data.Answer)
                                }
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <EmptyCard />
                  )}
                </div>
                <Modal
                  title={"Feedback Response"}
                  footer={false}
                  onOk={handleModel}
                  open={isModalOpen}
                  onCancel={handleModel}
                >
                  <div
                    className="d-flex flex-column justify-content-between"
                    style={{ fontFamily: "Avenir Next" }}
                  >
                    <div
                      className={`d-flex ${
                        currentModalData?.Answer
                          ? "justify-content-between"
                          : "justify-content-end"
                      }`}
                    >
                      {currentModalData?.Answer && (
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: " rgb(181, 77, 38)",
                          }}
                        >
                          Q{modalCurrentPage}. {currentModalData?.Title}
                        </div>
                      )}
                      <ModalPagination
                        self={this}
                        left={left}
                        right={right}
                        modalCurrentPage={modalCurrentPage}
                        numberOfModalPages={numberOfModalPages}
                      />
                      {console.log(
                        "modalData in modal",
                        currentModalData,
                        currentModalData?.Answer?.length,
                        pageNumber
                      )}
                    </div>
                    {currentModalData?.Answer ? (
                      <div className="mb-3 pt-2">
                        <div className="d-flex flex-column gap-2">
                          <span
                            style={{
                              fontSize: "18px",
                              fontWeight: "600",
                            }}
                          >
                            1. {currentModalData?.QuestionOne}
                          </span>
                          <span
                            className="ms-4"
                            style={{
                              fontSize: "16px",
                              fontWeight: "600",
                            }}
                          >
                            {answerOne()}
                          </span>
                        </div>
                        <div className="d-flex flex-column gap-2">
                          <span
                            style={{
                              fontSize: "18px",
                              fontWeight: "600",
                            }}
                          >
                            2. {currentModalData?.QuestionTwo}
                          </span>
                          <span
                            className="ms-4"
                            style={{
                              fontSize: "16px",
                              fontWeight: "600",
                            }}
                          >
                            {answerTwo()}
                          </span>
                        </div>
                        <div className="d-flex flex-column gap-2">
                          <span
                            style={{
                              fontSize: "18px",
                              fontWeight: "600",
                            }}
                          >
                            3. {currentModalData?.QuestionThree}
                          </span>
                          <span
                            className="ms-4"
                            style={{
                              fontSize: "16px",
                              fontWeight: "600",
                            }}
                          >
                            {answerThree()}
                          </span>
                        </div>
                        <div
                          className="mb-2"
                          style={{
                            fontSize: "20px",
                            fontWeight: "600",
                            color: " rgb(181, 77, 38)",
                          }}
                        >
                          Response By{" "}
                        </div>
                        <div
                          className="d-flex gap-2 p-2 border border-primary"
                          style={{ width: "max-content" }}
                        >
                          <div className="d-flex align-items-center">
                            <img
                              className="rounded-circle"
                              width="50px"
                              height="50px"
                              src={`${
                                context.pageContext.web.absoluteUrl
                              }/_layouts/15/userphoto.aspx?AccountName=${answerEmail()}`}
                            />
                          </div>
                          <div className="d-flex align-items-center">
                            <span
                              style={{
                                fontSize: "20px",
                                fontWeight: "600",
                              }}
                            >
                              {answerBy()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <EmptyCard />
                    )}
                    {currentModalData?.Answer && (
                      <div className="d-flex justify-content-center">
                        <Pagination
                          defaultPageSize={1}
                          onChange={onChange}
                          current={pageNumber}
                          total={currentModalData.Answer?.length}
                        />
                      </div>
                    )}
                  </div>
                </Modal>
              </CommonCard>
            </CommonLayout>
          );
        }}
      </UserConsumer>
    );
  }
}
