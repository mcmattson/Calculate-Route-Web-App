package com.tco.misc;

import static com.tco.misc.DistanceCalculator.calculate;
import static com.tco.misc.DistanceCalculator.useRandom;
import static java.lang.Math.toRadians;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;


public class TestDistanceCalculator {

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
    
    //Testcases will go below: 




}
