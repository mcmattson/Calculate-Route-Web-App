package com.tco.requests;

import java.util.List;
import java.util.HashMap;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DistancesRequest extends Request {

    private static final transient Logger log = LoggerFactory.getLogger(DistancesRequest.class);

    private Float earthRadius;
    private HashMap<String, String> places;
    private List<Integer> distances;
    private List<String> features;

    @Override
    public void buildResponse() {
        distances = null;
    }

  /* The following methods exist only for testing purposes and are not used
  during normal execution, including the constructor. */

    public DistancesRequest() {
        this.requestType = "distances";
    }

    public boolean validFeature(String feature){
        return features.contains(feature);
    }
}
