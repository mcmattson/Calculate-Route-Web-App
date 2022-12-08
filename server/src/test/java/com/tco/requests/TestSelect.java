package com.tco.requests;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.sql.ResultSet;
import com.tco.requests.Database;

public class TestSelect {
    
    private Select sql;

    @BeforeEach
    public void configureDatabaseForTest(){
        sql = new Select();
    }

    @Test
    @DisplayName("mikylab: the match returns 28 places with limit of 50")
    public void testFindMultiple() {
        try {
            Places places = Database.Places("sandy", 50);
            assertEquals(28, places.size());
        } catch (Exception e) {
            System.err.println("Exception: " + e.getMessage());
        }
    }

    @Test
    @DisplayName("mikylab: the match should only return 5 entries")
    public void testMatchLimit() {
        try {
            Places places = Database.Places("dave", 5);
            assertEquals(5, places.size());
        } catch (Exception e) {
            System.err.println("Exception: " + e.getMessage());
        }
    }

    @Test
    @DisplayName("mikylab: all entries should be found")
    public void testNoMatchLimit() {
        try {
            Places places = Database.Places("dave", 0 );
            assertEquals(28, places.size());
        } catch (Exception e) {
            System.err.println("Exception: " + e.getMessage());
        }
    }
}