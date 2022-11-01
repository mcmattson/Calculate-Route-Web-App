// Credit To Dave Matthews

package com.tco.requests;

import static java.lang.Double.parseDouble;
import static java.lang.Math.toRadians;

import com.tco.misc.GeographicCoordinate;
import java.util.HashMap;

class Place implements GeographicCoordinate {

    public String latitude;
    public String longitude;
    public HashMap<String, String> locationFeatures;
    //Test
    //Constructor
    Place(String lat, String lon) {
        this.latitude = lat;
        this.longitude = lon;
    }

    //Interface
    public Double latRadians() {
        return toRadians(parseDouble(latitude));
    }

    public Double lonRadians() {
        return toRadians(parseDouble(longitude));
    }
    
}