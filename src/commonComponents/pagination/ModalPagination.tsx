import * as React from "react";

export interface IModalPaginationProps {
  self: any;
  left: any;
  right: any;
  modalCurrentPage: number;
  numberOfModalPages: number;
}

export interface IModalPaginationState {}

export default class ModalPagination extends React.Component<
  IModalPaginationProps,
  IModalPaginationState
> {
  public constructor(
    props: IModalPaginationProps,
    state: IModalPaginationState
  ) {
    super(props);
    this.state = {};
  }

  public render(): React.ReactElement<IModalPaginationProps> {
    const { self, modalCurrentPage, numberOfModalPages, left, right } =
      this.props;
    return (
      <div className="d-flex align-items-center" style={{ fontFamily: "Avenir Next" }}>
        <span
          onClick={() => {
            self.setState({
              modalCurrentPage:
                modalCurrentPage > 1
                  ? modalCurrentPage - 1
                  : modalCurrentPage - 0,
            });
          }}
          style={{ cursor: "pointer" }}
        >
          <img src={left} alt="<" width={"18px"} />
        </span>
        <span
          className="d-flex align-items-center ps-2"
          style={{ fontWeight: 700, fontSize: "12px" }}
        >
          {modalCurrentPage}
        </span>
        <span
          className="d-flex align-items-center"
          style={{ fontWeight: 600, fontSize: "12px" }}
        >
          /
        </span>
        <span
          className="d-flex align-items-center pe-2"
          style={{ fontWeight: 700, fontSize: "12px" }}
        >
          {numberOfModalPages}
        </span>
        <span
          onClick={() => {
            self.setState({
              modalCurrentPage:
                modalCurrentPage >= numberOfModalPages
                  ? modalCurrentPage + 0
                  : modalCurrentPage + 1,
            });
          }}
          style={{ cursor: "pointer" }}
        >
          <img src={right} alt="<" width={"18px"} />
        </span>
      </div>
    );
  }
}
