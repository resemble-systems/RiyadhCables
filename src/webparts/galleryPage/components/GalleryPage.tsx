import * as React from "react";
import { IGalleryPageProps } from "./IGalleryPageProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { Row, Col } from "antd";
import "antd/dist/reset.css";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import EmptyCard from "../../../commonComponents/emptyCard/EmptyCard";
import "../../global.css";
export interface IGalleryPageState {
  galleryAsSortedRecent: any;
  isOpen: any;
  photoIndex: any;
  filterAz: any;
  filterZa: any;
  filterEventaz: any;
  filterEventza: any;
  filterLocationaz: any;
  filterlocationza: any;
  filterRecent: any;
  filterOldest: any;
  searchText: any;
  isScreenWidth: any;
}

export default class GalleryPage extends React.Component<
  IGalleryPageProps,
  IGalleryPageState
> {
  public scrollRef: any;
  public constructor(props: IGalleryPageProps, state: IGalleryPageState) {
    super(props);
    this.state = {
      isOpen: false,
      photoIndex: 0,
      galleryAsSortedRecent: [],
      filterAz: true,
      filterZa: false,
      filterEventaz: false,
      filterEventza: false,
      filterLocationaz: false,
      filterlocationza: false,
      filterRecent: true,
      filterOldest: false,
      searchText: "",
      isScreenWidth: 800,
    };
    this.scrollRef = React.createRef();
  }
  public componentDidMount(): void {
    setTimeout(() => {
      console.log("scrollRef", this.scrollRef);
      if (this.scrollRef)
        this.scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 1000);
    let ScreenWidth: any = window.screen.width;
    console.log(ScreenWidth, "ScreenWidth");
    this.setState({ isScreenWidth: ScreenWidth });
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('Gallery')/Items?$select=Id,Event,Keywords,Location,Title,Created,Date,ApprovalStatus,FileRef,Created/FileRef &$orderby=Created desc`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        console.log("listItems Success");
        return res.json();
      })
      .catch((err) => {
        console.log("Gallery", err);
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
        console.log("galleryAsSortedRecent", sortedItems);
        this.setState({ galleryAsSortedRecent: sortedItems });
      });
  }
  private isImage(fileUrl: string): boolean {
    return (
      fileUrl.search(
        /\.(jpe?g|png|bmp|gif|tiff|aiff|eps|raw|cr2|nef|orf|sr2|apng|avif|jfif|pjpeg|pjp|svg|webp|ico|cur)$/i
      ) !== -1
    );
  }
  public sortAZ: any = () => {
    let BasicState: any = this.state.galleryAsSortedRecent;
    console.log("BasicState", BasicState);
    let sortAZData: any = BasicState.sort((a: any, b: any) => {
      const aName = a.FileRef.split("/").slice(
        a.FileRef.split("/").length - 1
      )[0];
      const bName = b.FileRef.split("/").slice(
        a.FileRef.split("/").length - 1
      )[0];
      if (aName > bName) {
        return 1;
      }
      if (aName < bName) {
        return -1;
      }
      return 0;
    });
    console.log(sortAZData, "Sortingssss");
    this.setState({
      galleryAsSortedRecent: sortAZData,
      filterAz: true,
      filterZa: false,
      filterEventaz: false,
      filterEventza: false,
      filterLocationaz: false,
      filterlocationza: false,
      filterRecent: false,
      filterOldest: false,
    });
  };
  public sortZA: any = () => {
    let BasicState: any = this.state.galleryAsSortedRecent;
    console.log("BasicState", BasicState);
    let sortZAData: any = BasicState.sort((a: any, b: any) => {
      const aName = a.FileRef.split("/").slice(
        a.FileRef.split("/").length - 1
      )[0];
      const bName = b.FileRef.split("/").slice(
        a.FileRef.split("/").length - 1
      )[0];
      if (bName > aName) {
        return 1;
      }
      if (bName < aName) {
        return -1;
      }
      return 0;
    });
    console.log(sortZAData, "Sortingssss");
    this.setState({
      galleryAsSortedRecent: sortZAData,
      filterAz: false,
      filterZa: true,
      filterEventaz: false,
      filterEventza: false,
      filterLocationaz: false,
      filterlocationza: false,
      filterRecent: false,
      filterOldest: false,
    });
  };
  public sortEventaz: any = () => {
    let BasicState: any = this.state.galleryAsSortedRecent;
    console.log("BasicState", BasicState);
    let sortEventazData: any = BasicState.sort((a: any, b: any) => {
      if (a.Event > b.Event) {
        return 1;
      }
      if (a.Event < b.Event) {
        return -1;
      }
      return 0;
    });
    console.log(sortEventazData, "Sortingssss");
    this.setState({
      galleryAsSortedRecent: sortEventazData,
      filterAz: false,
      filterZa: false,
      filterEventaz: true,
      filterEventza: false,
      filterLocationaz: false,
      filterlocationza: false,
      filterRecent: false,
      filterOldest: false,
    });
  };
  public sortEventza: any = () => {
    let BasicState: any = this.state.galleryAsSortedRecent;
    console.log("BasicState", BasicState);
    let sortEventzaData: any = BasicState.sort((a: any, b: any) => {
      if (b.Event > a.Event) {
        return 1;
      }
      if (b.Event < a.Event) {
        return -1;
      }
      return 0;
    });
    console.log(sortEventzaData, "Sortingssss");
    this.setState({
      galleryAsSortedRecent: sortEventzaData,
      filterAz: false,
      filterZa: false,
      filterEventaz: false,
      filterEventza: true,
      filterLocationaz: false,
      filterlocationza: false,
      filterRecent: false,
      filterOldest: false,
    });
  };
  public sortLocationaz: any = () => {
    let BasicState: any = this.state.galleryAsSortedRecent;
    console.log("BasicState", BasicState);
    let sortLocationazData: any = BasicState.sort((a: any, b: any) => {
      if (a.Location > b.Location) {
        return 1;
      }
      if (a.Location < b.Location) {
        return -1;
      }
      return 0;
    });
    console.log(sortLocationazData, "Sortingssss");
    this.setState({
      galleryAsSortedRecent: sortLocationazData,
      filterAz: false,
      filterZa: false,
      filterEventaz: false,
      filterEventza: false,
      filterLocationaz: true,
      filterlocationza: false,
      filterRecent: false,
      filterOldest: false,
    });
  };
  public sortLocationza: any = () => {
    let BasicState: any = this.state.galleryAsSortedRecent;
    console.log("BasicState", BasicState);
    let sortLocationzaData: any = BasicState.sort((a: any, b: any) => {
      if (b.Location > a.Location) {
        return 1;
      }
      if (b.Location < a.Location) {
        return -1;
      }
      return 0;
    });
    console.log(sortLocationzaData, "Sortingssss");
    this.setState({
      galleryAsSortedRecent: sortLocationzaData,
      filterAz: false,
      filterZa: false,
      filterEventaz: false,
      filterEventza: false,
      filterLocationaz: false,
      filterlocationza: true,
      filterRecent: false,
      filterOldest: false,
    });
  };
  public sortRecent: any = () => {
    let BasicState: any = this.state.galleryAsSortedRecent;
    console.log("BasicState", BasicState);
    let sortRecentData: any = BasicState.sort(
      (a: any, b: any) =>
        new Date(b.Created).getTime() - new Date(a.Created).getTime()
    );
    console.log(sortRecentData, "Sortingssss");
    this.setState({
      galleryAsSortedRecent: sortRecentData,
      filterRecent: true,
      filterAz: false,
      filterZa: false,
      filterEventaz: false,
      filterEventza: false,
      filterLocationaz: false,
      filterlocationza: false,
      filterOldest: false,
    });
  };
  public sortOldest: any = () => {
    let BasicState: any = this.state.galleryAsSortedRecent;
    console.log("BasicState", BasicState);
    let sortOldData: any = BasicState.sort(
      (a: any, b: any) =>
        new Date(a.Created).getTime() - new Date(b.Created).getTime()
    );
    console.log(sortOldData, "Sortingssss");
    this.setState({
      galleryAsSortedRecent: sortOldData,
      filterRecent: false,
      filterAz: false,
      filterZa: false,
      filterEventaz: false,
      filterEventza: false,
      filterLocationaz: false,
      filterlocationza: false,
      filterOldest: true,
    });
  };

  public render(): React.ReactElement<IGalleryPageProps> {
    let bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    /*  let font =
    "https://fonts.googleapis.com/css2?family=Montserrat:wght@100&family=Roboto:wght@100;300;400;500;700;900&display=swap";*/
    let fa =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
    let Avenir = `${this.props.context.pageContext.web.absoluteUrl}/SiteAssets/font/style.css`;
    SPComponentLoader.loadCss(bootstarp5CSS);
    /*  SPComponentLoader.loadCss(font); */
    SPComponentLoader.loadCss(fa);
    SPComponentLoader.loadCss(Avenir);
    const {
      isOpen,
      photoIndex,
      galleryAsSortedRecent,
      filterAz,
      filterZa,
      filterEventaz,
      filterEventza,
      filterLocationaz,
      filterlocationza,
      filterRecent,
      filterOldest,
      searchText,
    } = this.state;
    const filteredItem: [] = galleryAsSortedRecent.map((gallery: any) => {
      return gallery.FileRef;
    });
    const images = filteredItem;
    console.log(images, "Gallery Items");
    let index = 0;

    return (
      <div>
        <div
          className="detailsContainer px-0"
          style={{
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
                <div
                  className="d-flex align-items-center justify-content-between w-100 h-100"
                  style={{ fontFamily: "Avenir Next" }}
                >
                  <h4 className="d-flex align-items-center justify-content-start ps-4 w-50">
                    <a href={`${this.props.context.pageContext.web.absoluteUrl}`}>
                      <img
                        src={require("../assets/arrow-left.svg")}
                        alt="folder"
                        height="20px"
                        width="50px"
                      />
                    </a>
                    <img
                      src={require("../assets/folder.svg")}
                      alt="folder"
                      height="20px"
                      width="50px"
                    />
                    Gallery
                  </h4>
                  <div className="d-flex align-items-center justify-content-end px-3 w-50">
                    <div className="input-group flex-nowrap pe-3">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search...."
                        aria-label="Username"
                        value={this.state.searchText}
                        onChange={(e) => {
                          var format =
                            /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;

                          if (!format.test(e.target.value)) {
                            this.setState({ searchText: e.target.value });
                          }
                        }}
                        style={{ cursor: "pointer" }}
                        aria-describedby="addon-wrapping"
                      />
                      <span
                        className="input-group-text text-white"
                        style={{
                          cursor: "pointer",
                          backgroundColor: " rgb(181, 77, 38)",
                        }}
                        onClick={() => {
                          this.setState({ searchText: "" });
                        }}
                        id="addon-wrapping"
                      >
                        <b>X</b>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col xs={0} sm={0} md={0} lg={6}>
              <div
                className="me-3"
                style={{
                  height: "560px",
                  boxShadow: "1px 1px 18px 0 rgba(0, 0, 0, 0.16)",
                  backgroundColor: " #fff",
                  borderRadius: "5px",
                }}
              >
                <div
                  className="mt-3 pt-4"
                  style={{ fontFamily: "Avenir Next" }}
                >
                  <ul style={{ marginBottom: "0px", display: "none" }}>
                    <li
                      className="my-3"
                      style={{
                        color: filterAz ? " rgb(181, 77, 38)" : "#495866",
                      }}
                    >
                      <div
                        style={{
                          color: filterAz ? " rgb(181, 77, 38)" : "#495866",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          this.sortAZ();
                        }}
                      >
                        Sort A-Z
                      </div>
                    </li>
                    <li
                      className="my-3"
                      style={{
                        color: filterZa ? " rgb(181, 77, 38)" : "#495866",
                      }}
                    >
                      <div
                        style={{
                          color: filterZa ? " rgb(181, 77, 38)" : "#495866",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          this.sortZA();
                        }}
                      >
                        Sort Z-A
                      </div>
                    </li>
                    <li
                      className="my-3"
                      style={{
                        color: filterEventaz ? " rgb(181, 77, 38)" : "#495866",
                      }}
                    >
                      <div
                        style={{
                          color: filterEventaz
                            ? " rgb(181, 77, 38)"
                            : "#495866",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          this.sortEventaz();
                        }}
                      >
                        Sort By Event A-Z
                      </div>
                    </li>
                    <li
                      className="my-3"
                      style={{
                        color: filterEventza ? " rgb(181, 77, 38)" : "#495866",
                      }}
                    >
                      <div
                        style={{
                          color: filterEventza
                            ? " rgb(181, 77, 38)"
                            : "#495866",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          this.sortEventza();
                        }}
                      >
                        Sort By Event Z-A
                      </div>
                    </li>
                    <li
                      className="my-3"
                      style={{
                        color: filterLocationaz
                          ? " rgb(181, 77, 38)"
                          : "#495866",
                      }}
                    >
                      <div
                        style={{
                          color: filterLocationaz
                            ? " rgb(181, 77, 38)"
                            : "#495866",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          this.sortLocationaz();
                        }}
                      >
                        Sort By Location A-Z
                      </div>
                    </li>
                    <li
                      className="my-3"
                      style={{
                        color: filterlocationza
                          ? " rgb(181, 77, 38)"
                          : "#495866",
                      }}
                    >
                      <div
                        style={{
                          color: filterlocationza
                            ? " rgb(181, 77, 38)"
                            : "#495866",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          this.sortLocationza();
                        }}
                      >
                        Sort By Location Z-A
                      </div>
                    </li>
                  </ul>
                  <ul style={{ paddingLeft: "12px" }}>
                    <div style={{ color: "#495866" }}>
                      Sort By Picture Captured
                    </div>

                    <li
                      className="my-3 mx-4"
                      style={{
                        color: filterRecent ? " rgb(181, 77, 38)" : "#495866",
                      }}
                    >
                      <div
                        style={{
                          color: filterRecent ? " rgb(181, 77, 38)" : "#495866",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          this.sortRecent();
                        }}
                      >
                        Ascending
                      </div>
                    </li>

                    <li
                      className="my-3 mx-4"
                      style={{
                        color: filterOldest ? " rgb(181, 77, 38)" : "#495866",
                      }}
                    >
                      <div
                        style={{
                          color: filterOldest ? " rgb(181, 77, 38)" : "#495866",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          this.sortOldest();
                        }}
                      >
                        Descending
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
            <Col xs={24} sm={24} md={24} lg={18}>
              <div
                className="w-100 my-3 px-3 py-4"
                style={{
                  height: "560px",
                  boxShadow: "1px 1px 18px 0 rgba(0, 0, 0, 0.16)",
                  backgroundColor: " #fff",
                  borderRadius: "5px",
                }}
              >
                <div
                  className="row row-cols-1 g-1 row-cols-md-3"
                  style={{
                    height: "515px",
                    overflowY: "scroll",
                    scrollbarWidth: "thin",
                  }}
                >
                  {galleryAsSortedRecent?.length > 0 ? (
                    galleryAsSortedRecent
                      ?.filter((item: any) => {
                        return (
                          item?.Title?.toLowerCase().match(
                            searchText.toLowerCase()
                          ) ||
                          item?.Location?.toLowerCase().match(
                            searchText.toLowerCase()
                          ) ||
                          item?.Event?.toLowerCase().match(
                            searchText.toLowerCase()
                          ) ||
                          item?.Keyword?.toLowerCase().match(
                            searchText.toLowerCase()
                          ) ||
                          item?.Created?.toLowerCase().match(
                            searchText.toLowerCase()
                          )
                        );
                      })
                      ?.map((item: any, id = index++) => {
                        return (
                          <div className="col" style={{ cursor: "pointer" }}>
                            <div
                              style={{ height: "200px", overflow: "hidden" }}
                            >
                              <div
                                className="d-flex justify-content-center align-items-center h-100"
                                style={{
                                  backgroundColor: "rgba(210, 210, 210, 0.2)",
                                }}
                              >
                                {this.isImage(item.FileRef) && (
                                  <img
                                    src={item.FileRef}
                                    width="100%"
                                    alt="Gallery"
                                    onClick={() => {
                                      this.setState({
                                        isOpen: true,
                                        photoIndex: id,
                                      });
                                    }}
                                  />
                                )}
                                {!this.isImage(item.FileRef) && (
                                  <video
                                    width="100%"
                                    height="200px"
                                    autoPlay={true}
                                    muted={true}
                                    controls
                                  >
                                    <source src={item.FileRef} />
                                  </video>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <EmptyCard />
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </div>
        {isOpen && (
          <Lightbox
            mainSrc={images[photoIndex]}
            nextSrc={images[(photoIndex + 1) % images.length]}
            prevSrc={images[(photoIndex + images.length - 1) % images.length]}
            onCloseRequest={() => this.setState({ isOpen: false })}
            onMovePrevRequest={() =>
              this.setState({
                photoIndex: (photoIndex + images.length - 1) % images.length,
              })
            }
            onMoveNextRequest={() =>
              this.setState({
                photoIndex: (photoIndex + 1) % images.length,
              })
            }
          />
        )}
      </div>
    );
  }
}
