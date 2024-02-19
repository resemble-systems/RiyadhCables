import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import ComentsModal from "../../../../commonComponents/modals/CommentsModal";
import LikeModal from "../../../../commonComponents/modals/LikeModal";
import EmptyCard from "../../../../commonComponents/emptyCard/EmptyCard";
import CommonLayout from "../../../../commonComponents/layout/Layout";
import CommonCard from "../../../../commonComponents/commonCard";
import { UserConsumer } from "../../../../service/UserContext";
import NewsCard from "../../../../commonComponents/newsCard/NewsCard";

interface INewsProps {
  context: WebPartContext;
  marginRight: boolean;
}

interface INewsState {
  newsSortedAsRecent: any[];
  isModalOpen: boolean;
  commentsPost: string;
  modalData: { ID: number; Comments: string };
  modalDataID: number;
  LikeModalData: { ID: number; Likes: string };
  isLikeModalOpen: boolean;
}

export default class News extends React.Component<INewsProps, INewsState> {
  public constructor(props: INewsProps, state: INewsState) {
    super(props);
    this.state = {
      newsSortedAsRecent: [],
      isModalOpen: false,
      commentsPost: "",
      modalData: { ID: 0, Comments: "" },
      modalDataID: 0,
      LikeModalData: { ID: 0, Likes: "" },
      isLikeModalOpen: false,
    };
  }

  public componentDidMount(): void {
    this.getNews();
  }

  /*  public getNews: () => void = () => {
    const { context } = this.props;
    const { modalDataID, isModalOpen } = this.state;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('News')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(`Error in News Fetch ${res.status}`);
          return;
        }
      })
      .then((listItems: { value: any[] }) => {
        console.log("News Fetch", listItems);
        const approvedItems: any[] = listItems.value.filter(
          (items: { ApprovalStatus: string }) =>
            items.ApprovalStatus === "Approved"
        );
        const sortedItems: any[] = approvedItems.sort(
          (a: { Date: string }, b: { Date: string }) =>
            new Date(b.Date).getTime() - new Date(a.Date).getTime()
        );
        let filteredModalData: any[] = [];
        if (modalDataID && isModalOpen) {
          filteredModalData = sortedItems.filter(
            (item: { ID: number | string }) => {
              return modalDataID === item.ID;
            }
          );
        }
        this.setState({
          newsSortedAsRecent: sortedItems,
          modalData: filteredModalData[0] ? filteredModalData[0] : {},
        });
      });
  }; */

