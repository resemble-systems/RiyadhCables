import * as React from "react";
import { Row, Col, Carousel } from "antd";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import styles from "./banner.module.sass";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import BannerNav from "../bannerNav/BannerNav";
import Loader from "../../../../commonComponents/loader/Loader";

export interface IBannerProps {
  context: WebPartContext;
}
export interface IBannerState {
  BannerListItems: any;
  isLoading: boolean;
  isDetailsPage: boolean;
  departmentsAsRecent: any;
}

export default class Banner extends React.Component<
  IBannerProps,
  IBannerState
> {
  private ref: any = null;

  public constructor(props: IBannerProps, state: IBannerState) {
    super(props);
    this.state = {
      BannerListItems: [],
      isLoading: false,
      isDetailsPage: true,
      departmentsAsRecent: [],
    };
  }
  public componentDidMount(): void {
    const { context } = this.props;

    console.log("currentUrl", context.pageContext);

    /*  const currentPage = context.pageContext.site.serverRequestPath.split(
      context.pageContext.site.serverRelativeUrl
    )[1]; */
    /* if (
      currentPage === "/SitePages/Page Details.aspx" ||
      currentPage === "/SitePages/Workflow.aspx" ||
      currentPage === "/SitePages/Announcements.aspx" ||
      currentPage === "/SitePages/News.aspx" ||
      currentPage === "/SitePages/Document.aspx" ||
      currentPage === "/SitePages/Gallery.aspx" ||
      currentPage === "/SitePages/About.aspx" ||
      currentPage === "/SitePages/PolicesProcedures.aspx" ||
      currentPage === "/SitePages/CompanyReports.aspx"
    ) {
      this.setState({ isDetailsPage: true });
    } */
    const currentPage: string = window.location.toString().toLowerCase();
    console.log("CURRENT URL", currentPage);
    console.log(
      "URL CONDITIONS",
      `${context.pageContext.site.absoluteUrl}/SitePages/Home.aspx`.toLowerCase(),
      context.pageContext.site.absoluteUrl?.toLowerCase(),
      currentPage !=
        `${context.pageContext.site.absoluteUrl}/SitePages/Home.aspx`.toLowerCase(),
      currentPage != context.pageContext.site.absoluteUrl?.toLowerCase(),
      currentPage == `${context.pageContext.site.absoluteUrl?.toLowerCase()}/`
    );
    if (
      currentPage ==
        `${context.pageContext.site.absoluteUrl}/SitePages/Home.aspx`.toLowerCase() ||
      currentPage == context.pageContext.site.absoluteUrl?.toLowerCase() ||
      currentPage == `${context.pageContext.site.absoluteUrl?.toLowerCase()}/`
    ) {
      this.setState({ isDetailsPage: false });
    }
    this.getDepartment();
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Banner')/items?$select=*&$expand=AttachmentFiles`,
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
        console.log("BannerListItems", sortedItems);
        this.setState({ BannerListItems: sortedItems });
      });
    setTimeout(() => this.setState({ isLoading: false }), 2000);
  }

  public getDepartment() {
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Departments')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        console.log("listItems Success");
        return res.json();
      })
      .then((listItems: any) => {
        console.log("Departments", listItems);
        const sortedItems: any = listItems.value.sort((a: any, b: any) => {
          if (a.Title > b.Title) {
            return 1;
          }
          if (a.Title < b.Title) {
            return -1;
          }
          return 0;
        });
        console.log("departmentsAsRecent", sortedItems);
        this.setState({ departmentsAsRecent: sortedItems });
        const departmentPage = context.pageContext.web.title;
        const isDepartment = sortedItems?.filter(
          (data: { Title: string }) => data.Title === departmentPage
        );
        if (isDepartment?.length > 0) {
          this.setState({ isDetailsPage: true });
        }
      });
  }

  public render(): React.ReactElement<IBannerProps> {
    const { BannerListItems, isLoading, isDetailsPage, departmentsAsRecent } =
      this.state;
    const { context } = this.props;
    return (
      <>
        {isLoading ? (
          <Loader row={5} avatar={false} skeletonCount={1} />
        ) : (
          <div style={{ position: "relative", fontFamily: "Avenir Next" }}>
            <div
              id="banner-container"
              className={`container-fluid p-0 ${styles.bannerContainer} ${
                isDetailsPage ? "d-none" : ""
              }`}
            >
              <Row className={`h-100`}>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  <Carousel
                    autoplay
                    dots={false}
                    ref={(ref: any) => {
                      console.log("ref", ref);
                      this.ref = ref;
                      console.log("ref", this.ref);
                    }}
                  >
                    {BannerListItems.map((banner: any) => {
                      return (
                        <div className={`d-flex  ${styles.bannerImgContainer}`}>
                          <img
                            id="banner-img"
                            src={
                              context.pageContext.web.absoluteUrl
                                .split("/")
                                .slice(0, 3)
                                .join("/") +
                              banner?.AttachmentFiles[0]?.ServerRelativeUrl
                            }
                            alt="bannerImg"
                            className={`${styles.bannerImg}`}
                          />
                         {/*  <div
                            className={`h-100 w-100 ${styles.bannerImgLayer} `}
                          ></div> */}
                          <div
                            className={`w-100 ${styles.bannerInfoContainer}`}
                          >
                            <div className="d-flex justify-content-between">
                              <div
                                className="d-flex justify-content-start align-items-center"
                                style={{ width: "5vw" }}
                              >
                                <img
                                  src={require("../assets/banner/cleft.png")}
                                  alt="leftArr"
                                  style={{ cursor: "pointer" }}
                                  className={`${styles.bannerInfoArrows}`}
                                  onClick={() => {
                                    this.ref.prev();
                                  }}
                                />
                              </div>
                              <div className="d-flex justify-content-start flex-fill">
                                <div className={`${styles.InfoContainer}`}>
                                  <div className={`${styles.bannerInfoTitle}`}>
                                    {banner.Title}
                                  </div>
                                  <div
                                    className={`mb-0 ${styles.bannerInfoDes}`}
                                    dangerouslySetInnerHTML={{
                                      __html: banner.Description,
                                    }}
                                  ></div>
                                  <div
                                    className={`mt-2 px-3 py-1 ${styles.bannerInfoMore} fs-bold`}
                                    style={{
                                      backgroundColor: " rgb(181, 77, 38)",
                                      fontWeight: "500",
                                      cursor: "pointer",
                                      width: "max-content",
                                    }}
                                  >
                                    <a
                                      className="text-decoration-none text-white"
                                      href={banner.Link}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      Know More
                                    </a>
                                  </div>
                                </div>
                              </div>
                              <div
                                className="d-flex justify-content-end align-items-center"
                                style={{ width: "5vw" }}
                              >
                                <img
                                  src={require("../assets/banner/cright.png")}
                                  alt="rightArr"
                                  style={{ cursor: "pointer" }}
                                  className={`ms-4 ${styles.bannerInfoArrows}`}
                                  onClick={() => {
                                    this.ref.next();
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </Carousel>
                </Col>
              </Row>
            </div>
            <Col
              xs={0}
              sm={0}
              md={24}
              lg={24}
              xl={24}
              style={{
                position: isDetailsPage ? "relative" : "absolute",
                right: "0",
                left: "0",
                bottom: isDetailsPage ? "" : "-3rem",
                paddingTop: isDetailsPage ? "1rem" : "",
              }}
            >
              <BannerNav
                context={context}
                departmentsAsRecent={departmentsAsRecent}
              />
            </Col>
            <Col
              xs={24}
              sm={24}
              md={0}
              lg={0}
              xl={0}
              style={{ paddingTop: isDetailsPage ? "1rem" : "" }}
            >
              <BannerNav
                context={context}
                departmentsAsRecent={departmentsAsRecent}
              />
            </Col>
          </div>
        )}
      </>
    );
  }
}
