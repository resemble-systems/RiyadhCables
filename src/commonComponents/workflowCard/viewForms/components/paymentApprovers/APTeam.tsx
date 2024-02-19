import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { DataType } from "../DataType";

export interface IAPTeamProps {
  self: any;
  context: WebPartContext;
  data: DataType;
}

export default class APTeam extends React.Component<IAPTeamProps, {}> {
  public componentDidMount(): void {}
  public render(): React.ReactElement<IAPTeamProps> {
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
                  self.updateApproval("Cash Team", "Transfer Team", data);
                }}
              >
                Transfer To Cash Team
              </button>
              <button
                type="submit"
                className="text-white bg-success px-3 py-2 rounded"
                style={{
                  border: "none",
                }}
                onClick={() => {
                  self.updateApproval("AR Team", "Transfer Team", data);
                }}
              >
                Transfer To AR Team
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
                  self.updateApproval("Approved", "Update Team", data);
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
                    updationType: "Update Team",
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
