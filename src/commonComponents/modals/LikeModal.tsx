import * as React from "react";
import { Modal } from "antd";
import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface ILikeModalProps {
  isLikeModalOpen: boolean;
  handleLikeModel: () => void;
  LikeModalData: { Likes: string };
  context: WebPartContext;
}

export default class LikeModal extends React.Component<ILikeModalProps, {}> {
  public render(): React.ReactElement<ILikeModalProps> {
    const { isLikeModalOpen, handleLikeModel, LikeModalData, context } =
      this.props;
    return (
      <Modal
        open={isLikeModalOpen}
        onOk={handleLikeModel}
        onCancel={handleLikeModel}
        footer={null}
        centered
        width={400}
      >
        <div
          style={{
            maxHeight: "400px",
            overflowY: "scroll",
            scrollbarWidth: "thin",
            fontFamily: "Avenir Next",
          }}
        >
          <div
            className="d-flex justify-content-center mb-3"
            style={{
              fontSize: "22px",
              fontWeight: "600",
            }}
          >
            Likes
          </div>
          {LikeModalData?.Likes &&
            JSON.parse(LikeModalData.Likes).map(
              (
                data: { RespondantName: string; RespondantEmail: string },
                index: number
              ) => (
                <div className="d-flex gap-2 py-2 border-top border-3 me-2">
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
              )
            )}
        </div>
      </Modal>
    );
  }
}
