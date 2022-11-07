package com.tco.requests;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FindRequest extends Request{
    private static final transient Logger log = LoggerFactory.getLogger(FindRequest.class);

    private String match;
    private ArrayList<String> type;
    private ArrayList<String> where;
    private Integer limit;
    private Integer found; 
    private Places places; 

    public void buildResponse() {
        try{
            found = Database.found(match);
            places = Database.Places(match, limit); 
        } catch (Exception e) {}

        log.trace("FindResponse -> {}", this);
    }
    
    public FindRequest() {
        this.requestType = "find";
    }

    //For testing purposes
    public FindRequest(String match, Integer limit) {
        this.match = match;
        this.limit = limit;  
        this.requestType = "find";     
    }

    public Integer getFound(){return found;}
    public Places getPlaces(){ return places;}
    public Integer getLimit(){return limit;}
}
