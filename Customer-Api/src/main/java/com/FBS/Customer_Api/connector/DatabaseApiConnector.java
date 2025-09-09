package com.FBS.Customer_Api.connector;

import com.FBS.Customer_Api.model.Customer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Component
public class DatabaseApiConnector {

    @Value("${database.api.url}")
    private String databaseApiUrl; // e.g. http://localhost:8080/api/v1/database

    private final RestTemplate restTemplate = new RestTemplate();

    // CREATE
    public Customer createCustomer(Customer customer) {
        return restTemplate.postForObject(databaseApiUrl + "/customers", customer, Customer.class);
    }

    // READ ALL
    public List<Customer> getAllCustomers() {
        ResponseEntity<Customer[]> resp =
                restTemplate.getForEntity(databaseApiUrl + "/customers", Customer[].class);
        return Arrays.asList(resp.getBody());
    }

    // READ BY ID
    public Customer getCustomerById(UUID id) {
        return restTemplate.getForObject(databaseApiUrl + "/customers/" + id, Customer.class);
    }

    // READ BY EMAIL
    public Customer getCustomerByEmail(String email) {
        return restTemplate.getForObject(databaseApiUrl + "/customers/email/" + email, Customer.class);
    }

    // UPDATE
    public Customer updateCustomer(UUID id, Customer customer) {
        restTemplate.put(databaseApiUrl + "/customers/" + id, customer);
        return customer;
    }

    // DELETE
    public void deleteCustomer(UUID id) {
        restTemplate.delete(databaseApiUrl + "/customers/" + id);
    }
}
