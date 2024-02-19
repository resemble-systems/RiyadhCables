import * as React from "react";
interface IWeatherProps {}
interface IWeatherState {
  weatherValue: any;
  weatherDescription: any;
  weatherPlace: any;
  weatherIcon: any;
  weatherImage: any;
}

export default class Weather extends React.Component<
  IWeatherProps,
  IWeatherState
> {
  constructor(props: IWeatherProps, state: IWeatherState) {
    super(props);
    this.state = {
      weatherValue: "",
      weatherDescription: "",
      weatherPlace: "",
      weatherIcon: "",
      weatherImage: "",
    };
  }

  componentDidMount = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      let lat = position.coords.latitude;
      let long = position.coords.longitude;
      fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=aaa2cbfe889773ba4e86bb1e4d8597cf`
      )
        .then((res) => res.json())
        .then((res) => {
          console.log(
            "Weather",
            res.main.temp,
            res.weather[0].description.toUpperCase(),
            res.weather[0],
            res.name,
            res.weather[0].icon,
            res
          );
          const weatherValue = (res.main.temp - 273.15).toFixed(0);
          const weatherDescription = res.weather[0].description.toUpperCase();
          const weatherPlace = res.name;
          const icon = res.weather[0].icon;
          console.log("ICON", icon);
          let weatherImage: any;
          switch (icon) {
            case "01d":
              weatherImage = require("./sun.png");
              console.log("Case 1", weatherImage);
              break;
            case "01n":
              weatherImage = require("./sun.png");
              console.log("Case 1", weatherImage);
              break;
            case "02d":
              weatherImage = require("./clear-sky.png");
              console.log("Case 2", weatherImage);
              break;
            case "02n":
              weatherImage = require("./clear-sky.png");
              console.log("Case 2", weatherImage);
              break;
            case "03d":
              weatherImage = require("./clouds.png");
              console.log("Case 3", weatherImage);
              break;
            case "04d":
              weatherImage = require("./clouds.png");
              console.log("Case 3", weatherImage);
              break;
            case "03n":
              weatherImage = require("./clouds.png");
              console.log("Case 4", weatherImage);
              break;
            case "04n":
              weatherImage = require("./clouds.png");
              console.log("Case 4", weatherImage);
              break;
            case "09d":
              weatherImage = require("./rain.png");
              console.log("Case 5", weatherImage);
              break;
            case "10d":
              weatherImage = require("./rain.png");
              console.log("Case 5", weatherImage);
              break;
            case "09n":
              weatherImage = require("./rain.png");
              console.log("Case 6", weatherImage);
              break;
            case "10n":
              weatherImage = require("./rain.png");
              console.log("Case 6", weatherImage);
              break;
            case "11d":
              weatherImage = require("./thunderstorm.png");
              console.log("Case 7", weatherImage);
              break;
            case "11n":
              weatherImage = require("./thunderstorm.png");
              console.log("Case 7", weatherImage);
              break;
            case "13d":
              weatherImage = require("./snowman.png");
              console.log("Case 8", weatherImage);
              break;
            case "13n":
              weatherImage = require("./snowman.png");
              console.log("Case 8", weatherImage);
              break;
            case "50d":
              weatherImage = require("./mist.png");
              console.log("Case 9", weatherImage);
              break;
            case "50n":
              weatherImage = require("./mist.png");
              console.log("Case 9", weatherImage);
              break;
            default:
              weatherImage = require("./weather.png");
              console.log("Default", weatherImage);
              break;
          }

          this.setState({
            weatherValue,
            weatherDescription,
            weatherPlace,
            weatherImage,
          });
        });
    });
  };

  public render(): React.ReactElement<{}> {
    const { weatherValue, weatherDescription, weatherPlace } = this.state;
    console.log("weatherImage", this.state.weatherImage);
    return (
      <>
        <div
          className="d-flex justify-content-start align-items-center"
          style={{ fontFamily: "Avenir Next" }}
        >
          <div className="d-flex justify-content-start align-items-center">
            <div>
              <img
                src={this.state.weatherImage}
                width="40px"
                height="40px"
                /* className="rounded-circle" */
              />
            </div>
            <div
              className="ps-2"
              style={{
                fontWeight: "400",
                fontSize: "45px",
              }}
            >
              {weatherValue}&deg;
            </div>
          </div>
          <div className="d-flex justify-content-between ps-2" style={{}}>
            <div>
              <div>
                <small style={{ fontWeight: "600" }}>{weatherPlace}</small>
              </div>
              <div className="fw-bold">{weatherDescription}</div>
            </div>
            <div
              className="ps-2 d-flex align-items-center"
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </>
    );
  }
}
