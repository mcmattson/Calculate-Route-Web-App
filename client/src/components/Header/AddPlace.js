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
import { getOriginalServerUrl, sendAPIRequest } from '../../utils/restfulAPI';
import { useFind } from '../../hooks/useFind';
import { Place } from '../../models/place.model';

export default function AddPlace(props) {
	var [foundPlace, setFoundPlace] = useState();
	var [foundNamePlace, setFoundNamePlace] = useState();
	const [coordString, setCoordString] = useState('');
	const [nameString, setNameString] = useState('');
	const [finalPlaceArr, setFinalPlaceArr] = useState([])
	var limit = 5;
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
				foundPlace={foundPlace}
				setCoordString={setCoordString}
				setFoundPlace={setFoundPlace}
			/>

			<PlaceNameSearch
				foundNamePlace={foundNamePlace}
				setFoundNamePlace={setFoundNamePlace}
				setNameString={setNameString}
				findSettings={findSettings}
			/>

			<AddOrDeletePlaceListItems
				setFoundNamePlace={setFoundNamePlace}
				setFinalPlaceArr={setFinalPlaceArr}
			/>

			<AddNameFooter
				appendPlace={props.appendPlace}
				setNameString={setNameString}
				setFoundPlace={setFoundPlace}
				setFoundNamePlace={setFoundNamePlace}
				foundNamePlace={foundNamePlace}
				finalPlaceArr={finalPlaceArr}
				setFinalPlaceArr={setFinalPlaceArr}
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

	}, [props.nameString]);
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

function PlaceNameInfo(props) {
	return (
		<ModalBody>
			<div id="outerDivElement" className="list-group adjustList"></div>
		</ModalBody>
	);
}

function AddOrDeletePlaceListItems(props) {
	const buttons = document.querySelectorAll('.arrList');
	const placeArr = [];
	let newPlace = '';
	buttons.forEach(el => el.addEventListener('click', () => {
		const text = el.getAttribute("latlng").toString(),
			name = el.getAttribute("name"),
			index = el.getAttribute("index"),
			municipality = el.getAttribute("municipality"),
			iso_region = el.getAttribute("iso_region"),
			latLngPlace = new Coordinates(text),
			lat = latLngPlace.getLatitude().toString(),
			lng = latLngPlace.getLongitude().toString(),
			newPlace = new Place({ latitude: lat, longitude: lng, name: name, index: index, municipality: municipality, iso_region: iso_region });

		placeArr.push(index, newPlace);
		props.setFinalPlaceArr(finalPlaceArr => [...finalPlaceArr, index, newPlace]);
		verifyPlacesName(newPlace, props.setFoundNamePlace);
		document.addEventListener('click', function handleClick(event) {
			event.target.classList.add('active');
			event.target.classList.add('disabled');
		});

	}))
	return (null);
}

function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

function splitIso_Region(str) {
	const result = str.split('-');
	return result;
}

export function placesList(places, limit) {
	places["name"] = [{ "index": places.get('index'), "name": places.get('name'), "latitude": places.get('latitude'), "longitude": places.get('longitude'), "municipality": places.get('municipality'), "iso_region": places.get('iso_region') }];
	let splitIso_RegionResults = splitIso_Region(places.get('iso_region'));
	var parent = document.querySelector('#outerDivElement'),
		buttonsAmount = document.querySelectorAll('#outerDivElement button');
	var buttonElement = document.createElement('button');
	var buttonElementtext = document.createTextNode("");
	if (limit != 0 && buttonsAmount.length < limit) {
		buttonElementtext = document.createTextNode(`${places.get('name')}` + ", " + `${places.get('municipality')}` + ", " + splitIso_RegionResults[1] + ", " + splitIso_RegionResults[0]);
		buttonElement.setAttribute("name", `${places.get('name')}`);
		buttonElement.setAttribute("index", `${places.get('index')}`);
		buttonElement.setAttribute("latlng", `${places.get('latitude')}` + "," + `${places.get('longitude')}`);
		buttonElement.setAttribute("id", "places" + `${places.get('index')}` + "-btn"); buttonElement.setAttribute("data-testid", "places" + `${places.get('index')}` + "-btn");
		buttonElement.setAttribute("type", "button"); buttonElement.setAttribute("class", "arrList list-group-item list-group-item-action");
		parent.appendChild(buttonElement);
		buttonElement.appendChild(buttonElementtext);
	} else if (limit ==0){
		removeAllChildNodes(parent);
		const divElementtext = document.createTextNode("No Results Found"), divElement = document.createElement('div'); divElement.setAttribute("id", "places-notfound");
		divElement.setAttribute("data-testid", "places-notfound"); divElement.setAttribute("style", "text-align: center");
		divElement.appendChild(divElementtext);
		parent.appendChild(divElement);
	} else {
		removeAllChildNodes(parent);
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
function mapCorrection(array) {
	let i = array.length;
	while (i--) (i) % 2 === 0 && (array.splice(i, 1));//Remove Indexing Numbers
	const unique = [...new Map(array.map((m) => [m.name, m])).values()];//Remove Duplicates
	return unique
}

function resolveAfterSeconds() {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve('resolved');
		}, 10);
	});
}

function AddNameFooter(props) {
	return (
		<ModalFooter>
			<Button
				color='primary'
				onClick={() => {
					async function asyncCall() {
						const unique = mapCorrection(props.finalPlaceArr);
						while (unique.length != 0) {
							const result = await resolveAfterSeconds();
							unique.splice(-1, unique.length).forEach(function (unique) { props.appendPlace(unique); console.log(unique); return result; })
						}
					} asyncCall();
					props.setNameString(''); props.setFinalPlaceArr(''); /* props.setFoundNamePlace(''); */
				}} data-testid='add-name-button' disabled={!props.foundNamePlace}
			>Add Place(s)
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
