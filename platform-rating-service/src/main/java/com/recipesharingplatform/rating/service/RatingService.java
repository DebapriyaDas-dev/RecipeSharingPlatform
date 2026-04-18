package com.recipesharingplatform.rating.service;

import java.util.List;

import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.recipesharingplatform.rating.dao.RatingRepository;
import com.recipesharingplatform.rating.entity.Rating;
import com.recipesharingplatform.rating.exception.RatingNotFoundException;

@Service
public class RatingService {
	
	@Autowired
	private RatingRepository ratingRepository;
	
	private static final Logger logger = LoggerFactory.getLogger(RatingService.class);
	
	public Rating create(Rating rating) {
		return ratingRepository.save(rating);
	}
	
	public List<Rating> getAll(){
		List<Rating> ratingList = ratingRepository.findAll();
		logger.info("Fetched {} ratings from the database.",ratingList.size());
		return ratingList;
	}
	
	public Rating findRatingById(String id) {
		return ratingRepository.findById(id).orElseThrow(()-> new RatingNotFoundException("Rating with given id not found! -"+id));
	}
	
	public List<Rating> getRatingByUserId(String userId){
		return ratingRepository.findByUserId(userId);
	}
	
	public List<Rating> getRatingByRecipeId(String recipeId){
		return ratingRepository.findByRecipeId(recipeId);
	}
	
	public String delete(String id) {
		Optional<Rating> rating = ratingRepository.findById(id);
		if(rating.isPresent()) {
			ratingRepository.deleteById(id);
			return ("Rating with ID: "+id+ " is deleted.");

		} else {
			throw new RatingNotFoundException("Rating not found with id: " + id);
		}
	}
	
	public Rating update(String id, Rating updatedRating) {
		Optional<Rating> optionalRating = ratingRepository.findById(id);
		if(!optionalRating.isPresent()) {
			throw new RatingNotFoundException("Rating with given id: "+id+" not found");
		}
		
		Rating existingRating = optionalRating.get();
		if(updatedRating.getRating()!=null) 
			existingRating.setRating(updatedRating.getRating());
		if(updatedRating.getComment()!=null) 
			existingRating.setComment(updatedRating.getComment());
		
		return ratingRepository.save(existingRating);
		
	}
	
}
