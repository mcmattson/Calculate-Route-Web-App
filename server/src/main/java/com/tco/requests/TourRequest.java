package com.tco.requests;
import com.tco.misc.Optimize;
import com.tco.requests.Places;

public class TourRequest extends Request{
    
    private String requestType;
    private Double earthRadius;
    private Double response;
    private Places places;

    @Override
    public void buildResponse(){
        optimizePlaces();
    }


    public void optimizePlaces(){
        Optimize optimizer = new Optimize(places, earthRadius);
        places = optimizer.findBestTour();
    }

    public TourRequest(){
        this.requestType = "tour";
    }

}
