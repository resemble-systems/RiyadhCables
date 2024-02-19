import * as React from "react";
export interface IEmptyImageProps {}

export default class EmptyImage extends React.Component<IEmptyImageProps, {}> {
  public render(): React.ReactElement<IEmptyImageProps> {
    const alternate = require("../alternateImage/assets/emptyImg.png");
    return (
      <div className="h-100 d-flex align-items-center border">
        <img src={alternate} width="100%" />
      </div>
    );
  }
}
