import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import CommonLayout from "../../../../commonComponents/layout/Layout";
import CommonCard from "../../../../commonComponents/commonCard";
import { UserConsumer } from "../../../../service/UserContext";
import EmptyCard from "../../../../commonComponents/emptyCard/EmptyCard";
import FolderStructure from "../../../../commonComponents/documentStructure/FolderStructure";
import FileStructure from "../../../../commonComponents/documentStructure/FileStructure";

interface IDocumentStructureProps {
  context: WebPartContext;
  listName: string;
  cardIcon: string;
  cardTitle: string;
  footerText: string;
  footerVisible: boolean;
  rightPanelElement: JSX.Element;
  rightPanelVisible: boolean;
  redirectionLink: string;
  marginRight: boolean;
}

interface IDocumentStructureState {
  folderFilter: any;
  fileFilter: any;
  innerFiles: any;
  innerFolders: any;
  folderName: any;
  isOpen: boolean;
  approvedItems: any;
  sharedFiles: any;
}

export default class DocumentStructure extends React.Component<
  IDocumentStructureProps,
  IDocumentStructureState
> {
  public constructor(
    props: IDocumentStructureProps,
    state: IDocumentStructureState
  ) {
    super(props);
    this.state = {
      folderFilter: null,
      fileFilter: null,
      innerFiles: null,
      innerFolders: null,
      folderName: null,
      isOpen: false,
      approvedItems: null,
      sharedFiles: [],
    };
  }

  public dataSorting(arrayElement: any[]) {
    const sortedItems = arrayElement?.sort((a, b) => {
      let nameA = a.Name.toLowerCase();
      let nameB = b.Name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    return sortedItems;
  }

  public componentDidMount() {
    const { context, listName } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/getByTitle('${listName}')/items?$select=ID,FileRef,ApprovalStatus`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        console.log("listItems Success");
        return res.json();
      })
      .catch((error) => {
        console.log(error, "ERROR");
      })
      .then((listItems: any) => {
        console.log("Res Policies listItems", listItems);
        const approvedItems: any = listItems.value; /* .filter(
          (items: any) => items.ApprovalStatus === "Approved"
        ); */
        console.log(approvedItems, "Policies approvedItems");
        const filesFilter: any = approvedItems.filter(
          (items: any) => items.FileRef.split(".").length > 1
        );
        this.setState({
          approvedItems: approvedItems,
          sharedFiles: filesFilter,
        });
        if (approvedItems.length > 0) {
          this.getFilesFolder();
        }
      });
  }

  public getFilesFolder: any = () => {
    const { context, listName } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/Web/GetFolderByServerRelativeUrl('${listName}')?$select=*&$expand=files,Folders`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        console.log("New Document listItems Success Structure");
        return res.json();
      })
      .catch((error) => {
        console.log(error, "Document ERROR");
      })
      .then((lisItems: any) => {
        console.log(lisItems, "New Document listItems Success Structure");
        const fileSort: any = this.dataSorting(lisItems.Files);
        /* lisItems.Files.sort(
          (a: any, b: any) =>
            new Date(b.TimeCreated).getTime() -
            new Date(a.TimeCreated).getTime()
        ); */
        this.setState({ fileFilter: this.filterFunction(fileSort) });
        const folderSort: any = this.dataSorting(lisItems.Folders);
        /* lisItems.Folders.sort(
          (a: any, b: any) =>
            new Date(b.TimeCreated).getTime() -
            new Date(a.TimeCreated).getTime()
        ); */
        const formFilter: any = folderSort.filter(
          (items: any) => items.Name !== "Forms"
        );
        this.setState({ folderFilter: formFilter });
      });
  };

  public getInnerFiles: any = (siteUrl: any) => {
    const { context, listName } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/GetFolderByServerRelativeUrl('${listName}/${siteUrl}')?$select=*&$expand=files,Folders`,
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
        const fileSort: any = this.dataSorting(lisItems.Files);
        /* const fileSort: any = lisItems.Files.sort(
          (a: any, b: any) =>
            new Date(b.TimeCreated).getTime() -
            new Date(a.TimeCreated).getTime()
        ); */
        console.log(fileSort, "fileSort");
        this.setState({ innerFiles: this.filterFunction(fileSort) });
        const folderSort: any = this.dataSorting(lisItems.Folders);
        /* const folderSort: any = lisItems.Folders.sort(
          (a: any, b: any) =>
            new Date(b.TimeCreated).getTime() -
            new Date(a.TimeCreated).getTime()
        ); */
        console.log(folderSort, "folderSort");
        this.setState({ innerFolders: folderSort });
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
        this.state.approvedItems.filter((itemsOne: any) => {
          return itemsOne.FileRef == items.ServerRelativeUrl;
        }).length != 0
      );
    });
    return arrayFilter;
  };

  public render(): React.ReactElement<IDocumentStructureProps> {
    const {
      fileFilter,
      folderFilter,
      innerFiles,
      folderName,
      innerFolders,
      isOpen,
      approvedItems,
    } = this.state;
    const {
      context,
      listName,
      cardIcon,
      cardTitle,
      footerText,
      footerVisible,
      rightPanelElement,
      rightPanelVisible,
      redirectionLink,
      marginRight,
    } = this.props;
    const folderIcon = require("./assets/folder.png");
    const up = require("./assets/up.png");

    return (
      <UserConsumer>
        {(UserDetails: {
          name: string;
          email: string;
          isAdmin: boolean;
          isSmallScreen: boolean;
        }) => {
          return (
            <CommonLayout
              lg={8}
              xl={8}
              classNames={`${marginRight && "marginRight"}`}
            >
              <CommonCard
                cardIcon={cardIcon}
                cardTitle={cardTitle}
                footerText={footerText}
                footerVisible={footerVisible}
                rightPanelVisible={rightPanelVisible}
                redirectionLink={redirectionLink}
                rightPanelElement={rightPanelElement}
              >
                <div
                  className={`mb-3 documentContainer`}
                  style={{
                    height: "400px",
                    overflowY: "scroll",
                    scrollbarWidth: "thin",
                  }}
                >
                  {folderFilter?.length > 0 || fileFilter?.length > 0 ? (
                    <>
                      {folderFilter?.length > 0 &&
                        folderFilter?.map((driveData: any, index: any) => {
                          return (
                            <>
                              <div
                                className="d-flex justify-content-between mb-3 me-2 border-bottom border-secondary"
                                style={{ fontSize: "16px", fontWeight: "400" }}
                              >
                                <div className="d-flex">
                                  <div className="pb-2">
                                    <img
                                      src={folderIcon}
                                      width="30px"
                                      height="30px"
                                    />
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
                                        innerFiles: null,
                                        innerFolders: null,
                                        isOpen: true,
                                      });
                                      this.getInnerFiles(
                                        driveData.ServerRelativeUrl.split("/")
                                          .slice(4)
                                          .join("/")
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
                                        innerFiles: null,
                                        innerFolders: null,
                                      });
                                    }}
                                  >
                                    <img src={up} width="16px" height="16px" />
                                  </div>
                                )}
                              </div>
                              {innerFolders?.length > 0 &&
                                folderName === driveData.Name && (
                                  <FolderStructure
                                    context={context}
                                    innerFiles={innerFiles}
                                    innerFolders={innerFolders}
                                    margin={"ms-3"}
                                    approvedItems={approvedItems}
                                    listName={listName}
                                  />
                                )}
                              {innerFiles?.length > 0 &&
                                folderName === driveData.Name && (
                                  <FileStructure
                                    context={context}
                                    fileData={innerFiles}
                                    margin={"ms-3"}
                                  />
                                )}
                            </>
                          );
                        })}

                      {fileFilter?.length > 0 && (
                        <FileStructure
                          context={context}
                          fileData={fileFilter}
                          margin={""}
                        />
                      )}
                    </>
                  ) : (
                    <EmptyCard />
                  )}
                </div>
              </CommonCard>
            </CommonLayout>
          );
        }}
      </UserConsumer>
    );
  }
}
