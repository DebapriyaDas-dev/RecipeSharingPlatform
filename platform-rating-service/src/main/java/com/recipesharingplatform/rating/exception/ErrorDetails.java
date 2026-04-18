package com.recipesharingplatform.rating.exception;

import java.time.LocalDateTime;

public class ErrorDetails {
	//time-stamp
	private LocalDateTime timestamp;
	
	//message
	private String message;
	
	//Error code status
	private Integer code;

	//No Arguments constructor
	public ErrorDetails() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public ErrorDetails(LocalDateTime timestamp, String message, int code) {
		super();
		this.timestamp = timestamp;
		this.message = message;
		this.code=code;

	}
	
	public Integer getCode() {
		return code;
	}

	public void setCode(Integer code) {
		this.code = code;
	}


	public LocalDateTime getTimestamp() {
		return timestamp;
	}
	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}
	public String getMessage() {
		return message;
	}
	public void setMessage(String message) {
		this.message = message;
	}
	
	
}
