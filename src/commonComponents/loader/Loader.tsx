import { Skeleton } from "antd";
import * as React from "react";

export interface ILoaderProps {
  row: number;
  avatar: boolean;
  skeletonCount: number;
}

export interface ILoaderState {}

export default class Loader extends React.Component<
  ILoaderProps,
  ILoaderState
> {
  public constructor(props: ILoaderProps, state: ILoaderState) {
    super(props);
    this.state = {};
  }

  public render(): React.ReactElement<ILoaderProps> {
    const { avatar, row, skeletonCount } = this.props;
    return (
      <div>
        {[...Array(skeletonCount).map(() => 1)].map(() => (
          <Skeleton active avatar={avatar} paragraph={{ rows: row }} />
        ))}
      </div>
    );
  }
}
