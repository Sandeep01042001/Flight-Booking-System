package com.FBS.Customer_Api.connector;

import com.FBS.Customer_Api.model.Customer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class AuthApiConnector {

    @Value("${auth.api.url}")
    private String authApiUrl; // e.g. http://localhost:8082

    private final RestTemplate restTemplate = new RestTemplate();

    // LOGIN
    public TokenResponse login(String email, String password) {
        LoginRequest req = new LoginRequest(email, password);
        ResponseEntity<TokenResponse> response =
                restTemplate.postForEntity(authApiUrl + "/auth/login", req, TokenResponse.class);
        return response.getBody();
    }

    // VALIDATE
    public boolean validateToken(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<Boolean> response =
                restTemplate.exchange(authApiUrl + "/auth/validate", HttpMethod.GET, entity, Boolean.class);
        return response.getBody() != null && response.getBody();
    }

    // LOGOUT
    public String logout(String token) {
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response =
                restTemplate.exchange(authApiUrl + "/auth/logout", HttpMethod.POST, entity, String.class);
        return response.getBody();
    }

    // REGISTER in Auth
    public String registerInAuth(Customer customer) {
        ResponseEntity<String> response =
                restTemplate.postForEntity(authApiUrl + "/auth/register", customer, String.class);
        return response.getBody();
    }

    // small DTOs
    private record LoginRequest(String email, String password) {}
    public record TokenResponse(String token) {}
}
