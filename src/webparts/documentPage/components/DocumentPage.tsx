import * as React from "react";
import { IDocumentPageProps } from "./IDocumentPageProps";
import Polices from "./polices/Polices";
import { SPComponentLoader } from "@microsoft/sp-loader";

interface IDocumentPageState {
  listName: string;
}

export default class DocumentPage extends React.Component<
  IDocumentPageProps,
  IDocumentPageState
> {
  public constructor(props: IDocumentPageProps, state: IDocumentPageState) {
    super(props);
    this.state = {
      listName: "",
    };
  }
  public render(): React.ReactElement<IDocumentPageProps> {
    const bootstarp5CSS =
      "https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css";
    const fa =
      "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css";
    let Avenir = `${this.props.context.pageContext.site.absoluteUrl}/SiteAssets/font/styles.css`;
    /* const Montserrat =
      "https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;500;600;700;800;900&family=Open+Sans:wght@600&display=swap";
    const Roboto =
      "https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap"; */
    SPComponentLoader.loadCss(bootstarp5CSS);
    SPComponentLoader.loadCss(fa);
    SPComponentLoader.loadCss(Avenir);
    /*  SPComponentLoader.loadCss(Montserrat);
    SPComponentLoader.loadCss(Roboto); */
    const { context } = this.props;
    return <Polices context={context} />;
  }
}
