import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { DataType } from "../DataType";

export interface IARHeadProps {
  self: any;
  context: WebPartContext;
  data: DataType;
}

export default class ARHead extends React.Component<IARHeadProps, {}> {
  public componentDidMount(): void {}
  public render(): React.ReactElement<IARHeadProps> {
    const { data, context, self } = this.props;

    return (
      <>
        {data.PendingWith?.split(";").filter(
          (item) => item === context.pageContext.user.displayName
        )?.length > 0 ? (
          <div>
            <div className="d-flex justify-content-end mt-3 gap-3">
              <div
                className="py-2"
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              ></div>
              <button
                type="submit"
                className="text-white bg-success px-3 py-2 rounded"
                style={{
                  border: "none",
                }}
                onClick={() => {
                  self.updateApproval("Cash Head", "Transfer Head", data);
                }}
              >
                Transfer To Cash Head
              </button>
              <button
                type="submit"
                className="text-white bg-success px-3 py-2 rounded"
                style={{
                  border: "none",
                }}
                onClick={() => {
                  self.updateApproval("AP Head", "Transfer Head", data);
                }}
              >
                Transfer To AP Head
              </button>
            </div>
            <div className="d-flex justify-content-end mt-3 gap-3">
              <div
                className="py-2"
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                }}
              >
                {data.ApprovalProcess}
              </div>
              <button
                type="submit"
                className="text-white bg-success px-3 py-2 rounded"
                style={{
                  border: "none",
                }}
                onClick={() => {
                  self.updateApproval("Approved", "Update Head", data);
                }}
              >
                Approve
              </button>
              <button
                type="submit"
                className="text-white bg-danger px-3 py-2 rounded"
                style={{
                  border: "none",
                }}
                onClick={() => {
                  self.setState({
                    openRejectComments: true,
                    updationType: "Update Head",
                  });
                }}
              >
                Reject
              </button>
            </div>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
}
