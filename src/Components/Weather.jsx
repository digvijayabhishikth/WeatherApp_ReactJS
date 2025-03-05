import React, { useEffect, useRef, useState } from 'react'
import './Weather.css'
import sunny from '../assets/sun.png'
import windy from '../assets/windy.png'
import humid from '../assets/humidity.png'

const Weather = () => {

    const inputRef = useRef();

    const [weatherdata,setWeatherData] = useState(false)

    const search = async (city)=>{

        if(city === ""){
            alert("Enter city name");
            return;
        }
        try{
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`
            
            const response = await fetch(url);
            const data = await response.json();
            
            if(!response.ok){
                alert(data.message);
                return;
            }
            console.log(data)
            const icon = data.weather[0].icon || sunny;
            setWeatherData({
                description: data.weather[0].description,
                humidity: data.main.humidity,
                windSpeed : data.wind.speed,
                temparature : Math.floor(data.main.temp),
                location : data.name,
                icon : `https://openweathermap.org/img/wn/${icon}@2x.png`,
            })
            
        }
        catch(error){
            setWeatherData(false);
            console.error(`${error}Error in fetching data`)
        }
    }

    useEffect(()=>{
        search("London")
    },[])

    const handleKeyPress = (event)=>{
        if(event.key === 'Enter'){
            search(inputRef.current.value)
        }
    }

  return (
    <div className='weather'>
        <div className='search-bar'>
            <input ref={inputRef} className='searchInput' type="text" placeholder='Search for City' onKeyDown={handleKeyPress}/>
            <div>
                <span className="material-icons-outlined search-icon" onClick={()=>search(inputRef.current.value)}>
                    search
                </span>
            </div>
        </div>
        {weatherdata?<>
            <img className='weatherIcon' src={weatherdata.icon} alt="Sunny Weather image"/>
            <span className='desc'>{weatherdata.description}</span>
            <p className='temparature'>{weatherdata.temparature}°C</p>
            <p className='location'>{weatherdata.location}</p>
            <div className='weather-data'>
                <div className='specs'>
                    <img src={humid} className='humidi'/>
                    <div>
                        <p>{weatherdata.humidity}%<span>Humidity</span></p>
                    </div>
                </div>
                <div className='specs'>
                    <img src={windy}/>
                    <div>
                        <p>{weatherdata.windSpeed}km/h<span>Wind Speed</span></p>
                    </div>
                </div>
            </div>
        </>:<></>}
        
    </div>
  )
}

export default Weather