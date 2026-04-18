package com.recipeplatform.recipe.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.recipeplatform.recipe.entity.Recipe;

public interface RecipeRepository extends JpaRepository<Recipe, String>{
	
	List<Recipe> findByUserId(String userId);
}
