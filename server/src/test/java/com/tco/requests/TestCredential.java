package com.tco.requests;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.DriverManager;

import com.tco.requests.Credential;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;

public class TestCredential {
     
    String sql = Select.match("Dave", 1);
    
    @Test
    @DisplayName ("mmattson: no Credentials")
    public void testNoCredentials () {
        boolean thrown = true;
        try (
            Connection conn = DriverManager.getConnection(null, null, null);
            Statement query = conn.createStatement();
            ResultSet results = query.executeQuery(sql)
        ) {}
        catch (Exception e){
            thrown = false;
        }
        assertFalse(thrown);
    }

    @Test
    @DisplayName ("mmattson: correct credentials")
    public void testCorrectCredentials () {
        boolean thrown = true;
        String user = Credential.USER;
        String password = Credential.PASSWORD;
        String url = Credential.URL;
        try (
            Connection conn = DriverManager.getConnection(url, user, password);
            Statement query = conn.createStatement();
            ResultSet results = query.executeQuery(sql)
        ) {}
        catch(Exception e){
            thrown = false;
        } 
        assertTrue(thrown);  
    }
     
     @Test
    @DisplayName ("mmattson: incorrect credentials")
    public void testWrongCredentials () {
        boolean thrown = true;
        String user = "wronguser";
        String password = "abc123";
        String url = "WrongDB";

        try (
            Connection conn = DriverManager.getConnection(url, user, password);
            Statement query = conn.createStatement();
            ResultSet results = query.executeQuery(sql)
        ) {}
        catch (Exception e){
            thrown = false;
        }
        assertFalse(thrown);
    }
}
