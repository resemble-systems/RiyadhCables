import * as React from "react";
import * as ReactDom from "react-dom";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import AdminDasboard from "./components/AdminDasboard";
import { IAdminDasboardProps } from "./components/IAdminDasboardProps";

export interface IAdminDasboardWebPartProps {
  description: string;
}

export default class AdminDasboardWebPart extends BaseClientSideWebPart<IAdminDasboardWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = "";

  public render(): void {
    const element: React.ReactElement<IAdminDasboardProps> =
      React.createElement(AdminDasboard, {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context
      });

    ReactDom.render(element, this.domElement);
  }
}
