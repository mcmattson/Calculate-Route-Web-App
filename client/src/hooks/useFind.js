import React, { useEffect, useState } from 'react';
import { LOG } from '../utils/constants';
import { getOriginalServerUrl, sendAPIRequest } from '../utils/restfulAPI';
import { placesList } from '../components/Header/AddPlace';

function useFind(match, limit, serverURL) {
    if (match == undefined || match.length < 3) {
        match = ' ';
        limit = 0;
    }

    let [found, setFound] = useState();
    let [places, setPlaces] = useState([]);
    const [type, setType] = useState(['airport']);
    const [where, setWhere] = useState(['US']);
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
        const { setServerFind } = findActions;
        let name, index, latitude, longitude, findResponse;
        const map1 = new Map();

        try {
            const requestBody = {
                requestType: "find", match: match, type: type, where: where, limit: limit
            }; findResponse = await sendAPIRequest(requestBody, serverURL);

            //Set Limit to 10 if more than 10
            found = findResponse.found;
            if (findResponse.found > limit) { found = limit; }

            if (found > 0) {
                processServerFindSuccess(findResponse, serverUrl);
                for (let i = 0; i < found; i++) {
                    places = findResponse.places[i], name = places.name, index = i, latitude = places.latitude, longitude = places.longitude;
                    map1.clear();

                    //Sets Map
                    map1.set('index', index);
                    map1.set('name', name);
                    map1.set('latitude', latitude);
                    map1.set('longitude', longitude);
                    setPlaces(placesList(map1, found));
                    setServerFind({ places });
                }
            } else {
                map1.set('name', 'unknown');
                placesList(map1, found);
                setServerFind({ places: [] });
            }
        } catch (error) { }
    }
}
export { useFind };