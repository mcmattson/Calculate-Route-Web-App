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
import { reversePlacecode } from '../../utils/reversePlacecode';

export default function AddPlace(props) {
	const [foundPlace, setFoundPlace] = useState();
	const [coordString, setCoordString] = useState('');
	return (
		<Modal isOpen={props.isOpen} toggle={props.toggleAddPlace}>
			<AddPlaceHeader toggleAddPlace={props.toggleAddPlace} />
			<PlaceSearch
				foundPlace={foundPlace}
				setFoundPlace={setFoundPlace}
				coordString={coordString}
				setCoordString={setCoordString}
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
					placeholder='Enter Coordinates (Lat, Long) or Search Term'
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
			<ModalBody>
				<br />
				<Input
					type="checkbox"
					onClick={() => {
						console.log('Seclection made');
					}
					}
					data-testid='add-place-checkbox'
				>
				</Input>
				{props.foundPlace?.formatPlace()}
			</ModalBody>
		</Collapse>
	);
}

function AddPlaceFooter(props) {
	return (
		<ModalFooter>
			<Button
				color='primary'
				onClick={() => {
					//TODO: add selction list to Map/Itinerary
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
			const fullPlace = await reversePlacecode(nameString);
			setFoundPlace(fullPlace);
		}
	} catch (error) {
		setFoundPlace(undefined);
	}
}

function isPlaceValid(coordString) {
	return (coordString !== undefined);
}

function isLatLngValid(lat, lng) {
	return (lat !== undefined && lng !== undefined);
}

function useFind(match) {
	const [serverUrl, setServerUrl] = useState(getOriginalServerUrl());
	const [serverFind, serServerFind] = useState({ places: [] });

	useEffect(() => {
		sendFindRequest();
	}, [match]);

	function processServerFindSuccess() { }

	async function sendFindRequest() { }

	return null;
}