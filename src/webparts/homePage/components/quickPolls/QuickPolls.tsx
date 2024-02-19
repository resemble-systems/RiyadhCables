import * as React from "react";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import {
  ISPHttpClientOptions,
  SPHttpClient,
  SPHttpClientResponse,
} from "@microsoft/sp-http";
import CommonLayout from "../../../../commonComponents/layout/Layout";
import CommonCard from "../../../../commonComponents/commonCard";
import { UserConsumer } from "../../../../service/UserContext";
import QuickPollsCard from "../../../../commonComponents/quickPollsCard/QuickPollsCard";
import Pagination from "../../../../commonComponents/pagination/Pagination";

interface IQuickPollsProps {
  context: WebPartContext;
  marginRight: boolean;
}
interface IQuickPollsState {
  currentPage: number;
  quickPollsAsSorted: any;
  quickPollsChoice: any;
  isModalOpen: boolean;
  modalData: ModalDataFinalElement[];
  optionSelected: any;
}

export interface ModalDataFinalElement {
  Answer: {
    Option: string;
    SelectedBy: { RespondantName: string; RespondantEmail: string }[];
  }[];
  Title: string;
}

export interface QuickPollModalData {
  Title: string;
  Choice: string | null;
  Option1: string | null;
  Option2: string | null;
  Option3: string | null;
  Option4: string | null;
}

export interface QuickPollModalChoice {
  RespondantName: string;
  RespondantEmail: string;
  RespondantChoice: { Option: string; ID: number };
}
export interface QuickPollModalAnswer {
  RespondantName: string;
  RespondantEmail: string;
  RespondantChoice: string;
}

export default class QuickPolls extends React.Component<
  IQuickPollsProps,
  IQuickPollsState
