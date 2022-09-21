package com.tco.requests;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class TestDistancesRequest {

    private DistancesRequest dist;

    @BeforeEach
    public void createConfigurationForTestCases() {
        dist = new DistancesRequest();
        dist.buildResponse();
    }

    @Test
    @DisplayName("base: Request type is \"distances\"")
    public void testType() {
        String type = dist.getRequestType();
        assertEquals("distances", type);
    }

}
