import React from 'react'
import App from '../../components/app/App'
import { func } from 'prop-types';

const Weather = (props) => {
    console.log({props})
    return(
        <div className="container">
             <h1 className="py-4">WEATHER FORCAST</h1>
            <div className="cards pt-4" >
               
                <h1>
                    {props.city}
                </h1>

                <h5 className="py-4"><i className={`wi ${props.icon} display-1`}></i></h5>
                                    
                {props.temp_celsius? (<h1 className="py-2">{props.temp_celsius}&deg;</h1>):null}
                                
                {minmaxTemp(props.temp_min,props.temp_max)}
                
                

                <h4 className="py-3">{props.description}</h4>
            </div>
        </div>
    );
}

function minmaxTemp(min,max){
    if(min && max){
        return(
            <h3>
                <span className="px-4">{min}&deg;</span>
                <span className="px-4">{max}&deg;</span>
            </h3>   
        );
        
    }
}
export default Weather;