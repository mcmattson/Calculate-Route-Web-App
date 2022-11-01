package com.tco.requests;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;

import java.sql.ResultSet;
import com.tco.requests.Database;
import com.tco.requests.Place;
import com.tco.requests.Places;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class TestDatabase {
   private Database database;

   @BeforeEach
   public void configureDatabaseForTest(){
    database = new Database();
   }

   @Test
   @DisplayName("marilake: testing convertQueryResultsToLocations when ResultSet is null")
    public void testResultSetNull() {
        boolean thrown = false;
        try{
            ResultSet results = null;
            String columns = "1,2,3";  
            Places resultTest = database.convertQueryResultsToLocations(results, columns);
        }
        catch (Exception e){
            thrown = true;
        }
        assertTrue(thrown);
    }

@Test
   @DisplayName("cath2731: testing Locations when locations is null")
    public void testLocationNull() {
        boolean thrown = false;
        try{
            Places resulting = database.Places(null, -1);
        }
        catch (Exception e){
            thrown = true;
        }
        assertTrue(thrown);
    }

    @Test
    @DisplayName("mikylab: test find a result")
    public void testFindDave(){
        Integer count = 0;
        try{
            count = database.found("dave");
        }
        catch(Exception e){
        }
        assertEquals(16, count);

    }

}
