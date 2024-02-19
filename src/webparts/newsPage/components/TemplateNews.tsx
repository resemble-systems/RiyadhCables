import * as React from "react";
import { ITemplateNewsProps } from "./ITemplateNewsProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import { Row, Col } from "antd";
import "antd/dist/reset.css";
import "../../global.css";
import EmptyCard from "../../../commonComponents/emptyCard/EmptyCard";
import ComentsModal from "../../../commonComponents/modals/CommentsModal";
import LikeModal from "../../../commonComponents/modals/LikeModal";
import NewsCard from "../../../commonComponents/newsCard/NewsCard";
interface ITemplateNewsState {
  newsSortedAsRecent: any;
  isModalOpen: any;
  currentPage: number;
  commentsPost: any;
  modalData: any;
  modalDataID: any;
  filterRecent: any;
  filterAz: any;
  filterZa: any;
  searchText: any;
  isScreenWidth: any;
  isLikeModalOpen: any;
  LikeModalData: any;
  filterOlder: boolean;
}
export default class TemplateNews extends React.Component<
  ITemplateNewsProps,
  ITemplateNewsState
> {
  public scrollRef: any;
  public constructor(props: ITemplateNewsProps, state: ITemplateNewsState) {
    super(props);
    this.state = {
      newsSortedAsRecent: [],
      currentPage: 1,
      isModalOpen: false,
      commentsPost: "",
      modalData: {},
      modalDataID: 0,
      filterRecent: true,
      filterAz: false,
      filterZa: false,
      searchText: "",
      isScreenWidth: 800,
      isLikeModalOpen: false,
      LikeModalData: false,
      filterOlder: false,
    };
    this.scrollRef = React.createRef();
  }

  /*  public getNews: any = () => {
    const { context } = this.props;
    const { modalDataID, isModalOpen, modalData } = this.state;
    const ActivePage = window.location.pathname;
    const CurrentPage = ActivePage.split("/SitePages");
    const NewsPage = CurrentPage[1] === "/News.aspx" ? true : false;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${
          NewsPage ? "News" : "Announcements"
        }')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        console.log("listItems Success");
        return res.json();
      })
      .then((listItems: any) => {
        console.log("Res listItems", listItems);
        const approvedItems: any = listItems.value.filter(
          (items: any) => items.ApprovalStatus === "Approved"
        );
        const sortedItems: any = approvedItems.sort(
          (a: any, b: any) =>
            new Date(b.Date).getTime() - new Date(a.Date).getTime()
        );
        console.log("NewsSortedItems", sortedItems);
        let filteredModalData: any = [];
        if (modalDataID && isModalOpen) {
          filteredModalData = sortedItems.filter((item: any) => {
            return modalDataID === item.ID;
          });
        }
        console.log(filteredModalData, "filteredModalData");
        console.log(modalData, "modalData Comments");
        this.setState({
          newsSortedAsRecent: sortedItems,
          modalData: filteredModalData[0] ? filteredModalData[0] : {},
        });
      });
  }; */

  public getNews = async () => {
    const { context } = this.props;
    const { modalDataID, isModalOpen } = this.state;
    const ActivePage = window.location.pathname;
    const CurrentPage = ActivePage.split("/SitePages");
    const NewsPage = CurrentPage[1] === "/News.aspx" ? true : false;
    try {
      const res: SPHttpClientResponse = await context.spHttpClient.get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${
          NewsPage ? "News" : "Announcements"
        }')/items?$select=*&$expand=AttachmentFiles`,
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
              NewsPage ? "News" : "Announcements",
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
    const newsUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('HomePageSmallPictures')/items?$select=ID,Created,TypeofData,NewsTitle/Id&$expand=NewsTitle&$expand=AttachmentFiles &$filter= TypeofData eq '${ListType}'`;
    const announcementUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('HomePageSmallPictures')/items?$select=ID,Created,TypeofData,AnnouncemmentTitle/Id&$expand=AnnouncemmentTitle&$expand=AttachmentFiles &$filter= TypeofData eq '${ListType}'`;
    try {
      const res: SPHttpClientResponse = await context.spHttpClient.get(
        ListType === "News" ? newsUrl : announcementUrl,
        SPHttpClient.configurations.v1
      );

      if (!res.ok) {
        throw new Error(`HTTP request failed with status ${res.status}`);
      }
      const listItems: any = await res.json();
      console.log("HomePageSmallPictures Fetch", listItems);

      const filteredItem = listItems.value?.filter(
        (data: {
          AnnouncemmentTitle: { Id: number };
          NewsTitle: { Id: number };
        }) => {
          if (ListType === "News") {
            return data.NewsTitle.Id === ID;
          } else {
            return data.AnnouncemmentTitle.Id === ID;
          }
        }
      );
      console.log("HomePageSmallPictures filteredItem", filteredItem);
      return filteredItem.length ? filteredItem[0] : {};
    } catch (err) {
      console.error(err);
      return undefined
    }
  }

  public componentDidMount(): void {
    setTimeout(() => {
      console.log("scrollRef", this.scrollRef);
      if (this.scrollRef)
        this.scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1000);
    let ScreenWidth: any = window.screen.width;
    console.log(ScreenWidth, "ScreenWidth");
    this.setState({ isScreenWidth: ScreenWidth });
    this.getNews();
  }

  public updateItem = (commentResponse: any, ID: any) => {
    const { context } = this.props;
    const ActivePage = window.location.pathname;
    const CurrentPage = ActivePage.split("/SitePages");
    const NewsPage = CurrentPage[1] === "/News.aspx" ? true : false;
    const headers: any = {
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
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${
          NewsPage ? "News" : "Announcements"
        }')/items('${ID}')`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      )
      .then((r) => {
        console.log(r, "Post Response");
        this.getNews();
      });
  };
  public getDateTime = () => {
    var now: any = new Date();
    var monthNames = [
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

    var date = ("0" + now.getDate()).slice(-2);
    var month = monthNames[now.getMonth()];
    var year = now.getFullYear();
    var hour: any = now.getHours();
    var minute: any = now.getMinutes();
    if (hour.toString().length === 1) {
      hour = "0" + hour;
    }
    if (minute.toString().length === 1) {
      minute = "0" + minute;
    }
    var dateTime = `${date}-${month}-${year} ${hour}:${minute}`;
    return dateTime;
  };
  public handleSubmit = (ID: any, COMMENTS: any, commentsPost: any) => {
    const { context } = this.props;
    let dateTime = this.getDateTime();
    console.log(dateTime, "dateTime");
    let commentsArray = JSON.parse(COMMENTS);
    let result = {
      RespondantName: context.pageContext.user.displayName,
      RespondantEmail: context.pageContext.user.email,
      RespondantComment: commentsPost,
      RespondantDate: dateTime,
    };
    if (!commentsArray) {
      let newComment = [result];
      let commentResponse = JSON.stringify(newComment);
      console.log("commentResponse", commentResponse);
      this.updateItem(commentResponse, ID);
      this.setState({ commentsPost: "" });
    } else {
      let newComment = [...commentsArray, result];
      let commentResponse = JSON.stringify(newComment);
      console.log("commentResponse", commentResponse);
      this.updateItem(commentResponse, ID);
      this.setState({ commentsPost: "" });
    }
  };
  public updateLikes = (likeResponse: any, ID: any) => {
    const { context } = this.props;
    const ActivePage = window.location.pathname;
    const CurrentPage = ActivePage.split("/SitePages");
    const NewsPage = CurrentPage[1] === "/News.aspx" ? true : false;
    const headers: any = {
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
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${
          NewsPage ? "News" : "Announcements"
        }')/items('${ID}')`,

        SPHttpClient.configurations.v1,

        spHttpClintOptions
      )

      .then((r) => {
        console.log(r, "Like Response");

        this.getNews();
      });
  };

  public handleLiked = (ID: any, LIKES: any) => {
    const { context } = this.props;

    let result = {
      RespondantName: context.pageContext.user.displayName,

      RespondantEmail: context.pageContext.user.email,
    };

    let likesArray = JSON.parse(LIKES);

    console.log(likesArray, "TEST");

    let isUserExist: any = [];

    if (likesArray) {
      isUserExist = likesArray.filter(
        (item: any) =>
          item.RespondantName === context.pageContext.user.displayName &&
          item.RespondantEmail === context.pageContext.user.email
      );
    }

    console.log(isUserExist, "isUserExist");

    if (!likesArray) {
      console.log(
        "!likesArray || likesArray.length===0",

        !likesArray

        /* likesArray.length === 0 */
      );

      let likesResult = [result];

      let likesResponse = JSON.stringify(likesResult);

      console.log("likesResult", likesResult);

      console.log("likesResponse", likesResponse);

      this.updateLikes(likesResponse, ID);
    }

    if (isUserExist.length > 0) {
      let likesResult = likesArray.filter(
        (item: any) =>
          item.RespondantName !== context.pageContext.user.displayName &&
          item.RespondantEmail !== context.pageContext.user.email
      );

      console.log("likesResultRemoved", likesResult);

      let likesResponse = JSON.stringify(likesResult);

      this.updateLikes(likesResponse, ID);
    } else {
      let likesResult = [...likesArray, result];

      console.log("likesResultElse", likesResult);

      let likesResponse = JSON.stringify(likesResult);

      this.updateLikes(likesResponse, ID);
    }
  };

  public likesCount: any = (likesData: any) => {
    console.log(likesData, "likesData", JSON.parse(likesData));

    if (!JSON.parse(likesData) || JSON.parse(likesData)?.length === 0) return 0;
    else return JSON.parse(likesData).length;
  };

  public likeImage: any = (likeData: any) => {
    const { context } = this.props;

    let likesArray = JSON.parse(likeData);

    let isUserExist: any = [];

    if (likesArray) {
      isUserExist = likesArray.filter(
        (item: any) =>
          item.RespondantName === context.pageContext.user.displayName &&
          item.RespondantEmail === context.pageContext.user.email
      );
    }

    console.log(isUserExist, "Liked User");

    if (isUserExist.length > 0) {
      return true;
    } else {
      return false;
    }
  };
  public commentsCount: any = (commentsData: any) => {
    console.log(commentsData, "commentsData", JSON.parse(commentsData));

    if (!JSON.parse(commentsData) || JSON.parse(commentsData)?.length === 0)
      return 0;
    else return JSON.parse(commentsData).length;
  };

  public sortRecent: any = () => {
    const { newsSortedAsRecent } = this.state;

    const sortedData = [...newsSortedAsRecent].sort(
      (a: any, b: any) =>
        new Date(b.Date).getTime() - new Date(a.Date).getTime()
    );

    this.setState({
      newsSortedAsRecent: sortedData,
      filterRecent: true,
      filterAz: false,
      filterZa: false,
      filterOlder: false,
    });
  };

  public sortOlder: any = () => {
    const { newsSortedAsRecent } = this.state;

    const sortedData = [...newsSortedAsRecent].sort(
      (a: any, b: any) =>
        new Date(a.Date).getTime() - new Date(b.Date).getTime()
    );

    this.setState({
      newsSortedAsRecent: sortedData,
      filterRecent: false,
      filterAz: false,
      filterZa: false,
      filterOlder: true,
    });
  };

  public render(): React.ReactElement<ITemplateNewsProps> {
    const bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    const fa =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
    let Avenir = `${this.props.context.pageContext.site.absoluteUrl}/SiteAssets/font/style.css`;
    SPComponentLoader.loadCss(bootstarp5CSS);
    SPComponentLoader.loadCss(fa);
    SPComponentLoader.loadCss(Avenir);

    const {
      newsSortedAsRecent,
      isModalOpen,
      filterRecent,
      currentPage,
      commentsPost,
      modalData,
      searchText,
      LikeModalData,
      isLikeModalOpen,
      filterOlder,
    } = this.state;

    const { context } = this.props;

    const handleCancel = () => {
      this.setState({ isModalOpen: false });
    };

    const handleLikeModel = () => {
      this.setState({ isLikeModalOpen: false });
    };

    const exercisesPerPage = 5;
    const numberOfElements = newsSortedAsRecent.length;
    const numberOfPages = Math.round(numberOfElements / exercisesPerPage + 0.4);
    const indexOfLastPage = currentPage * exercisesPerPage;
    const indexOfFirstPage = indexOfLastPage - exercisesPerPage;
    const currentData = newsSortedAsRecent.slice(
      indexOfFirstPage,
      indexOfLastPage
    );
    const ActivePage = window.location.pathname;
    const CurrentPage = ActivePage.split("/SitePages");
    const NewsPage = CurrentPage[1] === "/News.aspx" ? true : false;
    const left = require("../assets/left.png");
    const right = require("../assets/right.png");

    return (
      <div
        className="detailsContainer px-0"
        style={{ fontFamily: "Avenir Next" }}
      >
        <Row ref={this.scrollRef}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div
              className=""
              style={{
                height: "110px",
                boxShadow: "1px 1px 18px 0 rgba(0, 0, 0, 0.16)",
                backgroundColor: " #fff",
                borderRadius: "5px",
              }}
            >
              <div className="d-flex align-items-center justify-content-between w-100 h-100">
                <h4
                  className="d-flex align-items-center justify-content-start ps-4 w-50"
                  style={{ fontFamily: "Avenir Next" }}
                >
                  <a href={`${context.pageContext.site.absoluteUrl}`}>
                    <img
                      src={require("../assets/arrow-left.svg")}
                      alt="folder"
                      height="20px"
                      width="50px"
                    />
                  </a>
                  <img
                    src={require("../assets/folder.svg")}
                    alt="folder"
                    height="20px"
                    width="50px"
                  />
                  {NewsPage ? "News" : "Announcements"}
                </h4>
                <div
                  className="d-flex align-items-center justify-content-end px-3 w-50"
                  style={{ fontFamily: "Avenir Next" }}
                >
                  <div className="input-group flex-nowrap pe-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search...."
                      aria-label="Username"
                      value={this.state.searchText}
                      onChange={(e) => {
                        var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

                        if (!format.test(e.target.value)) {
                          this.setState({ searchText: e.target.value });
                        }
                      }}
                      style={{ cursor: "pointer" }}
                      aria-describedby="addon-wrapping"
                    />
                    <span
                      className="input-group-text text-white"
                      style={{
                        cursor: "pointer",
                        backgroundColor: " rgb(181, 77, 38)",
                      }}
                      onClick={() => {
                        this.setState({ searchText: "" });
                      }}
                      id="addon-wrapping"
                    >
                      <b>X</b>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs={0} sm={0} md={0} lg={6}>
            <div
              className="me-3"
              style={{
                height: "1100px",
                boxShadow: "1px 1px 18px 0 rgba(0, 0, 0, 0.16)",
                backgroundColor: " #fff",
                borderRadius: "5px",
              }}
            >
              <div className="mt-3 pt-4" style={{ fontFamily: "Avenir Next" }}>
                <ul>
                  <li
                    className="my-3"
                    style={{
                      color: filterRecent ? " rgb(181, 77, 38)" : "#495866",
                    }}
                  >
                    <div
                      style={{
                        color: filterRecent ? " rgb(181, 77, 38)" : "#495866",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        this.sortRecent();
                      }}
                    >
                      {NewsPage ? "Recent News" : "Recent Announcements"}
                    </div>
                  </li>
                  <li
                    className="my-3"
                    style={{
                      color: filterOlder ? " rgb(181, 77, 38)" : "#495866",
                    }}
                  >
                    <div
                      style={{
                        color: filterOlder ? " rgb(181, 77, 38)" : "#495866",
                        cursor: "pointer",
                      }}
                      onClick={() => {
                        this.sortOlder();
                      }}
                    >
                      {NewsPage ? "Older News" : "Older Announcements"}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </Col>
          <Col xs={24} sm={24} md={24} lg={18}>
            <div
              className="w-100 my-3"
              style={{
                height: "1100px",
                boxShadow: "1px 1px 18px 0 rgba(0, 0, 0, 0.16)",
                backgroundColor: " #fff",
                borderRadius: "5px",
              }}
            >
              <div className="d-flex justify-content-end pt-3 me-3">
                <>
                  <span
                    className="px-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      this.setState({
                        currentPage:
                          currentPage > 1 ? currentPage - 1 : currentPage - 0,
                      });
                    }}
                  >
                    <img src={left} alt="<" width={"24px"} />
                  </span>
                  <span style={{ fontSize: "16px", fontWeight: "800" }}>
                    {currentPage}
                  </span>
                  <span style={{ fontSize: "16px", fontWeight: "800" }}>/</span>
                  <span style={{ fontSize: "16px", fontWeight: "800" }}>
                    {numberOfPages}
                  </span>
                  <span
                    className="px-3"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      this.setState({
                        currentPage:
                          currentPage >= numberOfPages
                            ? currentPage + 0
                            : currentPage + 1,
                      });
                    }}
                  >
                    <img src={right} alt="<" width={"24px"} />
                  </span>
                </>
              </div>
              {currentData?.length > 0 ? (
                currentData
                  ?.filter((item: any) => {
                    return (
                      item?.Title?.toLowerCase().match(
                        searchText.toLowerCase()
                      ) ||
                      item?.Location?.toLowerCase().match(
                        searchText.toLowerCase()
                      ) ||
                      item?.Created?.toLowerCase().match(
                        searchText.toLowerCase()
                      ) ||
                      item?.Description?.toLowerCase().match(
                        searchText.toLowerCase()
                      )
                    );
                  })
                  ?.map((news: any) => {
                    return (
                      <NewsCard
                        col={4}
                        self={this}
                        context={context}
                        singleLine={true}
                        cardItem={news}
                        listName={`${NewsPage ? "news" : "announcement"}`}
                        classNames="mx-3 mt-2"
                        likeImage={this.likeImage}
                        likesCount={this.likesCount}
                        handleLiked={this.handleLiked}
                        commentsCount={this.commentsCount}
                      />
                    );
                  })
              ) : (
                <EmptyCard />
              )}
            </div>
          </Col>
        </Row>
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
      </div>
    );
  }
}
