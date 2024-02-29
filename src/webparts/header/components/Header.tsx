import * as React from "react";
import { IHeaderProps } from "./IHeaderProps";
import { SPComponentLoader } from "@microsoft/sp-loader";
import Navbar from "./Navbar/Navbar";
import "antd/dist/reset.css";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import Loader from "../../../commonComponents/loader/Loader";
import "../../global.css";

interface IHeaderState {
  AdminUser: any;
  canvasMargin: any;
  isLoading: boolean;
}

export default class Header extends React.Component<
  IHeaderProps,
  IHeaderState
> {
  public constructor(props: IHeaderProps, state: IHeaderState) {
    super(props);
    this.state = {
      AdminUser: false,
      canvasMargin: null,
      isLoading: false,
    };
  }

  public componentDidMount() {
    setTimeout(() => {
      const ScrollerContainer =
        document.getElementsByClassName("ScrollerContainer");
      console.log("ScrollerContainer", ScrollerContainer);
      const lastPrice = document.getElementsByClassName("last");
      console.log("lastPrice", lastPrice);
    }, 3000);
    const canvas: any = document?.getElementsByClassName("l_b_50a7110f");
    console.log(canvas, "canvas");
    this.setState({ canvasMargin: canvas });

    const appBar: any = document?.getElementById("sp-appBar");
    appBar.style.display = "none";

    const paddingCanvas: any = document.getElementsByClassName("k_c_50a7110f");
    console.log("paddingCanvas", paddingCanvas);

    const spSiteHeader: any = document?.getElementById("spSiteHeader");
    spSiteHeader
      ? (spSiteHeader.style.display = "none")
      : console.log("spSiteHeader", spSiteHeader);

    const spLeftNav: any = document?.getElementById("spLeftNav");
    spLeftNav
      ? (spLeftNav.style.display = "none")
      : console.log("spLeftNav", spLeftNav);

    const spAppBar: any = document?.getElementById("sp-appBar");
    spAppBar
      ? (spAppBar.style.display = "none")
      : console.log("spAppBar", spAppBar);

    const SuiteNavWrapper: any = document?.getElementById(
      "SuiteNavPlaceholder"
    );
    SuiteNavWrapper
      ? (SuiteNavWrapper.style.display = "none")
      : console.log("spAppBar", SuiteNavWrapper);

    const canvaSection: any = document?.getElementsByClassName(
      "f_a_50a7110f e_a_50a7110f"
    );
    canvaSection.length > 0
      ? console.log(canvaSection, "canvaSection")
      : console.log(canvaSection, "canvaSection");
    const { context } = this.props;
    context.spHttpClient
      .get(
        `${context.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('Admin')/items?$select=*&$expand=AttachmentFiles`,
        SPHttpClient.configurations.v1
      )
      .then((res: SPHttpClientResponse) => {
        console.log("listItems Success");
        return res.json();
      })
      .then((listItems: any) => {
        console.log("Admin listItems", listItems);
        const approvedItems: any = listItems.value.filter(
          (items: any) => items.ApprovalStatus === "Approved"
        );
        let adminList = approvedItems.map((item: any) => item.Title);
        console.log("adminList", adminList);
        this.setState({ AdminUser: adminList });
        if (adminList.length > 0) {
          let filteredAdminList = adminList.filter(
            (item: any) => item === context.pageContext.user.loginName
          );
          console.log("Current User", context.pageContext.user.loginName);
          console.log("filteredAdminList", filteredAdminList);
          const spCommandBar: any = document?.getElementById("spCommandBar");
          if (filteredAdminList.length === 0) {
            spCommandBar.style.display = "none";
            this.setState({ AdminUser: false });
            console.log("Non Admin User");
          } else {
            console.log("Admin User");
            this.setState({ AdminUser: true });
          }
        } else {
          console.log("Admin User List Not Found");
        }
      });
    setTimeout(() => this.setState({ isLoading: false }), 2000);
  }

  public render(): React.ReactElement<IHeaderProps> {
    let bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    let fa =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
    let Avenir = `${this.props.context.pageContext.site.absoluteUrl}/SiteAssets/font/style.css`;
    console.log(`Props url ${this.props.context.pageContext.web.absoluteUrl}`);
    SPComponentLoader.loadCss(bootstarp5CSS);
    SPComponentLoader.loadCss(fa);
    SPComponentLoader.loadCss(Avenir);
    const { context } = this.props;
    const { isLoading } = this.state;
    console.log(this.state.canvasMargin, "canvasMargin");

    return (
      <>
        {isLoading ? (
          <Loader row={2} avatar={true} skeletonCount={1} />
        ) : (
          <>
            <Navbar context={context} AdminUser={this.state.AdminUser} />
          </>
        )}
      </>
    );
  }
}
