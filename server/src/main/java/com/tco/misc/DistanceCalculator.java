package com.tco.misc;

public final class DistanceCalculator {
    
    final static boolean useRandom = false;

    private DistanceCalculator() {}

    public static Long calculate(GeographicCoordinate from, GeographicCoordinate to, double earthRadius){
        Double delta_lambda = to.lonRadians() - from.lonRadians();

        Double first_group = Math.cos(to.latRadians()) * Math.sin(delta_lambda);
        Double second_group = first_group * first_group;

        Double cosSinLat = Math.cos(from.latRadians()) * Math.sin(to.latRadians());
        Double sinCosCos = Math.sin(from.latRadians()) * Math.cos(to.latRadians()) * Math.cos(delta_lambda);
        Double third_group = cosSinLat-sinCosCos;      
        Double fourth_group = third_group *third_group;

        Double numerator = Math.sqrt(second_group + fourth_group);
        Double sinSin = Math.sin(from.latRadians()) * Math.sin(to.latRadians());
        Double cosCosCos = Math.cos(from.latRadians()) * Math.cos(to.latRadians()) * Math.cos(delta_lambda);
        Double demoninator = sinSin + cosCosCos;

        Double delta_o = Math.atan2(numerator,demoninator);
        return Math.round(delta_o * earthRadius); 
    }

}

