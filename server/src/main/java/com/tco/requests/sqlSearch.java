package com.tco.requests;

public class sqlSearch {
    private final static String TABLE = "world";
	private final static String COLUMNS = "id,name,municipality,iso_region,iso_country,continent,latitude,longitude,altitude";

	public static String getCOLUMNS(){
		return COLUMNS;
	}

	public static String getTABLE(){
		return TABLE;
	} 
}