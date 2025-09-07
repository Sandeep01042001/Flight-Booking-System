package com.FBS.auth_Api.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class AuthFilter extends OncePerRequestFilter{

    
    private AuthUtility authUtility;
    
    @Autowired
    public AuthFilter(AuthUtility authUtility){
        this.authUtility = authUtility;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String bearerToken = request.getHeader("Authorization");
        if(bearerToken != null && bearerToken.startsWith("Bearer ")){
            String token = bearerToken.substring(7);
            boolean isValid = authUtility.validateToken(token);
            if(isValid == false){
                filterChain.doFilter(request, response);
            }else{
                String payload = authUtility.decryptJwtToken(token);
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(payload, null, Collections.emptyList());
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                filterChain.doFilter(request, response);
            }
            
        }else{
            // If the token is not present then i will not set any kind of authentication
            // and i will return from here it self
            filterChain.doFilter(request, response);
        }
    }
    
}
