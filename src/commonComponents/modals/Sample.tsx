import * as React from "react";
import { Modal } from "antd";
export interface IWorkFlowFormProps {}

export default class WorkFlowForm extends React.Component<
  IWorkFlowFormProps,
  {}
> {
  public componentDidMount(): void {}
  public render(): React.ReactElement<IWorkFlowFormProps> {
    const {} = this.props;

    return <Modal></Modal>;
  }
}
