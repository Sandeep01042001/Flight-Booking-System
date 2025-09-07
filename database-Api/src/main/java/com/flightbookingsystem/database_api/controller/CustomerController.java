package com.flightbookingsystem.database_api.controller;


import com.flightbookingsystem.database_api.model.Customer;
import com.flightbookingsystem.database_api.reposatories.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/db/customer")
public class CustomerController {


     CustomerRepository customerRepository;

    @Autowired
    public CustomerController(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    @GetMapping("{email}")
    public ResponseEntity<Customer> getEmployeeByEmailId(@PathVariable String email){
        Customer customer = customerRepository.findByEmail(email);
        return new ResponseEntity<>(customer, HttpStatus.OK);

    }

    @PostMapping("/create")
    public Customer createCustomer(@RequestBody Customer customer) {
        return customerRepository.save(customer);
    }

    @GetMapping
    public List<Customer> getAllCustomer(){
        return customerRepository.findAll();
    }

    @GetMapping("/{customerId}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable UUID customerId) {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        if (customer == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(customer, HttpStatus.OK);
    }

    @PutMapping("/{customerId}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable UUID customerId, @RequestBody Customer updatedCustomer) {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        if (customer == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        // Update fields
        customer.setName(updatedCustomer.getName());
        customer.setEmail(updatedCustomer.getEmail());
        customer.setPhone(updatedCustomer.getPhone());
        customer.setPassword(updatedCustomer.getPassword());
        customer.setAddress(updatedCustomer.getAddress());
        customer.setWalletBalance(updatedCustomer.getWalletBalance());
        customer.setLoyaltyPoints(updatedCustomer.getLoyaltyPoints());
        customer.setRole(updatedCustomer.getRole());

        Customer savedCustomer = customerRepository.save(customer);
        return new ResponseEntity<>(savedCustomer, HttpStatus.OK);
    }

    @DeleteMapping("/{customerId}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable UUID customerId) {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        if (customer == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        customerRepository.delete(customer);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
