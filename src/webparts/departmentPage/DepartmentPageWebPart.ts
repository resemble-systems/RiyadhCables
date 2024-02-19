import * as React from "react";
import * as ReactDom from "react-dom";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import DepartmentPage from "./components/DepartmentPage";
import { IDepartmentPageProps } from "./components/IDepartmentPageProps";
import '../global.css'
export interface IDepartmentPageWebPartProps {
  description: string;
}

export default class DepartmentPageWebPart extends BaseClientSideWebPart<IDepartmentPageWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = "";

  public render(): void {
    const element: React.ReactElement<IDepartmentPageProps> =
      React.createElement(DepartmentPage, {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context,
      });

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
}
