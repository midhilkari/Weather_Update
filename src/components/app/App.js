import React from "react";
import './App.css';
import Weather from '../../components/weather/weather.component';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../components/weather/weather-icons/css/weather-icons.css';
import Form from '../../components/form/form.component';

//API key for Open Weather API
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
      weatherState: undefined,
      description : "",
      error : false,
      errorCity:false
    };
    
    //Icons for different weather conditions dowloaded from erik flowers
    this.weatherIcon= {
      Thunderstorm:"wi-thunderstorm",
      Drizzle:"wi-sleet",
      Rain:"wi-storm-showers",
      Snow:"wi-snow",
      Atmosphere:"wi-fog",
      Clear:"wi-day-sunny",
      Clouds:"wi-day-fog",
    };

    this.weatherState={
      haze:"../../assets/img2.jpg"
    }
  }

  //synchronously calling weather api
  getWeather = async(e)=>{

    e.preventDefault();
    
    //Getting values from the interface page form
    const city = e.target.elements.city.value;
    const country = e.target.elements.country.value;
    console.log({city,country})

    //checking if city and country are entered
    if(city && country){
      console.log("calling api")
      const api_call = await fetch('http://api.openweathermap.org/data/2.5/find/?q='+city+','+country+'&appid=62a01dc6786ac94ea6ffb947cab0d995');
      console.log("fetched API response")
      const response = await api_call.json();
      console.log(response);
      //checking for valid response - if not valid return error message
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
          icon: weatherIcon,
          //weatherState:this.setWeatherBackground(response.list[0].weather[0].main)
        });
        //console.log("Weather condition: ",response.list[0].weather[0].main)
        //console.log(setWeatherBackground)
      }else{
        this.setState({error:true});
      }
    }else{
      this.setState({error:true});
    }
  }

  

  //function to convert temparature into celsius
  calCelsius(temp){
    console.log("Received temparature in kelvins");
    let cell = Math.floor(temp - 273.15)
    console.log("converted to celsius");
    return cell;
  }
  
  //function to get appropriate icons based on the weather conditions
  get_weatherIcon(rangeId){
    console.log({rangeId}, "assigning weather icon");
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
        weatherIcon = this.weatherIcon.Clouds
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
        {/* <img src={require('../../assets/img2.jpg')} alt="loading..." /> */}
        <Form loadweather={this.getWeather} error={this.state.error}/>
        <Weather 
        city={this.state.city} 
        country={this.state.country}
        icon= {this.state.icon}
        temp_celsius={this.state.celsius}
        temp_max={this.state.temp_max}
        temp_min={this.state.temp_min}
        description={this.state.description}
        weatherState={this.state.weatherState}
        
        />
      </div>
    );
  }
}

export default App;
