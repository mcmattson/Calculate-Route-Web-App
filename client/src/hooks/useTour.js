import { useState, useEffect } from 'react';
import { LOG } from '../utils/constants';
import {getOriginalServerUrl, sendAPIRequest } from '../utils/restfulAPI';


export function useTour(optimize, earthRadius, places, response, serverURL) {
    const [serverTour, setServerTour] = useState({places: []});
    const [serverUrl, setServerUrl] = useState(getOriginalServerUrl());

    useEffect( () => {
        makeTourRequest(earthRadius, places, response, serverURL);
    }, optimize);  

    return [{serverUrl: serverUrl, serverTour: serverTour}, processServerTourSuccess];
}

function processServerTourSuccess(places, url){
    LOG.info('Switching to Server: ', url);
    setServerTour(places);
    setServerUrl(url);
}

async function makeTourRequest(earthRadius, places, response, serverURL) {
    const tourResponse = await sendAPIRequest({
        requestType: 'tour',
        earthRadius: earthRadius,
        places: places, 
        response: response}, serverUrl);
    if (tourResponse) {
        processServerTourSuccess(tourResponse,serverUrl);
    } else {
        setServerTour({places: []});
    }
}
