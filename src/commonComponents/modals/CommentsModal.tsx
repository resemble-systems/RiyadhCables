import * as React from "react";
import { Modal } from "antd";
import EmptyCard from "../emptyCard/EmptyCard";
import TextArea from "antd/es/input/TextArea";
import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IComentsModalProps {
  context: WebPartContext;
  isModalOpen: boolean;
  handleCancel: () => void;
  commentsPost: string;
  self: any;
  modalData: { ID: number; Comments: string };
  handleSubmit: (ID: number, Comments: string, commentsPost: string) => void;
}

export default class ComentsModal extends React.Component<
  IComentsModalProps,
  {}
> {
  public render(): React.ReactElement<IComentsModalProps> {
    const {
      isModalOpen,
      handleCancel,
      commentsPost,
      self,
      modalData,
      handleSubmit,
      context,
    } = this.props;
    return (
      <Modal
        open={isModalOpen}
        onOk={handleCancel}
        onCancel={handleCancel}
        footer={null}
        centered
      >
        <div style={{ fontFamily: "Avenir Next" }}>
          <div className=" d-flex mt-4 mb-4">
            <TextArea
              rows={4}
              placeholder="Add Comments...."
              showCount
              maxLength={250}
              value={commentsPost}
              onChange={(e: { target: { value: any } }) =>
                self.setState({
                  commentsPost: e.target.value,
                })
              }
            />
          </div>

          <div className="d-flex justify-content-end mb-3">
            <div
              className="p-2 px-3 rounded text-white"
              style={{
                cursor: "pointer",
                backgroundColor: " rgb(181, 77, 38)",
              }}
              onClick={() => {
                if (
                  commentsPost !== "" &&
                  commentsPost.split("").length <= 250
                ) {
                  handleSubmit(modalData.ID, modalData.Comments, commentsPost);
                } else {
                  alert("Comments must have 1 to 250 words");
                }
              }}
            >
              Submit
            </div>
          </div>
          {modalData.Comments ? (
            <div
              style={{
                maxHeight: "300px",
                overflowY: "scroll",
                scrollbarWidth: "thin",
              }}
            >
              {modalData.Comments &&
                JSON.parse(modalData.Comments)
                  .sort(
                    (
                      a: { RespondantDate: string },
                      b: { RespondantDate: string }
                    ) =>
                      new Date(b.RespondantDate).getTime() -
                      new Date(a.RespondantDate).getTime()
                  )
                  .map(
                    (data: {
                      RespondantEmail: string;
                      RespondantName: string;
                      RespondantComment: string;
                      RespondantDate: string;
                    }) => {
                      return (
                        <div
                          className="py-2 border-top border-3 me-2"
                          key={data.RespondantEmail}
                        >
                          <div className="d-flex gap-2">
                            <img
                              className="rounded-circle"
                              width="50px"
                              height="50px"
                              src={`${context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?AccountName=${data.RespondantEmail}`}
                            />
                            <div>
                              <span
                                style={{
                                  fontSize: "14px",
                                  fontWeight: "600",
                                }}
                              >
                                {data.RespondantName}
                              </span>{" "}
                              <span
                                style={{
                                  fontSize: "16px",
                                  fontWeight: "500",
                                }}
                              >
                                {data.RespondantComment}
                              </span>
                            </div>
                          </div>
                          <div
                            className="d-flex justify-content-end mt-2"
                            style={{
                              fontSize: "10px",
                              fontWeight: "600",
                            }}
                          >
                            {data.RespondantDate}
                          </div>
                        </div>
                      );
                    }
                  )}
            </div>
          ) : (
            <EmptyCard />
          )}
        </div>
      </Modal>
    );
  }
}
