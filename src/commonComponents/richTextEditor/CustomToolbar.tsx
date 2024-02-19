import * as React from "react";
import formats from "./Toolbar";
export interface ICustomToolbarProps {}

export default class CustomToolbar extends React.Component<
  ICustomToolbarProps,
  {}
> {
  public componentDidMount(): void {}
  public render(): React.ReactElement<ICustomToolbarProps> {
    const {} = this.props;

    const renderOptions = (formatData: { className: any; options: any }) => {
      const { className, options } = formatData;
      return (
        <select className={className}>
          <option selected></option>
          {options.map(
            (value: string | number | readonly string[] | undefined) => {
              return <option value={value}></option>;
            }
          )}
        </select>
      );
    };
    const renderSingle = (formatData: { className: any; value: any }) => {
      const { className, value } = formatData;
      return <button className={className} value={value}></button>;
    };

    return (
      <div id="toolbar">
        {formats.map((classes: any[]) => {
          return (
            <span className="ql-formats">
              {classes.map((formatData) => {
                return formatData.options
                  ? renderOptions(formatData)
                  : renderSingle(formatData);
              })}
            </span>
          );
        })}
      </div>
    );
  }
}
