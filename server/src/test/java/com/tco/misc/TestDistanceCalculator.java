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
    final Geo origin = new Geo(0.0, 0.0);
    final Geo coordinatesBurma = new Geo(21.9162, 95.9560);

    //Testing minimum Earth radius value.
    final static long small = 1L;
    final static long piSmall = Math.round(Math.PI * small);
    final static long piSmallHalf = Math.round(Math.PI / 2.0 * small);

    //Testing large values with significant digits to verify double/long.
    final static long big = 1000000000000L;
    final static long piBig = Math.round(Math.PI * big);
    final static long piBigHalf = Math.round(Math.PI / 2.0 * big);

    //Big identity tests.
    @Test
    @DisplayName("cath2731: The distance-to-self should be zero.")
    public void testDistanceToSelf() {
        assertEquals(0L, calculate(origin, origin, big));
        assertEquals(0L, calculate(origin, origin, small));
    }

    @Test
    @DisplayName("cath2731: The distance-to-self should be zero.")
    public void testDistanceToSelfPi() {
        assertEquals(0L, calculate(origin, origin, piBig));
        assertEquals(0L, calculate(origin, origin, piSmall));
    }

    @Test
    @DisplayName("cath2731: The distance-to-self should be zero.")
    public void testDistanceToSelf() {
        assertEquals(0L, calculate(origin, origin, piBigHalf));
        assertEquals(0L, calculate(origin, origin, piSmallHalf));
    }




}
