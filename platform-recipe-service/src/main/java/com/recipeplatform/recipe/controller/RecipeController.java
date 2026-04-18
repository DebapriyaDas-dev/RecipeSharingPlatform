package com.recipeplatform.recipe.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StreamUtils;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.recipeplatform.recipe.entity.Recipe;
import com.recipeplatform.recipe.service.RecipeService;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("recipes")
public class RecipeController {

	@Autowired
	private RecipeService recipeService;
	
	@Value("${project.image}")
	private String path;

	// Get all users
	@GetMapping("/all-recipes")
	public ResponseEntity<List<Recipe>> getAllRecipes() {
		List<Recipe> recipeList = recipeService.getAll();
		return ResponseEntity.ok(recipeList);
	}

	@GetMapping("/user/{userId}")
	public ResponseEntity<List<Recipe>> getRatingsByUserId(@PathVariable String userId) {
		return ResponseEntity.ok(recipeService.getRatingByUserId(userId));
	}

	// Get recipe by ID
	@GetMapping("/{id}")
	public ResponseEntity<Recipe> getReipeById(@PathVariable("id") String id) {
		Recipe recipe = recipeService.findRecipeById(id);
		return ResponseEntity.ok(recipe);
	}

	// Create user
	@PostMapping("/new-recipe")
	public ResponseEntity<Recipe> createUser(@Validated @RequestBody Recipe recipe) {
		recipe = recipeService.create(recipe);
		return ResponseEntity.ok(recipe);
	}
	
	@PostMapping("/upload-image/{id}")
	public ResponseEntity<Recipe> fileUpload(@PathVariable String id, @RequestParam("image") MultipartFile image){
		Recipe recipe = recipeService.findRecipeById(id);
		String fileName =null;
		try {
			fileName = this.recipeService.uploadImage(path, image);
		}catch(IOException e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatusCode.valueOf(500)).build();
		}
		recipe.setFileName(fileName);
		recipe = recipeService.create(recipe);
		return ResponseEntity.ok(recipe);
	}
	
	@GetMapping(value="/image/{image}", produces=MediaType.IMAGE_JPEG_VALUE)
    public void downloadImage(@PathVariable String image, HttpServletResponse response) throws IOException{
		InputStream resource = this.recipeService.getResource(path, image);
		response.getContentType();
		StreamUtils.copy(resource, response.getOutputStream());
	}

	// Update user
	@PutMapping("/update-recipe/{id}")
	public ResponseEntity<Recipe> updateRecipe(@PathVariable String id, @RequestBody Recipe updatedRecipe) {
		Recipe newRecipe = recipeService.update(id, updatedRecipe);
		return ResponseEntity.ok(newRecipe);
	}

	// Delete user
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable String id) {
		recipeService.delete(id);
		return ResponseEntity.noContent().build();
	}

}
