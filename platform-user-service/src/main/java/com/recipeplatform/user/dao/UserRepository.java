package com.recipeplatform.user.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.recipeplatform.user.entity.User;

public interface UserRepository extends JpaRepository<User, String> {
	
	public Optional<User> findUserByEmail(String email);
}
