import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import style from "./Application.module.sass";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import EmptyCard from "../../../../commonComponents/emptyCard/EmptyCard";
import { UserConsumer } from "../../../../service/UserContext";
import CommonLayout from "../../../../commonComponents/layout/Layout";
import CommonCard from "../../../../commonComponents/commonCard";
import ApplicationCard from "../../../../commonComponents/applicationCard/ApplicationCard";

interface IApplicationProps {
  context: WebPartContext;
  marginRight: boolean;
}

interface IApplicationState {
  applicationAsRecent: any;
}

export default class Application extends React.Component<
  IApplicationProps,
  IApplicationState
> {
  public constructor(props: IApplicationProps, state: IApplicationState) {
    super(props);
    this.state = {
      applicationAsRecent: [],
    };
  }

  public componentDidMount(): void {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Applications')/items?$select=*&$expand=AttachmentFiles`,
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
          (a: any, b: any) => a.ShowOrder - b.ShowOrder
        );
        console.log("applicationAsRecent", sortedItems);
        this.setState({ applicationAsRecent: sortedItems });
      });
  }

  public render(): React.ReactElement<IApplicationProps> {
    const { applicationAsRecent } = this.state;
    const { context, marginRight } = this.props;

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
              lg={6}
              xl={6}
              classNames={`${marginRight && "marginRight"}`}
            >
              <CommonCard
                cardIcon={require("../../assets/app.png")}
                cardTitle={"Applications"}
                footerText={""}
                footerVisible={false}
                rightPanelVisible={false}
                redirectionLink={``}
                rightPanelElement={<></>}
              >
                {applicationAsRecent?.length > 0 ? (
                  <div className={`${style.applicationContainer} mb-3`}>
                    {applicationAsRecent.map(
                      (application: {
                        ID: number;
                        Link: string;
                        AttachmentFiles: any[];
                        Title: string;
                      }) => {
                        return (
                          <ApplicationCard
                            key={application.ID}
                            cardItem={application}
                            context={context}
                          />
                        );
                      }
                    )}
                  </div>
                ) : (
                  <EmptyCard />
                )}
              </CommonCard>
            </CommonLayout>
          );
        }}
      </UserConsumer>
    );
  }
}
