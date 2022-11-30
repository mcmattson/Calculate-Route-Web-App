package com.tco.requests;


public class Optimize {
    Places places;
    long totalDistance; 
    Double earthRadius;

    public Optimize(Places places, Double earthRadius){
        this.places = places;
        DistancesRequest distances = new DistancesRequest(places);
        this.totalDistance = distances.buildDistanceList().total();
        this.earthRadius = earthRadius;
    }

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
        Place closestPlace = unvisited(0);
        long closestDistance;
        DistanceCalculator calculator = new DistanceCalculator();

        long distance = calculator.calculate(next, unvisited(0), earthRadius);
        closestDistance = distance;

        for (int i = 1; i < unvisited.length(); i++){
            distance = calculator.calculate(next, unvisited(i), earthRadius);
            if (distance < closestDistance){
                closestDistance = distance;
                closestPlace = unvisited(i);
            }
        }
        return closestPlace;
    }

}
