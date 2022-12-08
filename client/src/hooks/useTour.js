import { useState, useEffect} from "react";
import { LOG } from "../utils/constants";
import { getOriginalServerUrl, sendAPIRequest } from "../utils/restfulAPI";

export function useTour(places, earthRadius, serverURL, optimize){
    const [serverUrl, setServerUrl] = useState(getOriginalServerUrl());
    const [serverTour, setServerTour] = useState([]);
    const [responseTime, setResponseTime] = useState(0);
    const tourVariables = { serverTour, setServerTour, responseTime, setResponseTime, serverUrl, setServerUrl };
    useEffect( () => {
        makeTourRequest(places, earthRadius, tourVariables);
    }, optimize);  

    return { serverTour, responseTime, tourVariables};
}
async function makeTourRequest(places, earthRadius, tourVariables){
    const {serverUrl, serverTour, setServerTour, setResponseTime} = tourVariables;
    const tourResponse = await sendAPIRequest({ 
        requestType: "tour", 
        earthRadius, 
        response: 1, 
        places}, serverUrl)
        setResponseTime(tourResponse.response);
        setServerTour(tourResponse.places);
        LOG.info('Tour Request Success ', serverUrl, tourResponse.places, tourResponse.response);
}