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

export default function AddPlace(props) {
	const [foundPlace, setFoundPlace] = useState();
	const [coordString, setCoordString] = useState();
	const findSettings = useFind(props.places, 10, getOriginalServerUrl());
	return (
		<Modal isOpen={props.isOpen} toggle={props.toggleAddPlace}>
			<AddPlaceHeader toggleAddPlace={props.toggleAddPlace} />
			<PlaceSearch
				foundPlace={foundPlace}
				setFoundPlace={setFoundPlace}
				coordString={coordString}
				setCoordString={setCoordString}
				findSettings={findSettings}
				places={props.places}
			/>
			<AddPlaceFooter
				append={props.append}
				foundPlace={foundPlace}
				findSettings={findSettings}
				setCoordString={setCoordString}
				places={props.places}
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
			} else if (textLength(this.value)) {
				verifyPlacesName(props.coordString, props.setFoundPlace);
			}
		}
	}, [props.coordString]);
	return (
		<ModalBody>
			<Col>
				<Input
					type='search' id='search'
					onChange={(input) => props.setCoordString(input.target.value)}
					placeholder='Enter Coordinates or Place Name'
					data-testid='coord-input'
					value={props.coordString}
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
	return (coordString == "dave");
}

function useFind(matchStr, listLimit, serverURL) {
	console.log("match: ", matchStr);
	//console.log("limit: ", listLimit);
	//console.log("serverURL: ", serverURL);

	matchStr = "dave";
	listLimit = 10;
	const [found, setFoundPlace] = useState([]);

	const find = {
		found: found
	}

	const findActions = {
		setFoundPlace: setFoundPlace
	}
	
	useEffect(() => {
		sendFindRequest(matchStr, listLimit, serverURL, findActions);
	}, [matchStr, listLimit])

	console.log(find);
	return { find };

	async function sendFindRequest(matchStr, listLimit, serverUrl) {

		const { setPlace, setFound } = findActions;

		const requestBody = { requestType: 'find', matchStr: "dave", listLimit: listLimit};
		const findResponse = await sendAPIRequest(requestBody, serverUrl);

		if (findResponse) {
			setPlace(findResponse.find);
			setFound(findResponse.find);
		} else {
			LOG.error(`Find request to ${serverURL} failed. Check the log for more details.`, "error");

		}
	}

	//return [{ serverUrl: serverUrl, serverFind: serverFind }, processServerFindSuccess,];
}