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
        String[] cols = columns.split(",");
        Places Places = new Places();
        while (results.next()) {
            Place Place = new Place(results.getString("latitude"), 
                                    results.getString("longitude"),
                                    results.getString("name"), 
                                    results.getString("id"), 
                                    results.getString("continent"),
                                    results.getString("altitude"), 
                                    results.getString("iso_country"), 
                                    results.getString("municipality"), 
                                    results.getString("iso_region"));
            Places.add(Place);  
        }

        return Places;
    }



}
