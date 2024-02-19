import * as React from "react";
export interface ILoadingProps {
    loadingText:string
}

export default class Loading extends React.Component<ILoadingProps, {}> {
  public componentDidMount(): void {}
  public render(): React.ReactElement<ILoadingProps> {
    const {loadingText} = this.props;
    return (
      <div
        className="d-flex justify-content-center align-items-center flex-column"
        style={{ height: "70vh" }}
      >
        <div className="spinner-border text-info" role="status" />
        <div className="fs-5 fw-medium mt-3">{loadingText}</div>
      </div>
    );
  }
}
