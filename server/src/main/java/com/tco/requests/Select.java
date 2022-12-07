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
        return statement(match, "*", "LIMIT " + limit);
    }

    static String found(String match) {
        return statement(match, "COUNT(*) AS count ", "");
    }

    static String statement(String match, String data, String limit) {
        return "SELECT "
            + data
            + " FROM " + getTABLE()
            + " INNER JOIN region ON world.iso_region = region.id"
            + " INNER JOIN country ON world.iso_country = country.id"
            + " INNER JOIN continent ON world.continent = continent.id"
            + " WHERE (country.name LIKE \"%" + match + "%\" "
            + " OR region.name LIKE \"%" + match + "%\" "
            + " OR world.name LIKE \"%" + match + "%\" "
            + " OR world.municipality LIKE \"%" + match + "%\") "
            + limit
            + " ;";
    }
}
