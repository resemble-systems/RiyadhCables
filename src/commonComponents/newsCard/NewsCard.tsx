import * as React from "react";
/* import { Row, Col } from "antd"; */
import { WebPartContext } from "@microsoft/sp-webpart-base";
import styles from "./BasicCard.module.scss";
import "./newsCard.css";
import EmptyImage from "../alternateImage/EmptyImage";

export interface INewsCardProps {
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
    HomePageSmallPictures: any[];
  };
  likeImage: (likeData: string) => boolean;
  likesCount: (likesData: string) => number;
  handleLiked: (ID: number | string, LIKES: string) => void;
  commentsCount: (commentsData: string) => number;
}

interface INewsCardState {
  isArabic: any;
}

export default class NewsCard extends React.Component<
  INewsCardProps,
  INewsCardState
> {
  public constructor(props: INewsCardProps, state: INewsCardState) {
    super(props);
    this.state = {
      isArabic: null,
    };
  }
  public componentDidMount(): void {}

  public render(): React.ReactElement<INewsCardProps> {
    const {
      classNames,
      cardItem,
      context,
      likesCount,
      handleLiked,
      likeImage,
      commentsCount,
      self,
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
      <div className={`row mb-2 px-2 ${classNames}`}>
        <div className={`p-1 col-12 rounded newsCard`}>
          <div
            className="d-flex flex-column"
            style={{
              overflowY: "hidden",
              scrollbarWidth: "thin",
            }}
          >
            <div
              className={`${styles.headingOne}`}
              style={{
                fontSize: "16px",
                fontWeight: "600",
                color: "#292929",
                fontFamily: "Avenir Next",
              }}
            >
              {cardItem.Title}
            </div>
            <div className="d-flex gap-2 justify-content-between">
              <div
                className={`${styles.description}`}
                style={{
                  fontSize: "14px",
                  fontWeight: "400",
                  color: "#292929",
                  fontFamily: "Avenir Next",
                }}
              >
                {getRichText(cardItem.Description)}
              </div>
              <div
                className=""
                style={{
                  height: "120px",
                  overflow: "hidden",
                  minWidth: "180px",
                  maxWidth: "180px",
                }}
              >
                {cardItem.HomePageSmallPictures?.length > 0 ? (
                  <img
                    src={
                      context.pageContext.web.absoluteUrl
                        .split("/")
                        .slice(0, 3)
                        .join("/") +
                      cardItem?.HomePageSmallPictures[0]?.ServerRelativeUrl
                    }
                    width="100%"
                    style={{ objectFit: "contain" }}
                    alt="logo"
                  />
                ) : (
                  <EmptyImage />
                )}
              </div>
            </div>
            <div className="mt-1 d-flex justify-content-between align-items-center">
              <a
                className=""
                href={`${context.pageContext.web.absoluteUrl}/SitePages/Page%20Details.aspx?pp=home&lname=${listName}&pid=${cardItem.ID}`}
                style={{
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "rgb(184, 78, 38)",
                  fontFamily: "Avenir Next",
                }}
              >
                Read More
              </a>
              {false && (
                <div className="d-flex align-items-center gap-2">
                  <img
                    style={{ cursor: "pointer" }}
                    src={require("./assets/location.svg")}
                    alt="heart"
                    height="20px"
                    width="20px"
                  />
                  <div
                    className=""
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#363b40",
                    }}
                  >
                    {cardItem.Location}
                  </div>
                </div>
              )}
            </div>

            <div
              className="d-flex justify-content-between align-items-center"
              style={{ fontFamily: "Avenir Next" }}
            >
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
              <div
                className=""
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#363b40",
                }}
              >
                <span>
                  {cardItem.Date !== null ? (
                    <>
                      {" "}
                      {moment(cardItem.Date).format("Do MMM YYYY")},{" "}
                      {moment(cardItem.Date).format("h:mm a")}
                    </>
                  ) : (
                    <></>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
