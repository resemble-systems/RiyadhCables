import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface ITemplateNewsProps {
  description: string;
  context: WebPartContext;
  isDarkTheme: boolean;
  environmentMessage: string;
  hasTeamsContext: boolean;
  userDisplayName: string;
}
