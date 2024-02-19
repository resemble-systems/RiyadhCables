import * as React from "react";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import styles from "./Gallery.module.scss";
import { UserConsumer } from "../../../../service/UserContext";
import CommonLayout from "../../../../commonComponents/layout/Layout";
import CommonCard from "../../../../commonComponents/commonCard";
import EmptyCard from "../../../../commonComponents/emptyCard/EmptyCard";

interface IGalleryProps {
  context: WebPartContext;
  marginRight: boolean;
}
interface IGalleryState {
  isOpen: any;
  photoIndex: any;
  galleryAsSorted: any;
  filterred: any;
  FilteredItem: any;
}

export default class Gallery extends React.Component<
  IGalleryProps,
  IGalleryState
> {
  public constructor(props: IGalleryProps, state: IGalleryState) {
    super(props);
    this.state = {
      isOpen: false,
      photoIndex: 0,
      galleryAsSorted: [],
      filterred: [],
      FilteredItem: [],
    };
  }
  public componentDidMount(): void {
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
      .then((listItems: any) => {
        console.log("Res listItems", listItems);
        const approvedItems: any = listItems.value.filter(
          (items: any) => items.ApprovalStatus === "Approved"
        );
        const sortedItems: any = approvedItems.sort(
          (a: any, b: any) =>
            new Date(b.Created).getTime() - new Date(a.Created).getTime()
        );
        console.log("galleryAsSorted", sortedItems);
        this.setState({ galleryAsSorted: sortedItems });
      });
  }

  private isImage(fileUrl: string): boolean {
    return (
      fileUrl.search(
        /\.(jpe?g|png|bmp|gif|tiff|aiff|eps|raw|cr2|nef|orf|sr2|apng|avif|jfif|pjpeg|pjp|svg|webp|ico|cur)$/i
      ) !== -1
    );
  }

  public render(): React.ReactElement<IGalleryProps> {
    const { isOpen, photoIndex, galleryAsSorted, FilteredItem } = this.state;
    const { context } = this.props;
    const filteredItem: [] = galleryAsSorted
      .slice(0, 6)
      .map((galleryItem: any) => {
        return galleryItem.FileRef;
      });
    const images = filteredItem;
    console.log(images, "Gallery Items");
    let index = 0;

    return (
      <UserConsumer>
        {(UserDetails: { name: string; email: string; isAdmin: boolean }) => {
          return (
            <CommonLayout lg={16} xl={16}>
              <CommonCard
                cardIcon={require("../../assets/gallery.svg")}
                cardTitle={"Media Gallery"}
                footerText={"View All"}
                footerVisible={true}
                rightPanelVisible={false}
                redirectionLink={`${context.pageContext.web.absoluteUrl}/SitePages/Gallery.aspx`}
                rightPanelElement={<></>}
              >
                {galleryAsSorted?.length > 0 ? (
                  <div
                    className={`row row-cols-1 g-1 row-cols-md-3 ${styles.galleryContainer}`}
                  >
                    {galleryAsSorted
                      .slice(0, 6)
                      .map((item: any, id = index++) => {
                        return (
                          <div
                            className="col"
                            style={{
                              cursor: "pointer",
                              fontFamily: "Avenir Next",
                            }}
                          >
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
                                        FilteredItem: [
                                          ...FilteredItem,
                                          item.FileRef,
                                        ],
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
                      })}
                    {isOpen && (
                      <Lightbox
                        mainSrc={images[photoIndex]}
                        nextSrc={images[(photoIndex + 1) % images.length]}
                        prevSrc={
                          images[
                            (photoIndex + images.length - 1) % images.length
                          ]
                        }
                        onCloseRequest={() => this.setState({ isOpen: false })}
                        onMovePrevRequest={() =>
                          this.setState({
                            photoIndex:
                              (photoIndex + images.length - 1) % images.length,
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
