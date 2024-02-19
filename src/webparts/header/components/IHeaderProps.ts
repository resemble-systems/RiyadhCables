import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IHeaderProps {
  description: string;
  context: WebPartContext;
  userDisplayName: string;
}
