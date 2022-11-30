package com.tco.requests;



public class Select {
    private final static String TABLE = "world";
	private final static String COLUMNS = "id,name,municipality,iso_region,iso_country,continent,latitude,longitude,altitude";

	public static String getCOLUMNS(){
		return COLUMNS;
	}

	public static String getTABLE(){
		return TABLE;
	} 

    static String match(String match, int limit) {
        return statement(match, "DISTINCT " + getCOLUMNS(), "LIMIT " + limit);
    }

    static String found(String match) {
        return statement(match, "COUNT(*) AS count ", "");
    }

    static String statement(String match, String data, String limit) {
        return "SELECT "
            + data
            + " FROM " + getTABLE()
            + " WHERE name LIKE \"%" + match + "%\" OR id LIKE \"%" + match + "%\" OR municipality LIKE \"%" + match + "%\" OR iso_country LIKE \"%" + match + "%\" OR continent LIKE \"%" + match + "%\" "
            + limit
            + " ;";
    }
}
