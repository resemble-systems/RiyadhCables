import * as React from "react";
import { Col } from "antd";
import "./layout.css";
export interface ICommonLayoutProps {
  children: JSX.Element;
  heigth?: string;
  lg: number;
  xl: number;
  md?: number;
  classNames?: string;
}

export default class CommonLayout extends React.Component<
  ICommonLayoutProps,
  {}
> {
  public render(): React.ReactElement<ICommonLayoutProps> {
    const { md, lg, xl, heigth, children, classNames } = this.props;
    return (
      <Col xs={24} sm={24} md={md ? md : 24} lg={lg} xl={xl}>
        <div
          style={{ height: heigth || "auto", fontFamily: "Avenir Next" }}
          className={`bg-white shadow-lg rounded mb-4 ${classNames}`}
        >
          {children}
        </div>
      </Col>
    );
  }
}
