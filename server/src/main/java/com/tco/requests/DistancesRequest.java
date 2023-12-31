package com.tco.requests;
import com.tco.misc.DistanceCalculator;

import java.util.List;
import java.util.HashMap;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class DistancesRequest extends Request {

    private static final transient Logger log = LoggerFactory.getLogger(DistancesRequest.class);

    private Double earthRadius;
    private Places places;
    private Distances distances;

    @Override
    // Credit To Dave Matthews
    public void buildResponse() {
        distances = buildDistanceList();
        log.trace("distanceResponse -> {}", this);
    }

    public Distances buildDistanceList() {
        Distances distances = new Distances();
        
        for(int i = 0; i < places.size(); i++ ){
            Place placeFrom = places.get(i);
            Place placeTo = places.get((i + 1) % places.size());
            Long toAdd = DistanceCalculator.calculate(placeFrom, placeTo, earthRadius);
            distances.add(toAdd);
        } 
        return distances;
    }

  /* The following methods exist only for testing purposes and are not used
  during normal execution, including the constructor. */

    public DistancesRequest() {
        this.requestType = "distances";
    }

    public DistancesRequest(Places places) {
        this.places = places;
    }
    
}
