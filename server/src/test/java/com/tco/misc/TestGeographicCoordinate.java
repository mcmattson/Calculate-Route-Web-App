package com.tco.misc;

import static java.lang.Math.toRadians;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;


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

}
