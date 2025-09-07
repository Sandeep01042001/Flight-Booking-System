package com.FBS.auth_Api.conectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpMethod;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.FBS.auth_Api.models.Customer;

/*
 * this class is responsble for calling diffrents endpoints for database api
 */

@Component
public class DatabaseApiConectors {

    @Value("${database.api.url}")
    String databaseApiUrl;
    
    /*
     * This method is responsible for calling get employee by email endpoint
     * /api/v1/db/empolyee/{email}
     * it will return Employee object
     * @param email
     * @return Customer 
     */
    public Customer callGetCustomerByEmailEndPoint(String email){
        // 1. create url
        String url = databaseApiUrl + "/customer/" + email; 
        // 2. create RequestEntity
        RequestEntity request = RequestEntity.get(url).build();
        // 3. call the database api 
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<Customer> response =  restTemplate.exchange(url, HttpMethod.GET, request, Customer.class);
        return response.getBody();    
    }  


}
