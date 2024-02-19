import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface IFileStructureProps {
  fileData: any;
  context: WebPartContext;
  margin: string;
}

interface IFileStructureState {}

export default class FileStructure extends React.Component<
  IFileStructureProps,
  IFileStructureState
> {
  public constructor(props: IFileStructureProps, state: IFileStructureState) {
    super(props);
    this.state = {};
  }

  public render(): React.ReactElement<IFileStructureProps> {
    const { fileData, context, margin } = this.props;
    console.log("Web URL CONTEXT", context);
    return (
      <>
        {fileData?.length > 0 &&
          fileData?.map((driveData: any) => {
            let fileIcon: string;
            let baseUrl: string;
            let documentUrl: string;
            let absoluteUrl = context.pageContext.web.absoluteUrl;
            console.log(absoluteUrl, "absoluteurl");
            let subtUrl = absoluteUrl
              .split(context.pageContext.web.serverRelativeUrl)
              .join("")
              .concat(driveData.ServerRelativeUrl);
            console.log(subtUrl, "subturl");
            const urlConstructor = (type: string) => {
              const url = `${context.pageContext.web.absoluteUrl
                .split(context.pageContext.web.serverRelativeUrl)
                .join("")}/:${type}:/r${
                context.pageContext.web.serverRelativeUrl
              }/_layouts/15/Doc.aspx?sourcedoc=%7B${
                driveData.UniqueId
              }%7D&file=${driveData.Name}&action=view&mobileredirect=true`;
              return url;
            };

            switch (
              driveData.Name.split(".")[driveData.Name.split(".").length - 1]
            ) {
              case "docx" || "doc":
                fileIcon = require("./assets/word.png");
                break;
              case "xlsx":
                fileIcon = require("./assets/xlsx.png");
                break;
              case "pptx" || "ppt":
                fileIcon = require("./assets/ppt.png");
                break;
              case "png":
                fileIcon = require("./assets/png.png");
                break;
              case "jpg" || "jpeg":
                fileIcon = require("./assets/jpeg.png");
                break;
              case "pdf":
                fileIcon = require("./assets/pdf.png");
                break;
              default:
                fileIcon = require("./assets/word.png");
                break;
            }

            switch (absoluteUrl.split("/").length) {
              case 6:
                baseUrl = `${subtUrl}`;
                break;

              default:
                baseUrl = `${subtUrl}`;
            }

            switch (
              driveData.Name.split(".")[driveData.Name.split(".").length - 1]
            ) {
              case "docx" || "doc":
                documentUrl = urlConstructor("w");
                break;
              case "xlsx":
                documentUrl = urlConstructor("x");
                break;
              case "pptx" || "ppt":
                documentUrl = urlConstructor("p");
                break;
              case "png":
                documentUrl = baseUrl;
                break;
              case "jpg" || "jpeg":
                documentUrl = baseUrl;
                break;
              case "pdf":
                documentUrl = baseUrl;
                break;
              default:
                documentUrl = baseUrl;
                break;
            }

            return (
              <a
                href={`${documentUrl}`}
                className="text-decoration-none text-dark"
                target="_blank"
                rel="noopener noreferrer"
                data-interception="off"
              >
                <div
                  className={`d-flex ${margin} mb-3 me-2 border-bottom border-secondary`}
                  style={{}}
                >
                  <div className="pb-2">
                    <img src={fileIcon} width="30px" height="30px" />
                  </div>
                  <div
                    className="d-flex align-items-center ms-3"
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      fontFamily: "Avenir Next",
                    }}
                  >
                    {driveData.Name}
                  </div>
                </div>
              </a>
            );
          })}
      </>
    );
  }
}
