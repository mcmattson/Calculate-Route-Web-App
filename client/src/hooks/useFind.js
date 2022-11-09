import {useState} from 'react';
import {LOG} from '../utils/constants'
import { sendAPIRequest } from '../utils/restfulAPI';



export function useFind(match, places, setPlaces) {
	const ServerFound = {
		places: places
	}

	const PlaceActions = {
		setPlaces : setPlaces
	}

//	useEffect( () => {
		sendFindRequest(match, 10 , getOriginalServerUrl(), PlaceActions);
 //   }, match);  
 	return {ServerFound};
}

	async function sendFindRequest(match, limit, serverUrl, PlaceActions) {
		const requestBody = {requestType: "find", match: match, limit: limit};
		const findResponse = await sendAPIRequest(requestBody , getOriginalServerUrl());
			console.log(findResponse);
		if (findResponse) {
			setPlaces(findResponse.places)
		} else {
			setPlaces([]);
			LOG.error(`Find request to ${serverUrl} failed. Check the log for more details.`, "error");
		}
	}
