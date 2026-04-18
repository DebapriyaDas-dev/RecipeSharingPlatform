package com.recipeplatform.user.dto;

import java.sql.Time;
import java.time.LocalDate;

public class Recipe {

	
	private String name;
	
	private String userId; 
	
	private String userName;
	
	private Time cookingTime;
	
	private LocalDate createdAt;

	private Integer kiloCalories;

	// Getters and setters for other attributes and ingredients

	public Recipe() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Recipe(String name, String userId, String userName, Time cookingTime, LocalDate createdAt,
			Integer kiloCalories) {
		super();
		this.name = name;
		this.cookingTime = cookingTime;
		this.createdAt = createdAt;
		this.kiloCalories = kiloCalories;
		this.userId=userId;
	}
	

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}
	

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Time getCookingTime() {
		return cookingTime;
	}

	public void setCookingTime(Time cookingTime) {
		this.cookingTime = cookingTime;
	}

	public LocalDate getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDate createdAt) {
		this.createdAt = createdAt;
	}

	public Integer getKiloCalories() {
		return kiloCalories;
	}

	public void setKiloCalories(Integer kiloCalories) {
		this.kiloCalories = kiloCalories;
	}

}

