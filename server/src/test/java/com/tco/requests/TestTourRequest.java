package com.tco.requests;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class TestTourRequest {
    private TourRequest tour;

    @BeforeEach
    public void createConfigurationForTestCases() {
        tour = new TourRequest();
    }

    @Test
    @DisplayName("marilake: Request type is \"tour\"")
    public void testType(){
        String type = tour.getRequestType();
        assertEquals("tour", type);
    }

}
