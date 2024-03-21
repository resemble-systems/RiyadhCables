import * as React from "react";
import { IFooterProps } from "./IFooterProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import "antd/dist/reset.css";
import "./styles.css";
import Loader from "../../../commonComponents/loader/Loader";

interface IFooterState {
  footerLogo: any;
  isLoading: boolean;
}

export default class Footer extends React.Component<
  IFooterProps,
  IFooterState
> {
  public constructor(props: IFooterProps, state: IFooterState) {
    super(props);
    this.state = {
      footerLogo: [],
      isLoading: true,
    };
  }

  public componentDidMount(): void {
    let commentSection: any = document.getElementById("CommentsWrapper");
    commentSection.style.display = "none";
    setInterval(() => {
      let footer = document.getElementsByTagName("footer")[1];
      footer.style.display = "none";
    }, 1000);

    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Logo')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        console.log("listItems Success");
        return res.json();
      })
      .then((listItems: any) => {
        console.log("Res listItems", listItems);
        const footerLogo: any = listItems.value.filter(
          (item: any) => item.Title.toLowerCase() === "footer"
        );
        console.log("FooterLogo", footerLogo);
        this.setState({ footerLogo: footerLogo });
      });
    setTimeout(() => this.setState({ isLoading: false }), 2000);
  }

  public render(): React.ReactElement<IFooterProps> {
    let bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    let fa =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
    let Avenir = `${this.props.context.pageContext.site.absoluteUrl}/SiteAssets/font/style.css`;
    SPComponentLoader.loadCss(bootstarp5CSS);
    SPComponentLoader.loadCss(fa);
    SPComponentLoader.loadCss(Avenir);
    const { context } = this.props;
    const { footerLogo, isLoading } = this.state;
    return (
      <>
        {isLoading ? (
          <Loader row={3} avatar={false} skeletonCount={1} />
        ) : (
          <footer
            style={{
              height: "90px",
              backgroundColor: "rgb(139, 138, 138)",
              fontFamily: "Avenir Next",
            }}
          >
            <div className="h-100 text-light d-flex justify-content-between align-items-center px-2">
              <div className="d-flex  h-100 justify-content-around align-items-center">
                {footerLogo.map((header: any) => {
                  return (
                    <div className="h-100 d-flex align-items-center justify-content-start">
                      <a
                        href={`${context.pageContext.web.absoluteUrl
                          .split("/")
                          .slice(0, 5)
                          .join("/")}`}
                      >
                        <img
                          src={
                            context.pageContext.web.absoluteUrl
                              .split("/")
                              .slice(0, 3)
                              .join("/") +
                            header?.AttachmentFiles[0]?.ServerRelativeUrl
                          }
                          height={`${header.Height}`}
                          width={`${header.Width}`}
                          className="d-none d-lg-block"
                        />
                        <img
                          src={
                            context.pageContext.web.absoluteUrl
                              .split("/")
                              .slice(0, 3)
                              .join("/") +
                            header?.AttachmentFiles[0]?.ServerRelativeUrl
                          }
                          height={`80px`}
                          width={`110px`}
                          className="logoImage"
                        />
                      </a>
                    </div>
                  );
                })}
              </div>
              <div className="d-none d-md-flex gap-5 h-100 justify-content-around align-items-center"></div>
              <div className="d-none d-md-flex justify-content-center">
                <span
                  className="mx-2"
                  style={{ height: "23px", width: "30px" }}
                >
                  <a
                    href="https://www.instagram.com/riyadhcablessa/"
                    target="_blank"
                  >
                    <img alt="" src={require("../assets/instagram.svg")} />
                  </a>
                </span>
                <span
                  className="mx-2"
                  style={{ height: "23px", width: "30px" }}
                >
                  <a
                    href="https://www.facebook.com/RiyadhCablesSA"
                    target="_blank"
                  >
                    <img alt="" src={require("../assets/facebook.svg")} />
                  </a>
                </span>
                <span
                  className="mx-2"
                  style={{ height: "23px", width: "30px" }}
                >
                  <a
                    href="https://www.linkedin.com/company/riyadhcablessa"
                    target="_blank"
                  >
                    <img alt="" src={require("../assets/linkedin.svg")} />
                  </a>
                </span>
                <span
                  className="mx-2"
                  style={{ height: "23px", width: "30px" }}
                >
                  <a href="https://twitter.com/RiyadhCablesSA" target="_blank">
                    <img alt="" src={require("../assets/twitter.svg")} />
                  </a>
                </span>
                <span
                  className="mx-2"
                  style={{ height: "23px", width: "30px" }}
                >
                  <a
                    href="http://www.youtube.com/channel/UCVixHHUaRU8gCv0cDxdEefQ"
                    target="_blank"
                  >
                    <img alt="" src={require("../assets/youtube.svg")} />
                  </a>
                </span>
              </div>
            </div>
          </footer>
        )}
      </>
    );
  }
}
