import * as React from "react";
import * as ReactDom from "react-dom";
import "../global.css";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import WorkFlow from "./components/WorkFlow";
import { IWorkFlowProps } from "./components/IWorkFlowProps";

export interface IWorkFlowWebPartProps {
  description: string;
}

export default class WorkFlowWebPart extends BaseClientSideWebPart<IWorkFlowWebPartProps> {
  private _isDarkTheme: boolean = false;
  private _environmentMessage: string = "";

  public render(): void {
    const element: React.ReactElement<IWorkFlowProps> = React.createElement(
      WorkFlow,
      {
        description: this.properties.description,
        isDarkTheme: this._isDarkTheme,
        environmentMessage: this._environmentMessage,
        hasTeamsContext: !!this.context.sdks.microsoftTeams,
        userDisplayName: this.context.pageContext.user.displayName,
        context: this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }
}
