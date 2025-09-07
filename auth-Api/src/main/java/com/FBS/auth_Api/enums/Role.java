package com.FBS.auth_Api.enums;


public enum Role {
    Customer("CUSTOMER"),
    Admin("ADMIN");
    
    private final String value;
    
    Role(String value) {
        this.value = value;
    }
    
    public String getValue() {
        return value;
    }
}
