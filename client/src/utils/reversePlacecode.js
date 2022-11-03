import { Place } from "../models/place.model";

const GEOCODE_URL = "https://nominatim.openstreetmap.org/search?format=jsonv2";

async function reversePlacecode(place) {
    // Here the place search are in string format - example: {Dave}
    const API_URL = GEOCODE_URL + `&q=${place}&countrycodes=us`;
    const data = await fetch(API_URL);
    const dataJSON = await data.json();   
    
    //testing purposes only - shows all responses from query 
     for (var i = 0; i < dataJSON.length; i++) {
        console.log("reversePlacecode [" + i + "]: " + dataJSON[i].display_name + " " + dataJSON[i].lat + " " + dataJSON[i].lon); 
    }

    const formattedPlace = place;
    if (dataJSON[0].display_name) {
        const newPlace = new Place({ ...formattedPlace, name: dataJSON[0].display_name, lat: dataJSON[0].lat, longitude: dataJSON[0].lon, });
        return newPlace;
    } else {
        const unknownPlace = new Place({ name: 'Unkown', ...formattedPlace });
        return unknownPlace;
    }
}

export { reversePlacecode };