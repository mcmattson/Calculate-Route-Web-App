import React, { useEffect, useState } from 'react';
import {
	Button,
	Col,
	Modal,
	ModalBody,
	ModalHeader,
	Input,
	Collapse,
	ModalFooter,
} from 'reactstrap';
import Coordinates from 'coordinate-parser';
import { LOG } from '../../utils/constants';
import { reverseGeocode } from '../../utils/reverseGeocode';
import { getOriginalServerUrl, sendAPIRequest } from '../../utils/restfulAPI';
import { Place } from "../../models/place.model";
import { latLngToPlace } from "../../utils/transformers";

export default function AddPlace(props) {
	const [foundPlace, setFoundPlace] = useState();
	const [coordString, setCoordString] = useState('');
	var [nameString, setNameString] = useState('');
	var [limit, setLimit] = useState(10);
	
	const findSettings = useFind(nameString, limit, getOriginalServerUrl());
	return (
		<Modal isOpen={props.isOpen} toggle={props.toggleAddPlace}>
			<AddPlaceHeader toggleAddPlace={props.toggleAddPlace} />
			<PlaceSearch
				foundPlace={foundPlace}
				setFoundPlace={setFoundPlace}
				coordString={coordString}
				setCoordString={setCoordString}
				setNameString={setNameString}
				nameString={nameString}
				findSettings={findSettings}
				places={props.places}
				setLimit={setLimit}
				//places={places}
				placeActions={props.placeActions}
			/>
			<AddPlaceFooter
				append={props.append}
				foundPlace={foundPlace}
				setFoundPlace={setFoundPlace}
				findSettings={findSettings}
				setCoordString={setCoordString}
				nameString={nameString}
				setNameString={setNameString}
				places={props.places}
				placeActions={props.placeActions}
				//places={places}
				selectedIndex={props.selectedIndex}
			/>
		</Modal>
	);
}

function AddPlaceHeader(props) {
	return (
		<ModalHeader className='ml-2' toggle={props.toggleAddPlace}>
			Add a Place
		</ModalHeader>
	);
}

function textComma(value) {
	return (value.indexOf(',') > -1);
}


function PlaceSearch(props) {
	useEffect(() => {
		document.getElementById('search').onkeyup = function () {
			if (textComma(this.value)) {
				verifyCoordinates(props.coordString, props.setFoundPlace);
			}
		}
	}, [props.coordString]);

	useEffect(() => {
		document.getElementById('search-name').onkeyup = function () {
				verifyPlacesName(props.nameString, props.setFoundPlace);
		}
	}, [props.nameString]);

	return (
		<ModalBody>
			<Col>
				Enter a Coordinates Search (EX: 50,50)
				<Input
					type='search' id='search'
					
					onChange={(input) => props.setCoordString(input.target.value)}
					placeholder='Enter Coordinates'
					data-testid='coord-input'
					value={props.coordString}
				/>
				<br />
				Enter a Name Search
				<Input
					type='search' id='search-name'
					
					onChange={(input) => props.setNameString(input.target.value)}
					placeholder='Enter Name'
					data-testid='name-input'
					value={props.nameString}
				/>
				<PlaceInfo foundPlace={props.foundPlace} />
			</Col>
		</ModalBody>
	);
}
/* async function checkSearchType(coordString) {
	let newCoordString = coordString.replace(/,/g, '')
	let stringLength = newCoordString.length

	if (textLength(newCoordString)) {
		let isNumber = Number(newCoordString)
		if (isNaN(isNumber)) {
			return false
		} else {
			return true
		}
	}
} */

function PlaceInfo(props) {
	return (
		<Collapse isOpen={!!props.foundPlace}>
			<br />
			<h5><p>Search Results:</p></h5>
			{props.foundPlace?.formatPlace()}
		</Collapse>
	);
}

