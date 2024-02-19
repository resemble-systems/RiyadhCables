import * as React from "react";
import styles from "./AboutPage.module.scss";
import { IAboutPageProps } from "./IAboutPageProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { Row, Col, Empty } from "antd";
import "antd/dist/reset.css";
import "../../global.css";

interface IAboutPageState {
  aboutSortedAsRecent: any;
  isScreenWidth: any;
}
export default class AboutPage extends React.Component<
  IAboutPageProps,
  IAboutPageState
> {
  public scrollRef: any;
  public constructor(props: IAboutPageProps, state: IAboutPageState) {
    super(props);
    this.state = {
      aboutSortedAsRecent: [],
      isScreenWidth: 800,
    };
    this.scrollRef = React.createRef();
  }

  public async componentDidMount(): Promise<void> {
    setTimeout(() => {
      console.log("scrollRef", this.scrollRef);
      if (this.scrollRef)
        this.scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1000);
    const ScreenWidth: any = window.screen.width;
    console.log(ScreenWidth, "ScreenWidth");
    this.setState({ isScreenWidth: ScreenWidth });

    try {
      const { context } = this.props;
      const apiUrl = `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('About')/items?$select=*`;
      const res: SPHttpClientResponse = await context.spHttpClient.get(
        apiUrl,
        SPHttpClient.configurations.v1
      );

      if (!res.ok) {
        throw new Error(`HTTP request failed with status ${res.status}`);
      }

      const listItems: any = await res.json();
      console.log("Res listItems", listItems);

      const approvedItems: any = listItems.value?.filter(
        (items: any) => items.ApprovalStatus === "Approved"
      );
      const sortedItems: any = approvedItems?.sort(
        (a: any, b: any) =>
          new Date(b.Created).getTime() - new Date(a.Created).getTime()
      );

      console.log("aboutSortedItems", sortedItems);
      this.setState({ aboutSortedAsRecent: sortedItems });
    } catch (error) {
      console.error("Error in componentDidMount:", error);
      // Handle the error, e.g., show an error message to the user or log it.
    }
  }

  public render(): React.ReactElement<IAboutPageProps> {
    // let carouselOneAction: any = {};
    const bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    const fa =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
    let Avenir = `${this.props.context.pageContext.site.absoluteUrl}/SiteAssets/font/style.css`;
    SPComponentLoader.loadCss(bootstarp5CSS);
    SPComponentLoader.loadCss(fa);
    SPComponentLoader.loadCss(Avenir);

    const { aboutSortedAsRecent /*  isScreenWidth */ } = this.state;
    const { context } = this.props;
    return (
      <div
        className="detailsContainer px-0"
        style={{
          /* paddingTop: `${isScreenWidth < 768 ? "30px" : "80px"}`, */
          fontFamily: "Avenir Next",
        }}
      >
        <Row ref={this.scrollRef}>
          <Col xs={24} sm={24} md={24} lg={24}>
            <div
              className=""
              style={{
                height: "110px",
                boxShadow: "1px 1px 18px 0 rgba(0, 0, 0, 0.16)",
                backgroundColor: " #fff",
                borderRadius: "5px",
              }}
            >
              <div className="d-flex align-items-center justify-content-between w-100 h-100">
                <h4 className="d-flex align-items-center justify-content-start ps-4 w-100">
                  <a
                    href={`${context.pageContext.web.absoluteUrl}/SitePages/Home.aspx`}
                  >
                    <img
                      src={require("../assets/arrow-left.svg")}
                      height="20px"
                      width="50px"
                    />
                  </a>
                  About Us
                </h4>
              </div>
            </div>
          </Col>
        </Row>

        <Row
          className="my-4 px-5 py-3"
          style={{
            boxShadow: "1px 1px 18px 0 rgba(0, 0, 0, 0.16)",
            backgroundColor: " #fff",
            borderRadius: "5px",
          }}
        >
          {/*  <Col xs={24} md={24} lg={24} xl={24}>
            <div className="d-flex justify-content-center">
              <div className="my-5 w-50" style={{ position: "relative" }}>
                <Carousel
                  autoplay={false}
                  dots={false}
                  ref={(ref) => {
                    carouselOneAction = ref;
                  }}
                >
                  {aboutSortedAsRecent?.length > 0 ? (
                    aboutSortedAsRecent[0]?.AttachmentFiles?.map(
                      (file: any) => {
                        return (
                          <div className="d-flex h-100 justify-content-center align-items-center">
                            <img
                              className="rounded w-100"
                              style={{ aspectRatio: "1.5/1" }}
                              src={
                                context.pageContext.web.absoluteUrl
                                  .split("/")
                                  .slice(0, 3)
                                  .join("/") + file.ServerRelativeUrl
                              }
                            />
                          </div>
                        );
                      }
                    )
                  ) : (
                    <Row className="w-100">
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div className="d-flex w-100 justify-content-center align-items-center">
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                              <span className="text-secondary">No Data</span>
                            }
                          ></Empty>
                        </div>
                      </Col>
                    </Row>
                  )}
                </Carousel>
                <div
                  className="d-flex justify-content-between"
                  style={{
                    position: "absolute",
                    left: "0",
                    right: "0",
                    top: "44%",
                  }}
                >
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      carouselOneAction.prev();
                    }}
                  >
                    <img
                      className={`${styles.bannerInfoArrows}`}
                      src={require("../assets/left.png")}
                    />
                  </div>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      carouselOneAction.next();
                    }}
                  >
                    <img
                      className={`${styles.bannerInfoArrows}`}
                      src={require("../assets/right.png")}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Col> */}

          <Col xs={24} md={24} lg={24} xl={24}>
            {aboutSortedAsRecent?.length > 0 ? (
              aboutSortedAsRecent.map((about: any) => {
                return (
                  <div className="d-flex justify-content-start align-items-center">
                    <div
                      className={`${styles.description}my-2`}
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#292929",
                        textAlign: "justify",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: about.Description,
                      }}
                    ></div>
                  </div>
                );
              })
            ) : (
              <Row className="w-100">
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <div className="d-flex w-100 justify-content-center align-items-center">
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description={
                        <span className="text-secondary">No Data</span>
                      }
                    ></Empty>
                  </div>
                </Col>
              </Row>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}
