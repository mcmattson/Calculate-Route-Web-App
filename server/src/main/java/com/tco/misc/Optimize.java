package com.tco.requests;
import com.tco.misc.DistanceCalculator;

public class Optimize {
    Places places;
    long totalDistance; 
    Double earthRadius;

    public Places findBestTour(){
        Places bestTour = places;
        long bestDistance = totalDistance;

        for (Place start : places){
            Places current = createNearestNeighborTour(start);
            DistancesRequest distances = new DistancesRequest(current);
            Distances currentDistanceList = distances.buildDistanceList();
            long totalDistance = currentDistanceList.total();
            if (totalDistance < bestDistance){
                bestTour = current;
                bestDistance = totalDistance;
            }
        }
        return bestTour;
    }


    public Places createNearestNeighborTour(Place start){
        
        Places tour = new Places();
        Places unvisited = places;
        tour.add(start);
        unvisited.remove(start);
        Place next = start;

        while (!unvisited.isEmpty()){
            next = findClosest(unvisited,next);
            tour.add(next);
            unvisited.remove(next);
        }

        return tour;
        
    }

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
