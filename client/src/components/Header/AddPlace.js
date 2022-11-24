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
	ListGroup,
	ListGroupItem,
	Grid,
	Row,
	Panel,
	Table,
} from 'reactstrap';
import Coordinates from 'coordinate-parser';
import { LOG } from '../../utils/constants';
import { reverseGeocode } from '../../utils/reverseGeocode';
import { getOriginalServerUrl, sendAPIRequest } from '../../utils/restfulAPI';
import { Place } from "../../models/place.model";
import { latLngToPlace } from "../../utils/transformers";

export default function AddPlace(props) {
	var [foundPlace, setFoundPlace] = useState();
	var [foundNamePlace, setFoundNamePlace] = useState();
	const [coordString, setCoordString] = useState('');
	const [nameString, setNameString] = useState('');
	var [limit, setLimit] = useState(10);
	var [found, setFound] = useState(0);
	var [places, setPlaces] = useState([]);


	const findSettings = useFind(nameString, limit, getOriginalServerUrl());
	return (
		<Modal isOpen={props.isOpen} toggle={props.toggleAddPlace}>
			<AddPlaceHeader toggleAddPlace={props.toggleAddPlace} />
			<PlaceCoordSearch
				foundPlace={foundPlace}
				setFoundPlace={setFoundPlace}
				coordString={coordString}
				setCoordString={setCoordString}

			/>

			<AddCoordFooter
				append={props.append}
				setCoordString={setCoordString}
				coordString={coordString}
				nameString={nameString}
				setNameString={setNameString}
			/>

			<PlaceNameSearch
				foundPlace={foundPlace}
				setFoundPlace={setFoundPlace}
				nameString={nameString}
				setNameString={setNameString}
				findSettings={findSettings}
				found={found}
				setFound={setFound}
			/>
			<AddNameFooter
				append={props.append}
				foundNamePlace={foundNamePlace}
				setNameString={setNameString}
				setCoordString={setCoordString}
				coordString={coordString}
			/>
		</Modal>
	);
}

function AddPlaceHeader(props) {
	return (
		<ModalHeader className='ml-2' toggle={props.toggleAddPlace}>
			Add a Place(s)
		</ModalHeader>
	);
}

function textComma(value) {
	return (value.indexOf(',') > -1);
}


function PlaceCoordSearch(props) {
	useEffect(() => {
		verifyCoordinates(props.coordString, props.setFoundPlace);
	}, [props.coordString]);

	return (
		<ModalBody>
			<Col>
				<Input
					onChange={(input) => props.setCoordString(input.target.value)}
					placeholder='Enter Place Coordinates'
					data-testid='coord-input'
					value={props.coordString}
				/>
				<PlaceCoordInfo foundPlace={props.foundPlace} />
			</Col>
		</ModalBody>
	);
}

function PlaceNameSearch(props) {
	useEffect(() => {
		document.getElementById('search-name').onkeyup = function () {
			verifyPlacesName(props.findSettings, props.setFoundNamePlace);
		}
	}, [props.nameString]);

	return (
		<ModalBody>
			<Col>
				Enter a Name Search
				<Input
					type='search' id='search-name'
					onChange={(input) => props.setNameString(input.target.value)}
					placeholder='Enter Name'
					data-testid='name-input'
					value={props.nameString}
				/>
				<PlaceNameInfo foundNamePlace={props.foundNamePlace} />
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

function PlaceCoordInfo(props) {
	return (
		<Collapse isOpen={!!props.foundPlace}>
			<br />
			{props.foundPlace?.formatPlace()}
		</Collapse>
	);
}

function PlaceNameInfo(props) {

	return (
		//<Collapse isOpen ={!!props.foundNamePlace} >
		<ModalBody>
			<div style={{ width: 440, marginLeft: -18/* marginRight: -155 */ }}>
				<div id='places0'></div>
				<div id='places1'></div>
				<div id='places2'></div>
				<div id='places3'></div>
				<div id='places4'></div>
				<div id='places5'></div>
				<div id='places6'></div>
				<div id='places7'></div>
				<div id='places8'></div>
				<div id='places9'></div>
			</div>
		</ModalBody>
		//</Collapse>
	);
}

function show(places, limit) {
	places["name"] = [{ "index": places.get('index'), "name": places.get('name'), "latitude": places.get('latitude'), "longitude": places.get('longitude') }];
	let elem;
	if (limit > 0) {
		for (let i = 0; i < 1; i++) {
			elem = document.getElementById('places' + `${i}`);
		}
		elem.innerHTML += `<button id="places' + ${places.get('index')}" data-testid="places' + ${places.get('index')}"
			type="button" class="list-group-item list-group-item-action" >${places.get('name')}</button>`
		return;
	} else {
		for (let i = 0; i < 1; i++) {
			elem = document.getElementById('places' + `${i}`);
		}
		elem.innerHTML = `<div class="list-group">No results <div>`;
		return;
	}
}



function AddCoordFooter(props) {
	return (
		<ModalFooter>
			<Button
				color='primary'
				onClick={() => {
					props.append(props.foundPlace);
					props.setCoordString('');
					props.setNameString('');
				}}
				data-testid='add-place-button'
			//disabled={!props.foundPlace}
			>
				Add Place
			</Button>
		</ModalFooter>
	);
}

function AddNameFooter(props) {
	return (
		<ModalFooter>
			<Button
				color='primary'
				onClick={() => {
					props.append(props.foundPlace);
					props.setCoordString('');
					props.setNameString('');
				}}
				data-testid='add-place-button'
				disabled={!props.foundPlace}
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
		//console.log(error);
		setFoundPlace(undefined);
	}
}

async function verifyPlacesName(props, setFoundPlace) {
	try {
		if (isPlaceValid(props.nameString)) {
			fullPlace = useFind(nameString);
			setFoundPlace(fullPlace);
		}
	} catch (error) {
		console.log(error);
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

	if (match == undefined || match.length < 3) {
		match = '';
		limit = 0;
	}
	var [found, setFound] = useState();
	var [places, setPlaces] = useState([]);
	const [type, setType] = useState(['airport']);
	const [where, setWhere] = useState(['United States']);
	const [serverUrl, setServerUrl] = useState(getOriginalServerUrl());
	const [serverFind, setServerFind] = useState({ places: [] });


	var find = {
		serverFind
	}

	var findActions = {
		setServerFind: setServerFind
	}

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
		let found, name, index, latitude, longitude, findResponse;
		const map1 = new Map();

		try {
			const requestBody = {
				requestType: 'find', match: match, type: type, where: where, limit: limit
			};
			findResponse = await sendAPIRequest(requestBody, serverURL);

			found = findResponse.found;
			if (findResponse.found > limit) {
				found = limit;
			} setFound(found);

			if (findResponse) {
				processServerFindSuccess(findResponse, serverUrl);
				for (var i = 0; i < found; i++) {
					places = findResponse.places[i];
					name = places.locationFeatures.name;
					index = places.locationFeatures.index;
					latitude = places.locationFeatures.latitude;
					longitude = places.locationFeatures.longitude;
					map1.set('index', index);
					map1.set('name', name);
					map1.set('latitude', latitude);
					map1.set('longitude', longitude);
					//console.log(map1.get('name'));
					show(map1, found);
				}
			} else {
				setServerFind({ places: [] });
			}
		} catch (error) { console.log(error); }

		return [{ serverUrl: serverUrl, serverFind: serverFind }, processServerFindSuccess,];
	}

}
