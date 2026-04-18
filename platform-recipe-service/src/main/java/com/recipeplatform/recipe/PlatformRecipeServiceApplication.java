package com.recipeplatform.recipe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@EnableDiscoveryClient
@SpringBootApplication
public class PlatformRecipeServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(PlatformRecipeServiceApplication.class, args);
	}

}
