package com.recipeplatform.user.dto;

public class Rating {
	
	private String ratingId;
	
	private String userId;
	
	private String recipeId;
	
	private Integer rating;
	
	private String comment;
	
	private Recipe recipe;

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

	public Recipe getRecipe() {
		return recipe;
	}

	public void setRecipe(Recipe recipe) {
		this.recipe = recipe;
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
