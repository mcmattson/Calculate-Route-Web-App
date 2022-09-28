package com.tco.misc;

public final class DistanceCalculator {
    
    final static boolean useRandom = false;

    private DistanceCalculator() {}

    public static Long calculate(GeographicCoordinate from, GeographicCoordinate to, double earthRadius){
        Double delta_lambda = to.lonRadians() - from.lonRadians();

        Double firstParenthesis = Math.cos(to.latRadians()) * Math.sin(delta_lambda);
        Double firstParenthesisSquared = firstParenthesis * firstParenthesis;

        Double cosSinLatitude = Math.cos(from.latRadians()) * Math.sin(to.latRadians());
        Double sinCosCosLatitude = Math.sin(from.latRadians()) * Math.cos(to.latRadians()) * Math.cos(delta_lambda);
        Double secondParenthesis = cosSinLatitude-sinCosCosLatitude;      
        Double secondParenthesisSquared = secondParenthesis *secondParenthesis;

        Double numerator = Math.sqrt(firstParenthesisSquared + secondParenthesisSquared);
        Double sinSinLatitude = Math.sin(from.latRadians()) * Math.sin(to.latRadians());
        Double cosCosCosLatitude = Math.cos(from.latRadians()) * Math.cos(to.latRadians()) * Math.cos(delta_lambda);
        Double denominator = sinSinLatitude + cosCosCosLatitude;

        Double delta_o = Math.atan2(numerator,denominator);
        Long distanceBetweenPlaces = Math.round(delta_o * earthRadius); 
        return distanceBetweenPlaces;
    }

}

