import * as React from "react";
import EmptyCard from "../emptyCard/EmptyCard";
import styles from "./QuickPolls.module.scss";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Collapse, CollapseProps, Modal } from "antd";
import { ModalDataFinalElement } from "../../webparts/homePage/components/quickPolls/QuickPolls";
import ModalPagination from "../pagination/ModalPagination";
export interface IQuickPollsCardProps {
  self: any;
  currentData: any;
  modalData: ModalDataFinalElement[];
  isAdmin: boolean;
  handleSubmit: any;
  handleModel: any;
  handleEdit: any;
  quickPollsAsSorted: any;
  context: WebPartContext;
  currentPage: number;
  isModalOpen: boolean;
  optionSelected: any;
  quickPollsChoice: any;
}
interface IQuickPollsCardState {
  numberOfModalPages: number;
  modalCurrentPage: number;
  dataIndex: string;
}

export default class QuickPollsCard extends React.Component<
  IQuickPollsCardProps,
  IQuickPollsCardState
> {
  public constructor(props: IQuickPollsCardProps, state: IQuickPollsCardState) {
    super(props);
    this.state = {
      numberOfModalPages: 1,
      modalCurrentPage: 1,
      dataIndex: "0",
    };
  }
  public userCount(modalResult: string): number {
    const { optionSelected } = this.props;
    const count = JSON.parse(modalResult).filter(
      (data: any) => data.RespondantChoice.Option === optionSelected
    )?.length;
    return count;
  }

  public componentDidUpdate(
    prevProps: Readonly<IQuickPollsCardProps>,
    prevState: Readonly<IQuickPollsCardState>,
    snapshot?: any
  ): void {
    if (prevProps.modalData !== this.props.modalData) {
      this.setState({ numberOfModalPages: this.props.modalData?.length });
    }
    if (prevState.modalCurrentPage !== this.state.modalCurrentPage) {
      this.setState({ dataIndex: "0" });
    }
  }

  public render(): React.ReactElement<IQuickPollsCardProps> {
    const {
      handleEdit,
      handleModel,
      self,
      quickPollsChoice,
      currentData,
      quickPollsAsSorted,
      isModalOpen,
      modalData,
      context,
      handleSubmit,
      isAdmin,
    } = this.props;
    const { modalCurrentPage, numberOfModalPages, dataIndex } = this.state;
    const left = require("../../webparts/homePage/assets/left.png");
    const right = require("../../webparts/homePage/assets/right.png");
    const exercisesPerPage = 1;
    const indexOfLastPage = exercisesPerPage * modalCurrentPage;
    const indexOfFirstPage = indexOfLastPage - exercisesPerPage;
    const onChange = (key: string | string[]) => {
      console.log(key);
    };

    return (
      <>
        {quickPollsAsSorted?.length > 0 ? (
          <div
            className={`${styles.PollsContainer} mb-3`}
            style={{
              scrollbarWidth: "thin",
              fontFamily: "Avenir Next",
            }}
          >
            {currentData.map((quickpolls: any) => {
              console.log(
                "Quick Poll Condition",
                JSON.parse(quickpolls.Choice)
              );
              const ChoiceSelected = JSON.parse(quickpolls.Choice);
              let isUserExist: any = [];
              if (ChoiceSelected) {
                isUserExist = ChoiceSelected.filter(
                  (item: any) =>
                    item.RespondantName ===
                      context.pageContext.user.displayName &&
                    item.RespondantEmail === context.pageContext.user.email
                );
              }
              console.log("Poll", isUserExist, isUserExist.length);

              if (isUserExist.length === 0) {
                return (
                  <div className="d-flex my-3 me-2" key={quickpolls.ID}>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "500",
                      }}
                    >
                      Q{}
                    </div>
                    <div className="ms-2 w-100">
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "500",
                        }}
                      >
                        {quickpolls.Title}
                      </div>
                      <div className="mt-2">
                        {quickpolls.Option1 && (
                          <div
                            className="d-flex"
                            style={{
                              height: "30px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              self.setState({
                                quickPollsChoice: {
                                  ID: quickpolls.ID,
                                  Option: quickpolls.Option1,
                                },
                              });
                            }}
                          >
                            <div className="d-flex h-100 align-items-center">
                              <div
                                className="border border-2 border-dark rounded-circle "
                                style={{
                                  height: "15px",
                                  width: "15px",
                                  backgroundColor:
                                    quickPollsChoice.Option ===
                                      quickpolls.Option1 &&
                                    quickPollsChoice.ID === quickpolls.ID
                                      ? " rgb(181, 77, 38)"
                                      : "#ffffff",
                                }}
                              ></div>
                            </div>
                            <div className="d-flex h-100 align-items-center ps-2">
                              {quickpolls.Option1}
                            </div>
                          </div>
                        )}
                        {quickpolls.Option2 && (
                          <div
                            className="d-flex"
                            style={{
                              height: "30px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              self.setState({
                                quickPollsChoice: {
                                  ID: quickpolls.ID,
                                  Option: quickpolls.Option2,
                                },
                              });
                            }}
                          >
                            <div className="d-flex h-100 align-items-center">
                              <div
                                className="border border-2 border-dark rounded-circle "
                                style={{
                                  height: "15px",
                                  width: "15px",
                                  backgroundColor:
                                    quickPollsChoice.Option ===
                                      quickpolls.Option2 &&
                                    quickPollsChoice.ID === quickpolls.ID
                                      ? " rgb(181, 77, 38)"
                                      : "#ffffff",
                                }}
                              ></div>
                            </div>
                            <div className="d-flex h-100 align-items-center ps-2">
                              {quickpolls.Option2}
                            </div>
                          </div>
                        )}
                        {quickpolls.Option3 && (
                          <div
                            className="d-flex"
                            style={{
                              height: "30px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              self.setState({
                                quickPollsChoice: {
                                  ID: quickpolls.ID,
                                  Option: quickpolls.Option3,
                                },
                              });
                            }}
                          >
                            <div className="d-flex h-100 align-items-center">
                              <div
                                className="border border-2 border-dark rounded-circle "
                                style={{
                                  height: "15px",
                                  width: "15px",
                                  backgroundColor:
                                    quickPollsChoice.Option ===
                                      quickpolls.Option3 &&
                                    quickPollsChoice.ID === quickpolls.ID
                                      ? " rgb(181, 77, 38)"
                                      : "#ffffff",
                                }}
                              ></div>
                            </div>
                            <div className="d-flex h-100 align-items-center ps-2">
                              {quickpolls.Option3}
                            </div>
                          </div>
                        )}
                        {quickpolls.Option4 && (
                          <div
                            className="d-flex"
                            style={{
                              height: "30px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              self.setState({
                                quickPollsChoice: {
                                  ID: quickpolls.ID,
                                  Option: quickpolls.Option4,
                                },
                              });
                            }}
                          >
                            <div className="d-flex h-100 align-items-center">
                              <div
                                className="border border-2 border-dark rounded-circle "
                                style={{
                                  height: "15px",
                                  width: "15px",
                                  backgroundColor:
                                    quickPollsChoice.Option ===
                                      quickpolls.Option4 &&
                                    quickPollsChoice.ID === quickpolls.ID
                                      ? " rgb(181, 77, 38)"
                                      : "#ffffff",
                                }}
                              ></div>
                            </div>
                            <div className="d-flex h-100 align-items-center ps-2">
                              {quickpolls.Option4}
                            </div>
                          </div>
                        )}

                        <div
                          className={`d-flex ${
                            isAdmin
                              ? "justify-content-end"
                              : "justify-content-end"
                          }`}
                        >
                          {false && (
                            <div
                              className="d-flex justify-content-center mt-2 rounded text-dark p-2"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                self.setState({
                                  isModalOpen: true,
                                  modalData: {
                                    Title: quickpolls.Title,
                                    Choice: quickpolls.Choice,
                                    Option1: quickpolls.Option1,
                                    Option2: quickpolls.Option2,
                                    Option3: quickpolls.Option3,
                                    Option4: quickpolls.Option4,
                                  },
                                  optionSelected: quickpolls.Option1,
                                });
                                console.log(
                                  quickpolls.Choice,
                                  " quickpolls.Choice,"
                                );
                              }}
                            >
                              View
                            </div>
                          )}
                          <div
                            className="d-flex justify-content-center mt-2 rounded text-white w-25 p-2"
                            style={{
                              backgroundColor: " rgb(181, 77, 38)",
                              fontSize: "16px",
                              fontWeight: "500",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              if (quickPollsChoice !== "") {
                                handleSubmit(quickpolls.ID, quickpolls.Choice);
                              } else {
                                alert("Please select an option");
                              }
                            }}
                          >
                            Submit
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              } else {
                const selectOption = isUserExist[0].RespondantChoice.Option;
                const selectID = isUserExist[0].RespondantChoice.ID;
                console.log("Selected Choice", selectOption, selectID);
                return (
                  <div className="d-flex my-3 me-2" key={quickpolls.ID}>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "500",
                      }}
                    >
                      Q{}
                    </div>
                    <div className="ms-2 w-100">
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "500",
                        }}
                      >
                        {quickpolls.Title}
                      </div>
                      <div className="mt-2">
                        {quickpolls.Option1 && (
                          <div
                            className="d-flex"
                            style={{
                              height: "30px",
                              cursor: "not-allowed",
                            }}
                          >
                            <div className="d-flex h-100 align-items-center">
                              <div
                                className="border border-2 border-dark rounded-circle "
                                style={{
                                  height: "15px",
                                  width: "15px",
                                  backgroundColor:
                                    selectOption === quickpolls.Option1 &&
                                    selectID === quickpolls.ID
                                      ? " rgb(181, 77, 38)"
                                      : "#ffffff",
                                }}
                              ></div>
                            </div>
                            <div className="d-flex h-100 align-items-center ps-2">
                              {quickpolls.Option1}
                            </div>
                          </div>
                        )}
                        {quickpolls.Option2 && (
                          <div
                            className="d-flex"
                            style={{
                              height: "30px",
                              cursor: "not-allowed",
                            }}
                          >
                            <div className="d-flex h-100 align-items-center">
                              <div
                                className="border border-2 border-dark rounded-circle "
                                style={{
                                  height: "15px",
                                  width: "15px",
                                  backgroundColor:
                                    selectOption === quickpolls.Option2 &&
                                    selectID === quickpolls.ID
                                      ? " rgb(181, 77, 38)"
                                      : "#ffffff",
                                }}
                              ></div>
                            </div>
                            <div className="d-flex h-100 align-items-center ps-2">
                              {quickpolls.Option2}
                            </div>
                          </div>
                        )}
                        {quickpolls.Option3 && (
                          <div
                            className="d-flex"
                            style={{
                              height: "30px",
                              cursor: "not-allowed",
                            }}
                          >
                            <div className="d-flex h-100 align-items-center">
                              <div
                                className="border border-2 border-dark rounded-circle "
                                style={{
                                  height: "15px",
                                  width: "15px",
                                  backgroundColor:
                                    selectOption === quickpolls.Option3 &&
                                    selectID === quickpolls.ID
                                      ? " rgb(181, 77, 38)"
                                      : "#ffffff",
                                }}
                              ></div>
                            </div>
                            <div className="d-flex h-100 align-items-center ps-2">
                              {quickpolls.Option3}
                            </div>
                          </div>
                        )}
                        {quickpolls.Option4 && (
                          <div
                            className="d-flex"
                            style={{
                              height: "30px",
                              cursor: "not-allowed",
                            }}
                          >
                            <div className="d-flex h-100 align-items-center">
                              <div
                                className="border border-2 border-dark rounded-circle "
                                style={{
                                  height: "15px",
                                  width: "15px",
                                  backgroundColor:
                                    selectOption === quickpolls.Option4 &&
                                    selectID === quickpolls.ID
                                      ? " rgb(181, 77, 38)"
                                      : "#ffffff",
                                }}
                              ></div>
                            </div>
                            <div className="d-flex h-100 align-items-center ps-2">
                              {quickpolls.Option4}
                            </div>
                          </div>
                        )}
                        <div
                          className={`d-flex ${
                            isAdmin
                              ? "justify-content-end"
                              : "justify-content-end"
                          }`}
                        >
                          {false && (
                            <div
                              className="d-flex justify-content-center mt-2 rounded text-dark p-2"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                self.setState({
                                  isModalOpen: true,
                                  modalData: {
                                    Title: quickpolls.Title,
                                    Choice: quickpolls.Choice,
                                    Option1: quickpolls.Option1,
                                    Option2: quickpolls.Option2,
                                    Option3: quickpolls.Option3,
                                    Option4: quickpolls.Option4,
                                  },
                                  optionSelected: quickpolls.Option1,
                                });
                                console.log(
                                  quickpolls.Choice,
                                  " quickpolls.Choice,"
                                );
                              }}
                            >
                              View
                            </div>
                          )}
                          <div
                            className="d-flex justify-content-center mt-2 rounded text-dark w-25 p-2"
                            style={{
                              fontSize: "16px",
                              fontWeight: "500",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              handleEdit(quickpolls.ID, quickpolls.Choice);
                            }}
                          >
                            Edit
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
            <Modal
              title={"Quick Polls Response"}
              open={isModalOpen}
              onOk={handleModel}
              onCancel={handleModel}
              footer={null}
              centered
            >
              <div
                style={{
                  maxHeight: "60vh",
                  overflow: "auto",
                  scrollbarWidth: "thin",
                }}
                className="mb-3"
              >
                <div className="d-flex justify-content-end">
                  <ModalPagination
                    self={this}
                    left={left}
                    right={right}
                    modalCurrentPage={modalCurrentPage}
                    numberOfModalPages={numberOfModalPages}
                  />
                </div>

                {modalData
                  .slice(indexOfFirstPage, indexOfLastPage)
                  .map((data, mainIndex) => {
                    const menuItem: CollapseProps["items"] = data.Answer.map(
                      (answerData, index: number) => {
                        const pollResonse = answerData.SelectedBy;
                        return {
                          key: index.toString(),
                          label: (
                            <div
                              style={{
                                fontSize: "18px",
                                fontWeight: "600",
                              }}
                            >
                              {index + 1}. {answerData.Option}
                            </div>
                          ),
                          children: (
                            <div className="d-flex gap-2 flex-wrap">
                              {pollResonse?.length ? (
                                pollResonse.map((selectedUser) => {
                                  return (
                                    <div
                                      className="d-flex gap-2 p-2 border border-primary"
                                      style={{ width: "max-content" }}
                                    >
                                      <div className="d-flex align-items-center">
                                        <img
                                          className="rounded-circle"
                                          width="50px"
                                          height="50px"
                                          src={`${context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?AccountName=${selectedUser.RespondantEmail}`}
                                        />
                                      </div>
                                      <div className="d-flex align-items-center">
                                        <span
                                          style={{
                                            fontSize: "20px",
                                            fontWeight: "600",
                                          }}
                                        >
                                          {selectedUser.RespondantName}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })
                              ) : (
                                <div
                                  style={{
                                    fontSize: "20px",
                                    fontWeight: "600",
                                  }}
                                >
                                  Selected by no users
                                </div>
                              )}
                            </div>
                          ),
                        };
                      }
                    );
                    return (
                      <div className="d-flex flex-column gap-3">
                        <span
                          style={{
                            fontSize: "18px",
                            fontWeight: "600",
                            color: " rgb(181, 77, 38)",
                          }}
                        >
                          Q{modalCurrentPage} {data.Title}
                        </span>
                        <Collapse
                          accordion
                          items={menuItem}
                          onChange={onChange}
                          defaultActiveKey={[dataIndex]}
                        />
                      </div>
                    );
                  })}
              </div>
            </Modal>
          </div>
        ) : (
          <EmptyCard />
        )}
      </>
    );
  }
}
