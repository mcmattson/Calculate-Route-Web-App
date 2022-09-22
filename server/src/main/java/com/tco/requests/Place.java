// Credit To Dave Matthews

package com.tco.requests;

import static java.lang.Double.parseDouble;
import static java.lang.Math.toRadians;

import com.tco.misc.GeographicCoordinate;
import java.util.HashMap;

class Place extends HashMap<String,String> implements GeographicCoordinate {

    //Test
    //constructor
    Place(String lat, String lon) {
        this.put("latitude", lat);
        this.put("longitude", lon);
    }

    //interface
    public Double latRadians() {
        return toRadians(parseDouble(this.get("latitude")));
    }

    public Double lonRadians() {
        return toRadians(parseDouble(this.get("longitude")));
    }
    
}