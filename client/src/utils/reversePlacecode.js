import { Place } from "../models/place.model";
import { latLngToPlace, placeToLatLng } from "./transformers";

const GEOCODE_URL = "https://nominatim.openstreetmap.org/search?format=jsonv2";

async function reversePlacecode(place) {
    // Here the coordinates are in latLng format - example: {lat: 0, lng: 0}
    const API_URL = GEOCODE_URL + `&q=${place}&countrycodes=us`;
    //console.log('reversePlacecode API_URL: ' + API_URL);
    const data = await fetch(API_URL);
    //console.log('reversePlacecode data: ' + data);
    const dataJSON = await data.json();
    //console.log('reversePlacecode dataJSON: ' + dataJSON);
    for (let i = 0; i < dataJSON.length; i++) {
        console.log('reversePlacecode display_name: ' + dataJSON[i].display_name);        
    }
    
    const formattedPlace = place;
    if (dataJSON[0].display_name) {
        //console.log("Hi from reversePlacecode: " + dataJSON[0].display_name);
        const newPlace = new Place({ name: dataJSON[0].display_name});
        return newPlace;
    } else {
        const unknownPlace = new Place({ name: 'Unkown', ...formattedPlace });
        return unknownPlace;
    }
}

export { reversePlacecode };