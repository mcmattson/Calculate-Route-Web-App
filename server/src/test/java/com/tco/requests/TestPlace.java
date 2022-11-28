package com.tco.requests;

import com.tco.requests.Place;
import static java.lang.Math.toRadians;
import static java.lang.Double.parseDouble;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static java.lang.Math.toRadians;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class TestPlace {

    Place origin = new Place("0.0", "0.0", "NA", "430"  ,"US", "Burma", "CO", "CO", "CI12") ;
    Place coordinatesBurma = new Place("21.9162", "95.9560" , "NA", "430" , "US", "Burma", "CO", "CO", "CI12");
    Place coordinatesFoCo = new Place("40.5853" , "-105.0844" , "NA", "430" , "US", "Burma", "CO", "CO", "CI12");
    Place coordinatesAntarctic = new Place("-82.8628", "135.0000", "NA", "430", "US" , "Burma", "CO", "CO", "CI12");
    Place coordinatesEverest = new Place("27.9881", "86.9250" , "NA", "430" , "US", "Burma", "CO", "CO", "CI12");

    public boolean TestRadians(String typeCoordinates, String mockValue, Place location){
        double convertedMockValue = toRadians(parseDouble(mockValue)); 
        if (typeCoordinates == "longitude"){
            return convertedMockValue == location.lonRadians();
        }else if (typeCoordinates == "latitude"){
            return convertedMockValue == location.latRadians();
        }else{
            return false;
        }
    }

    @Test
    @DisplayName("mikylab: test latitude Everest radians")
    public void testLatitudeEverest(){
        assertTrue(TestRadians("latitude", "27.9881", coordinatesEverest));
    }

    @Test
    @DisplayName("mikylab: test longitude Everest radians") 
    public void testLongitudeEverest(){
        assertTrue(TestRadians("longitude", "86.9250", coordinatesEverest));
    }


    @Test
    @DisplayName("marilake: testing the constructor works with valid inputs")
    public void testConstructor(){
        boolean lat = (coordinatesFoCo.latitude == "40.5853");
        boolean lon = (coordinatesFoCo.longitude == "-105.0844");
        assertTrue(lat && lon);
    }

    @Test
    @DisplayName("marilake: testing that latRadians is implimented and correctly")
    public void testLatRadians(){
        Double MOCKlatitude = toRadians(parseDouble("21.9162"));
        Double burmaRadiansLat = coordinatesBurma.latRadians();
        assertEquals(MOCKlatitude, burmaRadiansLat);
    }

    @Test
    @DisplayName("marilake: testing that lonRadians is implimented and correctly")
    public void testLonRadians(){
        Double MOCKlongitude = toRadians(parseDouble("95.9560"));
        Double burmaRadiansLon = coordinatesBurma.lonRadians();
        assertEquals(MOCKlongitude, burmaRadiansLon);
    }

    @Test
    @DisplayName("marilake: testing that latRadians works at the origin")
    public void originLatRadiansTest(){
        Double MOCKlatitude = toRadians(parseDouble("0.0"));
        Double originRadiansLat = origin.latRadians();
        assertEquals(MOCKlatitude, originRadiansLat);
    }

    @Test
    @DisplayName("marilake: testing that lonRadians works at origin")
    public void originLonRadiansTest(){
        Double MOCKlongitude = 0.0;
        Double originRadiansLon = origin.lonRadians();
        assertEquals(MOCKlongitude, originRadiansLon);
    }

}
