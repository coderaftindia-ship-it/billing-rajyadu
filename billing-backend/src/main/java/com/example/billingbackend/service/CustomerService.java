package com.example.billingbackend.service;

import com.example.billingbackend.model.Customer;
import com.example.billingbackend.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer createCustomer(Customer customer) {
        if (customer.getGst() != null) {
            customer.setGst(customer.getGst().toUpperCase().trim());
        }
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer customerDetails) {
        Customer customer = customerRepository.findById(id).orElse(null);
        if (customer != null) {
            customer.setName(customerDetails.getName());
            customer.setPhone(customerDetails.getPhone());
            customer.setAddress(customerDetails.getAddress());
            if (customerDetails.getGst() != null) {
                customer.setGst(customerDetails.getGst().toUpperCase().trim());
            } else {
                customer.setGst(null);
            }
            return customerRepository.save(customer);
        }
        return null;
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}
