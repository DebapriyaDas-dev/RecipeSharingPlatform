package com.recipeplatform.recipe.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.nio.file.Files;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import com.recipeplatform.recipe.dao.RecipeRepository;
import com.recipeplatform.recipe.entity.Recipe;
import com.recipeplatform.recipe.exception.ResourceNotFoundException;

@Service
public class RecipeService {

	@Autowired
	private RecipeRepository recipeRepository;

	private static final Logger logger = LoggerFactory.getLogger(RecipeService.class);

	public Recipe create(Recipe recipe) {
		recipe.setCreatedAt(LocalDate.now());
		return recipeRepository.save(recipe);
	}

	public List<Recipe> getRatingByUserId(String userId) {
		return recipeRepository.findByUserId(userId);
	}

	public String uploadImage(String path, MultipartFile file) throws IOException {
		// File-name
		String name = file.getOriginalFilename();

		// Full path
		String filePath = path + File.separator + name;

		// create folder if not created
		File f = new File(path);
		if (!f.exists()) {
			f.mkdir();
		}

		// file copy
		Files.copy(file.getInputStream(), Paths.get(filePath));

		return name;

	}
	
	public InputStream getResource(String path, String fileName) throws IOException{
		String fullPath = path+File.separator+fileName;
		InputStream is = new FileInputStream(fullPath);
		return is;
	}

	// get-all
	public List<Recipe> getAll() {
		List<Recipe> recipeList = recipeRepository.findAll();
		logger.info("Fetched {} recipes from the database.", recipeList.size());
		return recipeList;
	}

	// get single
	public Recipe findRecipeById(String id) {
		return recipeRepository.findById(id)
				.orElseThrow(() -> new ResourceNotFoundException("Recipe with given id not found ! - " + id));
	}

	public String delete(String id) {
		Optional<Recipe> recipe = recipeRepository.findById(id);
		if (recipe.isPresent()) {
			recipeRepository.deleteById(id);
			return ("Recipe with ID: " + id + " is deleted.");

		} else {
			throw new ResourceNotFoundException("Recipe not found with id: " + id);
		}
	}

	public Recipe update(String id, Recipe updatedRecipe) {
		Optional<Recipe> optionalRecipe = recipeRepository.findById(id);
		if (!optionalRecipe.isPresent()) {
			throw new ResourceNotFoundException("Recipe with given id: " + id + " not found.");
		}
		Recipe existingRecipe = optionalRecipe.get();
		if (updatedRecipe.getName() != null)
			existingRecipe.setName(updatedRecipe.getName());
		if (updatedRecipe.getRecipeDescription() != null)
			existingRecipe.setRecipeDescription(updatedRecipe.getRecipeDescription());
		if (updatedRecipe.getCookingTime() != null)
			existingRecipe.setCookingTime(updatedRecipe.getCookingTime());
		if (updatedRecipe.getCreatedAt() != null)
			existingRecipe.setCreatedAt(updatedRecipe.getCreatedAt());
		if (updatedRecipe.getKiloCalories() != null)
			existingRecipe.setKiloCalories(updatedRecipe.getKiloCalories());
		if (updatedRecipe.getIngredients() != null)
			existingRecipe.setIngredients(updatedRecipe.getIngredients());
		return recipeRepository.save(existingRecipe);
	}

}
