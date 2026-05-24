import "./css/main.css";
import "./css/normalize.css";


const weatherDataRequestFormElement = document.getElementById("weatherDataRequestFormElement")
const cityNameInputElement = weatherDataRequestFormElement.querySelector("input#cityNameInputElement")

const weatherDataViewContainerElement = document.querySelector(".weatherDataViewContainerElement")
const tempratureSpanElement = weatherDataViewContainerElement.querySelector(".temp")
const feelsLikeSpanElement = weatherDataViewContainerElement.querySelector(".feelsLike")
const windSpeedSpanElement = weatherDataViewContainerElement.querySelector(".windSpeed")
const humiditySpanElement = weatherDataViewContainerElement.querySelector(".humidity")
const UVIndexSpanElement = weatherDataViewContainerElement.querySelector(".UVIndex")


async function getWeatherData(location) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=PFRUTATJUHH72C7DVKLTZX2V6`
    try {
        const response = await fetch(url)
        const responseInJSON = await response.json()
        return responseInJSON;
    } catch (error) {
        console.log(error.message)
        return false
    }
}

async function processWeatherData(location) {
    const dataInJSON = await getWeatherData(location)
    if (dataInJSON) {
        console.log(dataInJSON.currentConditions)
        return dataInJSON.currentConditions
    }
    console.log("there was an error")
}

weatherDataRequestFormElement.addEventListener("submit", async () => {
    event.preventDefault()
    if (cityNameInputElement.value.length < 1) {
        console.log("Monsiuer your input is empty")
        return;
    }
    const currentConditionWeatherObject = await processWeatherData(cityNameInputElement.value)
    updateScreen(
        currentConditionWeatherObject
    )
})


function updateScreen(weatherObject) {
    console.log(weatherObject)
    tempratureSpanElement.textContent = weatherObject.temp
    feelsLikeSpanElement.textContent = weatherObject.feelslike
    windSpeedSpanElement.textContent = weatherObject.windspeed
    humiditySpanElement.textContent = weatherObject.humidity
    UVIndexSpanElement.textContent = weatherObject.uvindex
    cityNameInputElement.value = ""
}
