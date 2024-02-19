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

interface IQuickPollsProps {
  context: WebPartContext;
}
interface IQuickPollsState {
  currentPage: number;
  quickPollsAsSorted: any;
  quickPollsChoice: any;
  isModalOpen: boolean;
  modalData: any;
  optionSelected: any;
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
      modalData: {},
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
        console.log("quickPollsAsSorted", sortedItems);
        this.setState({ quickPollsAsSorted: sortedItems });
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
          const { isAdmin, isSmallScreen } = UserDetails;
          return (
            <CommonLayout
              lg={8}
              xl={8}
              classNames={`${!isSmallScreen && "me-3"}`}
            >
              <CommonCard
                cardIcon={require("../../assets/document.svg")}
                cardTitle={"Quick Polls"}
                footerText={""}
                footerVisible={false}
                rightPanelVisible={true}
                redirectionLink={``}
                rightPanelElement={
                  <div className="d-flex align-items-center">
                    <span
                      onClick={() => {
                        this.setState({
                          currentPage:
                            currentPage > 1 ? currentPage - 1 : currentPage - 0,
                        });
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <img src={left} alt="<" width={"18px"} />
                    </span>
                    <span
                      className="d-flex align-items-center ps-2"
                      style={{ fontWeight: 700, fontSize: "12px" }}
                    >
                      {currentPage}
                    </span>
                    <span
                      className="d-flex align-items-center"
                      style={{ fontWeight: 600, fontSize: "12px" }}
                    >
                      /
                    </span>
                    <span
                      className="d-flex align-items-center pe-2"
                      style={{ fontWeight: 700, fontSize: "12px" }}
                    >
                      {numberOfPages}
                    </span>
                    <span
                      onClick={() => {
                        this.setState({
                          currentPage:
                            currentPage >= numberOfPages
                              ? currentPage + 0
                              : currentPage + 1,
                        });
                      }}
                      style={{ cursor: "pointer" }}
                    >
                      <img src={right} alt="<" width={"18px"} />
                    </span>
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
