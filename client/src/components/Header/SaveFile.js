import React, { useState } from "react";
import {
    Button,
    ListGroup,
    ListGroupItem,
} from 'reactstrap';
import { Modal, ModalHeader, ModalFooter, ModalBody } from "reactstrap";
//import { SavedPlaces } from "../../utils/saveTripJSON";
/* import { SavedPlacesCSV } from "../../utils/saveTripCSV";
import { SavedPlacesSVG } from "../../utils/saveTripSVG";
import { SavedPlacesKML } from "../../utils/saveTripKML"; */
//import { Place } from "../../models/place.model";
import { usePlaces } from "../../hooks/usePlaces";
import { useToggle } from '../../hooks/useToggle';


export default function SaveFile(props) {
    const [disallowSave, setDisallowSave] = useState(true)
    //const menuButtons = buildMenuButtons(props);

    function clear() {
        props.toggleSaveFile();
        setDisallowSave(true);
    }

    return (
        <Modal isOpen={props.isOpen} toggle={clear}>
            <SaveFileHeader
                toggleSaveFile={clear}
            />

            <SaveFileBody
                disallowSave={disallowSave}
                setDisallowSave={setDisallowSave}
                placeActions={props.placeActions}
                setTripName={props.setTripName}
                clear={clear}
                should
            />

        </Modal>
    );
}

function SaveFileHeader(props) {
    return (
        <ModalHeader className="ms-1" toggle={props.toggleSaveFile}>
            Save a Trip
        </ModalHeader>
    );
}

function SaveFileBody(props) {
    const { places: savedPlaces, selectedIndex: savedSelectedIndex, placeActions: savedPlaceActions } = usePlaces();
    const [downloadedFileName, setDownloadedFileName] = useState(null);

    return (
        <div>
            <SaveFileType
                setSavedPlace={savedPlaceActions.setPlaces}
                savedPlaces={savedPlaces}
                setDisallowSave={props.setDisallowSave}
                setDownloadedFileName={setDownloadedFileName}
            />

            <SavedFileFooter
                placeActions={props.placeActions}
                savedPlaces={savedPlaces}
                setSavePlace={savedPlaceActions.setPlaces}
                disallowSave={props.disallowSave}
                clear={props.clear}
                setTripName={props.setTripName}
                downloadedFileName={downloadedFileName}
            />
        </div>
    );
}

var filename_final = "";
function GetFormat(str) {
    filename_final = "itinerary"; //Default Filename
    filename_final = filename_final + '.' + str
    console.log("filename_final: " + filename_final);
    return filename_final;
}

var data_final = "";
function GetData(str) {
    console.log(str);
    if (str == "json") {
        data_final = DataJSON();
        console.log(data_final);
        return data_final;
    }
    if (str == "csv") {
        data_final = DataCSV();
        console.log(data_final);
        return data_final;
    }
    if (str == "svg") {
        data_final = DataSVG();
        console.log(data_final);
        return data_final;
    }
    if (str == "kml") {
        data_final = DataKML();
        console.log(data_final);
        return data_final;
    }
}

var datatype_final = " ";
function SaveFileType(props) {
    const [status] = useState(null);
    function changeStatus(e) {
        GetFormat(e);
        GetData(e);
        datatype_final = e;
        props.setDisallowSave(true);
        console.log("datatype: " + datatype_final);
        SaveAs(filename_final, datatype_final, data_final);
    }

    return (
        <ModalBody>
            <div>
                <p>Choose File Type:</p>
                <ListGroup flush >
                    <ListGroupItem tag="a" data-testid='json-option' id={status} onClick={() => changeStatus('json')} action>JSON</ListGroupItem>
                    <ListGroupItem tag="a" data-testid='csv-option' id={status} onClick={() => changeStatus('csv')} action>CSV</ListGroupItem>
                    <ListGroupItem tag="a" data-testid='svg-option' id={status} onClick={() => changeStatus('svg')} action>SVG</ListGroupItem>
                    <ListGroupItem tag="a" data-testid='kml-option' id={status} onClick={() => changeStatus('kml')} action>KML</ListGroupItem>
                </ListGroup>
            </div>
        </ModalBody>
    );

}

function DataJSON() { //TEST DATA - Needs data from sql data
    const originalData = {
        members: [{
            name: "cliff",
            age: "34"
        },
        {
            name: "ted",
            age: "42"
        },
        {
            name: "bob",
            age: "12"
        }
        ]
    };
    return JSON.stringify(originalData, null, 2);
}

function DataCSV() { //TEST DATA - Needs data from sql data
    const rows = [
        ["name1", "city1", "some other info"],
        ["name2", "city2", "more info"]
    ];

    let csvContent = rows.map(e => e.join(",")).join("\n");
    return csvContent;
}

function DataSVG() { //TEST DATA - Needs data from sql data

    let svgContent = 'test SVG'
    return svgContent;
}

function DataKML() { //TEST DATA - Needs data from sql data


    let kmlContent = 'test KML'
    return kmlContent;
}

function SavedFileFooter(props) {
    return (
        <ModalFooter>
            {/* <ConfirmSaveButton
                disallowSave={props.disallowSave}
                clear={props.clear}
                setPlaces={props.placeActions.setPlaces} //comment
                setSavePlace={props.setSavePlace}
                savedPlaces={props.savedPlaces}
                setTripName={props.setTripName}
                downloadedFileName={props.downloadedFileName}
            /> */}
            <CancelSaveButton
                clear={props.clear}
            />
        </ModalFooter>
    );
}

function ConfirmSaveButton(props) {
    return (
        <Button color="primary"
            //disabled={props.disallowSave}
            onClick={() => {
                SaveAs(filename_final, datatype_final, data_final);
                props.clear();
            }}
            data-testid='confirm-save-button'
        >
            Save As
        </Button>
    )
}

function SaveAs(filename, contentType, data) {
    const blob = new Blob([data], { type: contentType });
    try {
        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else {
            const e = window.document.createElement('a');
            e.href = window.URL.createObjectURL(blob);
            e.download = filename;
            document.body.appendChild(e);
            e.click();
            document.body.removeChild(e);
        }
        
    }
    catch (error) {
        console.error(error);
    }
}

function CancelSaveButton(props) {
    return (
        <Button color="secondary"
            onClick={() => {
                props.clear();
            }
            }
            data-testid='close-save'
        >
            Cancel
        </Button>
    )
}