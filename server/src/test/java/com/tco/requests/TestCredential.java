package com.tco.requests;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.sql.DriverManager;

import com.tco.requests.Credential;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.BeforeEach;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertEquals;

public class TestCredential {
     
    String sql = Select.match("Dave", 1); 
    String user = Credential.USER;
    String password = Credential.PASSWORD;
    String url = Credential.URL;

    @Test
    @DisplayName ("mmattson: no Credentials")
    public void testNoCredentials () {
        boolean thrown = true;
        try (
            Connection result = DriverManager.getConnection(null, null, null);
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
        try (
            Connection result = DriverManager.getConnection(url, user, password);
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
        try (
            Connection result = DriverManager.getConnection(url, user, "CS314IsFun!");
        ) {}
        catch (Exception e){
            thrown = false;
        }
        assertFalse(thrown);
    }

     @Test
    @DisplayName ("mmattson: query returned")
    public void testReturnQuery () {
        boolean thrown = true;
        try (
            Connection conn = DriverManager.getConnection(url, user, password);
            Statement query = conn.createStatement();
            ResultSet results = query.executeQuery(sql)
        ) {}
        catch (Exception e){
            thrown = false;
        }
        assertTrue(thrown);
    }

     @Test
    @DisplayName ("mmattson: query not returned")
    public void testNoReturnQuery () {
        boolean thrown = true;
        try (
            Connection conn = DriverManager.getConnection(url, " ", password);
            Statement query = conn.createStatement();
            ResultSet results = query.executeQuery(sql)
        ) {}
        catch (Exception e){
            thrown = false;
        }
        assertFalse(thrown);
    }
}
