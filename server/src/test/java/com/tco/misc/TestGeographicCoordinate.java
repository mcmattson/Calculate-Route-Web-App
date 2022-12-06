package com.tco.misc;

import static java.lang.Math.toRadians;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;


public class TestGeographicCoordinate {
    static class Geo implements GeographicCoordinate{
        Double degreesLatitude; 
        Double degreesLongitude;

        public Geo(Double lat, Double lon){
            this.degreesLatitude = lat;
            this.degreesLongitude = lon;
        }

        public Double latRadians(){ return toRadians(degreesLatitude); }
        public Double lonRadians(){ return toRadians(degreesLongitude); }

    }

    Geo geoCoord = new Geo(45.000,90.000);
    Double geoLatToRadians = toRadians(45.000);
    Double geoLonToRadians = toRadians(90.000);

    @Test
    @DisplayName("marilake : Testing interface implimentation of latRadians()")
    public void testLatRadiansImplimentation(){
        assertEquals(geoLatToRadians , geoCoord.latRadians());
    }
    
    @Test 
    @DisplayName("marilake : Testing interface implimentation of lonRadians()")
    public void testLonRadiansImplimentation(){
        assertEquals(geoLonToRadians, geoCoord.lonRadians());
    }

    @Test
    @DisplayName("cath2731 : Test that lonRadians() is NOT latRadians()")
    public void testLonIsNotLat(){
       if(geoCoord.latRadians() != geoCoord.lonRadians()){
        assertTrue(geoLonToRadians != geoCoord.latRadians());
       }
    }

    @Test
    @DisplayName("cath2731 : Test that latRadians() is NOT lonRadians()")
    public void testLatIsNotLon(){
       if(geoCoord.latRadians() != geoCoord.lonRadians()){
        assertTrue(geoLatToRadians != geoCoord.lonRadians());
       }
    }

}
