import { Col, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import * as React from "react";
export interface IRejectProps {
  self: any;
  reasonForRejection: string;
  updationType: string;
  data: any;
}

export default class Reject extends React.Component<IRejectProps, {}> {
  public componentDidMount(): void {}
  public render(): React.ReactElement<IRejectProps> {
    const { self, reasonForRejection, updationType, data } = this.props;

    return (
      <>
        <Row>
          <Col
            span={12}
            offset={12}
            style={{ fontSize: "1rem", fontWeight: 600 }}
          >
            <div>Reason for rejection</div>
            <TextArea
              showCount
              maxLength={500}
              style={{ height: 120 }}
              value={reasonForRejection}
              onChange={(event) => {
                self.setState({
                  reasonForRejection: event.target.value,
                });
              }}
            />
          </Col>
        </Row>
        <div className="d-flex justify-content-end mt-4 gap-3">
          <button
            type="submit"
            className="text-white bg-danger px-3 py-2 rounded"
            style={{
              border: "none",
            }}
            onClick={() => {
              if (reasonForRejection?.length > 3) {
                self.setState({
                  openRejectComments: false,
                });
                self.updateApproval("Rejected", updationType, data);
              } else {
                self.setState({
                  isError: true,
                  errorMessage: "Please add the reason for rejection",
                });
              }
            }}
          >
            Submit
          </button>
        </div>
      </>
    );
  }
}
