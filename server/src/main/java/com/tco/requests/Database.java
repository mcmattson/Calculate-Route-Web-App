package com.tco.requests;
import java.util.HashMap;
import java.util.ArrayList;

import com.tco.requests.Location;
import com.tco.requests.Locations;
import java.sql.ResultSet;


public class Database {
    


private static Locations convertQueryResultsToLocations(ResultSet results, String columns) throws Exception {
    int count = 0;
    String[] cols = columns.split(",");
    Locations Locations = new Locations();
    while (results.next()) {
        Location Location = new Location(); 
        for (String col : cols){
            Location.put(col, results.getString(col));
        }
        Location.put("index", String.format("%d", ++count));
        Locations.add(Location);  
    }
    return Locations;
}



}
