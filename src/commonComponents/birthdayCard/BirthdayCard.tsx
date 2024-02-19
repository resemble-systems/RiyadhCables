import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import AchievementModal from "./AchievementModal";
export interface IBirthdayCardProps {
  cardItem: {
    Achievements: string;
    ID: number;
    AttachmentFiles: any[];
    Title: string;
    Date?: string;
    Designation?: string;
  };
  context: WebPartContext;
  dateVisible: boolean;
  achievements: boolean;
}

interface IBirthdayCardState {
  isModalOpen: boolean;
}

export default class BirthdayCard extends React.Component<
  IBirthdayCardProps,
  IBirthdayCardState
> {
  public constructor(props: IBirthdayCardProps, state: IBirthdayCardState) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
  }
  public nameTrimmer(name: Array<string>): string {
    const checkedName = name.filter((str: string) =>
      RegExp(/^[A-Za-z]+$/).test(str) ? str : null
    );
    return checkedName.join("").toUpperCase();
  }

  public render(): React.ReactElement<IBirthdayCardProps> {
    const { cardItem, context, dateVisible, achievements } = this.props;
    const { isModalOpen } = this.state;
    const userImg = require("./assets/userImg.jpg");
    const moment = require("moment");

    return (
      <div
        className="m-3"
        style={{ width: "auto", fontFamily: "Avenir Next", minWidth: "200px" }}
        key={cardItem.ID}
      >
        <div className="d-flex justify-content-center">
          {cardItem?.AttachmentFiles.length > 0 ? (
            <img
              src={
                context.pageContext.web.absoluteUrl
                  .split("/")
                  .slice(0, 3)
                  .join("/") + cardItem?.AttachmentFiles[0]?.ServerRelativeUrl
              }
              className="rounded-circle"
              width="150px"
              height="150px"
              alt="cardItem"
            />
          ) : (
            <img
              src={userImg}
              className="rounded-circle"
              width="150px"
              height="150px"
              alt="cardItem"
            />
          )}
        </div>
        <div className={`d-flex justify-content-center text-center`}>
          <div
            style={{
              fontSize: "16px",
              fontWeight: "600",
              width: "max-content",
              fontFamily: "Avenir Next",
            }}
          >
            {cardItem.Title}
          </div>
        </div>
        {dateVisible ? (
          <div
            className="d-flex justify-content-center"
            style={{
              fontSize: "14px",
              fontWeight: "600",
              fontFamily: "Avenir Next",
              color: "rgb(184, 78, 38)",
            }}
          >
            {moment(cardItem.Date).format("MMM D").toUpperCase()}
          </div>
        ) : (
          <div
            className="d-flex justify-content-center pb-2"
            style={{
              fontSize: "14px",
              fontWeight: "600",
              fontFamily: "Avenir Next",
              color: "rgb(184, 78, 38)",
            }}
          >
            {cardItem.Designation}
          </div>
        )}
        {achievements && (
          <div className="d-flex justify-content-center">
            <button
              style={{
                border: "none",
                backgroundColor: " rgb(181, 77, 38)",
                fontFamily: "Avenir Next",
                fontSize: "14px",
              }}
              className="text-white py-2 px-3 rounded"
              onClick={() => {
                this.setState({ isModalOpen: true });
                console.log("Modal Open");
              }}
            >
              Employee Profile
            </button>
          </div>
        )}
        <AchievementModal
          isModalOpen={isModalOpen}
          self={this}
          achievements={cardItem.Achievements}
        />
      </div>
    );
  }
}
