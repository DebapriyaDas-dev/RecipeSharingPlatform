package com.recipesharingplatform.rating.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.recipesharingplatform.rating.entity.Rating;

public interface RatingRepository extends JpaRepository<Rating, String>{
	
	List<Rating> findByUserId(String userId);
	List<Rating> findByRecipeId(String recipeId);
}
