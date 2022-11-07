package com.tco.requests;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestFindRequest {

    private FindRequest find;

    @BeforeEach
    public void createConfigurationForTestCases() {
        find = new FindRequest();
    }

    @Test
    @DisplayName("Test the build response for find.")
    public void testBuildReponse(){
        find.buildResponse();
    }


    @Test
    @DisplayName("mikylab: Request type is \"find\"")
    public void testType() {
        String type = find.getRequestType();
        assertEquals("find", type);
    }
}
