import React, { useEffect, useState } from 'react';
import {
	Button,
	Col,
	Modal,
	ModalBody,
	ModalHeader,
	Input,
	Collapse,
	ModalFooter
} from 'reactstrap';
import Coordinates from 'coordinate-parser';
import { reverseGeocode } from '../../utils/reverseGeocode';
import { getOriginalServerUrl } from '../../utils/restfulAPI';
import { useFind } from '../../hooks/useFind';
import { Place } from '../../models/place.model';

export default function AddPlace(props) {
	var [foundPlace, setFoundPlace] = useState();
	const [coordString, setCoordString] = useState('');
	//const [nameString, setNameString] = useState('');	// ---  1 ----//
	//var limit = 5;  									// ---  - ----//
	//useFind(nameString, limit, getOriginalServerUrl()); // ---  - ----//

	return (
		<Modal isOpen={props.isOpen} toggle={props.toggleAddPlace}>
			<AddPlaceHeader toggleAddPlace={props.toggleAddPlace} />
			<PlaceCoordSearch
				foundPlace={foundPlace} setFoundPlace={setFoundPlace}
				coordString={coordString} setCoordString={setCoordString}
			/>
			<AddCoordFooter append={props.append} foundPlace={foundPlace}
				setCoordString={setCoordString} setFoundPlace={setFoundPlace}
			/>
			{/* <PlaceNameSearch nameString={nameString} setNameString={setNameString} /> */}{/* 1 */}
			{/* <Add appendPlace={props.appendPlace} /> */}{/* 3 */}
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
// ---  1 ----//
/* function PlaceNameSearch(props) {
	return (
		<ModalBody >
			<Col>
				<Input
					type='search' id='search-name'
					onChange={(input) => props.setNameString(input.target.value)}
					placeholder='Enter Name'
					data-testid='name-input'
					value={props.nameString}
				/>
				<PlaceNameInfo />
			</Col>
		</ModalBody >
	);
} */
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

// ---  1 ----//
/* function PlaceNameInfo() {
	return (
		<div>
			<br />
			<div id="outerDivElement" className="list-group"></div>
		</div>
	);
} */


// ---  3 ----//
/* function Add(props) {
	try {
		var newPlace = ['']
		const buttons = document.querySelectorAll('.addPlace-btn');
		buttons.forEach(el => el.addEventListener('click', () => {
			const text = el.getAttribute("data-latlng").toString(), name = el.getAttribute("data-name"),
				municipality = el.getAttribute("data-municipality"), region = el.getAttribute("data-region"),
				country = el.getAttribute("data-country"), latLngPlace = new Coordinates(text),
				lat = latLngPlace.getLatitude().toString(), lng = latLngPlace.getLongitude().toString();
			newPlace = new Place({ latitude: lat, longitude: lng, name: name, municipality: municipality, region: region, country: country });
			props.appendPlace(newPlace);
		}));
	} catch (e) { }
	return (null);
} */

// ---  2 ----//
/* function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
} */

// --- 2 ----//
/* function splitIso_Region(str) {
	const result = str.split('-');
	return result;
} */

// ---  2 ----//
/* export function placesList(places, limit) {
	const splitIso_RegionResults = splitIso_Region(places.region), parent = document.querySelector('#outerDivElement'), buttonsAmount = document.querySelectorAll('#outerDivElement button'), buttonElement = document.createElement('button'),
		buttonElementtext = document.createTextNode("+"), divElement = document.createElement('div');
	if (limit != 0 && buttonsAmount.length < limit) {
		buttonElement.setAttribute("type", "button");
		buttonElement.setAttribute("data-testid", "add-place-btn");
		buttonElement.setAttribute("class", "addPlace-btn btn btn-primary btn_adjust");
		buttonElement.setAttribute("style", "margin-left: auto; float: right; margin-bottom: 1em;");
		buttonElement.setAttribute("data-name", places.name);
		buttonElement.setAttribute("data-latlng", places.latitude + "," + places.longitude);
		buttonElement.setAttribute("data-municipality", places.municipality);
		buttonElement.setAttribute("data-region", splitIso_RegionResults[1]);
		buttonElement.setAttribute("data-country", splitIso_RegionResults[0]);
		buttonElement.addEventListener("click", function () { Add() }); // ---  3 ----//
		divElement.setAttribute("class", "div_adjust");
		parent.appendChild(divElement);
		var divElementtext = document.createTextNode(places.name + ", " + places.municipality + ", " + splitIso_RegionResults[1] + ", " + splitIso_RegionResults[0])
		divElement.appendChild(divElementtext);
		var linebreak = document.createElement('br'); divElement.appendChild(linebreak);
		divElementtext = document.createTextNode("(" + places.latitude + ", " + places.longitude + ")");
		divElement.appendChild(divElementtext);
		divElement.appendChild(buttonElement);
		buttonElement.appendChild(buttonElementtext);
	} else {
		removeAllChildNodes(parent);
	}
} */

function AddCoordFooter(props) {
	return (
		<ModalFooter>
			<Button
				color='primary'
				onClick={() => {
					props.append(props.foundPlace);
					props.setCoordString('');
				}}
				data-testid='add-coord-button'
				disabled={!props.foundPlace}
			>
				Add Place
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

function isLatLngValid(lat, lng) {
	return (lat !== undefined && lng !== undefined);
}
