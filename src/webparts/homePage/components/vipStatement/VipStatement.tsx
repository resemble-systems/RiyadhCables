import * as React from "react";
import "./index.css";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  SPHttpClient,
  SPHttpClientResponse,
  ISPHttpClientOptions,
} from "@microsoft/sp-http";
import { UserConsumer } from "../../../../service/UserContext";
import CommonLayout from "../../../../commonComponents/layout/Layout";
import CommonCard from "../../../../commonComponents/commonCard";
import EmptyCard from "../../../../commonComponents/emptyCard/EmptyCard";
import Pagination from "../../../../commonComponents/pagination/Pagination";
import LikeModal from "../../../../commonComponents/modals/LikeModal";

export interface IVipStatementProps {
  marginRight: boolean;
  context: WebPartContext;
}

export interface IVipStatementState {
  vipStatement: Array<any>;
  currentPage: number;
  isLikeModalOpen: boolean;
  LikeModalData: { ID: number; Likes: string };
}

export default class VipStatement extends React.Component<
  IVipStatementProps,
  IVipStatementState
> {
  public constructor(props: IVipStatementProps, state: IVipStatementState) {
    super(props);

    this.state = {
      vipStatement: [],
      currentPage: 1,
      isLikeModalOpen: false,
      LikeModalData: { ID: 0, Likes: "" },
    };
  }

  public componentDidMount(): void {
    this.getVipStatements();
  }

  public getVipStatements() {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('VipStatement')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        console.log("Vip Statement Success");
        return res.json();
      })
      .then((listItems: any) => {
        console.log("Vip Statement listItems", listItems);
        const sortedItems: any = listItems.value.sort(
          (a: any, b: any) => a.ShowOrder - b.ShowOrder
        );
        this.setState({ vipStatement: sortedItems });
      });
  }

  public updateLikes: (likeResponse: string, ID: number | string) => void =
    async (likeResponse: string, ID: number | string) => {
      const { context } = this.props;
      const headers = {
        "X-HTTP-Method": "MERGE",
        "If-Match": "*",
      };
      const spHttpClintOptions: ISPHttpClientOptions = {
        headers,
        body: JSON.stringify({
          Likes: likeResponse,
        }),
      };
      context.spHttpClient
        .post(
          `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('VipStatement')/items('${ID}')`,
          SPHttpClient.configurations.v1,
          spHttpClintOptions
        )
        .then((res: SPHttpClientResponse) => {
          console.log(`Announcement Post ${res.status}`);
          this.getVipStatements();
        });
    };

  public handleLiked: (ID: number | string, LIKES: string) => void = (
    ID: number | string,
    LIKES: string
  ) => {
    const { context } = this.props;
    const result = {
      RespondantName: context.pageContext.user.displayName,
      RespondantEmail: context.pageContext.user.email,
    };

    const likesArray = JSON.parse(LIKES);
    let isUserExist: any[] = [];
    if (likesArray) {
      isUserExist = likesArray.filter(
        (item: { RespondantName: string; RespondantEmail: string }) =>
          item.RespondantName === context.pageContext.user.displayName &&
          item.RespondantEmail === context.pageContext.user.email
      );
    }
    if (!likesArray) {
      const likesResult = [result];
      const likesResponse = JSON.stringify(likesResult);
      this.updateLikes(likesResponse, ID);
    }
    if (isUserExist.length > 0) {
      const likesResult = likesArray.filter(
        (item: { RespondantName: string; RespondantEmail: string }) =>
          item.RespondantName !== context.pageContext.user.displayName &&
          item.RespondantEmail !== context.pageContext.user.email
      );

      const likesResponse = JSON.stringify(likesResult);
      this.updateLikes(likesResponse, ID);
    } else {
      const likesResult = [...likesArray, result];
      const likesResponse = JSON.stringify(likesResult);
      this.updateLikes(likesResponse, ID);
    }
  };

  public likesCount: (likesData: string) => number = (likesData: string) => {
    if (!JSON.parse(likesData) || JSON.parse(likesData)?.length === 0) return 0;
    else return JSON.parse(likesData).length;
  };

  public likeImage: (likeData: string) => boolean = (likeData: string) => {
    const { context } = this.props;
    let likesArray = JSON.parse(likeData);
    let isUserExist: any[] = [];
    if (likesArray) {
      isUserExist = likesArray.filter(
        (item: { RespondantName: string; RespondantEmail: string }) =>
          item.RespondantName === context.pageContext.user.displayName &&
          item.RespondantEmail === context.pageContext.user.email
      );
    }
    if (isUserExist.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  public render(): React.ReactElement<IVipStatementProps> {
    const { vipStatement, currentPage, isLikeModalOpen, LikeModalData } =
      this.state;
    const { marginRight, context } = this.props;
    const exercisesPerPage = 1;
    const numberOfElements = vipStatement.length;
    const numberOfPages = Math.round(numberOfElements / exercisesPerPage);
    const indexOfLastPage = currentPage * exercisesPerPage;
    const indexOfFirstPage = indexOfLastPage - exercisesPerPage;
    const currentData = vipStatement.slice(indexOfFirstPage, indexOfLastPage);
    const left = require("../../assets/left.png");
    const right = require("../../assets/right.png");
    const heart = require("./assets/heart.png");
    const heartOutline = require("./assets/heartsOutline.png");

    const handleLikeModel: () => void = () => {
      this.setState({ isLikeModalOpen: false });
    };

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
                cardIcon={require("../../assets/vip.png")}
                cardTitle={"VIP Statements"}
                footerText={""}
                footerVisible={false}
                rightPanelVisible={true}
                redirectionLink={``}
                rightPanelElement={
                  <Pagination
                    self={this}
                    left={left}
                    right={right}
                    currentPage={currentPage}
                    numberOfPages={numberOfPages}
                  />
                }
              >
                <div
                  className="vipStatementContainer"
                  style={{
                    fontFamily: "Avenir Next",
                  }}
                >
                  {vipStatement.length > 0 ? (
                    currentData.map((data) => (
                      <>
                        <div
                          style={{
                            height: "420px",
                            overflowY: "scroll",
                            scrollbarWidth: "thin",
                          }}
                        >
                          <div className="d-flex gap-2 border-top border-3 pt-2">
                            <div>
                              <img
                                className="rounded-circle"
                                src={`${
                                  data.Email
                                    ? `${context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?AccountName=${data.Email}`
                                    : require("../../assets/userImg.jpg")
                                }`}
                                width={"44px"}
                              />
                            </div>
                            <div>
                              <div
                                style={{
                                  color: "#414141",
                                  fontWeight: "600",
                                  fontFamily: "Avenir Next",
                                }}
                              >
                                {data.Title}
                              </div>
                              <div
                                style={{
                                  fontSize: "12px",
                                  fontWeight: "600",
                                  color: "#84908E",
                                  fontFamily: "Avenir Next",
                                }}
                              >
                                {data.Designation}
                              </div>
                            </div>
                          </div>
                          <div
                            className={`p-2 rounded-3 mt-4 me-2 mb-3`}
                            style={{
                              fontSize: "14px",
                              fontWeight: "500",
                              backgroundColor: "#ededed",
                              cursor: "pointer",
                              minHeight: "85px",
                              fontFamily: "Avenir Next",
                            }}
                            dangerouslySetInnerHTML={{
                              __html: data.Statement,
                            }}
                          ></div>
                        </div>
                        <span
                          className="d-flex align-items-center justify-content-end my-2"
                          style={{ height: "20px" }}
                        >
                          <img
                            className="mx-1"
                            style={{ cursor: "pointer" }}
                            src={
                              this.likeImage(data?.Likes) ? heart : heartOutline
                            }
                            alt="heart"
                            height="20px"
                            width="20px"
                            onClick={() => {
                              this.handleLiked(data.ID, data.Likes);
                            }}
                          />
                          <span
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              if (this.likesCount(data?.Likes)) {
                                this.setState({
                                  isLikeModalOpen: true,
                                  LikeModalData: {
                                    ID: data.ID,
                                    Likes: data.Likes,
                                  },
                                });
                              }
                            }}
                          >
                            {this.likesCount(data?.Likes)}
                          </span>
                        </span>
                      </>
                    ))
                  ) : (
                    <EmptyCard />
                  )}
                  <LikeModal
                    context={context}
                    LikeModalData={LikeModalData}
                    handleLikeModel={handleLikeModel}
                    isLikeModalOpen={isLikeModalOpen}
                  />
                </div>
              </CommonCard>
            </CommonLayout>
          );
        }}
      </UserConsumer>
    );
  }
}
