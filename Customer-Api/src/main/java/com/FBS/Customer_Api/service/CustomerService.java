package com.FBS.Customer_Api.service;

import com.FBS.Customer_Api.connector.AuthApiConnector;
import com.FBS.Customer_Api.connector.DatabaseApiConnector;
import com.FBS.Customer_Api.model.Customer;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class CustomerService {

    private  DatabaseApiConnector dbConnector;
    private  AuthApiConnector authConnector;

    public CustomerService(DatabaseApiConnector dbConnector, AuthApiConnector authConnector) {
        this.dbConnector = dbConnector;
        this.authConnector = authConnector;
    }

    // CREATE -> DB + Auth
    public Customer registerCustomer(Customer customer) {
        Customer created = dbConnector.createCustomer(customer);
        if (customer.getPassword() != null) {
            authConnector.registerInAuth(created);
        }
        return created;
    }

    // READ
    public List<Customer> getAllCustomers() { return dbConnector.getAllCustomers(); }
    public Customer getCustomerById(UUID id) { return dbConnector.getCustomerById(id); }
    public Customer getCustomerByEmail(String email) { return dbConnector.getCustomerByEmail(email); }

    // UPDATE
    public Customer updateCustomer(UUID id, Customer customer) {
        return dbConnector.updateCustomer(id, customer);
    }

    // DELETE
    public void deleteCustomer(UUID id) { dbConnector.deleteCustomer(id); }

    // AUTH
    public AuthApiConnector.TokenResponse login(String email, String password) {
        return authConnector.login(email, password);
    }

    public boolean validateToken(String token) { return authConnector.validateToken(token); }

    public String logout(String token) { return authConnector.logout(token); }
}
