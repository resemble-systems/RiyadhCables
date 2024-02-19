import * as React from "react";
/* import { Row, Col } from "antd"; */
import { WebPartContext } from "@microsoft/sp-webpart-base";
import EmptyImage from "../alternateImage/EmptyImage";
import styles from "./BasicCard.module.scss";

export interface IBasicCardProps {
  self: any;
  col: number;
  singleLine: boolean;
  context: WebPartContext;
  listName: string;
  classNames?: string;
  cardItem: {
    ID: number;
    AttachmentFiles: any[];
    Title: string;
    Description: string;
    Location: string;
    Date: string;
    Likes: string;
    Comments: string;
    HomePageSmallPictures: any[]
  };
  likeImage: (likeData: string) => boolean;
  likesCount: (likesData: string) => number;
  handleLiked: (ID: number | string, LIKES: string) => void;
  commentsCount: (commentsData: string) => number;
}

interface IBasicCardState {
  isArabic: any;
}

export default class BasicCard extends React.Component<
  IBasicCardProps,
  IBasicCardState
> {
  public constructor(props: IBasicCardProps, state: IBasicCardState) {
    super(props);
    this.state = {
      isArabic: null,
    };
  }
  public componentDidMount(): void {}

  public render(): React.ReactElement<IBasicCardProps> {
    const {
      classNames,
      cardItem,
      context,
      likesCount,
      handleLiked,
      likeImage,
      commentsCount,
      self,
      col,
      singleLine,
      listName,
    } = this.props;
    const moment = require("moment");
    const heart = require("./assets/heart.png");
    const heartOutline = require("./assets/heartsOutline.png");
    const comment = require("./assets/comment.png");

    const getRichText = (RichText: string) => {
      if (!RichText) return "";
      const parser = new DOMParser();
      const richTextElement = parser.parseFromString(RichText, "text/html");
      const textContent =
        richTextElement.getElementsByTagName("body")[0].innerText;
      return textContent;
    };

    return (
      <div className={`row mb-2 px-2 ${classNames}`} key={cardItem.ID}>
        <div
          className={`p-0 col-lg-${col} col-md-6 col-sm-6 ${styles.marginBottom}`}
        >
          <div
            className="w-100"
            style={{ height: "200px", overflow: "hidden" }}
          >
            {cardItem.HomePageSmallPictures?.length > 0 ? (
              <div
                className="h-100 d-flex align-items-center border"
                style={
                  {
                    //backgroundColor: "rgba(210, 210, 210, 0.2)",
                  }
                }
              >
                <img
                  src={
                    context.pageContext.web.absoluteUrl
                      .split("/")
                      .slice(0, 3)
                      .join("/") +
                    cardItem?.AttachmentFiles[0]?.ServerRelativeUrl
                  }
                  width="100%"
                  height="200px"
                  style={{ objectFit: "contain" }}
                  alt="logo"
                />
              </div>
            ) : (
              <EmptyImage />
            )}
          </div>
        </div>
        <div
          className={`p-0 col-lg-${12 - col} col-md-6 col-sm-6 ${
            styles.marginBottom
          }`}
        >
          <div
            className="d-flex flex-column ms-3"
            style={{
              overflowY: "hidden",
              scrollbarWidth: "thin",
            }}
          >
            <div
              className={`${styles.headingOne} mb-1`}
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#292929",
              }}
            >
              {cardItem.Title}
            </div>
            <div
              className={`${styles.description}`}
              style={{
                fontSize: "14px",
                fontWeight: "400",
                color: "#292929",
              }}
              /*  dangerouslySetInnerHTML={{
                __html: cardItem.Description,
              }} */
            >
              {getRichText(cardItem.Description)}
            </div>
            <div className="mb-1">
              <a
                className=""
                href={`${context.pageContext.web.absoluteUrl}/SitePages/Page%20Details.aspx?pp=home&lname=${listName}&pid=${cardItem.ID}`}
                style={{
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "rgb(184, 78, 38)",
                }}
              >
                Read More
              </a>
            </div>
            {singleLine ? (
              <div
                className="mb-2"
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#363b40",
                }}
              >
                {cardItem.Location !== null ? <>{cardItem.Location} </> : <></>}
                {cardItem.Location !== null && cardItem.Date !== null ? (
                  <>{""}|</>
                ) : (
                  <></>
                )}
                {cardItem.Date !== null ? (
                  <>
                    {" "}
                    {moment(cardItem?.Date)?.format("Do MMM YYYY")} |{" "}
                    {moment(cardItem?.Date)?.format("h:mm a")}
                  </>
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <div
                className="mb-2"
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#363b40",
                }}
              >
                <div>
                  {cardItem.Location !== null ? (
                    <>{cardItem.Location}</>
                  ) : (
                    <></>
                  )}
                </div>
                <div>
                  {cardItem.Date !== null ? (
                    <> {moment(cardItem.Date).format("Do MMM YYYY")}</>
                  ) : (
                    <></>
                  )}
                </div>
                <div>
                  {cardItem.Date !== null ? (
                    <>{moment(cardItem.Date).format("h:mm a")}</>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            )}
            <div
              className="d-flex align-items-center"
              style={{ height: "20px" }}
            >
              <span
                className="d-flex align-items-center"
                style={{ height: "20px" }}
              >
                <img
                  className="mx-1"
                  style={{ cursor: "pointer" }}
                  src={likeImage(cardItem?.Likes) ? heart : heartOutline}
                  alt="heart"
                  height="20px"
                  width="20px"
                  onClick={() => {
                    handleLiked(cardItem.ID, cardItem.Likes);
                  }}
                />
                <span
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    if (likesCount(cardItem?.Likes)) {
                      self.setState({
                        isLikeModalOpen: true,
                        LikeModalData: {
                          ID: cardItem.ID,
                          Likes: cardItem.Likes,
                        },
                      });
                    }
                  }}
                >
                  {likesCount(cardItem?.Likes)}
                </span>
              </span>
              <span
                onClick={() => {
                  self.setState({
                    modalDataID: cardItem.ID,
                    modalData: cardItem,
                    isModalOpen: true,
                  });
                }}
                className="d-flex align-items-center mx-3"
                style={{ height: "20px", cursor: "pointer" }}
              >
                <img
                  className="mx-1"
                  src={comment}
                  alt="comment"
                  height="20px"
                  width="20px"
                />
                {commentsCount(cardItem?.Comments)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
