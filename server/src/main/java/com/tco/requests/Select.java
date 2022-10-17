package com.tco.requests;

import com.tco.requests.Location;
import com.tco.requests.Locations;
import com.tco.requests.sqlSearch;

public class Select {
    static String match(String match, int limit) {
        return statement(match, "DISTINCT " + sqlSearch.getCOLUMNS(), "LIMIT " + limit);
    }

    static String found(String match) {
        return statement(match, "COUNT(*) AS count ", "");
    }

    static String statement(String match, String data, String limit) {
        return "SELECT "
            + data
            + " FROM " + sqlSearch.getTABLE()
            + " WHERE name LIKE \"%" + match + "%\" "
            + limit
            + " ;";
    }
}