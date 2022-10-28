package com.tco.requests;
import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class FindRequest extends Request{
    private static final transient Logger log = LoggerFactory.getLogger(FindRequest.class);

    private String match;
    private ArrayList<String> type;
    private ArrayList<String> where;
    private Double limit;
    private Double found; 

    public void buildResponse() {
        
    }
    
    public FindRequest() {
        this.requestType = "find";
    }
}
