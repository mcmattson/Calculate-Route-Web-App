package com.tco.requests;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.lang.Exception;

import com.tco.requests.Place;
import com.tco.requests.Places;
import com.tco.requests.Select;

public class Database {
    
    static Integer found(String match) throws Exception {
        String sql = Select.found(match);
        try (
            // connect to the database and query
            Connection conn = DriverManager.getConnection(Credential.url(), Credential.USER, Credential.PASSWORD);
            Statement query = conn.createStatement();
            ResultSet results = query.executeQuery(sql)
        ) {
            return count(results);
        } catch (Exception e) {
            throw e;
        }
    }

    private static Integer count(ResultSet results) throws Exception {
        if (results.next()) {
            return results.getInt("count");
        }
        throw new Exception("No count results in found query.");
    }
    
    static Places Places(String match, Integer limit) throws Exception {
        String sql      = Select.match(match, limit);
        String url      = Credential.url();
        String user     = Credential.USER;
        String password = Credential.PASSWORD;
        try (
            // connect to the database and query
            Connection conn    = DriverManager.getConnection(url, user, password);
            Statement  query   = conn.createStatement();
            ResultSet  results = query.executeQuery(sql)
        ) {
            return convertQueryResultsToLocations(results, Select.getCOLUMNS());
        } catch (Exception e) {
            throw e;
        }
    }

    public static Places convertQueryResultsToLocations(ResultSet results, String columns) throws Exception {
        int count = 0;
        String[] cols = columns.split(",");
        Places Places = new Places();
        while (results.next()) {
            Place Place = new Place("0", "0");  
            Place.locationFeatures = new HashMap<String, String>();

            Place = parseResults(results, Place, cols);
            Place.locationFeatures.put("index", String.format("%d", ++count));    
            Places.add(Place);  
        }

        return Places;
    }

    private static Place parseResults(ResultSet results, Place Place, String[] cols) throws Exception{
        for (String col : cols){
            if (col == "latitude"){
                Place.latitude = results.getString(col);
            }else if (col == "longitude"){
                Place.longitude = results.getString(col);
            }else{
                Place.locationFeatures.put(col, results.getString(col));
            }
        }
        return Place; 
    }



}
