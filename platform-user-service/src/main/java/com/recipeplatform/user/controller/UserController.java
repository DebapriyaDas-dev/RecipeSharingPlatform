package com.recipeplatform.user.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.recipeplatform.user.dto.LoginDto;
import com.recipeplatform.user.dto.RegisterDto;
import com.recipeplatform.user.entity.User;
import com.recipeplatform.user.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {

	@Autowired
	private UserService userService;

	@PostMapping("/register")
	public ResponseEntity<User> createUser(@RequestBody RegisterDto registerdto) {
		User createdUser = userService.createUser(registerdto);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
	}
	
	@PostMapping("/logout/{userId}")
	public ResponseEntity<Void> logoutUser(@PathVariable String userId) {
		userService.logout(userId);
		return ResponseEntity.ok().build();
	}
	
	@PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginDto logindto) {
        User user1 = userService.login(logindto);
        return ResponseEntity.ok(user1);
    }

	// Get user by ID
	@GetMapping("/{id}")
	public ResponseEntity<User> getUserById(@PathVariable("id") String id) {
		User user = userService.findUserById(id);
		return ResponseEntity.ok().body(user);
	}

	// Get all users
	@GetMapping
	public ResponseEntity<List<User>> getAllUsers() {
		return ResponseEntity.ok(userService.getAll());
	}

	// Get all users with ratings and recipes
	@GetMapping("/all-data")
	public ResponseEntity<List<User>> getAllUsersWithData() {
		List<User> userList = userService.findAllUsers();
		return ResponseEntity.ok(userList);
	}

//
//    // Create user

//     Update user
	@PutMapping("/update-user/{id}")
	public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody User updatedUser) {
		User newUser = userService.updateUser(id, updatedUser);
		return ResponseEntity.ok(newUser);

	}

	// Delete user
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> deleteUser(@PathVariable("id") String id) {
		userService.deleteUser(id);
		return ResponseEntity.noContent().build();
	}
}
