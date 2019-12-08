import React from "react";
import './App.css';
import Weather from './app_component/weather.component';
import 'bootstrap/dist/css/bootstrap.min.css';
import './weather-icons/css/weather-icons.css';
import Form from './app_component/form.component';

let myHeaders = new Headers();
const myInit = {
  method: 'GET',
  headers: myHeaders,
  mode: 'no-cors',
  cache: 'default'
};


const API_KEY = '62a01dc6786ac94ea6ffb947cab0d995';
//const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
//const targetUrl  = 'http://samples.openweathermap.org/data/2.5/weather?q=${city},&{country}&appid=${API_KEY}';
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
      error : false
    };
    

    this.weatherIcon={
      Thunderstorm:"wi-thunderstorm",
      Drizzle:"wi-sleet",
      Rain:"wi-storm-showers",
      Snow:"wi-snow",
      Atmosphere:"wi-fog",
      Clear:"wi-day-sunny",
      Clouds:"wi-day-fog",
    };
  }

  calCelsius(temp){
    console.log("got temp");
    let cell = Math.floor(temp - 273.15)
    console.log("converted to celsius");
    return cell;
  }

  get_weatherIcon(icons,rangeId){
    switch(true){
      case rangeId >= 200 && rangeId <= 232:
        this.setState({icon:this.weatherIcon.Thunderstorm});
        break;
      case rangeId >= 300 && rangeId <= 321:
        this.setState({icon:this.weatherIcon.Drizzle});
        break;
      case rangeId >= 500 && rangeId <= 532:
        this.setState({icon:this.weatherIcon.Rain});
        break;
      case rangeId >= 600 && rangeId <= 622:
        this.setState({icon:this.weatherIcon.Snow});
        break;
      case rangeId >= 701 && rangeId <= 781:
        this.setState({icon:this.weatherIcon.Atmosphere});
        break;
      case rangeId === 800:
        this.setState({icon:this.weatherIcon.Clear});
        break;
      case rangeId >= 800 && rangeId <= 804:
        this.setState({icon:this.weatherIcon.Clouds});
        break;
      default:
        this.setState({icon:this.weatherIcon.Clear});
    }
  }

  
  getWeather = async(e)=>{

    e.preventDefault();

    const city = e.target.elements.city.value;
    const country = e.target.elements.country.value;

    if(city && country){
      const api_call = await fetch('http://api.openweathermap.org/data/2.5/find/?q='+city+','+country+'&appid=62a01dc6786ac94ea6ffb947cab0d995');

      const response = await api_call.json();
      console.log(response);
      
      this.setState({
        city:response.list[0].name + ' '+response.list[0].sys.country,
        celsius: this.calCelsius(response.list[0].main.temp),
        temp_max: this.calCelsius(response.list[0].main.temp_max),
        temp_min: this.calCelsius(response.list[0].main.temp_min),
        description: response.list[0].weather[0].description
        //icon: this.weatherIcon.Thunderstorm
        
      });
      this.get_weatherIcon(this.weatherIcon,response.list[0].weather[0].id);
    }else{
      this.setState({error:true});
    }
    
  }


  //state = {};
  render(){
    return(
      <div className="App">
        <Form loadweather={this.getWeather} error={this.state.error}/>
        <Weather 
        city={this.state.city} 
        country={this.state.country}
        temp_celsius={this.state.celsius}
        temp_max={this.state.temp_max}
        temp_min={this.state.temp_min}
        description={this.state.description}
        weatherIcon= {this.state.icon}
        />
      </div>
    );
  }
}

export default App;
