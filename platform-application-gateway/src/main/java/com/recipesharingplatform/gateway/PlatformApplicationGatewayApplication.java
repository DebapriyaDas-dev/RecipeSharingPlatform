package com.recipesharingplatform.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class PlatformApplicationGatewayApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlatformApplicationGatewayApplication.class, args);
	}

}
