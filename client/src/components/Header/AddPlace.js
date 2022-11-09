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
import { reverseGeocode } from '../../utils/reverseGeocode';
import { getOriginalServerUrl, sendAPIRequest } from '../../utils/restfulAPI';
import { LOG } from '../../utils/constants';

export default function AddPlace(props) {
	const [foundPlace, setFoundPlace] = useState();
	const [places, setPlaces] = useState([]);
	const [coordString, setCoordString] = useState('');
	return (
		<Modal isOpen={props.isOpen} toggle={props.toggleAddPlace}>
			<AddPlaceHeader toggleAddPlace={props.toggleAddPlace} />
			<PlaceSearch
				foundPlace={foundPlace}
				setFoundPlace={setFoundPlace}
				coordString={coordString}
				setCoordString={setCoordString}
				places = {places}
				setPlaces = {setPlaces}
			/>
			<AddPlaceFooter
				append={props.append}
				foundPlace={foundPlace}
				setCoordString={setCoordString}
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
	return value.length >= 3;
}

function PlaceSearch(props) {
	useEffect(() => {
		document.getElementById('search').onkeyup = function () {
			if (textLength(this.value))
				console.log("Return Place Search"); //replace with verifyPlace Function
		}
	}, [props.nameString]);

	if (!props.coordString) {
		useEffect(() => {
			verifyCoordinates(props.coordString, props.setFoundPlace);		
		}, [props.coordString]);
	}

	else{
		let response = useFind(props.coordString, props.places, props.setPlaces);
		props.setPlaces(response.ServerFound.places);
	}

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
		let response = useFind(coordString);
		setFoundPlace(response.ServerFound);
	}
}

function isLatLngValid(lat, lng) {
	return (lat !== undefined && lng !== undefined);
}

export function useFind(match, places, setPlaces) {
	const ServerFound = {
		places: places
	}

	const PlaceActions = {
		setPlaces : setPlaces
	}

	useEffect( () => {
		sendFindRequest(match, 10 , getOriginalServerUrl(), PlaceActions);
	}, match);  


	async function sendFindRequest(match, limit, serverUrl, PlaceActions) {
		const findResponse = await sendAPIRequest({
			requestType: 'find',
			match: match,
			limit: limit}, serverUrl);
		if (findResponse) {
			setPlaces(findResponse.places)
		} else {
			setPlaces([]);
			LOG.error(`Find request to ${serverUrl} failed. Check the log for more details.`, "error");
		}
	}

	return {ServerFound};
}