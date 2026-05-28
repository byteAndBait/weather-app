import "./css/main.css";
import "./css/normalize.css";
import { initUI } from "./UI.js";


async function getWeatherData(location) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=PFRUTATJUHH72C7DVKLTZX2V6&lang=id`
    try {
        const response = await fetch(url)
        const responseInJSON = await response.json()
        return responseInJSON;
    } catch (error) {
        console.log(error.message)
        return false
    }
}

export async function processWeatherData(location) {
    const dataInJSON = await getWeatherData(location)
    if (dataInJSON) {
        console.log(dataInJSON.currentConditions)
        return dataInJSON.currentConditions
    }
    console.log("there was an error")
}

initUI()

