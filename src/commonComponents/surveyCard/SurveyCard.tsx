import * as React from "react";
import EmptyCard from "../emptyCard/EmptyCard";
import styles from "./Survy.module.scss";
export interface ISurveyCardProps {
  surveyAsRecent: any;
}

export default class SurveyCard extends React.Component<ISurveyCardProps, {}> {
  public render(): React.ReactElement<ISurveyCardProps> {
    const { surveyAsRecent } = this.props;
    return (
      <>
        {surveyAsRecent?.length > 0 ? (
          <div
            className={`${styles.SurveyContainer} mb-3`}
            style={{
              scrollbarWidth: "thin",
              fontFamily: "Avenir Next",
            }}
          >
            {surveyAsRecent.map((survey: any, index: any) => {
              return (
                <a
                  key={survey.ID}
                  className="text-dark text-decoration-none"
                  href={survey.Link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div
                    className={`${styles.surveyDescription} p-2 rounded-3 mt-4 me-2`}
                    style={{
                      fontSize: "14px",
                      fontWeight: "400",
                      fontFamily: "Avenir Next",
                      backgroundColor: "#ededed",
                      cursor: "pointer",
                      height: "85px",
                    }}
                  >
                    {index + 1}. {survey.Title}
                  </div>
                </a>
              );
            })}
          </div>
        ) : (
          <EmptyCard />
        )}
      </>
    );
  }
}
