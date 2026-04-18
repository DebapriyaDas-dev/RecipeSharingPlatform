package com.recipeplatform.recipe.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Ingredient {
	@Id
	@GeneratedValue(strategy=GenerationType.UUID)
	@Column(name="ingredient_id")
	private String id;

	private String name;
    private String quantity;
    
    
	public Ingredient() {
		super();
		// TODO Auto-generated constructor stub
	}
	public Ingredient(String id, String name, String quantity) {
		super();
		this.id = id;
		this.name = name;
		this.quantity = quantity;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getQuantity() {
		return quantity;
	}
	public void setQuantity(String quantity) {
		this.quantity = quantity;
	}


}
