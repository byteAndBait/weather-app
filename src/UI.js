import { processWeatherData } from "./index.js"
import earthBackgroundImage from "./assets/images/nasa-earth.jpg"

const weatherDataRequestFormElement = document.getElementById("weatherDataRequestFormElement")
const cityNameInputElement = weatherDataRequestFormElement.querySelector("input#cityNameInputElement")

const weatherDataViewContainerElement = document.querySelector(".weatherDataViewContainerElement")
const tempratureSpanElement = weatherDataViewContainerElement.querySelector(".temp")
const feelsLikeSpanElement = weatherDataViewContainerElement.querySelector(".feelsLike")
const windSpeedSpanElement = weatherDataViewContainerElement.querySelector(".windSpeed")
const humiditySpanElement = weatherDataViewContainerElement.querySelector(".humidity")
const UVIndexSpanElement = weatherDataViewContainerElement.querySelector(".UVIndex")

const metricSliderElement = document.querySelector(".metricSlider")

const conditionsIDs = {
    "type_1": "Blowing Or Drifting Snow",
    "type_2": "Drizzle",
    "type_3": "Heavy Drizzle",
    "type_4": "Light Drizzle",
    "type_5": "Heavy Drizzle/Rain",
    "type_6": "Light Drizzle/Rain",
    "type_7": "Dust storm",
    "type_8": "Fog",
    "type_9": "Freezing Drizzle/Freezing Rain",
    "type_10": "Heavy Freezing Drizzle/Freezing Rain",
    "type_11": "Light Freezing Drizzle/Freezing Rain",
    "type_12": "Freezing Fog",
    "type_13": "Heavy Freezing Rain",
    "type_14": "Light Freezing Rain",
    "type_15": "Funnel Cloud/Tornado",
    "type_16": "Hail Showers",
    "type_17": "Ice",
    "type_18": "Lightning Without Thunder",
    "type_19": "Mist",
    "type_20": "Precipitation In Vicinity",
    "type_21": "Rain",
    "type_22": "Heavy Rain And Snow",
    "type_23": "Light Rain And Snow",
    "type_24": "Rain Showers",
    "type_25": "Heavy Rain",
    "type_26": "Light Rain",
    "type_27": "Sky Coverage Decreasing",
    "type_28": "Sky Coverage Increasing",
    "type_29": "Sky Unchanged",
    "type_30": "Smoke Or Haze",
    "type_31": "Snow",
    "type_32": "Snow And Rain Showers",
    "type_33": "Snow Showers",
    "type_34": "Heavy Snow",
    "type_35": "Light Snow",
    "type_36": "Squalls",
    "type_37": "Thunderstorm",
    "type_38": "Thunderstorm Without Precipitation",
    "type_39": "Diamond Dust",
    "type_40": "Hail",
    "type_41": "Overcast",
    "type_42": "Partially cloudy",
    "type_43": "Clear",
};
export async function initUI() {
    formEventsHandler()
    metricSliderEventHandler()
    document.body.style.backgroundImage = `url("${earthBackgroundImage}")`

}

function formEventsHandler() {
    weatherDataRequestFormElement.addEventListener("submit", async () => {
        event.preventDefault()
        if (cityNameInputElement.value.length < 1) {
            console.log("Monsiuer your input is empty")
            return;
        }
        try {
            const currentConditionWeatherObject = await processWeatherData(cityNameInputElement.value)
            const backgroundImageName = conditionsIDs[currentConditionWeatherObject.conditions]
            const backgroundImageURL = await getPhotoFromUnsplash(backgroundImageName)
            document.body.style.backgroundImage = `url("${backgroundImageURL}")`
            updateScreen(
                currentConditionWeatherObject
            )
        } catch (e) {
            console.log(e.message)
        }

        if (metricSliderElement.querySelector(".active").classList.contains("metricTemp")) {
            updateTempUnitSystem()
        }
        if (weatherDataViewContainerElement.querySelector(".overlay")) {
            weatherDataViewContainerElement.querySelector(".overlay").remove()
        }


    })
}
function metricSliderEventHandler() {
    document.querySelector(".metricSlider").addEventListener("click", () => {
        const target = event.target
        if (!target.classList.contains("temp")) { // To make sure it updates only when buttons are pressed
            return;
        }
        if (target.classList.contains("active")) {
            return;
        }
        metricSliderElement.querySelector(".active").classList.remove("active")
        target.classList.add("active")
        updateTempUnitSystem()
    })
}
async function updateScreen(weatherObject) {
    tempratureSpanElement.textContent = weatherObject.temp
    tempratureSpanElement.dataset.temp = weatherObject.temp
    feelsLikeSpanElement.textContent = weatherObject.feelslike
    feelsLikeSpanElement.dataset.temp = weatherObject.feelslike
    windSpeedSpanElement.textContent = weatherObject.windspeed
    humiditySpanElement.textContent = weatherObject.humidity
    UVIndexSpanElement.textContent = weatherObject.uvindex
    cityNameInputElement.value = ""

}
async function getPhotoFromUnsplash(keyword) {
    const url = `https://api.unsplash.com/search/photos?client_id=PQz9bjVxY_rgaLbOSfWJbzDPfcf7BsWGBTxcIYWy-eA&query=${keyword.toLowerCase().trim()}`
    try {
        const response = await fetch(url)
        const responseInJSON = await response.json()
        const imgURL = responseInJSON.results[0].urls.full
        return imgURL
    } catch (error) {
        console.log("there was an error " + error.message)
    }
}


function convertToCelsius(fahrenheit) {
    const celsuis = parseFloat((fahrenheit - 32) / 1.8)
    if (isNaN(celsuis)) return ""
    if (Math.floor(celsuis) == celsuis) {
        return Math.floor(celsuis)
    }
    return celsuis
}
function convertToFahrenheit(celsuis) {
    const fahrenheit = parseFloat((celsuis * 1.8) + 32)
    if (isNaN(fahrenheit)) return ""
    if (Math.floor(fahrenheit) == fahrenheit) {
        return Math.floor(fahrenheit)
    }
    return fahrenheit
}

function updateTempUnitSystem() {
    if (metricSliderElement.querySelector(".active")) {
        if (!(tempratureSpanElement.dataset.temp && feelsLikeSpanElement.dataset.temp)) {
            return
        }
        const currentUnitSystemElement = metricSliderElement.querySelector(".active")
        if (currentUnitSystemElement.classList.contains("USTemp")) {
            tempratureSpanElement.dataset.temp = convertToFahrenheit(tempratureSpanElement.dataset.temp)
            feelsLikeSpanElement.dataset.temp = convertToFahrenheit(feelsLikeSpanElement.dataset.temp)
            tempratureSpanElement.textContent = parseFloat(tempratureSpanElement.dataset.temp).toFixed(1)
            feelsLikeSpanElement.textContent = parseFloat(feelsLikeSpanElement.dataset.temp).toFixed(1)
            return;
        }
        if (currentUnitSystemElement.classList.contains("metricTemp")) {
            document.querySelector(".USTemp").classList.remove("active")
            tempratureSpanElement.dataset.temp = convertToCelsius(tempratureSpanElement.dataset.temp)
            feelsLikeSpanElement.dataset.temp = convertToCelsius(feelsLikeSpanElement.dataset.temp)
            tempratureSpanElement.textContent = parseFloat(tempratureSpanElement.dataset.temp).toFixed(1)
            feelsLikeSpanElement.textContent = parseFloat(feelsLikeSpanElement.dataset.temp).toFixed(1)
            return
        }
    }
}

