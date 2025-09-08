package com.FBS.Customer_Api.controller;

import com.FBS.Customer_Api.connector.AuthApiConnector;
import com.FBS.Customer_Api.model.Customer;
import com.FBS.Customer_Api.service.CustomerService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/customers")
public class CustomerController {

    private CustomerService service;
    private AuthApiConnector authConnector;

    public CustomerController(CustomerService service, com.FBS.Customer_Api.connector.AuthApiConnector authConnector) {
        this.service = service;
        this.authConnector = authConnector;
    }

    // CRUD

    @PostMapping("/register")
    public Customer register(@RequestBody Customer customer) {
        return service.registerCustomer(customer);
    }

    @GetMapping("/getAll")
    public List<Customer> getAll() {
        return service.getAllCustomers();
    }

    @GetMapping("/getById/{id}")
    public Customer getById(@PathVariable UUID id) {
        return service.getCustomerById(id);
    }

    @GetMapping("/email/{email}")
    public Customer getByEmail(@PathVariable String email) {
        return service.getCustomerByEmail(email);
    }

    @PutMapping("/update/{id}")
    public Customer update(@PathVariable UUID id, @RequestBody Customer customer) {
        return service.updateCustomer(id, customer);
    }

    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable UUID id) {
        service.deleteCustomer(id);
        return "Customer deleted with id: " + id;
    }

    // AUTH

    @PostMapping("/login")
    public AuthApiConnector.TokenResponse login(@RequestParam String email,
                                                @RequestParam String password) {
        return service.login(email, password);
    }

    @GetMapping("/validate")
    public boolean validate(@RequestHeader("Authorization") String token) {
        token = token.replace("Bearer ", "").trim();
        return service.validateToken(token);
    }

    @PostMapping("/logout")
    public String logout(@RequestHeader("Authorization") String token) {
        token = token.replace("Bearer ", "").trim();
        return service.logout(token);
    }
}
