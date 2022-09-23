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
    public void testOneDistances () {
        Distances distances = new Distances();
        distances.add(12345L);
        assertEquals(1, distances.size());
        assertEquals(12345L, distances.total());
    }
}
