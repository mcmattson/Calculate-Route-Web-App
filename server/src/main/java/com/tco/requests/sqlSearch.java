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



public class sqlSearch {

	private final static String TABLE = "world";
	private final static String COLUMNS = "id,name,municipality,iso_region,iso_country,continent,latitude,longitude,altitude";

	//static class Location extends HashMap<String,String> {}
	//static class Locations extends ArrayList<Location> {}

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

	static class Database {
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


		static Locations Locations(String match, Integer limit) throws Exception {
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
				return convertQueryResultsToLocations(results, COLUMNS);
			} catch (Exception e) {
				throw e;
			}
		}


		private static Locations convertQueryResultsToLocations(ResultSet results, String columns) throws Exception {
			int count = 0;
			String[] cols = columns.split(",");
			Locations Locations = new Locations();
			while (results.next()) {
				Location Location = new Location();
				for (String col: cols) {
					Location.put(col, results.getString(col));
				}
				Location.put("index", String.format("%d",++count));
				Locations.add(Location);
			}
			return Locations;
		}
	}
	static class Credential {
		// shared user with read-only access
		final static String USER = "cs314-db";
		final static String PASSWORD = "eiK5liet1uej";
		// connection information when using port forwarding from localhost
		final static String URL = "jdbc:mariadb://faure.cs.colostate.edu/cs314";
		static String url() {
			return URL;
		}
	}

	static class Select {
		static String match(String match, int limit) {
			return statement(match, "DISTINCT " + COLUMNS, "LIMIT " + limit);
		}

		static String found(String match) {
			return statement(match, "COUNT(*) AS count ", "");
		}

		static String statement(String match, String data, String limit) {
			return "SELECT "
				+ data
				+ " FROM " + TABLE
				+ " WHERE name LIKE \"%" + match + "%\" "
				+ limit
				+ " ;";
		}
	}
    

}