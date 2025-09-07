package com.FBS.auth_Api.controlers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.FBS.auth_Api.dto.UserDetailsDto;
import com.FBS.auth_Api.models.Customer;
import com.FBS.auth_Api.models.Employee;
import com.FBS.auth_Api.security.AuthUtility;
import com.FBS.auth_Api.service.CustomerService;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthControler {

   AuthUtility authUtility;
   CustomerService customerService;

   @Autowired
   public AuthControler(AuthUtility authUtility, CustomerService customerService) {
       this.authUtility = authUtility;
       this.customerService = customerService;
       
   }
    
   @PostMapping(value = "/token", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
   public String generateToken(@RequestBody UserDetailsDto userDetailsDto){
       String token = authUtility.generateToken(userDetailsDto.getEmail(), userDetailsDto.getPassword(), userDetailsDto.getRole());
       return token;
   }

    @GetMapping("/validate/{oprName}")
    public Customer validateToken(@RequestHeader String Authorization,
                                @PathVariable String oprName){
        String token = Authorization.substring(7);
        // Authentication check
        if(!authUtility.validateToken(token)){
            return null;
        }
        String email  = authUtility.decryptJwtToken(token).split(":")[0];
        // Authorization check
        Customer customer = customerService.isHavingAccess(email, oprName);
        return customer;
    }

}
