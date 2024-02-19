import * as React from "react";
import { Col } from "antd";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";

interface IBannerNavProps {
  context: WebPartContext;
  departmentsAsRecent: any;
}
interface IBannerNavState {}

export default class BannerNav extends React.Component<
  IBannerNavProps,
  IBannerNavState
> {
  public constructor(props: IBannerNavProps, state: IBannerNavState) {
    super(props);
    this.state = {};
  }

  public componentDidMount(): void {}

  public render(): React.ReactElement<IBannerNavProps> {
    const { context, departmentsAsRecent } = this.props;
    /* const { departmentsAsRecent } = this.state; */
    const announcment = require("./assets/announcment.svg");
    const documents = require("./assets/folderIcon.png");
    const workflow = require("./assets/workflow.png");
    const gallery = require("./assets/gallery.svg");
    const news = require("./assets/news.svg");
    const folderOpen = require("./assets/folderOpen.svg");
    const chevron = require("./assets/chevron-down.svg");

    const ActivePage = window.location.pathname;
    const CurrentPage = ActivePage.split("/SitePages");
    const WorkflowPAge = CurrentPage[1] === "/Workflow.aspx" ? true : false;
    const AnncouncmentPage =
      CurrentPage[1] === "/Announcements.aspx" ? true : false;
    const DocumentPage = CurrentPage[1] === "/Document.aspx" ? true : false;
    const NewsPage = CurrentPage[1] === "/News.aspx" ? true : false;
    const EventsPage = CurrentPage[1] === "/Events.aspx" ? true : false;
    const DepartmentsPage =
      CurrentPage[1] === "/Departments.aspx" ? true : false;
    const PersonalPage = CurrentPage[1] === "/Personal.aspx" ? true : false;
    const GalleryPage = CurrentPage[1] === "/Gallery.aspx" ? true : false;

    const items: MenuProps["items"] = [
      {
        label: (
          <div>
            {departmentsAsRecent.map((item: any) => {
              return (
                <a
                  className="text-decoration-none text-dark"
                  href={`${context.pageContext.web.absoluteUrl
                    .split("/")
                    .slice(0, 5)
                    .join("/")}/${item.Link}/SitePages/Home.aspx`}
                >
                  <div
                    className="border-bottom border-secondary py-2"
                    style={{
                      fontWeight: 500,
                      color: "#000000",
                      fontSize: "14px",
                    }}
                  >
                    {item.Title}
                  </div>
                </a>
              );
            })}
          </div>
        ),
        key: "0",
      },
    ];

    const BannerArray = [
      {
        id: 0,
        src: workflow,
        tittle: "Workflow",
        link: `${context.pageContext.site.absoluteUrl}/SitePages/Workflow.aspx`,
        font: WorkflowPAge ? 600 : 500,
        color: WorkflowPAge ? " rgb(181, 77, 38)" : "#000000",
        size: WorkflowPAge ? "16px" : "15px",
      },
      {
        id: 1,
        src: announcment,
        tittle: "Anncouncment",
        link: `${context.pageContext.web.absoluteUrl}/SitePages/Announcements.aspx`,
        font: AnncouncmentPage ? 600 : 500,
        color: AnncouncmentPage ? " rgb(181, 77, 38)" : "#000000",
        size: AnncouncmentPage ? "16px" : "15px",
      },
      {
        id: 2,
        src: documents,
        tittle: "Document",
        link: `${context.pageContext.web.absoluteUrl}/SitePages/Document.aspx`,
        font: DocumentPage ? 600 : 500,
        color: DocumentPage ? " rgb(181, 77, 38)" : "#000000",
        size: DocumentPage ? "16px" : "15px",
      },
      {
        id: 3,
        src: gallery,
        tittle: "Gallery",
        link: `${context.pageContext.web.absoluteUrl}/SitePages/Gallery.aspx`,
        font: GalleryPage ? 600 : 500,
        color: GalleryPage ? " rgb(181, 77, 38)" : "#000000",
        size: GalleryPage ? "16px" : "15px",
      },
      {
        id: 4,
        src: news,
        tittle: "News",
        link: `${context.pageContext.web.absoluteUrl}/SitePages/News.aspx`,
        font: NewsPage ? 600 : 500,
        color: NewsPage ? " rgb(181, 77, 38)" : "#000000",
        size: NewsPage ? "16px" : "15px",
      },
      /* {
        id: 5,
        src: events,
        tittle: "Events",
        link: `${context.pageContext.web.absoluteUrl}/SitePages/Events.aspx`,
        font: EventsPage ? 600 : 500,
        color: EventsPage ? " rgb(181, 77, 38)" : "#000000",
        size: EventsPage ? "16px" : "15px",
      }, */
      {
        id: 6,
        src: folderOpen,
        tittle: "Departments",
        link: `${context.pageContext.web.absoluteUrl}/SitePages/Departments.aspx`,
        font: DepartmentsPage ? 600 : 500,
        color: DepartmentsPage ? " rgb(181, 77, 38)" : "#000000",
        size: DepartmentsPage ? "16px" : "15px",
      },
      /* {
        id: 7,
        src: folderOpen,
        tittle: "Personal",
        link: `${context.pageContext.web.absoluteUrl}/SitePages/Personal.aspx`,
        font: PersonalPage ? 600 : 500,
        color: PersonalPage ? " rgb(181, 77, 38)" : "#000000",
        size: PersonalPage ? "16px" : "15px",
      }, */
    ];
    console.log(CurrentPage);
    console.log(
      AnncouncmentPage,
      DocumentPage,
      NewsPage,
      EventsPage,
      DepartmentsPage,
      PersonalPage,
      GalleryPage
    );
    console.log(
      BannerArray.map((arr) => {
        return console.log(arr.font, arr.color);
      })
    );

    return (
      <>
        <Col xs={24} sm={24} md={0} lg={0} xl={0} xxl={0}>
          <div
            className="rounded bg-white d-flex justify-content-between p-4 shadow-lg"
            style={{
              overflowX: "scroll",
              scrollbarWidth: "thin",
              fontFamily: "Avenir Next",
            }}
          >
            <div className="m-2" style={{ minWidth: "115px" }}>
              <a
                className="text-decoration-none text-dark"
                href={`${context.pageContext.site.absoluteUrl}/SitePages/Workflow.aspx`}
              >
                <div className="d-flex justify-content-center align-items-center pb-1 h-50">
                  <img src={workflow} width={"30px"} height={"30px"} />
                </div>
                <div
                  className="d-flex justify-content-center align-items-center h-50 fs-6"
                  style={{
                    fontWeight: WorkflowPAge ? 500 : 500,
                    color: WorkflowPAge ? " rgb(181, 77, 38)" : "#000000",
                    /* fontSize: WorkflowPAge ? "16px" : "15px", */
                  }}
                >
                  Workflow
                </div>
              </a>
            </div>
            <div className="m-2" style={{ minWidth: "115px" }}>
              <a
                className="text-decoration-none text-dark"
                href={`${context.pageContext.web.absoluteUrl}/SitePages/Announcements.aspx`}
              >
                <div className="d-flex justify-content-center align-items-center pb-1 h-50">
                  <img src={announcment} />
                </div>
                <div
                  className="d-flex justify-content-center align-items-center h-50 fs-6"
                  style={{
                    fontWeight: AnncouncmentPage ? 500 : 500,
                    color: AnncouncmentPage ? " rgb(181, 77, 38)" : "#000000",
                    /* fontSize: AnncouncmentPage ? "16px" : "15px", */
                  }}
                >
                  Announcement
                </div>
              </a>
            </div>
            <div className="m-2" style={{ minWidth: "115px" }}>
              <a
                className="text-decoration-none text-dark"
                href={`${context.pageContext.web.absoluteUrl}/SitePages/Document.aspx`}
              >
                <div className="d-flex justify-content-center align-items-center pb-1 h-50">
                  <img src={documents} width={"30px"} height={"30px"} />
                </div>
                <div
                  className="d-flex justify-content-center align-items-center h-50 fs-6"
                  style={{
                    fontWeight: DocumentPage ? 500 : 500,
                    color: DocumentPage ? " rgb(181, 77, 38)" : "#000000",
                    /* fontSize: DocumentPage ? "16px" : "15px", */
                    textAlign: "center",
                  }}
                >
                  Documents Library
                </div>
              </a>
            </div>
            <div className="m-2" style={{ minWidth: "115px" }}>
              <a
                className="text-decoration-none text-dark"
                href={`${context.pageContext.web.absoluteUrl}/SitePages/Gallery.aspx`}
              >
                <div className="d-flex justify-content-center align-items-center pb-1 h-50">
                  <img src={gallery} />
                </div>
                <div
                  className="d-flex justify-content-center align-items-center h-50 fs-6"
                  style={{
                    fontWeight: GalleryPage ? 500 : 500,
                    color: GalleryPage ? " rgb(181, 77, 38)" : "#000000",
                    /* fontSize: GalleryPage ? "16px" : "15px", */
                  }}
                >
                  Gallery
                </div>
              </a>
            </div>
            <div className="m-2" style={{ minWidth: "115px" }}>
              <a
                className="text-decoration-none text-dark"
                href={`${context.pageContext.web.absoluteUrl}/SitePages/News.aspx`}
              >
                <div className="d-flex justify-content-center align-items-center pb-1 h-50">
                  <img src={news} />
                </div>
                <div
                  className="d-flex justify-content-center align-items-center h-50 fs-6"
                  style={{
                    fontWeight: NewsPage ? 500 : 500,
                    color: NewsPage ? " rgb(181, 77, 38)" : "#000000",
                    /* fontSize: NewsPage ? "16px" : "15px", */
                  }}
                >
                  News
                </div>
              </a>
            </div>
            <div className="m-2" style={{ minWidth: "115px" }}>
              <div
                className="d-flex justify-content-center align-items-center pb-1 h-50"
                style={{ cursor: "pointer" }}
              >
                <img src={folderOpen} />
              </div>
              <Dropdown menu={{ items }} placement="bottomRight">
                <a
                  className="text-decoration-none text-dark"
                  onClick={(e) => e.preventDefault()}
                >
                  <Space className="h-50 fs-6" style={{ gap: "0px" }}>
                    <div
                      className="d-flex justify-content-center align-items-center fs-6"
                      style={{
                        fontWeight: DepartmentsPage ? 500 : 500,
                        color: DepartmentsPage
                          ? " rgb(181, 77, 38)"
                          : "#000000",
                        /* fontSize: DepartmentsPage ? "16px" : "15px", */
                      }}
                    >
                      Departments
                      <img className="mb-1 ps-1" src={chevron} />
                    </div>
                  </Space>
                </a>
              </Dropdown>
            </div>
          </div>
        </Col>
        <Col xs={0} sm={0} md={24} lg={24} xl={24} xxl={24}>
          <div
            className="rounded bg-white d-flex justify-content-between p-4 shadow-lg"
            style={{ fontFamily: "Avenir Next" }}
          >
            <div>
              <a
                className="text-decoration-none text-dark"
                href={`${context.pageContext.site.absoluteUrl}/SitePages/Workflow.aspx`}
              >
                <div className="d-flex justify-content-center align-items-center pb-1 h-50">
                  <img src={workflow} width={"30px"} height={"30px"} />
                </div>
                <div
                  className="d-flex justify-content-center align-items-center h-50 fs-6"
                  style={{
                    fontWeight: WorkflowPAge ? 500 : 500,
                    color: WorkflowPAge ? " rgb(181, 77, 38)" : "#000000",
                    /* fontSize: WorkflowPAge ? "16px" : "15px", */
                  }}
                >
                  Workflow
                </div>
              </a>
            </div>
            <div>
              <a
                className="text-decoration-none text-dark"
                href={`${context.pageContext.web.absoluteUrl}/SitePages/Announcements.aspx`}
              >
                <div className="d-flex justify-content-center align-items-center pb-1 h-50">
                  <img src={announcment} />
                </div>
                <div
                  className="d-flex justify-content-center align-items-center h-50 fs-6"
                  style={{
                    fontWeight: AnncouncmentPage ? 500 : 500,
                    color: AnncouncmentPage ? " rgb(181, 77, 38)" : "#000000",
                    /* fontSize: AnncouncmentPage ? "16px" : "15px", */
                  }}
                >
                  Announcement
                </div>
              </a>
            </div>
            <div>
              <a
                className="text-decoration-none text-dark"
                href={`${context.pageContext.web.absoluteUrl}/SitePages/Document.aspx`}
              >
                <div className="d-flex justify-content-center align-items-center pb-1 h-50">
                  <img src={documents} width={"30px"} height={"30px"} />
                </div>
                <div
                  className="d-flex justify-content-center align-items-center h-50 fs-6"
                  style={{
                    fontWeight: DocumentPage ? 500 : 500,
                    color: DocumentPage ? " rgb(181, 77, 38)" : "#000000",
                    /* fontSize: DocumentPage ? "16px" : "15px", */
                  }}
                >
                  Documents Library
                </div>
              </a>
            </div>
            <div>
              <a
                className="text-decoration-none text-dark"
                href={`${context.pageContext.web.absoluteUrl}/SitePages/Gallery.aspx`}
              >
                <div className="d-flex justify-content-center align-items-center pb-1 h-50">
                  <img src={gallery} />
                </div>
                <div
                  className="d-flex justify-content-center align-items-center h-50 fs-6"
                  style={{
                    fontWeight: GalleryPage ? 500 : 500,
                    color: GalleryPage ? " rgb(181, 77, 38)" : "#000000",
                    /* fontSize: GalleryPage ? "16px" : "15px", */
                  }}
                >
                  Gallery
                </div>
              </a>
            </div>
            <div>
              <a
                className="text-decoration-none text-dark"
                href={`${context.pageContext.web.absoluteUrl}/SitePages/News.aspx`}
              >
                <div className="d-flex justify-content-center align-items-center pb-1 h-50">
                  <img src={news} />
                </div>
                <div
                  className="d-flex justify-content-center align-items-center h-50 fs-6"
                  style={{
                    fontWeight: NewsPage ? 500 : 500,
                    color: NewsPage ? " rgb(181, 77, 38)" : "#000000",
                    /*  fontSize: NewsPage ? "16px" : "15px", */
                  }}
                >
                  News
                </div>
              </a>
            </div>
            <div>
              <div
                className="d-flex justify-content-center align-items-center pb-1 h-50"
                style={{ cursor: "pointer" }}
              >
                <img src={folderOpen} />
              </div>
              <Dropdown menu={{ items }} placement="bottomRight">
                <a
                  className="text-decoration-none text-dark"
                  onClick={(e) => e.preventDefault()}
                >
                  <Space className="h-50" style={{ gap: "0px" }}>
                    <div
                      className="d-flex justify-content-center align-items-center fs-6"
                      style={{
                        fontWeight: DepartmentsPage ? 500 : 500,
                        color: DepartmentsPage
                          ? " rgb(181, 77, 38)"
                          : "#000000",
                        /* fontSize: DepartmentsPage ? "16px" : "15px", */
                      }}
                    >
                      Departments
                      <img className="mb-1 ps-1" src={chevron} />
                    </div>
                  </Space>
                </a>
              </Dropdown>
            </div>
          </div>
        </Col>
      </>
    );
  }
}
