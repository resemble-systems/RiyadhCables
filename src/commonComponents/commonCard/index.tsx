import * as React from "react";
import styles from "./card.module.sass";

export interface ICommonCardProps {
  children: any;
  cardIcon: string;
  cardTitle: string;
  footerText: string;
  footerVisible: boolean;
  rightPanelElement: JSX.Element;
  rightPanelVisible: boolean;
  redirectionLink: string;
  footerPanelVisible?: boolean;
  footerPanelElement?: JSX.Element;
  scrollElement?: boolean;
}

export default class CommonCard extends React.Component<ICommonCardProps, {}> {
  public render(): React.ReactElement<ICommonCardProps> {
    const {
      children,
      cardIcon,
      cardTitle,
      footerText,
      footerVisible,
      rightPanelElement,
      rightPanelVisible,
      redirectionLink,
      footerPanelVisible,
      footerPanelElement,
      scrollElement,
    } = this.props;

    
    return (
      <div
        className={`d-flex flex-column justify-content-between ${styles.cardContainer}`}
      >
        <div
          className={`d-flex justify-content-between align-items-center p-3`}
        >
          <div className="d-flex align-items-center">
            <img
              src={
                cardIcon ? cardIcon : require("./assets/announcementLogo.svg")
              }
              alt="logo"
              height={"24px"}
              width={`24px`}
            />
            <div
              className={`ms-2`}
              style={{
                fontSize: "20px",
                fontWeight: "700",
                fontFamily: "Avenir Next",
              }}
            >
              {cardTitle ? cardTitle : `Card Title`}
            </div>
          </div>
          {rightPanelVisible && <div>{rightPanelElement}</div>}
        </div>
        <div
          className="flex-grow-1 p-3 py-0"
          style={{
            height: scrollElement ? "410px" : "auto",
            overflowX: scrollElement ? "scroll" : "auto",
          }}
        >
          {children}
        </div>
        <div>
          {footerVisible && (
            <a
              href={redirectionLink ? redirectionLink : ``}
              style={{ textDecoration: "none", fontFamily: "Avenir Next" }}
            >
              <div className={`text-center py-2 ${styles.cardFooterContainer}`}>
                {footerText ? footerText : `Footer Text`}
              </div>
            </a>
          )}
          {footerPanelVisible && (
            <div
              className={`text-center py-2 ${styles.cardFooterContainer}`}
              style={{ cursor: "pointer", fontFamily: "Avenir Next" }}
            >
              {footerPanelElement}
            </div>
          )}
        </div>
      </div>
    );
  }
}
