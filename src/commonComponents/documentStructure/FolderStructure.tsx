import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import FileStructure from "./FileStructure";

interface IFolderStructureProps {
  context: WebPartContext;
  innerFolders: any;
  innerFiles: any;
  margin: string;
  approvedItems: any;
  listName: string;
}

interface IFolderStructureState {
  folderName: any;
  FolderinnerFiles: any;
  FolderinnerFolders: any;
  isOpen: boolean;
}

export default class FolderStructure extends React.Component<
  IFolderStructureProps,
  IFolderStructureState
> {
  public constructor(
    props: IFolderStructureProps,
    state: IFolderStructureState
  ) {
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
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/GetFolderByServerRelativeUrl('${listName}/${folderName}')?$select=*&$expand=files,Folders`,
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
        this.props.approvedItems.filter((itemsOne: any) => {
          return itemsOne.FileRef == items.ServerRelativeUrl;
        }).length != 0
      );
    });
    return arrayFilter;
  };

  public render(): React.ReactElement<IFolderStructureProps> {
    const { folderName, FolderinnerFolders, FolderinnerFiles, isOpen } =
      this.state;
    const { context, innerFolders, margin, approvedItems, listName } =
      this.props;
    const folderIcon = require("./assets/folder.png");
    const up = require("./assets/up.png");

    return (
      <>
        {innerFolders?.map((driveData: any) => {
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
                      this.getInnerFiles(
                        driveData.ServerRelativeUrl.split(listName)[1]
                      );
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
                  <FolderStructure
                    context={context}
                    innerFiles={FolderinnerFiles}
                    innerFolders={FolderinnerFolders}
                    margin={"ms-3"}
                    approvedItems={approvedItems}
                    listName={listName}
                  />
                )}
              {FolderinnerFiles?.length > 0 &&
                folderName === driveData.Name && (
                  <FileStructure
                    context={context}
                    fileData={FolderinnerFiles}
                    margin={"ms-3"}
                  />
                )}
            </>
          );
        })}
      </>
    );
  }
}
