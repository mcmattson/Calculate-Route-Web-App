package com.tco.requests;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.HashMap;
import java.lang.Exception;
import com.tco.requests.Location;
import com.tco.requests.Locations;
import com.tco.requests.Report;
import com.tco.requests.Credential;



public class sqlSearch {

	private final static String TABLE = "world";
	private final static String COLUMNS = "id,name,municipality,iso_region,iso_country,continent,latitude,longitude,altitude";

	public static String getCOLUMNS(){
		return COLUMNS;
	}

	public static String getTABLE(){
		return TABLE;
	}

	public static void main(String[] args) {
		try {
			String match = "Sandy";
			Integer limit = 100;
			Integer found = Database.found(match);
			Locations Locations = Database.Locations(match, limit);
			System.out.println("");
			Report.printLocations(Locations);
			System.out.printf("%d found, %d returned\n", found, Locations.size());
		} catch (Exception e) {
			System.err.println("Exception: " + e.getMessage());
		}
	}

}