import * as React from "react";
import styles from "./DetailsPage.module.scss";
import { IDetailsPageProps } from "./IDetailsPageProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import { Row, Col, Carousel } from "antd";
import "antd/dist/reset.css";
import ComentsModal from "../../../commonComponents/modals/CommentsModal";
import LikeModal from "../../../commonComponents/modals/LikeModal";

interface IDetailsPageState {
  screenValue: any;
  pagename: any;
  redirect: any;
  isSectionvisible: any;
  isModalOpen: any;
  commentsPost: any;
  modalData: any;
  modalDataID: any;
  links: any;
  isScreenWidth: any;
  isLikeModalOpen: any;
  LikeModalData: any;
}

export default class DetailsPage extends React.Component<
  IDetailsPageProps,
  IDetailsPageState
> {
  public scrollRef: any;
  public constructor(props: IDetailsPageProps, state: IDetailsPageState) {
    super(props);
    this.state = {
      screenValue: null,
      pagename: "Page",
      redirect: "",
      isSectionvisible: true,
      isModalOpen: false,
      commentsPost: "",
      modalData: {},
      modalDataID: 0,
      links: "",
      isScreenWidth: 800,
      isLikeModalOpen: false,
      LikeModalData: false,
    };
    this.scrollRef = React.createRef();
  }
  public getData: any = () => {
    const { context } = this.props;
    const { modalDataID, isModalOpen, modalData } = this.state;
    let pageInitdetails: any = {};
    let api: any;
    let initDetails: any = window.location.search
      .substring(1)
      .split("&")
      .map(
        (item) => (pageInitdetails[item.split("=")[0]] = item.split("=")[1])
      );
    console.log(
      pageInitdetails,
      "pageinitDetails.lname",
      pageInitdetails.lname
    );

    switch (pageInitdetails.lname) {
      case "announcement":
        console.log("inside case Announcement");
        this.setState({ pagename: "Announcement", isSectionvisible: true });
        api = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Announcements')/items?$select=*&$expand=AttachmentFiles &$filter= Id eq ${pageInitdetails.pid}`;
        break;
      case "news":
        this.setState({ pagename: "News", isSectionvisible: true });
        api = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('News')/items?$select=*&$expand=AttachmentFiles &$filter= Id eq ${pageInitdetails.pid}`;
        break;
      case "survey":
        this.setState({ pagename: "Survey", isSectionvisible: false });
        api = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Survays')/items?$select=*&$expand=AttachmentFiles &$filter= Id eq ${pageInitdetails.pid}`;
        break;
    }
    console.log("api", api);
    console.log(initDetails, "initdetails");
    context.spHttpClient
      .get(api, SPHttpClient.configurations.v1)
      .then((res: SPHttpClientResponse) => {
        console.log("listItems Success");
        return res.json();
      })
      .then((listItems: any) => {
        console.log("IINN");
        console.log(listItems);
        console.log("PageslistItems========>", listItems);
        let filteredModalData: any = [];
        if (modalDataID && isModalOpen) {
          filteredModalData = listItems.value.filter((item: any) => {
            return modalDataID === item.ID;
          });
        }
        console.log(filteredModalData, "filteredModalData");

        console.log(modalData, "modalData Comments");

        this.setState({
          screenValue: listItems.value[0],
          modalData: filteredModalData[0] ? filteredModalData[0] : {},
        });
      });

    console.log("pageInitdetails.pp", pageInitdetails.pp);
    switch (pageInitdetails.pp) {
      case "announcement":
        this.setState({
          redirect: `${context.pageContext.web.absoluteUrl}/SitePages/Announcements.aspx`,
        });
        break;
      case "news":
        this.setState({
          redirect: `${context.pageContext.web.absoluteUrl}/SitePages/News.aspx`,
        });
        break;
      case "home":
        this.setState({
          redirect: `${context.pageContext.web.absoluteUrl}`,
        });
        break;
    }
  };

  public componentDidMount() {
    setTimeout(() => {
      console.log("scrollRef", this.scrollRef);
      if (this.scrollRef)
        this.scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1000);
    let ScreenWidth: any = window.screen.width;
    console.log(ScreenWidth, "ScreenWidth");
    this.setState({ isScreenWidth: ScreenWidth });
    this.getData();
  }
  public updateItem = (commentResponse: any, ID: any) => {
    const { context } = this.props;

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
    console.log("it is working");
    let pageInitdetails: any = {};
    let initDetails: any = window.location.search
      .substring(1)
      .split("&")
      .map(
        (item) => (pageInitdetails[item.split("=")[0]] = item.split("=")[1])
      );
    console.log(
      initDetails,
      "<=================>",
      pageInitdetails,
      "pagesssssinitDetails.lname",
      pageInitdetails.lname
    );
    let listname: any = "";
    console.log("pageInit.pid", pageInitdetails.pid);
    switch (pageInitdetails.lname) {
      case "announcement":
        listname = "Announcements";
        // this.setState({
        //   links: `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Announcements')/items('${ID}')`,
        // });
        break;

      case "news":
        listname = "News";
        // this.setState({
        //   links: `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('News')/items('${ID}')`,
        // });
        break;
    }
    console.log("Data captured");
    context.spHttpClient
      .post(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listname}')/items('${ID}')`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      )
      .then((r) => {
        console.log(r, "Post Response");
        this.getData();
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
    let pageInitdetails: any = {};
    let initDetails: any = window.location.search
      .substring(1)
      .split("&")
      .map(
        (item) => (pageInitdetails[item.split("=")[0]] = item.split("=")[1])
      );
    console.log(
      initDetails,
      "<=================>",
      pageInitdetails,
      "pagesssssinitDetails.lname",
      pageInitdetails.lname
    );
    let listname: any = "";
    console.log("pageInit.pid", pageInitdetails.pid);
    switch (pageInitdetails.lname) {
      case "announcement":
        listname = "Announcements";
        // this.setState({
        //   links: `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Announcements')/items('${ID}')`,
        // });
        break;

      case "news":
        listname = "News";
        // this.setState({
        //   links: `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('News')/items('${ID}')`,
        // });
        break;
    }
    context.spHttpClient

      .post(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listname}')/items('${ID}')`,

        SPHttpClient.configurations.v1,

        spHttpClintOptions
      )

      .then((r) => {
        console.log(r, "Like Response");

        this.getData();
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
  public render(): React.ReactElement<IDetailsPageProps> {
    let carouselOneAction: any = {};
    const bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    const fa =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
    let Avenir = `${this.props.context.pageContext.site.absoluteUrl}/SiteAssets/font/style.css`;
    SPComponentLoader.loadCss(bootstarp5CSS);
    SPComponentLoader.loadCss(fa);
    SPComponentLoader.loadCss(Avenir);
    const {
      screenValue,
      pagename,
      redirect,
      isModalOpen,
      isSectionvisible,
      commentsPost,
      modalData,
      LikeModalData,
      isLikeModalOpen,
    } = this.state;
    const { context } = this.props;
    const handleCancel = () => {
      this.setState({ isModalOpen: false });
    };
    const handleLikeModel = () => {
      this.setState({ isLikeModalOpen: false });
    };
    var moment = require("moment");
    const heart = require("../assets/heart.png");
    const heartOutline = require("../assets/heartsOutline.png");
    return (
      <div
        className="detailsContainer px-0"
        /* style={{ paddingTop: `${isScreenWidth < 768 ? "30px" : "80px"}` }} */
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
                fontFamily: "Avenir Next",
              }}
            >
              <div className="d-flex align-items-center justify-content-between w-100 h-100">
                <h4 className="d-flex align-items-center justify-content-start ps-4 w-100">
                  <a href={`${redirect}`}>
                    <img
                      src={require("../assets/arrow-left.svg")}
                      alt="folder"
                      height="20px"
                      width="50px"
                    />
                  </a>
                  {`${pagename} Details`}
                </h4>
              </div>
            </div>
          </Col>
        </Row>
        <Row
          className="mt-3 px-5 pt-3 pb-5 mb-4"
          style={{
            boxShadow: "1px 1px 18px 0 rgba(0, 0, 0, 0.16)",
            backgroundColor: " #fff",
            borderRadius: "5px",
            fontFamily: "Avenir Next",
          }}
        >
          {screenValue ? (
            <>
              <Col xs={24} sm={24} md={24} lg={24}>
                <div
                  className=" d-md-flex justify-content-between"
                  style={{ fontFamily: "Avenir Next" }}
                >
                  <div>
                    <h4>{screenValue.Title}</h4>
                  </div>
                  <div className="d-flex flex-column gap-2">
                    <div className="text-secondary fs-5">
                      {moment(screenValue.Date).format("Do MMM YYYY")},{" "}
                      {moment(screenValue.Date).format("h:mm a")}
                    </div>
                    {false && (
                      <div className="d-flex align-items-center gap-2">
                        <img
                          style={{ cursor: "pointer" }}
                          src={require("../assets/location.svg")}
                          alt="heart"
                          height="20px"
                          width="20px"
                        />
                        <div className=" fs-5 text-secondary ">
                          {screenValue.Location}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Col>

              {screenValue?.AttachmentFiles?.length > 0 ? (
                <Col sm={24} xs={24} md={24} lg={24} xl={24}>
                  <div
                    className="my-2 w-100 h-100"
                    style={{ position: "relative", fontFamily: "Avenir Next" }}
                  >
                    <Carousel
                      autoplay={false}
                      dots={false}
                      ref={(ref) => {
                        carouselOneAction = ref;
                      }}
                    >
                      {screenValue?.AttachmentFiles?.map((image: any) => {
                        return (
                          <div className="d-flex h-100 justify-content-center align-items-center">
                            <img
                              className="rounded w-100"
                              style={{ objectFit: "contain" }}
                              src={
                                context.pageContext.web.absoluteUrl
                                  .split("/")
                                  .slice(0, 3)
                                  .join("/") + image.ServerRelativeUrl
                              }
                            />
                          </div>
                        );
                      })}
                    </Carousel>
                    <div
                      className="d-flex justify-content-between"
                      style={{
                        position: "absolute",
                        left: "0",
                        right: "0",
                        top: "36%",
                      }}
                    >
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          carouselOneAction.prev();
                        }}
                      >
                        <img
                          className={`${styles.bannerInfoArrows}`}
                          src={require("../assets/cleft.png")}
                        />
                      </div>
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          carouselOneAction.next();
                        }}
                      >
                        <img
                          className={`${styles.bannerInfoArrows}`}
                          src={require("../assets/cright.png")}
                        />
                      </div>
                    </div>
                  </div>
                </Col>
              ) : (
                <></>
              )}

              <Col xs={24} sm={24} md={24} lg={24}>
                <div
                  className="d-flex justify-content-start align-items-center"
                  style={{ fontFamily: "Avenir Next" }}
                >
                  <div
                    className={`${styles.description}`}
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      color: "#292929",
                      textAlign: "justify",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: screenValue.Description,
                    }}
                  ></div>
                </div>
              </Col>

              <div className="d-flex justify-content-end w-100 mt-2">
                {isSectionvisible && (
                  <div className="d-flex fs-5 text-secondary gap-3">
                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <img
                        style={{ cursor: "pointer" }}
                        src={
                          this.likeImage(screenValue?.Likes)
                            ? heart
                            : heartOutline
                        }
                        alt="heart"
                        height="20px"
                        width="20px"
                        onClick={() => {
                          this.handleLiked(screenValue.ID, screenValue.Likes);
                        }}
                      />
                      <div
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          if (this.likesCount(screenValue?.Likes)) {
                            this.setState({
                              isLikeModalOpen: true,
                              LikeModalData: {
                                ID: screenValue.ID,
                                Likes: screenValue.Likes,
                              },
                            });
                          }
                        }}
                      >
                        {this.likesCount(screenValue?.Likes)}
                      </div>
                    </div>

                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <img
                        style={{ cursor: "pointer" }}
                        src={require("../assets/comment.png")}
                        alt="comment"
                        height="20px"
                        width="20px"
                        onClick={() => {
                          this.setState({
                            modalData: screenValue,
                            modalDataID: screenValue.ID,
                            isModalOpen: true,
                          });

                          console.log(screenValue.Comments, "Modal Data");
                        }}
                      />
                      <div>
                        {screenValue
                          ? this.commentsCount(screenValue?.Comments)
                          : "0"}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <></>
          )}
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
