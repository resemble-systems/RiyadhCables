import * as React from "react";
import "./index.css";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { MSGraphClientV3 } from "@microsoft/sp-http";
import { UserConsumer } from "../../../../service/UserContext";
import CommonLayout from "../../../../commonComponents/layout/Layout";
import CommonCard from "../../../../commonComponents/commonCard";
import EmptyCard from "../../../../commonComponents/emptyCard/EmptyCard";

interface TaskData {
  id: string;
  status: string;
  subject: string;
}

export interface IPersonalTaskProps {
  marginRight: boolean;
  context: WebPartContext;
}

export interface IPersonalTaskState {
  taskData: Array<TaskData>;
  isLoading: boolean;
}

export default class PersonalTask extends React.Component<
  IPersonalTaskProps,
  IPersonalTaskState
> {
  public constructor(props: IPersonalTaskProps, state: IPersonalTaskState) {
    super(props);
    this.state = {
      taskData: [],
      isLoading: false,
    };
  }

  public componentDidMount(): void {
    const { context } = this.props;
    context.msGraphClientFactory
      .getClient("3")
      .then((grahpClient: MSGraphClientV3): void => {
        grahpClient
          .api(`me/outlook/tasks`)
          .version("beta")
          .select("*")
          .top(20)
          .get((error: any, task: any, rawResponse?: any) => {
            if (error) {
              console.log("Task messages Error", error);
              return;
            }
            console.log("Task Response", task);
            this.setState({ isLoading: false, taskData: task.value });
          });
      });
  }

  public render(): React.ReactElement<IPersonalTaskProps> {
    const { marginRight } = this.props;
    const { taskData } = this.state;
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
                cardIcon={require("../../assets/to-do-list.png")}
                cardTitle={"Personal Tasks"}
                footerText={"View All"}
                footerVisible={false}
                rightPanelVisible={isAdmin}
                redirectionLink={``}
                rightPanelElement={<></>}
              >
                <div
                  className="taskContainer"
                  style={{
                    overflowY: "scroll",
                    scrollbarWidth: "thin",
                    fontFamily: "Avenir Next",
                  }}
                >
                  {taskData?.length > 0 ? (
                    taskData.map((taskItem: TaskData) => {
                      return (
                        <a
                          className="text-decoration-none text-dark"
                          href={`https://to-do.office.com/tasks/id/${taskItem.id}=/details`}
                        >
                          <div className="d-flex gap-3 border-top border-3 py-3 align-items-center">
                            <div>
                              <div
                                style={{
                                  width: "20px",
                                  height: "20px",
                                  backgroundColor: `${
                                    taskItem.status === "completed"
                                      ? "#32CD32"
                                      : " rgb(181, 77, 38)"
                                  }`,
                                }}
                                className="rounded-circle"
                              />
                            </div>
                            <div style={{ fontSize: "14px", fontWeight: 500 }}>
                              {taskItem.subject}
                            </div>
                          </div>
                        </a>
                      );
                    })
                  ) : (
                    <EmptyCard />
                  )}
                </div>
              </CommonCard>
            </CommonLayout>
          );
        }}
      </UserConsumer>
    );
  }
}
