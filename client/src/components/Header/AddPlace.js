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
	const { places, selectedIndex } = usePlaces();
	const [coordString, setCoordString] = useState('');
	const [nameString, setNameString] = useState('');
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
			if (textComma(this.value)) {
				verifyCoordinates(props.coordString, props.setFoundPlace);
			}
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
		/* if (isPlaceValid(nameString)) { */
			const fullPlace = useFind(nameString);
			setFoundPlace(fullPlace);
		/* } */
	} catch (error) {
		setFoundPlace(undefined);
	}
}

function isLatLngValid(lat, lng) {
	return (lat !== undefined && lng !== undefined);
}

/* function isPlaceValid(nameString) {
	return (nameString !== undefined);
} */

function useFind(match, serverURL) {
	if (match == undefined) {
		match = "dave";
	}
	console.log(match);
	const [found, setFoundPlace] = useState(1);
	const [places, setPlaces] = useState([]);
	const [limit, setLimit] = useState(1);
	const [type, setType] = useState(['airport']);
	const [where, setWhere] = useState(['United States']);
	const [lng, setLng] = useState();
	const [lat, setLat] = useState();

	const find = {
		type: type,
		where: where,
		limit: limit,
		found: found,
		places: places,

	}

	const findActions = {
		setLng: setLng,
		setLat: setLat,
		setPlaces: setPlaces

	}

	useEffect(() => {
		sendFindRequest(match, serverURL, findActions);
	}, [match, limit])
	return { find };

	async function sendFindRequest(match, serverURL, findActions) {
		const { setLng, setLat, setPlaces, setFoundPlace } = findActions;
		//TODO: FixME
		/* match = "dave"; */
		const requestBody = {
			requestType: 'find', match: match, type: type, where: where, limit: limit
		};
		console.log("requestBody: ", requestBody);
		const findResponse = await sendAPIRequest(requestBody, serverURL);

		if (findResponse) {
			setPlaces(findResponse.find);
		} else {
			setPlaces([]);
			LOG.error(`Find request to ${serverURL} failed. Check the log for more details.`, "error");
		}
		console.log("findResponse: ", findResponse);

	}
}