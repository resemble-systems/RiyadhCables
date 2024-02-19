import * as React from "react";
import { Modal } from "antd";
import './index.css'
export interface IAchievementModalProps {
  self: any;
  isModalOpen: boolean;
  achievements: string;
}

export default class AchievementModal extends React.Component<
  IAchievementModalProps,
  {}
> {
  public componentDidMount(): void {}
  public render(): React.ReactElement<IAchievementModalProps> {
    const { isModalOpen, self, achievements } = this.props;
    const handleModal = () => {
      self.setState({
        isModalOpen: false,
      });
    };

    return (
      <Modal
        open={isModalOpen}
        onCancel={handleModal}
        onOk={handleModal}
        centered
        width={"95vw"}
        footer={false}
        title={"Employee Profile"}
      >
        <div
          style={{
            height: "80vh",
            fontFamily: "Avenir Next",
            overflowY: "scroll",
          }}
        >
          <div
            className={``}
            dangerouslySetInnerHTML={{
              __html: achievements,
            }}
          />
        </div>
      </Modal>
    );
  }
}
