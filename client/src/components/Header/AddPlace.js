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
import { usePlaces, appendPlace } from '../../hooks/usePlaces';
import { render } from '@testing-library/react';

export default function AddPlace(props) {
	var [foundPlace, setFoundPlace] = useState();
	var [foundNamePlace, setFoundNamePlace] = useState(); // --- 1 -----//
	const [coordString, setCoordString] = useState('');
	const [nameString, setNameString] = useState('');// --- 1 -----//
	const [finalPlaceArr, setFinalPlaceArr] = useState([]) // --- 1 -----//
	var limit = 5; // --- 5 -----//
	const findSettings = useFind(nameString, limit, getOriginalServerUrl()); // --- 5 -----//

	return (
		<Modal isOpen={props.isOpen} toggle={props.toggleAddPlace}>
			<AddPlaceHeader
				toggleAddPlace={props.toggleAddPlace}
				setNameString={setNameString}
				setFinalPlaceArr={setFinalPlaceArr}
				setFoundNamePlace={setFoundNamePlace}
			/>
			<PlaceCoordSearch
				foundPlace={foundPlace}
				setFoundPlace={setFoundPlace}
				coordString={coordString}
				setCoordString={setCoordString}
			/>

			<AddCoordFooter
				append={props.append}
				foundPlace={foundPlace}
				setCoordString={setCoordString}
				setFoundPlace={setFoundPlace}
			/>

			<PlaceNameSearch
				foundNamePlace={foundNamePlace}
				setFoundNamePlace={setFoundNamePlace}
				setNameString={setNameString}
			/> {/* 5*/}

			{/* <Add
				finalPlaceArr={finalPlaceArr}
				setFinalPlaceArr={setFinalPlaceArr}
				appendPlace={props.appendPlace}
			/>
 */}
			<AddNameFooter
				appendPlace={props.appendPlace}
				setNameString={setNameString}
				setFoundPlace={setFoundPlace}
				setFoundNamePlace={setFoundNamePlace}
				foundNamePlace={foundNamePlace}
				nameString={nameString}
				setFinalPlaceArr={setFinalPlaceArr}
			/>{/* 6 */}
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

// ---  5 ----//
function PlaceNameSearch(props) {
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
				<PlaceNameInfo foundNamePlace={props.foundNamePlace} />
			</Col>
		</ModalBody >
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

// ---  5 ----//
function PlaceNameInfo(props) {
	return (
		<div>
			<br />
			<div id="outerDivElement" className="list-group adjustList container"></div>
		</div>
	);
}

// ---  2 ----//
function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

// --- 2 ----//
function splitIso_Region(str) {
	const result = str.split('-');
	return result;
}

/* function Add(props) {
	console.log(props.finalPlaceArr)
		//props.appendPlace(props.setFinalPlaceArr)	
 } */

/* function AddOrDeletePlaceListItems(props) {
	const buttons = document.querySelectorAll('.arrList');
	buttons.forEach(el => el.addEventListener('click', () => {
		
			newPlace = new Place({ latitude: lat, longitude: lng, name: name, index: index, municipality: municipality, iso_region: iso_region });
		props.setFinalPlaceArr(finalPlaceArr => [...finalPlaceArr, index, newPlace]);
		verifyPlacesName(newPlace, props.setFoundNamePlace);
		document.addEventListener('click', function handleClick(event) {
			event.target.classList.add('active');
			event.target.classList.add('disabled');
		});
	}))
	return (null);
} */

// ---  3 ----//
export function placesList(places, limit, props) {
	let splitIso_RegionResults = splitIso_Region(places.region)
	var parent = document.querySelector('#outerDivElement');
	var buttonsAmount = document.querySelectorAll('#outerDivElement button');
	var buttonElement = document.createElement('button');
	var buttonElementtext = document.createTextNode("+");
	var divElement = document.createElement('div');
	//props.setFinalPlaceArr(finalPlaceArr => [...finalPlaceArr, places]);

	if (limit != 0 && buttonsAmount.length < limit) {
		buttonElement.setAttribute("type", "button");
		buttonElement.setAttribute("data-testid", "add-place-btn");
		buttonElement.setAttribute("class", "addPlace-btn btn btn-primary");
		buttonElement.setAttribute("style", "margin-left: auto; float: right; margin-bottom: 1em;");
		//buttonElement.addEventListener("click", function () { Add(props.finalPlaceArr) });

		parent.appendChild(divElement);
		var divElementtext = document.createTextNode(places.name + ", " + places.municipality + ", " + splitIso_RegionResults[1] + ", " + splitIso_RegionResults[0])
		divElement.appendChild(divElementtext);
		var linebreak = document.createElement('br');
		divElement.appendChild(linebreak);
		divElementtext = document.createTextNode(places.latitude + ", " + places.longitude);
		divElement.appendChild(divElementtext);
		divElement.appendChild(buttonElement);
		buttonElement.appendChild(buttonElementtext);

	} else if (limit == 0) {
		removeAllChildNodes(parent);
		removeAllChildNodes(divElement);
		removeAllChildNodes(buttonElement);
		divElementtext = document.createTextNode("No Results Found"),
			divElement.setAttribute("data-testid", "places-notfound");
		divElement.setAttribute("style", "text-align: center");
		parent.appendChild(divElement);
		divElement.appendChild(divElementtext);
	} else {
		removeAllChildNodes(parent);
		removeAllChildNodes(divElement);
		removeAllChildNodes(buttonElement);
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
				}}
				data-testid='add-coord-button'
				disabled={!props.foundPlace}
			>
				Add Place
			</Button>
		</ModalFooter>
	);
}


// ---  6 ----//
function AddNameFooter(props) {
	return (
		<ModalFooter>
			{Clear(props)}
		</ModalFooter>
	);
}

function Clear(props) {
	return (
		<Button
			color='danger'
			onClick={() => {
				props.setNameString('');
				props.setFoundNamePlace('');
			}}
			data-testid='add-clear-button'
		//disabled={!props.foundNamePlace}
		>
			Clear Search
		</Button>
	)
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

// ---  2 ----//
export function verifyPlacesName(places, setFoundNamePlace) {
	try {
		setFoundNamePlace(places);
	} catch (error) {
		setFoundNamePlace(undefined);
	}
}

function isLatLngValid(lat, lng) {
	return (lat !== undefined && lng !== undefined);
}
