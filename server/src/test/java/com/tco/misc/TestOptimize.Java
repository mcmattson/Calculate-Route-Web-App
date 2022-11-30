package com.tco.misc;

import com.tco.requests.Place;
import com.tco.requests.Places;


import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;


public class TestOptimize {

    Place origin = new Place("0.0", "0.0");
    Place coordinatesBurma = new Place("21.9162", "95.9560");
    Place coordinatesFoCo = new Place("40.5853" , "-105.0844");
    Place coordinatesAntarctic = new Place("-82.8628", "135.0000");

    Places places = new Places();

    places.add(origin);
    places.add(coordinatesBurma);
    places.add(coordinatesFoCo);
    places.add(coordinatesAntarctic);

    Double earthRadius = 6378;

    @BeforeEach
    public void createOptimize(){
        Optimize optimize = new Optimize(places, earthRadius);
    }

    @Test 
    @DisplayName("marilake: testing findClosest method")
    public void testfindClosest(){
        Places temp = places;
        temp.remove(0);
        Place closest = optimize.findClosest(temp, places.get(0));
        assertEquals(coordinatesAntarctic, closest);
    }
    
}