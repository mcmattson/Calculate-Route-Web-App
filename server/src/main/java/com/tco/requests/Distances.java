// Credit To Dave Matthews
package com.tco.requests;

import java.util.ArrayList;

public class Distances extends ArrayList<Long> {
    
    //test
    public long total() {
        long sum = 0;
        for(long distance : this) {
            sum += distance;
        }
        return sum;
    }
}
