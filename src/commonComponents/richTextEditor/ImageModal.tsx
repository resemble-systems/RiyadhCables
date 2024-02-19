import * as React from "react";
import { Input, Modal } from "antd";
export interface IImageModalProps {
  self: any;
  isModalOpen: boolean;
  imageUrl: string;
  handleSubmit: any;
}

export default class ImageModal extends React.Component<IImageModalProps, {}> {
  public componentDidMount(): void {}
  public render(): React.ReactElement<IImageModalProps> {
    const { self, isModalOpen, handleSubmit, imageUrl } = this.props;

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      self.setState({ imageUrl: event.target.value });
    };

    const handleClose = () => {
      self.setState({ isModalOpen: false });
    };

    return (
      <Modal
        title={"Insert image"}
        open={isModalOpen}
        onCancel={handleClose}
        onOk={handleClose}
        footer={false}
      >
        <>
          <Input
            placeholder="Insert Image URL"
            value={imageUrl}
            onChange={handleChange}
          />
          <div className="d-flex justify-content-end mt-3">
            <button
              className="py-2 px-3 border-0 rounded-2 text-white bg-primary"
              type="submit"
              onClick={handleSubmit}
            >
              Insert Image
            </button>
          </div>
        </>
      </Modal>
    );
  }
}
