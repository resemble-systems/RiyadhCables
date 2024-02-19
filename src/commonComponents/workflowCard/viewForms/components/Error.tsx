import * as React from "react";
export interface IErrorProps {
  self: any;
  errorMessage: string;
}

export default class Error extends React.Component<IErrorProps, {}> {
  public componentDidMount(): void {}
  public render(): React.ReactElement<IErrorProps> {
    const { self, errorMessage } = this.props;

    return (
      <div
        className="bg-white p-2 rounded-3 shadow-lg"
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          zIndex: 9999999999999,
        }}
      >
        <div
          className="d-flex justify-content-end"
          onClick={() => {
            self.setState({ isError: false });
          }}
        >
          <div
            className="text-white bg-danger rounded px-2"
            style={{ cursor: "pointer" }}
          >
            x
          </div>
        </div>
        <div
          className="d-flex justify-content-center align-items-center gap-1"
          style={{ height: "60px" }}
        >
          <img
            src={require("../assets/Rejected.svg")}
            width={"25px"}
            height={"25px"}
          />
          <div className="fs-6 fw-medium">{errorMessage}</div>
        </div>
      </div>
    );
  }
}
