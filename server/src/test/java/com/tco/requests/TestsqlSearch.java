package com.tco.requests;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.sql.ResultSet;
import com.tco.requests.Database;
import com.tco.requests.Location;
import com.tco.requests.Locations;
import com.tco.requests.sqlSearch;

public class TestsqlSearch {
    
    private sqlSearch sql;

    @BeforeEach
    public void configureDatabaseForTest(){
        sql = new sqlSearch();
    }

    @Test
    @DisplayName("mikylab: testing an entire SQl query to be successful")
        public void testSQLsearch(){
            boolean successfulQuery = false;
            try {
                String match = "Sandy";
                Integer limit = 100;
                Integer found = Database.found(match);
                Locations Locations = Database.Locations(match, limit);
                successfulQuery = true;
            } catch (Exception e) {
                System.err.println("Exception: " + e.getMessage());
            }
            assertTrue(successfulQuery);
        }
}