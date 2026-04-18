package com.recipeplatform.user.entity;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.recipeplatform.user.dto.Rating;
import com.recipeplatform.user.dto.Recipe;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "users")
public class User {

	@Id
	@Column(name = "user_id")
	@JsonProperty(access = Access.READ_ONLY)
	@GeneratedValue(strategy = GenerationType.UUID)
	private String id;

	@Column(name = "user_name")
	@NotEmpty(message = "Name is required")
	private String name;

	@Column(unique = true, name = "email_id")
	@Email(message = "Invalid email address")
	@NotEmpty(message = "Email is required")
	private String email;

	@NotEmpty(message = "Password is required")
	@Size(min = 8, message = "Password must be at least 8 characters long")
	@Pattern(regexp = "^(?=.*[0-9])(?=.*[@#$%^&+=])(?=\\S+$).*$", message = "Password must contain at least one digit and one special character")
	private String password;
	
	@Column(name="logged_in")
	private boolean loggedIn = false;

	@Transient
	@JsonProperty(access = Access.READ_ONLY)
	private List<Rating> ratings = new ArrayList<>();

	@Transient
	@JsonProperty(access = Access.READ_ONLY)
	private List<Recipe> recipes = new ArrayList<>();

	public User() {
		super();
		// TODO Auto-generated constructor stub
	}
	

	@Override
	public String toString() {
		return "User [id=" + id + ", name=" + name + ", email=" + email + ", password=" + password + ", loggedIn="
				+ loggedIn + ", ratings=" + ratings + ", recipes=" + recipes + "]";
	}


	public User(String id, @NotEmpty(message = "Name is required") String name,
			@Email(message = "Invalid email address") @NotEmpty(message = "Email is required") String email,
			@NotEmpty(message = "Password is required") @Size(min = 8, message = "Password must be at least 8 characters long") @Pattern(regexp = "^(?=.*[0-9])(?=.*[@#$%^&+=])(?=\\S+$).*$", message = "Password must contain at least one digit and one special character") String password,
			boolean loggedIn) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.password = password;
		this.loggedIn = loggedIn;
	}
	

	public boolean isLoggedIn() {
		return loggedIn;
	}

	public void setLoggedIn(boolean loggedIn) {
		this.loggedIn = loggedIn;
	}

	public List<Rating> getRatings() {
		return ratings;
	}

	public void setRatings(List<Rating> ratings) {
		this.ratings = ratings;
	}

	public List<Recipe> getRecipes() {
		return recipes;
	}

	public void setRecipes(List<Recipe> recipes) {
		this.recipes = recipes;
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

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

}
