import * as React from "react";

export interface IPaginationProps {
  self: any;
  currentPage: number;
  numberOfPages: number;
  left: any;
  right: any;
}

export interface IPaginationState {}

export default class Pagination extends React.Component<
  IPaginationProps,
  IPaginationState
> {
  public constructor(props: IPaginationProps, state: IPaginationState) {
    super(props);
    this.state = {};
  }

  public render(): React.ReactElement<IPaginationProps> {
    const { self, currentPage, numberOfPages, left, right } = this.props;
    return (
      <div className="d-flex align-items-center" style={{ fontFamily: "Avenir Next" }}>
        <span
          onClick={() => {
            self.setState({
              currentPage: currentPage > 1 ? currentPage - 1 : currentPage - 0,
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
          {currentPage}
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
          {numberOfPages}
        </span>
        <span
          onClick={() => {
            self.setState({
              currentPage:
                currentPage >= numberOfPages
                  ? currentPage + 0
                  : currentPage + 1,
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
