package com.FBS.auth_Api.security;

import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.FBS.auth_Api.models.Customer;
import com.FBS.auth_Api.enums.Role;
import com.FBS.auth_Api.service.CustomerService;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class AuthUtility {
    @Value("${token.expirationTime}")
    Long expirationTime;

    @Value("${security.secretPassword}")
    String secretPassword;

    CustomerService customerService;
    
    @Autowired
    public AuthUtility(CustomerService customerService) {
        this.customerService = customerService;
    }

    public String generateToken(String email,
                                String password,
                                String role){
        String payload = email + ":" + password + ":" + role;
        String jwtToken = Jwts.builder()
                .setExpiration(new Date(System.currentTimeMillis() + expirationTime))
                .setIssuedAt(new Date())
                .signWith(SignatureAlgorithm.HS256, secretPassword)
                .setSubject(payload)
                .compact();
        return jwtToken;
    }

     /**
     * This method is responsible for decrypting the token and taking out the encrypted payload
     * @param token
     */
    public String decryptJwtToken(String token){
        String payload = Jwts.parser().setSigningKey(secretPassword)
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
        return payload;
    }

    /**
     * This method is responsible for validating the token
     * @param token
     */
    public boolean validateToken(String token){
        String payload =this.decryptJwtToken(token);
        String[] data = payload.split(":");
        String email = data[0];
        String password = data[1];
        String role = data[2];
        // I need to get the user having this email and password. 
        Customer customer = customerService.getCustomerDetails(email);
        if(customer == null){
            return false;
        }
        if(!customer.getPassword().equals(password)){
            return false;
        }
        return true;
    }
}
