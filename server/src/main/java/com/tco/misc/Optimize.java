package com.tco.requests;
import com.tco.misc.DistanceCalculator;

public class Optimize {
    Places places;
    long totalDistance; 
    Double earthRadius;

    public Place findClosest(Places unvisited, Place next){
        Place closestPlace = unvisited.get(0);
        long closestDistance;
        DistanceCalculator calculator = new DistanceCalculator();

        long distance = calculator.calculate(next, unvisited.get(0), earthRadius);
        closestDistance = distance;

        for (int i = 1; i < unvisited.size(); i++){
            distance = calculator.calculate(next, unvisited.get(i), earthRadius);
            if (distance < closestDistance){
                closestDistance = distance;
                closestPlace = unvisited.get(i);
            }
        }
        return closestPlace;
    }
    
}
