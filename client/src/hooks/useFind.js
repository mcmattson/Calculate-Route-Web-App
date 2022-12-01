import React, { useEffect, useState } from 'react';
import { LOG } from '../utils/constants';
import { getOriginalServerUrl, sendAPIRequest } from '../utils/restfulAPI';
import { placesList } from '../components/Header/AddPlace';

function useFind(match, limit, serverURL) {
    limit = limitUndefinedNull(match, limit);
    match = matchUndefinedNull(match);
    let found, places = [];
    const type = ['airport'], where = ['US'];
    const [serverUrl, setServerUrl] = useState(getOriginalServerUrl());
    const [serverFind, setServerFind] = useState({ places: [] });
    let find = { serverFind }
    let findActions = { setServerFind: setServerFind }

    useEffect(() => {
        sendFindRequest(match, limit, serverURL, findActions);
    }, [match, limit])
    return { find };

    function processServerFindSuccess(places, url) {
        LOG.info('Switching to Server:', url);
        setServerFind(places);
        setServerUrl(url);
    }
    async function sendFindRequest(match, limit, serverURL, findActions) {
        const { setServerFind } = findActions, map1 = new Map();
        let name, index, latitude, longitude, findResponse;
        try {
            const requestBody = { requestType: "find", match: match, type: type, where: where, limit: limit }; findResponse = await sendAPIRequest(requestBody, serverURL);
            found = setNewFound(findResponse.found, limit); //Set Limit to 10 if more than 10 
            if (found > 0) {
                processServerFindSuccess(findResponse, serverUrl);
                for (let i = 0; i < found; i++) {
                    places = findResponse.places[i], index = i, name, latitude, longitude;
                    let mapPlaces = setMapInfo(name = places.name, latitude = places.latitude, longitude = places.longitude, map1); //Clears and Sets Map
                    map1.set('index', index);
                    console.log(mapPlaces);
                    placesList(mapPlaces, found);
                    setServerFind({ places });
                }
            } else {
                let mapSetUnknown = setMapInfoUnknown(map1); //Clears and Sets Map to Unknown
                placesList(mapSetUnknown, found);
                setServerFind({ places: [] });
            }
        } catch (error) { }
    }
}
function setMapInfoUnknown(map1) {
    map1.clear();
    map1.set('name', 'unknown');
    return map1;
}

function setMapInfo(name, latitude, longitude, map1) {
    map1.clear();
    map1.set('name', name);
    map1.set('latitude', latitude);
    map1.set('longitude', longitude);
    return map1;
}
function setNewFound(found, limit) {
    if (found > limit) {
        found = limit;
        return found;
    } else {
        return found;
    }
}

function limitUndefinedNull(match, limit) {
    if (match == undefined || match.length < 3) {
        limit = 0;
        return limit;
    } else {
        return limit;
    }
}
function matchUndefinedNull(match) {
    if (match == undefined || match.length < 3) {
        match = ' ';
        return match;
    } else {
        return match;
    }
}
export { useFind };