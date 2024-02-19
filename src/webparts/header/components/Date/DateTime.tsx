import * as React from "react";

export default class DateTime extends React.Component<{}> {
  public today = new Date();
  public monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  public weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  public date = ("0" + this.today.getDate()).slice(-2);
  public month = this.monthNames[this.today.getMonth()];
  public year = this.today.getFullYear();
  public day = this.weekdays[this.today.getDay()];

  public render(): React.ReactElement<{}> {
    return (
      <>
        <div
          className="d-flex justify-content-start align-items-center"
          style={{ fontFamily: "Avenir Next" }}
        >
          <div
            className=""
            style={{
              fontWeight: "500",
              fontSize: "45px",
            }}
          >
            {this.date}
          </div>
          <div className="ps-2" style={{}}>
            <div>
              <small style={{ fontWeight: "600" }}>{this.day}</small>
            </div>
            <div className="fw-bold">
              {this.month} {this.year}
            </div>
          </div>
        </div>
      </>
    );
  }
}
