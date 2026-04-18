package com.recipeplatform.recipe.exception;
import java.time.LocalDateTime;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler{
	
	@ExceptionHandler(Exception.class)
	public final ResponseEntity<ErrorDetails> handleAllException(Exception ex){
		ErrorDetails errorDetails = new ErrorDetails(LocalDateTime.now(), ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value());
		return new ResponseEntity<ErrorDetails>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@ExceptionHandler(ResourceNotFoundException.class)
	public final ResponseEntity<ErrorDetails> handleUserNotFoundException(ResourceNotFoundException ex){
		String message = ex.getMessage();
		ErrorDetails errorDetails = new ErrorDetails();
		errorDetails.setCode(HttpStatus.NOT_FOUND.value());
		errorDetails.setMessage(message);
		errorDetails.setTimestamp(LocalDateTime.now());
		return new ResponseEntity<>(errorDetails, HttpStatus.NOT_FOUND);
	}
	
//	@Override
//	protected ResponseEntity<Object> handleMethodArgumentNotValid(
//			MethodArgumentNotValidException ex, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
//		ErrorDetails errorDetails = new ErrorDetails(LocalDateTime.now(),"Total errors: " +ex.getErrorCount()+ " Errors: "+ ex.getFieldError().getDefaultMessage(),request.getDescription(true));
//		
//		return new ResponseEntity<Object>(errorDetails, HttpStatus.BAD_REQUEST);
//	}
}
