package com.tco.requests;

public class TourRequest extends Request{
    
    private String requestType;
    private Double earthRadius;
    private Double response;
    private Places places;

    @Override
    public void buildResponse(){
   
    }

    public Places buildPlaces(){
        return null;
    }

    public void optimizePlaces(){}

}