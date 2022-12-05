// Credit To Dave Matthews

package com.tco.requests;

import static java.lang.Double.parseDouble;
import static java.lang.Math.toRadians;

import com.tco.misc.GeographicCoordinate;
import java.util.HashMap;

public class Place implements GeographicCoordinate {

    public String latitude;
    public String longitude;
    public String name;
    public String id;
    public String continent;
    public String altitude;
    public String iso_country;
    public String municipality;
    public String iso_region;
    //Test
    //Constructor
    Place(String lat, String lon) {
        this.latitude = lat;
        this.longitude = lon;
    }

    Place(String lat, String lon, String name, String id, String continent, String altitude, String iso_country, String municipality, String iso_region) {
        this.latitude = lat;
        this.longitude = lon;
        this.name = name;
        this.id = id;
        this.continent = continent; 
        this.altitude = altitude;
        this.iso_country = iso_country;
        this.municipality = municipality;
        this.iso_region = iso_region;
    }

    //Interface
    public Double latRadians() {
        return toRadians(parseDouble(latitude));
    }

    public Double lonRadians() {
        return toRadians(parseDouble(longitude));
    }
    
}