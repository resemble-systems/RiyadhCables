import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import CommonCard from "../../../../commonComponents/commonCard";
import EmptyCard from "../../../../commonComponents/emptyCard/EmptyCard";
import CommonLayout from "../../../../commonComponents/layout/Layout";
import LikeModal from "../../../../commonComponents/modals/LikeModal";
import ComentsModal from "../../../../commonComponents/modals/CommentsModal";
import { UserConsumer } from "../../../../service/UserContext";
import NewsCard from "../../../../commonComponents/newsCard/NewsCard";

interface IAnnouncementProps {
  context: WebPartContext;
}

interface IAnnouncementState {
  announcementSortedAsRecent: any[];
  isModalOpen: boolean;
  commentsPost: string;
  modalData: { ID: number; Comments: string };
  modalDataID: number;
  LikeModalData: { ID: number; Likes: string };
  isLikeModalOpen: boolean;
}

export default class Announcement extends React.Component<
  IAnnouncementProps,
  IAnnouncementState
> {
  public constructor(props: IAnnouncementProps, state: IAnnouncementState) {
    super(props);
    this.state = {
      announcementSortedAsRecent: [],
      isModalOpen: false,
      commentsPost: "",
      modalData: { ID: 0, Comments: "" },
      modalDataID: 0,
      LikeModalData: { ID: 0, Likes: "" },
      isLikeModalOpen: false,
    };
  }
  public componentDidMount(): void {
    this.getAnnouncements();
  }

  /* public getAnnouncements: () => void = () => {
    const { context } = this.props;
    const { modalDataID, isModalOpen } = this.state;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Announcements')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        if (res.ok) {
          return res.json();
        } else {
          console.log(`Error in Announcement Fetch ${res.status}`);
          return;
        }
      })
      .then((listItems: { value: any[] }) => {
        console.log("Announcement Fetch", listItems);
        const approvedItems: any[] = listItems.value.filter(
          (items: { ApprovalStatus: string }) =>
            items.ApprovalStatus === "Approved"
        );
        const sortedItems: any[] = approvedItems.sort(
          (a: { Created: string }, b: { Created: string }) =>
            new Date(b.Created).getTime() - new Date(a.Created).getTime()
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
          announcementSortedAsRecent: sortedItems,
          modalData: filteredModalData[0] ? filteredModalData[0] : {},
        });
      });
  }; */

  public getAnnouncements = async () => {
    const { context } = this.props;
    const { modalDataID, isModalOpen } = this.state;
    try {
      const res: SPHttpClientResponse = await context.spHttpClient.get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Announcements')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      );

      if (!res.ok) {
        throw new Error(`HTTP request failed with status ${res.status}`);
      }

      const listItems: any = await res.json();
      console.log("Announcement Fetch", listItems);

      const approvedItems: any[] = listItems.value.filter(
        (items: { ApprovalStatus: string }) =>
          items.ApprovalStatus === "Approved"
      );

      let filteredModalData: any[] = [];
      if (modalDataID && isModalOpen) {
        filteredModalData = approvedItems.filter(
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
              "Announcements",
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
        announcementSortedAsRecent: sortedItems,
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
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('HomePageSmallPictures')/items?$select=ID,Created,TypeofData,AnnouncemmentTitle/Id&$expand=AnnouncemmentTitle&$expand=AttachmentFiles &$filter= TypeofData eq '${ListType}'`,
        SPHttpClient.configurations.v1
      );

      if (!res.ok) {
        throw new Error(`HTTP request failed with status ${res.status}`);
      }
      const listItems: any = await res.json();
      console.log("HomePageSmallPictures Fetch", listItems);
      const filteredItem = listItems.value?.filter(
        (data: { AnnouncemmentTitle: { Id: number } }) =>
          data.AnnouncemmentTitle.Id === ID
      );
      console.log("HomePageSmallPictures filteredItem", filteredItem);
      return filteredItem.length ? filteredItem[0] : {};
    } catch (err) {
      console.error(err);
      return undefined;
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
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Announcements')/items('${ID}')`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      )
      .then((res: SPHttpClientResponse) => {
        console.log(`Announcement Post ${res.status}`);
        this.getAnnouncements();
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
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Announcements')/items('${ID}')`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      )
      .then((res: SPHttpClientResponse) => {
        console.log(`Announcement Post ${res.status}`);
        this.getAnnouncements();
      });
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

  public render(): React.ReactElement<IAnnouncementProps> {
    const {
      announcementSortedAsRecent,
      isModalOpen,
      commentsPost,
      modalData,
      isLikeModalOpen,
      LikeModalData,
    } = this.state;
    const { context } = this.props;

    const handleCancel: () => void = () => {
      this.setState({ isModalOpen: false });
    };

    const handleLikeModel: () => void = () => {
      this.setState({ isLikeModalOpen: false });
    };

    return (
      <UserConsumer>
        {(UserDetails: { name: string; email: string; isAdmin: boolean }) => {
          return (
            <CommonLayout lg={8} xl={8}>
              <CommonCard
                cardIcon={require("../../assets/announcment.svg")}
                cardTitle={"Announcements"}
                footerText={"Previous Announcements"}
                footerVisible={true}
                rightPanelVisible={false}
                redirectionLink={`${context.pageContext.web.absoluteUrl}/SitePages/Announcements.aspx`}
                rightPanelElement={<></>}
              >
                {announcementSortedAsRecent?.length > 0 ? (
                  announcementSortedAsRecent
                    .slice(0, 2)
                    .map(
                      (announcement: {
                        ID: number;
                        AttachmentFiles: any[];
                        Title: string;
                        Description: string;
                        Location: string;
                        Date: string;
                        Likes: string;
                        Comments: string;
                        HomePageSmallPictures: any[];
                      }) => {
                        return (
                          <NewsCard
                            col={6}
                            self={this}
                            listName="announcement"
                            context={context}
                            singleLine={false}
                            cardItem={announcement}
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
