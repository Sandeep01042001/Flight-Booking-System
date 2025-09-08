package com.FBS.Customer_Api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerDetails {
    
    private String name;
    private String email;
    private String phone;
    private String address;

}
