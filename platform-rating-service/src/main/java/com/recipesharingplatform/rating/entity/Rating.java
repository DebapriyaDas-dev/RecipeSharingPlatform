package com.recipesharingplatform.rating.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonProperty.Access;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

@Entity
public class Rating {
	@Id
	@GeneratedValue(strategy=GenerationType.UUID)
	@Column(name="rating_id")
	@JsonProperty(access=Access.READ_ONLY)
	private String ratingId;
	
	private String userId;
	
	private String recipeId;
	
	@Min(value = 1, message = "Rating value should be at least 1")
    @Max(value = 10, message = "Rating value should be at most 10")
	private Integer rating;
	
	private String comment;
	
	

	@Override
	public String toString() {
		return "Rating [ratingId=" + ratingId + ", userId=" + userId + ", recipeId=" + recipeId + ", rating=" + rating
				+ ", comment=" + comment + "]";
	}

	public Rating() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Rating(String ratingId, String userId, String recipeId, Integer rating, String comment) {
		super();
		this.ratingId = ratingId;
		this.userId = userId;
		this.recipeId = recipeId;
		this.rating = rating;
		this.comment = comment;
	}

	public String getRatingId() {
		return ratingId;
	}

	public void setRatingId(String ratingId) {
		this.ratingId = ratingId;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getRecipeId() {
		return recipeId;
	}

	public void setRecipeId(String recipeId) {
		this.recipeId = recipeId;
	}

	public Integer getRating() {
		return rating;
	}

	public void setRating(Integer rating) {
		this.rating = rating;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
	
	
}
