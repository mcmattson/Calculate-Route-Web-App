//Credit Dave Matthews
package com.tco.requests;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestDistances {

    @Test
    @DisplayName ("mmattson: distances with no places")
    public void testNoDistances () {
        Distances distances = new Distances();
        assertEquals(0, distances.size());
        assertEquals(0L, distances.total());
    }

    @Test
    @DisplayName ("mmattson: distances with 1 place")
    public void testOneoDistances () {
        Distances distances = new Distances();
        distances.add(12345L);
        assertEquals(1, distances.size());
        assertEquals(12345L, distances.total());
    }

    @Test
    @DisplayName ("mmattson: two distances with no places")
    public void testTwoDistances () {
        Distances distances = new Distances();
        distances.add(0L);
        distances.add(0L);
        assertEquals(2, distances.size());
        assertEquals(0L, distances.total());
    }

    @Test
    @DisplayName ("mmattson: distances with multiple places")
    public void testDistances () {
        Distances distances = new Distances();
        distances.add(5L);
        distances.add(40L);
        distances.add(300L);
        distances.add(2000L);
        distances.add(10000L);
        assertEquals(5, distances.size());
        assertEquals(12345L, distances.total());
    }
}