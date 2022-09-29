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
    final Geo coordinatesFoCo = new Geo(40.5853, -105.0844);
    final Geo coordinatesAntarctic = new Geo(-82.8628, 135.0000);

    //Testing minimum Earth radius value.
    final static long small = 1L;
    final static long piSmall = Math.round(Math.PI * small);
    final static long piSmallHalf = Math.round(Math.PI / 2.0 * small);

    //Testing large values with significant digits to verify double/long.
    final static long big = 1000000000000L;
    final static long piBig = Math.round(Math.PI * big);
    final static long piBigHalf = Math.round(Math.PI / 2.0 * big);

    //Actual Earth radius in km.
    final static long realRadius = 6378L;

    //Big identity tests.
    @Test
    @DisplayName("cath2731: The distance-to-self should be zero.")
    public void testDistanceToSelf() {
        assertEquals(0L, calculate(origin, origin, big));
        assertEquals(0L, calculate(origin, origin, small));
    }

    //Testing with pi Earth radius.
    @Test
    @DisplayName("cath2731: The distance-to-self should be zero.")
    public void testDistanceToSelfPi() {
        assertEquals(0L, calculate(origin, origin, piBig));
        assertEquals(0L, calculate(origin, origin, piSmall));
    }

    //Testing with 0.5*pi Earth radius.
    @Test
    @DisplayName("cath2731: The distance-to-self should be zero.")
    public void testDistanceToSelfPiHalf() {
        assertEquals(0L, calculate(origin, origin, piBigHalf));
        assertEquals(0L, calculate(origin, origin, piSmallHalf));
    }

    //Testing with new geographic location (positive lat, postive lon).
    @Test
    @DisplayName("cath2731: The distance-to-self should be zero.")
    public void testDistanceToSelfBurma() {
        assertEquals(0L, calculate(coordinatesBurma, coordinatesBurma, big));
        assertEquals(0L, calculate(coordinatesBurma, coordinatesBurma, small));
    }

    //Testing with new geographic location (postive lat, negative lon) with pi Earth radius.
    @Test
    @DisplayName("cath2731: The distance-to-self should be zero.")
    public void testDistanceToSelfPiFoCo() {
        assertEquals(0L, calculate(coordinatesFoCo, coordinatesFoCo, piBig));
        assertEquals(0L, calculate(coordinatesFoCo, coordinatesFoCo, piSmall));
    }

    //Testing with new geographic location (negative lat, positive lon) with 0.5*pi Earth radius.
    @Test
    @DisplayName("cath2731: The distance-to-self should be zero.")
    public void testDistanceToSelfPiAntarctic() {
        assertEquals(0L, calculate(coordinatesAntarctic, coordinatesAntarctic, piBigHalf));
        assertEquals(0L, calculate(coordinatesAntarctic, coordinatesAntarctic, piSmallHalf));
    }

    //Testing with different geographic location distances.
    @Test
    @DisplayName("cath2731: The distance-to-self should NOT be zero.")
    public void testDistanceToSelfNonZero() {
        assertEquals(10633L, calculate(origin, coordinatesBurma, realRadius));
        assertEquals(14898L, calculate(coordinatesFoCo, coordinatesAntarctic, realRadius));
    }


}
