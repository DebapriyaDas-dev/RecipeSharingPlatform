package com.recipeplatform.user.exception;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

import org.springframework.core.NestedExceptionUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler{
	
	@ExceptionHandler(Exception.class)
	public final ResponseEntity<ErrorDetails> handleAllException(Exception ex){
		ErrorDetails errorDetails = new ErrorDetails(LocalDateTime.now(), ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR.value());
		return new ResponseEntity<ErrorDetails>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
	}
	
	@ExceptionHandler(ConstraintViolationException.class)
	public final ResponseEntity<ErrorDetails> handleConstraintViolationException(ConstraintViolationException ex){
		String message = ex.getConstraintViolations().stream()
				.map(ConstraintViolation::getMessage)
				.sorted()
				.collect(Collectors.joining("; "));
		ErrorDetails errorDetails = new ErrorDetails(LocalDateTime.now(), message, HttpStatus.BAD_REQUEST.value());
		return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
	}

	// Entity validation runs when the transaction commits, so the violation arrives wrapped
	@ExceptionHandler(TransactionSystemException.class)
	public final ResponseEntity<ErrorDetails> handleTransactionSystemException(TransactionSystemException ex){
		if (NestedExceptionUtils.getMostSpecificCause(ex) instanceof ConstraintViolationException violation) {
			return handleConstraintViolationException(violation);
		}
		return handleAllException(ex);
	}

	@ExceptionHandler(UserNotFoundException.class)
	public final ResponseEntity<ErrorDetails> handleUserNotFoundException(UserNotFoundException ex){
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
