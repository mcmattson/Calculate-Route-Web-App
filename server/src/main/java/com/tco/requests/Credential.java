package com.tco.requests;

public class Credential {
    // shared user with read-only access
    final static String USER = "cs314-db";
    final static String PASSWORD = "eiK5liet1uej";
    // connection information when using port forwarding from localhost
    final static String URL = "jdbc:mariadb://faure.cs.colostate.edu/cs314";
    static String url() {
        return URL;
    }
}