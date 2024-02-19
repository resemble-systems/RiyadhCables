import * as React from "react";
export interface IDataNotFoundProps {}

export default class DataNotFound extends React.Component<
  IDataNotFoundProps,
  {}
> {
  public componentDidMount(): void {}
  public render(): React.ReactElement<IDataNotFoundProps> {
    const {} = this.props;

    return (
      <div
        className="d-flex justify-content-center align-items-center flex-column"
        style={{ height: "70vh" }}
      >
        <img
          src={require("../assets/Rejected.svg")}
          width={"40px"}
          height={"40px"}
        />
        <div className="fs-6 fw-medium mt-3">Data not found</div>
      </div>
    );
  }
}
