import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Tooltip } from "antd";
export interface IApplicationCardProps {
  cardItem: { Link: string; AttachmentFiles: any[]; Title: string };
  context: WebPartContext;
}

export default class ApplicationCard extends React.Component<
  IApplicationCardProps,
  {}
> {
  public render(): React.ReactElement<IApplicationCardProps> {
    const { cardItem, context } = this.props;
    const mail = require("./assets/mail.svg");
    return (
      <div className="border" style={{ height: "100px" }}>
        <a
          href={cardItem.Link}
          className="text-decoration-none text-dark"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="d-flex h-100 justify-content-center flex-column p-2">
            <div className="d-flex justify-content-center align-items-center bg-white">
              {cardItem?.AttachmentFiles.length > 0 ? (
                <div
                  className="d-flex justify-content-center align-items-center"
                  style={{
                    width: "80px",
                    height: "60px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={
                      context.pageContext.web.absoluteUrl
                        .split("/")
                        .slice(0, 3)
                        .join("/") +
                      cardItem?.AttachmentFiles[0]?.ServerRelativeUrl
                    }
                    height="100%"
                    width="100%"
                    alt="App"
                    style={{ objectFit: "contain" }}
                  />
                </div>
              ) : (
                <img src={mail} width="100%" alt="App" />
              )}
            </div>
            <div
              className={`d-flex pt-1 justify-content-center text-center bg-white`}
              style={{
                fontSize: "14px",
                fontWeight: "500",
                fontFamily: "Avenir Next",
              }}
            >
              <Tooltip placement="bottomLeft" title={cardItem.Title}>
                <div
                  style={{
                    display: "block",
                    maxWidth: "80px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {cardItem.Title}
                </div>
              </Tooltip>
            </div>
          </div>
        </a>
      </div>
    );
  }
}