function AddPlaceFooter(props) {
	return (
		<ModalFooter>
			<Button
				color='primary'
				onClick={() => {
					props.append(props.foundPlace);
					props.setCoordString('');
				}}
				data-testid='add-place-button'
			//disabled={!props.foundPlace}
			>
				Add Place(s)
			</Button>
		</ModalFooter>
	);
}

async function verifyCoordinates(coordString, setFoundPlace) {
	try {
		const latLngPlace = new Coordinates(coordString);
		const lat = latLngPlace.getLatitude();
		const lng = latLngPlace.getLongitude();
		if (isLatLngValid(lat, lng)) {
			const fullPlace = await reverseGeocode({ lat, lng });
			setFoundPlace(fullPlace);
		}
	} catch (error) {
		setFoundPlace(undefined);
	}
}

async function verifyPlacesName(nameString, setFoundPlace) {
	try {
		if (isPlaceValid(nameString)) {
			const fullPlace = useFind(nameString);
			console.log("fullPlace: ", fullPlace);
			setFoundPlace(fullPlace);
		}
	} catch (error) {
		setFoundPlace(undefined);
	}
}

function isLatLngValid(lat, lng) {
	return (lat !== undefined && lng !== undefined);
}

function isPlaceValid(nameString) {
	return (nameString !== undefined);
}

export function useFind(match, limit, serverURL) {
	
	if (match == undefined || match.length < 3 ) {
		match = "";
		limit = 0;
	}
	var [found, setFound] = useState(1);
	const [places, setPlaces] = useState([]);
	const [type, setType] = useState(['airport']);
	const [where, setWhere] = useState(['United States']);
	const [index, setIndex] = useState(0);
	const [lat, setLat] = useState(0);
	const [lng, setLng] = useState(0);
	const [name, setName] = useState("");


	var find = {
		places: places,
		found: found,
		name: name,
		index: index,
		lat: lat,
		lng: lng
	}

	var findActions = {
		setPlaces: setPlaces,
		setFound: setFound,
		setName: setName,
		setIndex: setIndex,
		setLat: setLat,
		setLng: setLng
	}
	//console.log("match-After useFind: ", match);
	useEffect(() => {
		sendFindRequest(match, limit, serverURL, findActions);
	}, [match])
	return { find };

	async function sendFindRequest(match, limit, serverURL, findActions) {
		const { setName, setPlaces, setFound, setLat, setLng, setIndex } = findActions;
		
		try {
			const requestBody = {
				requestType: 'find', match: match, type: type, where: where, limit: limit
			};

			console.log("requestBody: ", requestBody);
		
			const findResponse = await sendAPIRequest(requestBody, serverURL);
		

			if (findResponse) {
				const newPlace = new Place({ ...name, ...findResponse.name });
				setFound(findResponse.found);
				found = findResponse.found;
				if (findResponse.found > limit) {
				}
			
				//console.log("finalFound: ", found);
				setPlaces(findResponse.places);
				console.log("findResponse.places: ", findResponse.places);
				for (var i = 0; i < found; i++) {
					setName(findResponse.places[i].locationFeatures.name);
					//console.log("findResponse.name: %s", findResponse.places[i].locationFeatures.name);
					//console.log("findResponse.setName: %s", name);
					setLat(findResponse.places[i].locationFeatures.latitude);
					//console.log("findResponse.lat: %f", findResponse.places[i].locationFeatures.latitude);
					setLng(findResponse.places[i].locationFeatures.longitude);
					//console.log("findResponse.lng: %f", findResponse.places[i].locationFeatures.longitude );
					setIndex(findResponse.places[i].locationFeatures.index);
					//console.log("findResponse.index: %d", findResponse.places[i].locationFeatures.index);
					return newPlace;
				}
				
			} else {
				setPlaces([]);
				LOG.error(`Find request to ${serverURL} failed. Check the log for more details.`, "error");
			}
		} catch (error) { console.log(error); }
	}
}