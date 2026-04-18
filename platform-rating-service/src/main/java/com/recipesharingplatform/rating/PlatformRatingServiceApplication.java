package com.recipesharingplatform.rating;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class PlatformRatingServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlatformRatingServiceApplication.class, args);
	}

}
