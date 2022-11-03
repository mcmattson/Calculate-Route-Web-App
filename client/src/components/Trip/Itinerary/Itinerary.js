import React, { useState, useEffect } from 'react';
import { useToggle } from '../../../hooks/useToggle';
import { Table, Collapse } from 'reactstrap';
import { latLngToText, placeToLatLng } from '../../../utils/transformers';
import { BsChevronDown } from 'react-icons/bs';
import { LOG } from '../../../utils/constants';
import PlaceActions from './PlaceActions';
import { getOriginalServerUrl, sendAPIRequest } from '../../../utils/restfulAPI';


export default function Itinerary(props) {
	const distanceSettings = useDistances(props.places, 6371.0, getOriginalServerUrl());
	return (
		<Table responsive>
			<TripHeader
				tripName={props.tripName}
				distanceSettings= {distanceSettings}
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
				 <TotalTripDistance distanceSettings = {props.distanceSettings} /> 
			</tr>
			<tr>
				<th
					className='trip-header-title'
					data-testid='trip-header-title'
				>
					{props.tripName}
				</th>
				<th> Leg Distance (Kilometers) </th>
				<th> Cumulative Distance (Kilometers)</th>
			</tr>
		</thead>
	);
}

function TotalTripDistance(props){
	let distances = [0]; 
	if (props.distanceSettings.distances){ 
	 	distances = props.distanceSettings.distances;
	}
	let total = distances.total


	return (
		<th	 data-testid = {'header-total-dist'} > Total Trip Distance (Kilometers): {total}</th>
	)

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
	let distances = [0]; 
	if (props.distanceSettings.distances){ 
		
	 	distances = props.distanceSettings.distances.leg;
		
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
			<CumulativeLegDistance distances = {distances} index = {props.index}/>
			<RowArrow toggleShowFullName={toggleShowFullName} index={props.index}/>
		</tr>
	);
}

function CumulativeLegDistance(props){
    let cumulativeArray = calcCumulative(props.distances);
	return <td data-testid={`place-col-${props.index}`} align='right'> {cumulativeArray[props.index]}</td>

}

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

export function useDistances(places, earthRadius, serverURL) {
    const [leg, setLeg] = useState([]);
    const [cumulative, setCumulative] = useState([]);
    const [total, setTotal] = useState(0);
    
    const distances = {
      leg: leg,
      cumulative: cumulative,
      total: total
    }
    
    const distanceActions = {
      setLeg: setLeg,
      setCumulative: setCumulative,
      setTotal: setTotal
    }
    
    useEffect(() => {makeDistancesRequest(places, earthRadius, serverURL, distanceActions);},
              [places,earthRadius])
  
    return {distances};
}

async function makeDistancesRequest(places, earthRadius, serverURL, distanceActions) {
  
    const {setLeg, setCumulative, setTotal} = distanceActions;
  
    const requestBody = { requestType: "distances", places: places, earthRadius: earthRadius};
    const distancesResponse = await sendAPIRequest(requestBody, serverURL);

    if (distancesResponse) {
        setLeg(distancesResponse.distances);
        setCumulative(calcCumulative(distancesResponse.distances))
        setTotal(calcTotal(distancesResponse.distances))
    }
    else {
      LOG.error(`Distance request to ${serverURL} failed. Check the log for more details.`, "error");
    }
}

function calcCumulative(distances){
    let cummArray = [];
    let total = 0;
    cummArray[0] = 0;
    for (var i = 1; i < distances.length; i++){
       total += distances[i-1];
       cummArray[i] = total;
    }
  return cummArray;
}

function calcTotal(distances){
  let total = 0;
  for (var i = 0; i < distances.length; i++){
     total+= distances[i];
    }
  return total;
}


