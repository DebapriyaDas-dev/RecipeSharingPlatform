package com.recipeplatform.recipe.entity;

import java.sql.Time;
import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "recipes")
public class Recipe {
	@Id
	@GeneratedValue(strategy = GenerationType.UUID)
	@Column(name = "recipe_id")
	@JsonProperty(access = Access.READ_ONLY)
	private String recipeId;
	
	private String userId;

	@Column(name = "recipe_name")
	private String name;

	private String recipeDescription;

	private Time cookingTime;

	@JsonProperty(access = Access.READ_ONLY)
	private LocalDate createdAt;

	@Column(name = "kcal")
	private Integer kiloCalories;

	@OneToMany(cascade = CascadeType.ALL)
	@JoinColumn(name = "recipe_id")
	private List<Ingredient> ingredients;
	
	
	private String fileName;


	public Recipe() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Recipe(String recipeId, String userId, String name, String recipeDescription, Time cookingTime,
			LocalDate createdAt, Integer kiloCalories, List<Ingredient> ingredients, String fileName) {
		super();
		this.recipeId = recipeId;
		this.userId = userId;
		this.name = name;
		this.recipeDescription = recipeDescription;
		this.cookingTime = cookingTime;
		this.createdAt = createdAt;
		this.kiloCalories = kiloCalories;
		this.ingredients = ingredients;
		this.fileName = fileName;
	}

	public List<Ingredient> getIngredients() {
		return ingredients;
	}

	public void setIngredients(List<Ingredient> ingredients) {
		this.ingredients = ingredients;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}
	
	public String getFileName() {
		return fileName;
	}

	public String getRecipeId() {
		return recipeId;
	}

	public void setRecipeId(String recipeId) {
		this.recipeId = recipeId;
	}
	
	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getRecipeDescription() {
		return recipeDescription;
	}

	public void setRecipeDescription(String recipeDescription) {
		this.recipeDescription = recipeDescription;
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