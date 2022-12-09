import React from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { BsInfoCircleFill } from 'react-icons/bs';

export default function Help(props) {
	function clear(){
		props.toggleHelp();
	}
	return( 
		<Modal isOpen={props.isOpen} toggle={clear}>
			<HelpHeader toggleHelp={clear}/>
			<HelpBody/>
		</Modal>
	);
}

function HelpHeader(props){
	return(
		<ModalHeader toggle={props.toggleHelp}>
			{<BsInfoCircleFill/>} 
		</ModalHeader>
	);
}

function HelpBody(props){
	return(
		<ModalBody>
			<div style={{fontSize: '18px'}}>
				<h1><strong>Instructions</strong></h1>
				<p>1. The button in the top right will display the dropdown menu</p>
				<p>2. Click about in the dropdown to see the team about page</p>
				<p>3. Add home will add a location to the map at CSU</p>
				<p>4. Add place will allow you to search for places and add them to the trip</p>
				<p>5. Load file allows you to load in a predetermined trip</p>
				<p>6. The remove all button is available in the drop down and on th UI, which will clear your trip</p>
				<p>7. Switch the server using server settings</p>

			</div>
		</ModalBody>
	);
}