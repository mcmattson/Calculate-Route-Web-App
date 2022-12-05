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
	const [nameCoordString, setNameCoordString] = useState('');
	const [finalPlaceArr, setFinalPlaceArr] = useState([])
	const [query, setQuery] = useState("")
	var [limit, setLimit] = useState(10);
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
				limit={limit}
			/>

			<AddNameFooter
				appendPlace={props.appendPlace}
				foundPlace={foundPlace}
				setNameString={setNameString}
				setFoundPlace={setFoundPlace}
				nameString={nameString}
				setLimit={setLimit}
				limit={limit}
				foundNamePlace={foundNamePlace}
				finalPlaceArr={finalPlaceArr}
				setFinalPlaceArr={setFinalPlaceArr}
				setFoundNamePlace={setFoundNamePlace}
			/>

			<AddOrDeletePlaceListItems
				appendPlace={props.appendPlace}
				foundPlace={foundPlace}
				setFoundPlace={setFoundPlace}
				foundNamePlace={foundNamePlace}
				setFoundNamePlace={setFoundNamePlace}
				setNameCoordString={setNameCoordString}
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
		<ModalBody>
			<div id="outerDivElement" className="list-group adjustList"></div>
		</ModalBody>
	);
}

function AddOrDeletePlaceListItems(props) {
	let buttons = document.querySelectorAll('.arrList');
	let placeArr = [];
	var newPlace = '';
	buttons.forEach(el => el.addEventListener('click', () => {
		const text = el.getAttribute("latlng").toString();
		const name = el.getAttribute("name");
		const index = el.getAttribute("index");
		const latLngPlace = new Coordinates(text);
		const lat = latLngPlace.getLatitude().toString();
		const lng = latLngPlace.getLongitude().toString();
		const formattedLatLng = lat + "," + lng;
		const i = placeArr.indexOf(index);
		newPlace = new Place({ latitude: lat, longitude: lng, name: name, index: index });


		//FIXME:Adds and Deletes Lat/Lng to map
		if (i > -1) {
			placeArr.splice(i, 3);
			console.log('deleted', placeArr)
			document.addEventListener('click', function handleClick(event) {
				event.target.classList.remove('active');
				event.target.classList.remove('disabled');
			});

		} else {
			placeArr.push(index, newPlace);
			props.setFinalPlaceArr(finalPlaceArr => [...finalPlaceArr, index, newPlace]);
			verifyPlacesName(newPlace, props.setFoundNamePlace)
			document.addEventListener('click', function handleClick(event) {
				event.target.classList.add('active');
				event.target.classList.add('disabled');
			});
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
			buttonElement.setAttribute("name", `${places.get('name')}`);
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
function mapCorrection(array) {
	//Remove Indexing Numbers
	let i = array.length;
	while (i--) (i) % 2 === 0 && (array.splice(i, 1));
	//Remove Duplicates
	const unique = [...new Map(array.map((m) => [m.name, m])).values()];
	return unique
}

function AddNameFooter(props) {
	return (
		<ModalFooter>
			<Button
				color='primary'
				onClick={() => {
					let unique = mapCorrection(props.finalPlaceArr)

					//-- Append to Map--//
					function resolveAfter2Seconds() {
						return new Promise(resolve => {
							setTimeout(() => {
								resolve('resolved');
							}, 10);
						});
					}

					async function asyncCall() {
						console.log('calling');
						while (unique.length != 0) {
							const result = await resolveAfter2Seconds();
							unique.splice(-1, 1).forEach(function (unique) {
								props.appendPlace(unique);
								console.log(result);
								console.log(unique);
							})		
						}
						
					}
					asyncCall();
					
					//Clear Results and Input box
					props.setNameString('');
					props.setFinalPlaceArr('');
					props.setFoundNamePlace('');
				}}
				data-testid='add-name-button'
				disabled={!props.foundNamePlace}
			>
				Add Place(s)
			</Button>

			<Button
				color='danger'
				onClick={() => {
					props.setNameString('');
					props.setFinalPlaceArr('');
					props.setFoundNamePlace('');
				}}
				data-testid='add-clear-button'
				disabled={!props.foundNamePlace}
			>
				Clear Search
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

export async function verifyPlacesName(places, setFoundNamePlace) {
	try {
		setFoundNamePlace(places);
	} catch (error) {
		setFoundNamePlace(undefined);
	}
}

function isLatLngValid(lat, lng) {
	return (lat !== undefined && lng !== undefined);
}

function isPlaceValid(nameString) {
	return (nameString !== undefined);
}
