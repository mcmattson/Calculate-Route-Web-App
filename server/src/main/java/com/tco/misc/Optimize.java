package com.tco.requests;


public class Optimize {
    Places places;
    long totalDistance; 

    public Optimize(Places places){
        this.places = places;
        DistancesRequest distances = new DistancesRequest(places);
        this.totalDistance = distances.buildDistanceList().total();
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
        return null;
    }

}
