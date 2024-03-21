import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import Files from "./Files";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";

interface IFolderProps {
  context: WebPartContext;
  innerFolders: any;
  innerFiles: any;
  margin: string;
  searchText: string;
  approvedFiles: any;
  listName: string;
}

interface IFolderState {
  folderName: any;
  FolderinnerFiles: any;
  FolderinnerFolders: any;
  isOpen: boolean;
}

export default class Folder extends React.Component<
  IFolderProps,
  IFolderState
> {
  public constructor(props: IFolderProps, state: IFolderState) {
    super(props);
    this.state = {
      folderName: null,
      FolderinnerFolders: null,
      FolderinnerFiles: null,
      isOpen: false,
    };
  }

  public getInnerFiles: any = (folderName: any) => {
    const { context, listName } = this.props;
    let apiUrl: any;
    switch (context.pageContext.web.absoluteUrl.split("/").length) {
      case 6:
        apiUrl = listName;
        break;
      case 5:
        apiUrl = listName;
        break;
    }
    let folderUrl: any;
    switch (context.pageContext.web.absoluteUrl.split("/").length) {
      case 6:
        folderUrl = folderName.split("/").slice(5).join("/");
        break;
      case 5:
        folderUrl = folderName.split("/").slice(4).join("/");
        break;
    }
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/GetFolderByServerRelativeUrl('${apiUrl}/${folderUrl}')?$select=*&$expand=files,Folders`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        console.log("Inner Structure");
        return res.json();
      })
      .catch((error) => {
        console.log(error, "Document ERROR");
      })
      .then((lisItems: any) => {
        console.log(lisItems, "Inner Structure");
        const fileSort: any = lisItems.Files.sort(
          (a: any, b: any) =>
            new Date(b.TimeCreated).getTime() -
            new Date(a.TimeCreated).getTime()
        );
        console.log(fileSort, "FolderinnerFiles");
        this.setState({ FolderinnerFiles: this.filterFunction(fileSort) });
        const folderSort: any = lisItems.Folders.sort(
          (a: any, b: any) =>
            new Date(b.TimeCreated).getTime() -
            new Date(a.TimeCreated).getTime()
        );
        console.log(folderSort, "FolderinnerFolders");
        this.setState({ FolderinnerFolders: folderSort });
        if (
          folderSort.length === 0 &&
          this.filterFunction(fileSort).length === 0
        ) {
          this.setState({ isOpen: false });
          alert("Folder Empty");
        }
      });
  };

  public filterFunction: any = (arrayItem: any) => {
    let arrayFilter: any = arrayItem.filter((items: any) => {
      return (
        this.props.approvedFiles.filter((itemsOne: any) => {
          return itemsOne.FileRef == items.ServerRelativeUrl;
        }).length != 0
      );
    });
    return arrayFilter;
  };

  public render(): React.ReactElement<IFolderProps> {
    const { folderName, FolderinnerFolders, FolderinnerFiles, isOpen } =
      this.state;
    const {
      context,
      innerFolders,
      margin,
      searchText,
      approvedFiles,
      listName,
    } = this.props;
    const folderIcon = require("./assets/folder.png");
    const up = require("./assets/up.png");

    return (
      <>
        {innerFolders.map((driveData: any) => {
          return (
            <>
              <div
                className={`d-flex ${margin} justify-content-between mb-3 me-2 border-bottom border-secondary`}
                style={{
                  fontSize: "16px",
                  fontWeight: "400",
                  fontFamily: "Avenir Next",
                }}
              >
                <div className="d-flex">
                  <div className="pb-2">
                    <img src={folderIcon} width="30px" height="30px" />
                  </div>
                  <div
                    className="d-flex align-items-center ms-3"
                    style={{
                      fontSize: "16px",
                      fontWeight: "500",
                      pointerEvents: `${
                        isOpen && folderName === driveData.Name
                          ? "none"
                          : "auto"
                      }`,
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      this.setState({
                        folderName: driveData.Name,
                        isOpen: true,
                        FolderinnerFolders: null,
                        FolderinnerFiles: null,
                      });
                      this.getInnerFiles(driveData.ServerRelativeUrl);
                    }}
                  >
                    {driveData.Name}
                  </div>
                </div>
                {isOpen && folderName === driveData.Name && (
                  <div
                    className="pb-2 d-flex align-items-end"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      this.setState({
                        isOpen: false,
                        FolderinnerFolders: null,
                        FolderinnerFiles: null,
                      });
                    }}
                  >
                    <img src={up} width="16px" height="16px" />
                  </div>
                )}
              </div>
              {FolderinnerFolders?.length > 0 &&
                folderName === driveData.Name && (
                  <Folder
                    context={context}
                    innerFiles={FolderinnerFiles}
                    innerFolders={FolderinnerFolders}
                    margin={"ms-3"}
                    searchText={searchText}
                    approvedFiles={approvedFiles}
                    listName={listName}
                  />
                )}
              {FolderinnerFiles?.length > 0 &&
                folderName === driveData.Name && (
                  <Files
                    context={context}
                    fileFilter={FolderinnerFiles.filter((item: any) => {
                      return (
                        item?.Name?.toLowerCase().match(
                          searchText.toLowerCase()
                        ) ||
                        item?.TimeCreated?.toLowerCase().match(
                          searchText.toLowerCase()
                        )
                      );
                    })}
                    margin={"ms-3"}
                    searchText={searchText}
                    listName={listName}
                  />
                )}
            </>
          );
        })}
      </>
    );
  }
}
