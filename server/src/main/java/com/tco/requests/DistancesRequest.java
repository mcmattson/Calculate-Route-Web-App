package com.tco.requests;

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
    private List<String> features;

    @Override
    // Credit To Dave Matthews
    public void buildResponse() {
        distances = buildDistanceList();
        log.trace("distanceResponse -> {}", this);
    }

    private Distances buildDistanceList() {
        Distances distances = new Distances();

        return distances;
    }

  /* The following methods exist only for testing purposes and are not used
  during normal execution, including the constructor. */

    public DistancesRequest() {
        this.requestType = "distances";
    }
}
