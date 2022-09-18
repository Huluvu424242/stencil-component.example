import {Endpunkt} from "./endpunkt";

export const endpunkte: {[key:string]:Endpunkt }= {
'personapiurl': new Endpunkt("https://localhost","58","/person","/name"),
'weatherapiurl': new Endpunkt("https://localhost","58","/weather","/europe")
}
