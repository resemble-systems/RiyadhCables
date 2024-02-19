import * as React from "react";
import { Row, Col, Empty } from "antd";
export interface IEmptyCardProps {}

export default class EmptyCard extends React.Component<IEmptyCardProps, {}> {
  public render(): React.ReactElement<IEmptyCardProps> {
    return (
      <Row className="w-100">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <div
            className="d-flex w-100 justify-content-center align-items-center"
            style={{ fontFamily: "Avenir Next" }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={<span className="text-secondary">No Data</span>}
            />
          </div>
        </Col>
      </Row>
    );
  }
}
