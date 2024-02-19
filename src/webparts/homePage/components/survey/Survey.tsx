import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { UserConsumer } from "../../../../service/UserContext";
import CommonLayout from "../../../../commonComponents/layout/Layout";
import CommonCard from "../../../../commonComponents/commonCard";
import SurveyCard from "../../../../commonComponents/surveyCard/SurveyCard";

interface ISurveyProps {
  context: WebPartContext;
  marginRight: boolean;
}

interface ISurveyState {
  surveyAsRecent: any;
}

export default class Survey extends React.Component<
  ISurveyProps,
  ISurveyState
> {
  public constructor(props: ISurveyProps, state: ISurveyState) {
    super(props);
    this.state = {
      surveyAsRecent: [],
    };
  }

  public componentDidMount(): void {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Survey')/items?$select=*&$expand=AttachmentFiles`,
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
            new Date(b.Created).getTime() - new Date(a.Created).getTime()
        );
        console.log("surveyAsRecent", sortedItems);
        this.setState({ surveyAsRecent: sortedItems });
      });
  }

  public render(): React.ReactElement<ISurveyProps> {
    const { surveyAsRecent } = this.state;
    const { marginRight } = this.props;
    return (
      <UserConsumer>
        {(UserDetails: {
          name: string;
          email: string;
          isAdmin: boolean;
          isSmallScreen: boolean;
        }) => {
          const { isAdmin } = UserDetails;
          return (
            <CommonLayout
              lg={8}
              xl={8}
              classNames={`${marginRight && "marginRight"}`}
            >
              <CommonCard
                cardIcon={require("../../assets/survey.png")}
                cardTitle={"Survey"}
                footerText={""}
                footerVisible={false}
                rightPanelVisible={isAdmin}
                redirectionLink={``}
                rightPanelElement={
                  <div className="d-flex align-items-center">
                    <a
                      href="https://forms.office.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-decoration-none text-dark"
                    >
                      <div
                        style={{
                          fontSize: "20px",
                          fontWeight: "700",
                          cursor: "pointer",
                        }}
                      >
                        Create/ View
                      </div>
                    </a>
                  </div>
                }
              >
                <SurveyCard surveyAsRecent={surveyAsRecent} />
              </CommonCard>
            </CommonLayout>
          );
        }}
      </UserConsumer>
    );
  }
}