  public getNews = async () => {
    const { context } = this.props;
    const { modalDataID, isModalOpen } = this.state;
    try {
      const res: SPHttpClientResponse = await context.spHttpClient.get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('News')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      );

      if (!res.ok) {
        throw new Error(`HTTP request failed with status ${res.status}`);
      }

      const listItems: any = await res.json();
      console.log("Announcement Fetch", listItems);

      const approvedItems: any[] = listItems.value?.filter(
        (items: { ApprovalStatus: string }) =>
          items.ApprovalStatus === "Approved"
      );

      let filteredModalData: any[] = [];
      if (modalDataID && isModalOpen) {
        filteredModalData = approvedItems?.filter(
          (item: { ID: number | string }) => {
            return modalDataID === item.ID;
          }
        );
      }
      let smallPicture: any = [];
      await Promise.all(
        approvedItems?.map(async (item: any) => {
          try {
            const smallPictureData = await this.getSmallPicture(
              "News",
              item.ID
            );
            smallPicture = [
              ...smallPicture,
              {
                ...item,
                HomePageSmallPictures: smallPictureData
                  ? smallPictureData.AttachmentFiles
                  : [],
              },
            ];
          } catch (error) {
            console.error(error);
          }
        })
      );
      console.log("smallPicture", smallPicture);
      const sortedItems: any[] = smallPicture?.sort(
        (a: { Date: string }, b: { Date: string }) =>
          new Date(b.Date).getTime() - new Date(a.Date).getTime()
      );
      this.setState({
        newsSortedAsRecent: sortedItems,
        modalData: filteredModalData[0] ? filteredModalData[0] : {},
      });
    } catch (err) {
      console.error("Error in componentDidMount:", err);
    }
  };

  public async getSmallPicture(ListType: string, ID: number) {
    const { context } = this.props;
    try {
      const res: SPHttpClientResponse = await context.spHttpClient.get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('HomePageSmallPictures')/items?$select=ID,Created,TypeofData,NewsTitle/Id&$expand=NewsTitle&$expand=AttachmentFiles &$filter= TypeofData eq '${ListType}'`,
        SPHttpClient.configurations.v1
      );

      if (!res.ok) {
        throw new Error(`HTTP request failed with status ${res.status}`);
      }
      const listItems: any = await res.json();
      console.log("HomePageSmallPictures Fetch", listItems);
      const filteredItem = listItems.value?.filter(
        (data: { NewsTitle: { Id: number } }) => data.NewsTitle.Id === ID
      );
      console.log("HomePageSmallPictures filteredItem", filteredItem);
      return filteredItem.length ? filteredItem[0] : {};
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  public updateItem: (commentResponse: string, ID: number | string) => void = (
    commentResponse: string,
    ID: number | string
  ) => {
    const { context } = this.props;
    const headers = {
      "X-HTTP-Method": "MERGE",
      "If-Match": "*",
    };
    const spHttpClintOptions: ISPHttpClientOptions = {
      headers,
      body: JSON.stringify({
        Comments: commentResponse,
      }),
    };
    context.spHttpClient
      .post(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('News')/items('${ID}')`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      )
      .then((res: SPHttpClientResponse) => {
        console.log(`Error in News Post ${res.status}`);
        this.getNews();
      });
  };

  public updateLikes: (likeResponse: string, ID: number | string) => void = (
    likeResponse: string,
    ID: number | string
  ) => {
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
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('News')/items('${ID}')`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      )
      .then((res: SPHttpClientResponse) => {
        console.log(`Error in News Post ${res.status}`);
        this.getNews();
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
    let isUserExist: Array<{
      RespondantName: string;
      RespondantEmail: string;
    }> = [];
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

  public commentsCount: (commentsData: string) => number = (
    commentsData: string
  ) => {
    if (!JSON.parse(commentsData) || JSON.parse(commentsData)?.length === 0)
      return 0;
    else return JSON.parse(commentsData).length;
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

  public getDateTime: () => string = () => {
    const now = new Date();
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const date = ("0" + now.getDate()).slice(-2);
    const month = monthNames[now.getMonth()];
    const year = now.getFullYear();

    let hour: number | string = now.getHours();
    let minute: number | string = now.getMinutes();
    if (hour.toString().length === 1) {
      hour = "0" + hour;
    }
    if (minute.toString().length === 1) {
      minute = "0" + minute;
    }
    const dateTime = `${date}-${month}-${year} ${hour}:${minute}`;
    return dateTime;
  };

  public handleSubmit: (
    ID: number,
    COMMENTS: string,
    commentsPost: string
  ) => void = (ID: number, COMMENTS: string, commentsPost: string) => {
    const { context } = this.props;
    const dateTime = this.getDateTime();
    const commentsArray: [] = JSON.parse(COMMENTS);
    const result = {
      RespondantName: context.pageContext.user.displayName,
      RespondantEmail: context.pageContext.user.email,
      RespondantComment: commentsPost,
      RespondantDate: dateTime,
    };

    if (!commentsArray) {
      const newComment = [result];
      const commentResponse = JSON.stringify(newComment);
      this.updateItem(commentResponse, ID);
      this.setState({ commentsPost: "" });
    } else {
      const newComment = [...commentsArray, result];
      const commentResponse = JSON.stringify(newComment);
      this.updateItem(commentResponse, ID);
      this.setState({ commentsPost: "" });
    }
  };

  public render(): React.ReactElement<INewsProps> {
    const {
      newsSortedAsRecent,
      isModalOpen,
      commentsPost,
      modalData,
      LikeModalData,
      isLikeModalOpen,
    } = this.state;
    const { context, marginRight } = this.props;
    const handleCancel = () => {
      this.setState({ isModalOpen: false });
    };

    const handleLikeModel = () => {
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
              lg={9}
              xl={9}
              classNames={`${marginRight && "marginRight"}`}
            >
              <CommonCard
                cardIcon={require("../../assets/news.svg")}
                cardTitle={"News"}
                footerText={"Previous News"}
                footerVisible={true}
                rightPanelVisible={false}
                redirectionLink={`${context.pageContext.web.absoluteUrl}/SitePages/News.aspx`}
                rightPanelElement={<></>}
              >
                {newsSortedAsRecent?.length > 0 ? (
                  newsSortedAsRecent.slice(0, 2).map(
                    (
                      news: {
                        ID: number;
                        AttachmentFiles: any[];
                        Title: string;
                        Description: string;
                        Location: string;
                        Date: string;
                        Likes: string;
                        Comments: string;
                        HomePageSmallPictures: any[];
                      },
                      index: number
                    ) => {
                      return (
                        <NewsCard
                          key={index}
                          col={6}
                          self={this}
                          listName="news"
                          singleLine={index == 0}
                          context={context}
                          cardItem={news}
                          likeImage={this.likeImage}
                          likesCount={this.likesCount}
                          handleLiked={this.handleLiked}
                          commentsCount={this.commentsCount}
                        />
                      );
                    }
                  )
                ) : (
                  <EmptyCard />
                )}

                <ComentsModal
                  self={this}
                  context={context}
                  modalData={modalData}
                  isModalOpen={isModalOpen}
                  handleCancel={handleCancel}
                  commentsPost={commentsPost}
                  handleSubmit={this.handleSubmit}
                />
                <LikeModal
                  context={context}
                  LikeModalData={LikeModalData}
                  handleLikeModel={handleLikeModel}
                  isLikeModalOpen={isLikeModalOpen}
                />
              </CommonCard>
            </CommonLayout>
          );
        }}
      </UserConsumer>
    );
  }
}
