import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { DataType } from "../DataType";

export interface ICFOProps {
  self: any;
  context: WebPartContext;
  data: DataType;
}

export default class CFO extends React.Component<ICFOProps, {}> {
  public componentDidMount(): void {}
  public render(): React.ReactElement<ICFOProps> {
    const { data, context, self } = this.props;

    return (
      <>
        {data.PendingWith?.split(";").filter(
          (item) => item === context.pageContext.user.displayName
        )?.length > 0 ? (
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
                self.updateApproval("Approved", "Approve & Pay", data);
              }}
            >
              Approve & Pay
            </button>
            <button
              type="submit"
              className="text-white bg-success px-3 py-2 rounded"
              style={{
                border: "none",
              }}
              onClick={() => {
                self.updateApproval("Approved", "Approve & Escalate", data);
              }}
            >
              Approve & Escalate
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
                });
              }}
            >
              Reject
            </button>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
}
