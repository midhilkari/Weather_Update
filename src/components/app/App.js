import React from "react";
import './App.css';
import Weather from '../../components/weather/weather.component';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../components/weather/weather-icons/css/weather-icons.css';
import Form from '../../components/form/form.component';



const API_KEY = '62a01dc6786ac94ea6ffb947cab0d995';

class App extends React.Component{
  constructor(){
    super();
    this.state={
      city: undefined,
      country: undefined,
      icon: undefined,
      main: undefined,
      celsius: undefined,
      temp_max: undefined,
      temp_min: undefined,
      description : "",
      error : false,
      errorCity:false
    };
    

    this.weatherIcon= {
      Thunderstorm:"wi-thunderstorm",
      Drizzle:"wi-sleet",
      Rain:"wi-storm-showers",
      Snow:"wi-snow",
      Atmosphere:"wi-fog",
      Clear:"wi-day-sunny",
      Clouds:"wi-day-fog",
    };
  }

  getWeather = async(e)=>{

    e.preventDefault();

    const city = e.target.elements.city.value;
    const country = e.target.elements.country.value;

    if(city && country){
      console.log("about to call")
      const api_call = await fetch('http://api.openweathermap.org/data/2.5/find/?q='+city+','+country+'&appid=62a01dc6786ac94ea6ffb947cab0d995');
      console.log("fetched API response")
      const response = await api_call.json();
      console.log(response);
      const responseCount = response.count;
      console.log({responseCount})
      if(responseCount!=0){
        const weatherIcon = await this.get_weatherIcon(response.list[0].weather[0].id);
        console.log({weatherIcon})
        this.setState({
          city:response.list[0].name + ' '+response.list[0].sys.country,
          celsius: this.calCelsius(response.list[0].main.temp),
          temp_max: this.calCelsius(response.list[0].main.temp_max),
          temp_min: this.calCelsius(response.list[0].main.temp_min),
          description: response.list[0].weather[0].description,
          icon: weatherIcon
        });
      }else{
        this.setState({error:true});
      }
      
    }else{
      this.setState({error:true});
    }
  }

  calCelsius(temp){
    console.log("got temp");
    let cell = Math.floor(temp - 273.15)
    console.log("converted to celsius");
    return cell;
  }
  
  get_weatherIcon(rangeId){
    console.log(rangeId);
    let weatherIcon = null;
    switch(true){
      case rangeId >= 200 && rangeId <= 232:
        weatherIcon = this.weatherIcon.Thunderstorm
        break;
      case rangeId >= 300 && rangeId <= 321:
        weatherIcon = this.weatherIcon.Drizzle
        break;
      case rangeId >= 500 && rangeId <= 532:
        weatherIcon = this.weatherIcon.Rain
        break;
      case rangeId >= 600 && rangeId <= 622:
        weatherIcon = this.weatherIcon.Snow
        break;
      case rangeId >= 701 && rangeId <= 781:
        weatherIcon = this.weatherIcon.Atmosphere
        break;
      case rangeId === 800:
        weatherIcon = this.weatherIcon.Clear
        break;
      case rangeId >= 800 && rangeId <= 804:
        console.log(rangeId);
        weatherIcon = this.weatherIcon.Clouds
        console.log({state: this.state})
        break;
      default:
        weatherIcon = this.weatherIcon.Clear
    }
    return weatherIcon;
  }



  render(){
    console.log({state: this.state})
    return(
      <div className="App">
        <Form loadweather={this.getWeather} error={this.state.error}/>
        <Weather 
        city={this.state.city} 
        country={this.state.country}
        icon= {this.state.icon}
        temp_celsius={this.state.celsius}
        temp_max={this.state.temp_max}
        temp_min={this.state.temp_min}
        description={this.state.description}
        
        />
      </div>
    );
  }
}

export default App;
