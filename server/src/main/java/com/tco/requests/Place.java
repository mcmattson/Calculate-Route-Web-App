// Credit To Dave Matthews

package com.tco.requests;

import static java.lang.Double.parseDouble;
import static java.lang.Math.toRadians;

import com.tco.misc.GeographicCoordinate;
import java.util.HashMap;

class Place implements GeographicCoordinate {

    public String latitude;
    public String longitude;
    public String continent;
    public String altitude;
    public String iso_country;
    public String name;
    public String municipality;
    public String iso_region;
    public String id;

    //Test
    //Constructor
    Place(String lat, String lon, String continent, String altitude , 
            String iso_country, String name, String municipality, 
            String iso_region, String id) {
        this.latitude = lat;
        this.longitude = lon;
        this.continent = continent;
        this.altitude = altitude;
        this.iso_country = iso_country;
        this.name = name;
        this.municipality = municipality;
        this.iso_region = iso_region;
        this.id = id;
    }

    //Interface
    public Double latRadians() {
        return toRadians(parseDouble(latitude));
    }

    public Double lonRadians() {
        return toRadians(parseDouble(longitude));
    }
    
}