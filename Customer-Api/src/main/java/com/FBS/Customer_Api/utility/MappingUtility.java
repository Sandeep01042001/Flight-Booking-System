package com.FBS.Customer_Api.utility;

import org.springframework.stereotype.Component;

import com.FBS.Customer_Api.dto.CustomerDetails;
import com.FBS.Customer_Api.model.Customer;

@Component
public class MappingUtility {

    public Customer mapCustomerDetailsToCustomerModel(CustomerDetails details){
        Customer customer = new Customer();
        customer.setName(details.getName());
        customer.setEmail(details.getEmail());
        customer.setPhone(details.getPhone());
        customer.setAddress(details.getAddress());
        return customer;
    }
}
