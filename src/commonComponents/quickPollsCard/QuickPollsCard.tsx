import * as React from "react";
import EmptyCard from "../emptyCard/EmptyCard";
import styles from "./QuickPolls.module.scss";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Modal } from "antd";
export interface IQuickPollsCardProps {
  self: any;
  currentData: any;
  modalData: any;
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

export default class QuickPollsCard extends React.Component<
  IQuickPollsCardProps,
  {}
> {
  public userCount(modalResult: string): number {
    const { optionSelected } = this.props;
    const count = JSON.parse(modalResult).filter(
      (data: any) => data.RespondantChoice.Option === optionSelected
    )?.length;
    return count;
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
      optionSelected,
      context,
      handleSubmit,
      isAdmin,
    } = this.props;
    return (
      <>
        {quickPollsAsSorted?.length > 0 ? (
          <div
            className={`${styles.PollsContainer} mb-3`}
            style={{
              /* height: "420px",
              overflowY: "scroll", */
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
                              ? "justify-content-between"
                              : "justify-content-end"
                          }`}
                        >
                          {isAdmin && (
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
                              ? "justify-content-between"
                              : "justify-content-end"
                          }`}
                        >
                          {isAdmin && (
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
              width={'max-content'}
            >
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "scroll",
                  scrollbarWidth: "thin",
                }}
              >
                {console.log(modalData, "Modal Response")}
                <div style={{ fontSize: "20px", fontWeight: "600" }}>
                  {modalData.Title}
                </div>
                <div className="d-flex justify-content-between py-3">
                  {modalData.Option1 && (
                    <div
                      className="d-flex w-25"
                      style={{
                        cursor: "pointer",
                        fontSize: "18px",
                        fontWeight: "500",
                        color: `${
                          optionSelected === modalData.Option1 ? " rgb(181, 77, 38)" : ""
                        }`,
                      }}
                      onClick={() => {
                        self.setState({
                          optionSelected: modalData.Option1,
                        });
                      }}
                    >
                      1: {modalData.Option1}
                    </div>
                  )}
                  {modalData.Option2 && (
                    <div
                      className="d-flex w-25"
                      style={{
                        cursor: "pointer",
                        fontSize: "18px",
                        fontWeight: "500",
                        color: `${
                          optionSelected === modalData.Option2 ? " rgb(181, 77, 38)" : ""
                        }`,
                      }}
                      onClick={() => {
                        self.setState({
                          optionSelected: modalData.Option2,
                        });
                      }}
                    >
                      2: {modalData.Option2}
                    </div>
                  )}
                  {modalData.Option3 && (
                    <div
                      className="d-flex w-25"
                      style={{
                        cursor: "pointer",
                        fontSize: "18px",
                        fontWeight: "500",
                        color: `${
                          optionSelected === modalData.Option3 ? " rgb(181, 77, 38)" : ""
                        }`,
                      }}
                      onClick={() => {
                        self.setState({
                          optionSelected: modalData.Option3,
                        });
                      }}
                    >
                      3: {modalData.Option3}
                    </div>
                  )}
                  {modalData.Option1 && (
                    <div
                      className="d-flex w-25"
                      style={{
                        cursor: "pointer",
                        fontSize: "18px",
                        fontWeight: "500",
                        color: `${
                          optionSelected === modalData.Option4 ? " rgb(181, 77, 38)" : ""
                        }`,
                      }}
                      onClick={() => {
                        self.setState({
                          optionSelected: modalData.Option4,
                        });
                      }}
                    >
                      4: {modalData.Option4}
                    </div>
                  )}
                </div>

                {modalData.Choice &&
                JSON.parse(modalData.Choice).filter(
                  (data: any) => data.RespondantChoice.Option === optionSelected
                ).length > 0 ? (
                  JSON.parse(modalData.Choice)
                    .filter(
                      (data: any) =>
                        data.RespondantChoice.Option === optionSelected
                    )
                    .map((data: any, index: any) => {
                      return (
                        <div
                          className="d-flex gap-2 py-2 border-top border-3 me-2"
                          key={index}
                        >
                          <div className="d-flex align-items-center">
                            <img
                              key={index}
                              className="rounded-circle"
                              width="50px"
                              height="50px"
                              src={`${context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?AccountName=${data.RespondantEmail}`}
                            />
                          </div>
                          <div className="d-flex align-items-center">
                            <span
                              style={{
                                fontSize: "20px",
                                fontWeight: "600",
                              }}
                            >
                              {data.RespondantName}
                            </span>
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div
                    className="d-flex mt-2 justify-content-center align-items-center  border-top border-3"
                    style={{
                      fontSize: "20px",
                      fontWeight: "600",
                      height: "60px",
                    }}
                  >
                    No User
                  </div>
                )}
                <div
                  className="mb-2 border-top border-bottom border-3 py-2"
                  style={{ fontSize: "18px", fontWeight: "600" }}
                >
                  {optionSelected} Selected By{" "}
                  <span style={{ color: " rgb(181, 77, 38)" }}>
                    {modalData.Choice && this.userCount(modalData.Choice)}{" "}
                  </span>
                  {modalData.Choice && this.userCount(modalData.Choice) > 1
                    ? "Users"
                    : "User"}
                </div>
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
