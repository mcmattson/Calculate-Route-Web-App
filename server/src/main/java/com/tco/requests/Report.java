package com.tco.requests;

import com.tco.requests.Location;
import com.tco.requests.Locations;


public class Report {
    static void printLocations(Locations Locations) {
        for (Location Location : Locations) {
            System.out.println(Location);
        }
    }
}
