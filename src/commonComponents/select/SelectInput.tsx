import * as React from "react";
import { Select } from "antd";
export interface ISelectInputProps {
  options: Array<{ value: string; label: string }>;
}

export default class SelectInput extends React.Component<
  ISelectInputProps,
  {}
> {
  public componentDidMount(): void {}
  public render(): React.ReactElement<ISelectInputProps> {
    const { options } = this.props;

    return <Select placeholder="Select a person" options={options} />;
  }
}
