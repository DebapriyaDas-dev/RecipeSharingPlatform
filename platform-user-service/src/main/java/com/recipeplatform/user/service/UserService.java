package com.recipeplatform.user.service;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.recipeplatform.user.dao.UserRepository;
import com.recipeplatform.user.dto.LoginDto;
import com.recipeplatform.user.dto.Rating;
import com.recipeplatform.user.dto.Recipe;
import com.recipeplatform.user.dto.RegisterDto;
import com.recipeplatform.user.entity.User;
import com.recipeplatform.user.exception.UserNotFoundException;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private RestTemplate restTemplate;

	private static final Logger logger = LoggerFactory.getLogger(UserService.class);
	
	public List<User> getAll() {
		return userRepository.findAll();
	}

	public User createUser(RegisterDto registerdto) {
		User user = new User();
		user.setName(registerdto.getName());
		user.setEmail(registerdto.getEmail());
		user.setPassword(registerdto.getPassword());
		return userRepository.save(user);
	}

	public User login(LoginDto logindto) {
        User user = userRepository.findUserByEmail(logindto.getEmail()).get();
        System.out.println(user);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }

        if (!user.getPassword().equals(logindto.getPassword())) {
            throw new UserNotFoundException("Invalid password");
        }
        
        user.setLoggedIn(true);
        userRepository.save(user);
        return user;
    }
	
	public void logout(String userId) {
		User user = userRepository.findById(userId).orElseThrow(UserNotFoundException::new);
		user.setLoggedIn(false);
		userRepository.save(user);
	}

	public List<User> findAllUsers() {
		List<User> users = userRepository.findAll();
		logger.info("Fetched {} users from the database.", users.size());
		return users.stream().map(user -> {
			String userId = user.getId();
			Rating[] ratingsOfUser = restTemplate.getForObject("http://RATING-SERVICE/ratings/user/" + userId,
					Rating[].class);
			List<Rating> ratings = Arrays.stream(ratingsOfUser).toList();

			List<Rating> ratingList = ratings.stream().map(rating -> {
				ResponseEntity<Recipe> recipeEntity = restTemplate
						.getForEntity("http://RECIPE-SERVICE/recipes/" + rating.getRecipeId(), Recipe.class);
				Recipe recipe = recipeEntity.getBody();
				if (recipe != null) {
					User recipeUser = userRepository.findById(recipe.getUserId())
							.orElseThrow(() -> new UserNotFoundException(
									"User with the given id is not found on the server: " + recipe.getUserId()));
					recipe.setUserName(recipeUser.getName());
				}
				rating.setRecipe(recipe);
				return rating;
			}).collect(Collectors.toList());

			user.setRatings(ratingList);

			Recipe[] recipesOfUser = restTemplate.getForObject("http://RECIPE-SERVICE/recipes/user/" + user.getId(),
					Recipe[].class);
			// List<Recipe> recipes = Arrays.stream(recipesOfUser).toList();

			List<Recipe> recipes = Arrays.stream(recipesOfUser).peek(recipe -> recipe.setUserName(user.getName()))
					.collect(Collectors.toList());

			// Fetching the recipes posted by the current user
			user.setRecipes(recipes);

			return user;
		}).collect(Collectors.toList());
	}

	
	public void deleteUser(String userId) {
		Optional<User> user = userRepository.findById(userId);
		if (user.isPresent()) {
			userRepository.deleteById(userId);
		} else {
			throw new UserNotFoundException("User not found with id : " + userId);
		}
	}

	public User findUserById(String userId) {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new UserNotFoundException("User with given id is not found on server!! " + userId));
		Rating[] ratingsOfUser = restTemplate.getForObject("http://RATING-SERVICE/ratings/user/" + user.getId(),
				Rating[].class);

		List<Rating> ratings = Arrays.stream(ratingsOfUser).toList();

		List<Rating> ratingList = ratings.stream().map(rating -> {
			ResponseEntity<Recipe> forEntity = restTemplate
					.getForEntity("http://RECIPE-SERVICE/recipes/" + rating.getRecipeId(), Recipe.class);
			Recipe recipe = forEntity.getBody();
			User user1 = userRepository.findById(recipe.getUserId()).orElseThrow(
					() -> new UserNotFoundException("User with given id is not found on server!! " + userId));
			recipe.setUserName(user1.getName());
			rating.setRecipe(recipe);
			return rating;
		}).collect(Collectors.toList());

		// Fetching the ratings done by the current user
		user.setRatings(ratingList);

		Recipe[] recipesOfUser = restTemplate.getForObject("http://RECIPE-SERVICE/recipes/user/" + user.getId(),
				Recipe[].class);
		// List<Recipe> recipes = Arrays.stream(recipesOfUser).toList();

		List<Recipe> recipes = Arrays.stream(recipesOfUser).peek(recipe -> recipe.setUserName(user.getName()))
				.collect(Collectors.toList());

		// Fetching the recipes posted by the current user
		user.setRecipes(recipes);

		return user;
	}

	public User updateUser(String id, User updatedUser) {
		Optional<User> optionalUser = userRepository.findById(id);
		if (optionalUser.isEmpty())
			throw new UserNotFoundException("User not found with ID: " + id);
		User existingUser = optionalUser.get();
		if (updatedUser.getName() != null)
			existingUser.setName(updatedUser.getName());
		if (updatedUser.getEmail() != null)
			existingUser.setEmail(updatedUser.getEmail());
		if (updatedUser.getPassword() != null)
			existingUser.setPassword(updatedUser.getPassword());

		return userRepository.save(existingUser);

	}

}
