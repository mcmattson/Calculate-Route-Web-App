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

    Place origin = new Place("0.0", "0.0");
    Place coordinatesBurma = new Place("21.9162", "95.9560");
    Place coordinatesFoCo = new Place("40.5853" , "-105.0844");
    Place coordinatesAntarctic = new Place("-82.8628", "135.0000");

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
}
