package com.recipeplatform.user.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
		// One call per downstream service, regardless of how many users there are
		Rating[] ratings = restTemplate.getForObject("http://RATING-SERVICE/ratings/all-ratings", Rating[].class);
		Recipe[] recipes = restTemplate.getForObject("http://RECIPE-SERVICE/recipes/all-recipes", Recipe[].class);
		attachRatingsAndRecipes(users, toList(ratings), toList(recipes));
		return users;
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
		Rating[] ratings = restTemplate.getForObject("http://RATING-SERVICE/ratings/user/" + userId, Rating[].class);
		Recipe[] recipes = restTemplate.getForObject("http://RECIPE-SERVICE/recipes/user/" + userId, Recipe[].class);
		attachRatingsAndRecipes(List.of(user), toList(ratings), toList(recipes));
		return user;
	}

	// Sets each user's ratings (with the rated recipe) and posted recipes. Recipes not already
	// fetched are loaded in one batch call and their authors in one query. A rating whose recipe
	// no longer exists is kept with a null recipe instead of failing the whole request.
	private void attachRatingsAndRecipes(List<User> users, List<Rating> ratings, List<Recipe> postedRecipes) {
		Map<String, Recipe> recipesById = new HashMap<>();
		postedRecipes.forEach(recipe -> recipesById.put(recipe.getRecipeId(), recipe));

		List<String> missingRecipeIds = ratings.stream().map(Rating::getRecipeId)
				.filter(id -> id != null && !recipesById.containsKey(id)).distinct().toList();
		if (!missingRecipeIds.isEmpty()) {
			Recipe[] rated = restTemplate.postForObject("http://RECIPE-SERVICE/recipes/batch", missingRecipeIds,
					Recipe[].class);
			toList(rated).forEach(recipe -> recipesById.put(recipe.getRecipeId(), recipe));
		}

		Map<String, String> userNames = new HashMap<>();
		users.forEach(user -> userNames.put(user.getId(), user.getName()));
		List<String> unknownAuthorIds = recipesById.values().stream().map(Recipe::getUserId)
				.filter(id -> id != null && !userNames.containsKey(id)).distinct().toList();
		if (!unknownAuthorIds.isEmpty()) {
			userRepository.findAllById(unknownAuthorIds)
					.forEach(author -> userNames.put(author.getId(), author.getName()));
		}
		recipesById.values().forEach(recipe -> recipe.setUserName(userNames.get(recipe.getUserId())));

		ratings.forEach(rating -> {
			Recipe recipe = recipesById.get(rating.getRecipeId());
			if (recipe == null) {
				logger.warn("Rating {} refers to recipe {} which does not exist.", rating.getRatingId(),
						rating.getRecipeId());
			}
			rating.setRecipe(recipe);
		});

		Map<String, List<Rating>> ratingsByUser = ratings.stream().filter(rating -> rating.getUserId() != null)
				.collect(Collectors.groupingBy(Rating::getUserId));
		Map<String, List<Recipe>> recipesByUser = postedRecipes.stream().filter(recipe -> recipe.getUserId() != null)
				.collect(Collectors.groupingBy(Recipe::getUserId));
		users.forEach(user -> {
			user.setRatings(ratingsByUser.getOrDefault(user.getId(), new ArrayList<>()));
			user.setRecipes(recipesByUser.getOrDefault(user.getId(), new ArrayList<>()));
		});
	}

	private static <T> List<T> toList(T[] array) {
		return array == null ? List.of() : Arrays.asList(array);
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
