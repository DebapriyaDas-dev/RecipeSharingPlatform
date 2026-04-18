package com.recipesharingplatform.rating.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code=HttpStatus.NOT_FOUND)
public class RatingNotFoundException extends RuntimeException{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public RatingNotFoundException() {
		super("RATING NOT FOUND!");
	}
	public RatingNotFoundException(String message) {
		super(message);
	}
	

}
