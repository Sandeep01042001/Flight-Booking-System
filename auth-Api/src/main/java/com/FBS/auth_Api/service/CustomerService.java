package com.FBS.auth_Api.service;





import com.FBS.auth_Api.enums.Role;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.FBS.auth_Api.conectors.DatabaseApiConectors;
import com.FBS.auth_Api.models.Customer;

@Service
public class CustomerService {
    
    DatabaseApiConectors databaseApiConectors;

    @Autowired
    public CustomerService(DatabaseApiConectors databaseApiConectors) {
        this.databaseApiConectors = databaseApiConectors;
    }


    public Customer isHavingAccess(String email,
                                   String oprName){
        Customer customer = this.getCustomerDetails(email);
        if(customer == null){
            return null;
        }
        Role role = customer.getRole();
        if(role == Role.Admin){
            return customer;
        }
        return null;
    }


    
    public Customer getCustomerDetails(String email){
        return databaseApiConectors.callGetCustomerByEmailEndPoint(email);
    }
}
