package com.luxe.backend.dto;

public class PlaceOrderRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String zip;
    private String country;
    private String paymentMethod;
    private String sessionId;
    private String paymentIntentId;

    // Getters and Setters

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getZip() { return zip; }
    public void setZip(String zip) { this.zip = zip; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getPaymentIntentId() { return paymentIntentId; }
    public void setPaymentIntentId(String paymentIntentId) { this.paymentIntentId = paymentIntentId; }
}