> {
  public constructor(props: IQuickPollsProps, state: IQuickPollsState) {
    super(props);
    this.state = {
      currentPage: 1,
      quickPollsAsSorted: [],
      quickPollsChoice: {},
      isModalOpen: false,
      modalData: [],
      optionSelected: "",
    };
  }

  public componentDidMount(): void {
    this.getQuickPolls();
  }

  public getQuickPolls = () => {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('QuickPolls')/items?$select=*&$expand=AttachmentFiles`,
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
        const modalData: ModalDataFinalElement[] = sortedItems
          ?.map((data: QuickPollModalData) => {
            const { Title, Choice, Option1, Option2, Option3, Option4 } = data;
            const options = [Option1, Option2, Option3, Option4].filter(
              Boolean
            );
            if (Choice) {
              const choices = JSON.parse(Choice).map(
                ({
                  RespondantName,
                  RespondantEmail,
                  RespondantChoice,
                }: QuickPollModalChoice) => ({
                  RespondantEmail,
                  RespondantName,
                  RespondantChoice: RespondantChoice.Option,
                })
              );
              const answers = options
                .map((option: string) => {
                  const selectedBy = choices
                    .filter(
                      ({ RespondantChoice }: QuickPollModalAnswer) =>
                        option === RespondantChoice
                    )
                    .map(
                      ({
                        RespondantName,
                        RespondantEmail,
                      }: QuickPollModalAnswer) => ({
                        RespondantName,
                        RespondantEmail,
                      })
                    );

                  return { Option: option, SelectedBy: selectedBy };
                })
                .filter(Boolean);
              return answers.length ? { Title, Answer: answers } : null;
            }
            return null;
          })
          .filter(Boolean);

        console.log("QuickPolls Answer Data", modalData);
        console.log("quickPollsAsSorted", sortedItems);
        this.setState({
          quickPollsAsSorted: sortedItems,
          modalData: modalData,
        });
      });
  };

  public updateItem = (pollResponse: any, ID: any) => {
    const { context } = this.props;
    const headers: any = {
      "X-HTTP-Method": "MERGE",
      "If-Match": "*",
    };
    const spHttpClintOptions: ISPHttpClientOptions = {
      headers,
      body: JSON.stringify({
        Choice: pollResponse,
      }),
    };
    context.spHttpClient
      .post(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('QuickPolls')/items('${ID}')`,
        SPHttpClient.configurations.v1,
        spHttpClintOptions
      )
      .then((r) => {
        console.log(r, "Post Response");
        this.getQuickPolls();
        this.setState({ quickPollsChoice: {} });
      });
  };

  public handleSubmit = (ID: any, ANSWER: any) => {
    const { context } = this.props;
    let result = {
      RespondantName: context.pageContext.user.displayName,
      RespondantEmail: context.pageContext.user.email,
      RespondantChoice: this.state.quickPollsChoice,
    };
    let pollArray = JSON.parse(ANSWER);
    console.log(pollArray, "TEST");

    if (!pollArray) {
      let pollResult = [result];
      let pollResponse = JSON.stringify(pollResult);
      if (this.state.quickPollsChoice.ID === ID) {
        this.updateItem(pollResponse, ID);
        alert("Submitted");
      } else {
        this.setState({ quickPollsChoice: {} });
        alert("Please select valid options");
      }
    } else {
      let pollResult = [...pollArray, result];
      let pollResponse = JSON.stringify(pollResult);
      if (this.state.quickPollsChoice.ID === ID) {
        this.updateItem(pollResponse, ID);
        alert("Submitted");
      } else {
        this.setState({ quickPollsChoice: {} });
        alert("Please select valid options");
      }
    }
  };

  public handleEdit = (ID: any, CHOICE: any) => {
    const { context } = this.props;
    let pollArray = JSON.parse(CHOICE);

    let isUserExist: any = [];
    if (pollArray) {
      isUserExist = pollArray.filter(
        (item: any) =>
          item.RespondantName !== context.pageContext.user.displayName &&
          item.RespondantEmail !== context.pageContext.user.email
      );
    }
    let pollResult = isUserExist;
    let pollResponse = JSON.stringify(pollResult);
    this.updateItem(pollResponse, ID);
  };

  public render(): React.ReactElement<IQuickPollsProps> {
    const {
      currentPage,
      quickPollsAsSorted,
      isModalOpen,
      modalData,
      optionSelected,
      quickPollsChoice,
    } = this.state;
    const { context } = this.props;
    const exercisesPerPage = 2;
    const numberOfElements = quickPollsAsSorted.length;
    const numberOfPages = Math.round(numberOfElements / exercisesPerPage);
    const indexOfLastPage = currentPage * exercisesPerPage;
    const indexOfFirstPage = indexOfLastPage - exercisesPerPage;
    const currentData = quickPollsAsSorted.slice(
      indexOfFirstPage,
      indexOfLastPage
    );
    console.log(this.state.quickPollsChoice, "quickPollsChoice");
    const handleModel = () => {
      this.setState({ isModalOpen: false });
    };
    const left = require("../../assets/left.png");
    const right = require("../../assets/right.png");

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
            <CommonLayout lg={8} xl={8} classNames={``}>
              <CommonCard
                cardIcon={require("../../assets/polls.png")}
                cardTitle={"Quick Polls"}
                footerText={""}
                footerVisible={false}
                rightPanelVisible={true}
                redirectionLink={``}
                rightPanelElement={
                  <Pagination
                    self={this}
                    left={left}
                    right={right}
                    currentPage={currentPage}
                    numberOfPages={numberOfPages}
                  />
                }
                footerPanelVisible={isAdmin}
                footerPanelElement={
                  <div
                    onClick={() => {
                      if (modalData.length)
                        this.setState({ isModalOpen: true });
                      else alert("No Quickpolls response have been submitted");
                    }}
                  >
                    View Response
                  </div>
                }
              >
                <QuickPollsCard
                  self={this}
                  context={context}
                  isAdmin={isAdmin}
                  modalData={modalData}
                  handleModel={handleModel}
                  currentData={currentData}
                  currentPage={currentPage}
                  isModalOpen={isModalOpen}
                  handleEdit={this.handleEdit}
                  handleSubmit={this.handleSubmit}
                  optionSelected={optionSelected}
                  quickPollsChoice={quickPollsChoice}
                  quickPollsAsSorted={quickPollsAsSorted}
                />
              </CommonCard>
            </CommonLayout>
          );
        }}
      </UserConsumer>
    );
  }
}
