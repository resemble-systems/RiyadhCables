import * as React from "react";
interface IPrayerProps {}
interface IPrayerState {
  PrayerData: any;
  UpcomingPrayerName: any;
  UpcomingPrayerTime: any;
}

export default class Prayer extends React.Component<
  IPrayerProps,
  IPrayerState
> {
  constructor(props: IPrayerProps, state: IPrayerState) {
    super(props);
    this.state = {
      PrayerData: [],
      UpcomingPrayerName: "",
      UpcomingPrayerTime: "",
    };
  }

  public getPrayerData = () => {
    fetch(
      `https://api.aladhan.com/v1/timingsByAddress/currentDate?address=Riyadh`
    )
      .then((res) => res.json())
      .then((response) => {
        console.log("hh", response);
        let myObject: any = response.data.timings;
        let filterPrayers: any = {};
        Object.keys({ ...myObject }).filter((d) => {
          if (
            d !== "Imsak" &&
            d !== "Sunset" &&
            d !== "Midnight" &&
            d !== "Sunrise"
          ) {
            filterPrayers[d] = myObject[d];
          }
        });

        this.setState({ PrayerData: filterPrayers }, () => {});
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount = () => {
    function getDateTime() {
      var now: any = new Date();
      var hour: any = now.getHours();
      var minute: any = now.getMinutes();
      if (hour.toString().length === 1) {
        hour = "0" + hour;
      }
      if (minute.toString().length === 1) {
        minute = "0" + minute;
      }
      var dateTime = `${hour}.${minute}`;
      return dateTime;
    }
    setInterval(() => {
      let timeList = Object.keys(this.state.PrayerData).map((key) => {
        return this.state.PrayerData[key];
      });

      let mapTimeList = timeList.map((time) => time.split(":").join("."));
      mapTimeList = mapTimeList.sort();

      let currentTime = getDateTime();

      let setTime = null;
      for (let i = 0; i < mapTimeList.length; i++) {
        if (
          currentTime < mapTimeList[i] &&
          currentTime <= mapTimeList[mapTimeList.length - 1]
        ) {
          setTime = mapTimeList[i];

          break;
        }
      }
      if (!setTime) {
        setTime = mapTimeList[0];
      }

      if (setTime) {
        const getKeyByValue = (object: any, value: any) => {
          const keys = Object.keys(object);
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (object[key] == value) {
              return key;
            }
          }
        };
        let prayerName = getKeyByValue(
          this.state.PrayerData,
          setTime.split(".").join(":")
        );

        this.setState({
          UpcomingPrayerTime: setTime.split(".").join(":"),
          UpcomingPrayerName: prayerName,
        });
      }
    }, 1000);
    this.getPrayerData();
  };

  public render(): React.ReactElement<{}> {
    return (
      <>
        <div style={{ fontFamily: "Avenir Next" }}>
          <div>
            <div>
              <small style={{ fontWeight: "600" }}>Prayer Time</small>
            </div>
            <div className="fw-bold" style={{ color: "rgb(181, 77, 38)" }}>
              {/* UPCOMING PRAYER- */}
              {this.state.UpcomingPrayerName.toUpperCase()}:
              {this.state.UpcomingPrayerTime}
            </div>
          </div>
        </div>
      </>
    );
  }
}
