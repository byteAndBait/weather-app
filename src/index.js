import "./css/main.css";
import "./css/normalize.css";
import { initUI } from "./UI.js";


export async function getWeatherData(location) {
    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=PFRUTATJUHH72C7DVKLTZX2V6&lang=id&include=current`
    try {
        const response = await fetch(url)
        if(!response.ok){
            throw new Error()
        }
        
        const responseInJSON = await response.json()
        return responseInJSON;  

    } catch (error) {
        console.log(error.message)
        throw new Error("Location is not valid", { cause: error })
    }
}


initUI()

