package com.recipesharingplatform.rating.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.recipesharingplatform.rating.entity.Rating;
import com.recipesharingplatform.rating.service.RatingService;


@RestController
@RequestMapping("/ratings")
public class RatingController {
	
	@Autowired
	private RatingService ratingService;
	
	@GetMapping("/{id}")
	public ResponseEntity<Rating> getRatingById(@PathVariable String id){
		Rating rating = ratingService.findRatingById(id);
		return ResponseEntity.ok(rating);
	}
	
	@GetMapping("/all-ratings")
	public ResponseEntity<List<Rating>> getAllRatings(){
		List<Rating> ratingList = ratingService.getAll();
		return ResponseEntity.ok(ratingList);
	}
	@GetMapping("/user/{userId}")
	public ResponseEntity<List<Rating>> getRatingsByUserId(@PathVariable String userId){
		return ResponseEntity.ok(ratingService.getRatingByUserId(userId));
	}
	@GetMapping("/recipe/{recipeId}")
	public ResponseEntity<List<Rating>> getRatingsByHotelId(@PathVariable String recipeId){
		return ResponseEntity.ok(ratingService.getRatingByRecipeId(recipeId));
	}
	
	@PostMapping("/new-rating")
	public ResponseEntity<Rating> createRating(@Validated @RequestBody Rating rating){
		Rating createdRating = ratingService.create(rating);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdRating);
	}
	
	@PutMapping("/update-rating/{id}")
	public ResponseEntity<Rating> updateRating(@PathVariable String id, @RequestBody Rating updatedRating) {
		Rating newRating = ratingService.update(id, updatedRating);
		return ResponseEntity.ok(newRating);

	}

	// Delete user
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteRating(@PathVariable String id) {
		ratingService.delete(id);
		return ResponseEntity.noContent().build();
	}
	
	
}
