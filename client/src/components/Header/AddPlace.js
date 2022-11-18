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
import { usePlaces } from '../../hooks/usePlaces';

export default function AddPlace(props) {
	const [foundPlace, setFoundPlace] = useState();
	const { places, selectedIndex, placeActions } = usePlaces();
	const [coordString, setCoordString] = useState();
	const [nameString, setNameString] = useState(' ');
	const findSettings = useFind(props.places, getOriginalServerUrl());
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
				//places={props.places}
				places={places}
			/>
			<AddPlaceFooter
				append={props.append}
				foundPlace={foundPlace}
				setFoundPlace={setFoundPlace}
				findSettings={findSettings}
				setCoordString={setCoordString}
				//places={props.places}
				places={places}
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

function textLength(value) {
	return (value.length >= 3);
}

function textComma(value) {
	return (value.indexOf(',') > -1);
}

function PlaceSearch(props) {
	 useEffect(() => {
		 document.getElementById('search').onkeyup = function () {
				verifyCoordinates(props.coordString, props.setFoundPlace);
		}
	}, [props.coordString]);
	useEffect(() => {
		document.getElementById('search-name').onkeyup = function () {
			if (textLength(this.value)) {
				verifyPlacesName(props.nameString, props.setFoundPlace);
			}
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
					props.setNameString('')
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
			setFoundPlace(fullPlace);
		}
	} catch (error) {
		setFoundPlace(undefined);
	}
}

function isLatLngValid(lat, lng) {
	return (lat !== undefined && lng !== undefined);
}

function isPlaceValid(coordString) {
	return (coordString !== undefined);
}

function useFind(match, serverURL) {
	console.log("BEFORE || match: %s | serverURL: %s", match, serverURL);

	const [found, setFoundPlace] = useState(1);
	const [places, setPlaces] = useState([]);
	const [limit, setLimit] = useState(0);
	
	console.log("AFTER  || match: %s | limit: %d | serverURL: %s", match, limit, serverURL);

	const find = {
		found: found,
		places: places,
		limit : limit
	}

	const findActions = {
		setFoundPlace: setFoundPlace, 
		setPlaces: setPlaces,
		setLimit: setLimit
	}
	console.log("AFTER  || places: [%s] | limit: %d | found: %d", places, limit, found);

	useEffect(() => {
		sendFindRequest("davee", limit, serverURL/* , findActions */);

	}, [match, limit])
	return { find };
	
	async function sendFindRequest(match, serverUrl) {
		console.log("BEFORE Return || match: %s | limit: %d | serverURL: %s", match, limit, serverURL);
		const { setPlaces, setFoundPlace, setLimit } = findActions;

		const requestBody = {
			requestType: 'find', match: match, type: ["airport"], where: ["United States"], limit: limit, places: places};
		const findResponse = await sendAPIRequest(requestBody, serverUrl);

		if (findResponse) {
			setPlaces(findResponse.find);
			setFoundPlace(findResponse.find);
			setLimit(findResponse.find);
			console.log("AFTER Return || findResponse.places: %d | findResponse.foundPlace: %s | limit: %d | serverURL: %s", findResponse.places, findResponse.foundPlace, limit, serverURL);
		} else {
			LOG.error(`Find request to ${serverURL} failed. Check the log for more details.`, "error");

		}
	}

	//return [{ serverUrl: serverUrl, serverFind: serverFind }, processServerFindSuccess,];
}