import React, { useEffect, useState } from 'react';
import { LOG } from '../utils/constants';
import { getOriginalServerUrl, sendAPIRequest } from '../utils/restfulAPI';
import { placesList } from '../components/Header/AddPlace';
import { Place } from '../models/place.model';

function useFind(match, limit, serverURL) {
    /* limit = limitUndefinedNull(match, limit); match = matchUndefinedNull(match);
    let found, places = []; const type = ['airport'], where = ['US'], [serverUrl, setServerUrl] = useState(getOriginalServerUrl()), [serverFind, setServerFind] = useState({ places: [] });
    let find = { serverFind }, findActions = { setServerFind: setServerFind };
    useEffect(() => { sendFindRequest(match, limit, serverURL, findActions); }, [match, limit]); return { find };
    function processServerFindSuccess(places, url) { LOG.info('Switching to Server:', url); setServerFind(places); setServerUrl(url); }
    async function sendFindRequest(match, limit, serverURL, findActions) {
        const { setServerFind } = findActions, map1 = []; let findResponse, mapPlaces, i, mapSetUnknown;
        try {
            const requestBody = { requestType: "find", match: match, type: type, where: where, limit: limit }; findResponse = await sendAPIRequest(requestBody, serverURL);
            found = setNewFound(findResponse.found, limit); //Set Limit to 10 if more than 10 
            if (found > 0) {
                for (i = 0; i < limit; i++) {
                    processServerFindSuccess(findResponse[i], serverUrl);
                    places = findResponse.places[i];
                    map1.push(mapPlaces = new Place({
                        name: `${places.name}`, latitude: `${places.latitude}`, longitude: `${places.longitude}`, municipality: `${places.municipality}`, region: `${places.iso_region}`, index: `${places.index}`
                    }))
                    placesList(map1[i], found); setServerFind({ places: [map1] });
                }
            } else {
                mapSetUnknown = setMapInfoUnknown(map1);
                placesList(mapSetUnknown, found); setServerFind({ places: [] });
            }
        } catch (error) { }
    } */
}
/* function setMapInfoUnknown(map1) {
    map1.clear();
    map1.set('name', 'unknown');
    return map1;
} */

/* function setNewFound(found, limit) {
    if (found > limit) {
        found = limit;
        return found;
    } else {
        return found;
    }
} */

/* function limitUndefinedNull(match, limit) {
    if (match == undefined || match.length < 3) {
        limit = 0;
        return limit;
    } else {
        return limit;
    }
} */
/* function matchUndefinedNull(match) {
    if (match == undefined || match.length < 3) {
        match = ' ';
        return match;
    } else {
        return match;
    }
} */
export { useFind };