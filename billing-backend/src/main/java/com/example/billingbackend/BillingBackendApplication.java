package com.example.billingbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import jakarta.annotation.PostConstruct;
import java.util.TimeZone;

@SpringBootApplication
public class BillingBackendApplication {

	public static void main(String[] args) {
		// Set default TimeZone to UTC to avoid "Asia/Calcutta" error with PostgreSQL
		System.setProperty("user.timezone", "UTC");
		java.util.TimeZone.setDefault(java.util.TimeZone.getTimeZone("UTC"));
		SpringApplication.run(BillingBackendApplication.class, args);
	}

}
