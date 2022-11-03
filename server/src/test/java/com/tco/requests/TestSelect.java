package com.tco.requests;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.sql.ResultSet;
import com.tco.requests.Database;

public class TestSelect {
    
    private Select sql;

    @BeforeEach
    public void configureDatabaseForTest(){
        sql = new Select();
    }

    @Test
    @DisplayName("mikylab: testing an entire SQl query to be successful")
        public void testSelect(){
            boolean successfulQuery = false;
            try {
                String match = "Sandy";
                Integer limit = 100;
                Integer found = Database.found(match);
                Places Places = Database.Places(match, limit);
                successfulQuery = true;
            } catch (Exception e) {
                System.err.println("Exception: " + e.getMessage());
            }
            assertTrue(successfulQuery);
        }

    @Test
    @DisplayName("mikylab: testing an entire SQl query when no results are found")
        public void testNoResultsFound(){
            boolean noResultsFound = false;
            try {
                String match = "Asgard";
                Integer limit = 100;
                Integer found = Database.found(match);
                Places Places = Database.Places(match, limit);
                if (found == 0){
                    noResultsFound = true;
                }
            } catch (Exception e) {
                System.err.println("Exception: " + e.getMessage());
            }
            assertTrue(noResultsFound);
        }
}