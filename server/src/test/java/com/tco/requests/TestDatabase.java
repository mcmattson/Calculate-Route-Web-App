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
        assertEquals(28, count);

    }

 @Test
   @DisplayName("iandunc: test when something is not found")
    public void testLocationAsgard() {
        Integer count = 0;
        try{
            count = database.found("asgard");
        }
        catch (Exception e){
            
        }
        assertEquals(0, count);
    }

    @Test
    @DisplayName("cath2731: test convertQueryResultsToLocations when resultSet is NOT null")
    public void testNotNullResult() {
        boolean thrown = false;
        try{
            ResultSet results = null;
            results.moveToInsertRow();
            results.updateString(1, "Dave");
            results.moveToInsertRow();
            results.updateString(1, "Matt");
            results.moveToInsertRow();
            results.updateString(1, "hews");
            String columns = "1,2,3";  
            Places resultTest = database.convertQueryResultsToLocations(results, columns);
        }
        catch (Exception e){
            thrown = true;
        }
        assertTrue(thrown);
    }

}
