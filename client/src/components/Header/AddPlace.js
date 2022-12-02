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
import { LOG } from '../../utils/constants';
import { reverseGeocode } from '../../utils/reverseGeocode';
import { getOriginalServerUrl, sendAPIRequest } from '../../utils/restfulAPI';
import { useFind } from '../../hooks/useFind';
import { Place } from '../../models/place.model';

export default function AddPlace(props) {
	var [foundPlace, setFoundPlace] = useState();
	var [foundNamePlace, setFoundNamePlace] = useState();
	const [coordString, setCoordString] = useState('');
	const [nameString, setNameString] = useState('');
	var [limit, setLimit] = useState(10);
	var [found, setFound] = useState(0);
	var [index, setIndex] = useState(1);

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
				index={index}
				setIndex={setIndex}
				foundPlace={foundPlace}
				setFoundPlace={setFoundPlace}
				foundNamePlace={foundNamePlace}
				setFoundNamePlace={setFoundNamePlace}
				nameString={nameString}
				setNameString={setNameString}
				findSettings={findSettings}
				found={found}
				setFound={setFound}
			/>
			<AddNameFooter
				append={props.append}
				foundPlace={foundPlace}
				setNameString={setNameString}
				setFoundPlace={setFoundPlace}

			/>
			<AddOrDeletePlaceListItems
				append={props.append}
				foundPlace={foundPlace}
				setFoundPlace={setFoundPlace}
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
	/* useEffect(() => {
		document.getElementById('search-name').onkeyup = function () {
			verifyPlacesName(props.findSettings, props.setFoundPlace); //FIXME: Convert to lat/lng return from clicked
		}
	}, [props.nameString]); */

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
				<PlaceNameInfo foundNamePlace={props.foundPlace} />
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
		//<Collapse isOpen={!!props.foundNamePlace}>
		<ModalBody>
			<div id="outerDivElement" className="list-group adjustList"></div>
			{props.foundPlace}
		</ModalBody>
		//</Collapse>
	);
}

function AddOrDeletePlaceListItems(props) {
	let buttons = document.querySelectorAll('.arrList');
	let placeArr = [];
	buttons.forEach(el => el.addEventListener('click', () => {
		const text = el.getAttribute("latlng");
		const latLngPlace = new Coordinates(text);
		const lat = latLngPlace.getLatitude();
		const lng = latLngPlace.getLongitude();
		const formattedLatLng = lat + "," + lng;
		const index = placeArr.indexOf(formattedLatLng);

		//verifyCoordinates(formattedLatLng, props.setFoundPlace);
		/* document.addEventListener('click', function handleClick(event) {
			event.target.classList.add('active');
			verifyCoordinates(formattedLatLng, props.setFoundPlace); 
		});*/
		//FIXME:Adds and Deletes Lat/Lng to map
		if (index > -1) {
			placeArr.splice(index, 1);
			console.log('deleted', placeArr)
			document.addEventListener('click', function handleClick(event) {
				event.target.classList.remove('active');
			});
			//index--;
		} else {
			placeArr.push(formattedLatLng);
			console.log('added: ', placeArr)
			document.addEventListener('click', function handleClick(event) {
				event.target.classList.add('active');
				verifyPlacesName(formattedLatLng, props.setFoundPlace);
			});
			//index ++;
			//return verifyCoordinates(props.placeArr, props.setFoundPlace);
		}
	}))
	return (null);
}

function removeAllChildNodes(parent) {
	while (parent.firstChild) {
		parent.removeChild(parent.firstChild);
	}
}

export function placesList(places, limit) {
	places["name"] = [{ "index": places.get('index'), "name": places.get('name'), "latitude": places.get('latitude'), "longitude": places.get('longitude') }];
	let buttonElementtext = document.createTextNode("")
	let parent = document.querySelector('#outerDivElement')
	let buttonElement = document.createElement('button');
	var buttonsAmount = document.querySelectorAll('#outerDivElement button');
	if (limit > 0) {
		if (buttonsAmount.length < 10) {
			buttonElementtext = document.createTextNode(`${places.get('name')}`)
			buttonElement.setAttribute("index", `${places.get('index')}`);
			buttonElement.setAttribute("latlng", `${places.get('latitude')}` + "," + `${places.get('longitude')}`);
			buttonElement.setAttribute("id", "places" + `${places.get('index')}` + "-btn");
			buttonElement.setAttribute("data-testid", "places" + `${places.get('index')}` + "-btn");
			buttonElement.setAttribute("type", "button");
			buttonElement.setAttribute("class", "arrList list-group-item list-group-item-action list-group-item-mine");
			parent.appendChild(buttonElement);
			buttonElement.appendChild(buttonElementtext);
		} else {
			removeAllChildNodes(parent);
		}
	} else {
		removeAllChildNodes(parent);
		let divElement = document.createElement('div');
		divElement.setAttribute("id", "places-notfound");
		divElement.setAttribute("data-testid", "places-notfound");
		divElement.setAttribute("style", "text-align: center");
		let divElementtext = document.createTextNode("No Results Found");
		<br />
		divElement.appendChild(divElementtext);
		parent.appendChild(divElement);
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

function AddNameFooter(props) {
	return (
		<ModalFooter>
			<Button
				color='primary'
				onClick={() => {
					props.append(props.foundPlace);
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
	//console.log("Coord-coordString: ", coordString);
	//console.log("Coord-setFoundPlace: ", setFoundPlace);
	try {

		const latLngPlace = new Coordinates(coordString);
		const lat = latLngPlace.getLatitude();
		const lng = latLngPlace.getLongitude();
		if (isLatLngValid(lat, lng)) {
			const fullPlace = await reverseGeocode({ lat, lng });
			//props.append(props.foundPlace);
			setFoundPlace(fullPlace);
		}
	} catch (error) {
		//console.log(error);
		setFoundPlace(undefined);
	}
}
// FIXME:convert to add to map with own DB
async function verifyPlacesName(searchedCoordString, setFoundPlace) {
	console.log("Place-searchedCoordString: ", searchedCoordString);
	//console.log("Place-setFoundPlace: ", setFoundPlace);
	try {

		const latLngPlace = new Coordinates(searchedCoordString);
		const lat = latLngPlace.getLatitude();
		const lng = latLngPlace.getLongitude();
		if (isLatLngValid(lat, lng)) {
			const fullPlace = /* await reverseGeocode({ lat, lng }); */
				setFoundPlace(lat, lng);
			console.log("Place-fullPlace: ", fullPlace);
		}
	} catch (error) {
		//console.log(error);
		setFoundPlace(undefined);
	}
}

function isLatLngValid(lat, lng) {
	return (lat !== undefined && lng !== undefined);
}

function isPlaceValid(nameString) {
	return (nameString !== undefined);
}
