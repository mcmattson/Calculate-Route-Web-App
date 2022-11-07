package com.tco.requests;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

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

    @Test
    @DisplayName("marilake: match \"dave\" should return found number")
    public void testFound(){
        FindRequest findFull = new FindRequest("dave", 10);
        findFull.buildResponse();
        boolean validFound = findFull.getFound() != null;
        assertTrue(validFound);
    }

    @Test
    @DisplayName("marilake: match \"dave\" should return a list of places")
    public void testPlaces(){
        FindRequest findFull = new FindRequest("dave", 10);
        findFull.buildResponse();
        boolean validPlaces = findFull.getPlaces() != null;
        assertTrue(validPlaces);
        }
