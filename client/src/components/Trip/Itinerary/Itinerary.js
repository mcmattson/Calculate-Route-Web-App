import React, { useState, useEffect } from 'react';
import { useToggle } from '../../../hooks/useToggle';
import { Table, Collapse } from 'reactstrap';
import { latLngToText, placeToLatLng } from '../../../utils/transformers';
import { BsChevronDown } from 'react-icons/bs';
import { LOG } from '../../../utils/constants';
import PlaceActions from './PlaceActions';
import { getOriginalServerUrl, sendAPIRequest } from '../../../utils/restfulAPI';
//import {useDistances} from '../Page';

export default function Itinerary(props) {
	const [distanceSettings, processServerDistanceSuccess] = useDistances(props.places);
	return (
		<Table responsive>
			<TripHeader
				tripName={props.tripName}
			/>
			<PlaceList
				places={props.places}
				placeActions={props.placeActions}
				selectedIndex={props.selectedIndex}
				distanceSettings= {distanceSettings}

			/>
		</Table>
	);
}

function TripHeader(props) {
	return (
		<thead>
			<tr>
				<th
					className='trip-header-title'
					data-testid='trip-header-title'
				>
					{props.tripName}
				</th>
				<th> Kilometers </th>
			</tr>
		</thead>
	);
}

function PlaceList(props) {
	return (
		<tbody>
			{props.places.map((place, index) => (
				<PlaceRow
					key={`table-${JSON.stringify(place)}-${index}`}
					place={place}
					placeActions={props.placeActions}
					selectedIndex={props.selectedIndex}
					index={index}
					distanceSettings = {props.distanceSettings}
				/>
			))}
		</tbody>
	);
}

function PlaceRow(props) {
	const [showFullName, toggleShowFullName] = useToggle(false);
	const name = props.place.defaultDisplayName;
	const location = latLngToText(placeToLatLng(props.place));
	let distances = [9, 10, 11, 12, 99, 2, 44, 2, 5]; // for testing purposes. 
	if (props.distanceSettings.serverDistance){ 
		
	 	distances = props.distanceSettings.serverDistance.distances;
		
	}

	return (
		<tr className={props.selectedIndex === props.index ? 'selected-row' : ''}>
			<td
				data-testid={`place-row-${props.index}`}
				onClick={() =>
					placeRowClicked(
						toggleShowFullName,
						props.placeActions.selectIndex,
						props.index
					)
				}
			>
				<strong>{name}</strong>
				<AdditionalPlaceInfo showFullName={showFullName} location={location} placeActions={props.placeActions} index={props.index} place={props.place}/>
			</td>
			<td align='right'> {distances[props.index]} </td>
			<RowArrow toggleShowFullName={toggleShowFullName} index={props.index}/>
		</tr>
	);
}//ADD in distances.get(props.distanceIndex)

function AdditionalPlaceInfo(props) {
	return (
		<Collapse isOpen={props.showFullName}>
			{props.place.formatPlace().replace(`${props.place.defaultDisplayName}, `, '')}
			<br />
			{props.location}
			<br />
			<PlaceActions placeActions={props.placeActions} index={props.index} />
		</Collapse>
	);
}

function placeRowClicked(toggleShowFullName, selectIndex, placeIndex) {
	toggleShowFullName();
	selectIndex(placeIndex);
}

function RowArrow(props) {
	return (
		<td>
			<BsChevronDown data-testid={`place-row-toggle-${props.index}`} onClick={props.toggleShowFullName}/>
		</td>
	);
}
function useDistances(places) {
	const [serverUrl, setServerUrl] = useState(getOriginalServerUrl());
	const [serverDistance, setServerDistance] = useState({distances: []});

	useEffect(() => {
		sendDistanceRequest();
	}, [places]);

	function processServerDistanceSuccess(distance, url) {
		LOG.info('Switching to Server:', url);
		setServerDistance(distance);
		setServerUrl(url);
	}

	async function sendDistanceRequest() {
		const distanceResponse = await sendAPIRequest({ 
			requestType: 'distances', 
			places : places,
			earthRadius : 6571} , serverUrl); //Kilometers
		if (distanceResponse) {
			processServerDistanceSuccess(distanceResponse, serverUrl);
		} else {
			setServerDistance({distances: []});
			//showMessage(`Distance request to ${serverUrl} failed. Check the log for more details.`, 'error');
		}
	}

	return [{ serverUrl: serverUrl, serverDistance: serverDistance }, processServerDistanceSuccess,];
}

