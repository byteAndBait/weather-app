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
export function initUI() {
    formEventsHandler()
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

    })
}

async function updateScreen(weatherObject) {
    tempratureSpanElement.textContent = weatherObject.temp
    feelsLikeSpanElement.textContent = weatherObject.feelslike
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
