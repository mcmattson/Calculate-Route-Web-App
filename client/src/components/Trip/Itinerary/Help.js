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
			</div>
		</ModalBody>
	);
}