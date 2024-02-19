import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { DataType } from "../DataType";

export interface IFinanceSecretayProps {
  self: any;
  context: WebPartContext;
  data: DataType;
}

export default class FinanceSecretay extends React.Component<
  IFinanceSecretayProps,
  {}
> {
  public componentDidMount(): void {}
  public render(): React.ReactElement<IFinanceSecretayProps> {
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
                self.updateApproval("Cash Team", "Transfer", data);
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
                self.updateApproval("AP Team", "Transfer", data);
              }}
            >
              Transfer To AP Team
            </button>
            <button
              type="submit"
              className="text-white bg-success px-3 py-2 rounded"
              style={{
                border: "none",
              }}
              onClick={() => {
                self.updateApproval("AR Team", "Transfer", data);
              }}
            >
              Transfer To AR Team
            </button>
          </div>
        ) : (
          <></>
        )}
      </>
    );
  }
}
