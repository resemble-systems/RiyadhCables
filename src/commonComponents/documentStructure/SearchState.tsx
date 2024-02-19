import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";

interface ISearchStateProps {
  context: WebPartContext;
  sharedFiles: any;
  searchText: string;
}

interface ISearchStateState {}

export default class SearchState extends React.Component<
  ISearchStateProps,
  ISearchStateState
> {
  public constructor(props: ISearchStateProps, state: ISearchStateState) {
    super(props);
    this.state = {};
  }

  public render(): React.ReactElement<ISearchStateProps> {
    const { context, sharedFiles, searchText } = this.props;
    console.log("Web URL CONTEXT", context);
    return (
      <>
        {sharedFiles?.length > 0 &&
          sharedFiles
            ?.filter((item: any) => {
              return (
                item?.FileRef.split("/")
                  [item.FileRef.split("/").length - 1]?.toLowerCase()
                  .match(searchText.toLowerCase()) ||
                item?.Created?.toLowerCase().match(searchText.toLowerCase()) ||
                item?.FileRef.split("/")[5]
                  ?.toLowerCase()
                  .match(searchText.toLowerCase())
              );
            })
            ?.map((driveData: any, index: any) => {
              let fileIcon: string;
              let baseUrl: string;
              let documentUrl: string;
              let absoluteUrl = context.pageContext.web.absoluteUrl;
              console.log(absoluteUrl, "absoluteurl");
              let subtUrl = absoluteUrl
                .split(context.pageContext.web.serverRelativeUrl)
                .join("")
                .concat(driveData.FileRef);
              console.log(subtUrl, "subturl");

              switch (
                driveData.FileRef.split(".")[
                  driveData.FileRef.split(".").length - 1
                ]
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
                case "PNG":
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
                driveData.FileRef.split(".")[
                  driveData.FileRef.split(".").length - 1
                ]
              ) {
                case "docx" || "doc":
                  documentUrl = baseUrl;
                  break;
                case "xlsx":
                  documentUrl = baseUrl;
                  break;
                case "pptx" || "ppt":
                  documentUrl = baseUrl;
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
                  target="_blank"
                  rel="noopener noreferrer"
                  data-interception="off"
                  href={documentUrl}
                  className="text-decoration-none text-dark"
                >
                  <div
                    className="d-flex mb-3 mt-3 mx-3"
                    style={{
                      fontSize: "16px",
                      fontWeight: "400",
                      fontFamily: "Avenir Next",
                    }}
                  >
                    <div>
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
                      {
                        driveData.FileRef.split("/")[
                          driveData.FileRef.split("/").length - 1
                        ]
                      }
                    </div>
                  </div>
                  <hr />
                </a>
              );
            })}
      </>
    );
  }
}
