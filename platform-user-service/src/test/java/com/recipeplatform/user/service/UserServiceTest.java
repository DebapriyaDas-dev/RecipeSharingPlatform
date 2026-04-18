package com.recipeplatform.user.service;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.client.RestTemplate;

import com.recipeplatform.user.dao.UserRepository;
import com.recipeplatform.user.dto.LoginDto;
import com.recipeplatform.user.dto.RegisterDto;
import com.recipeplatform.user.entity.User;
import com.recipeplatform.user.exception.UserNotFoundException;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateUser() {
        RegisterDto registerDto = new RegisterDto();
        registerDto.setName("John");
        registerDto.setEmail("john@example.com");
        registerDto.setPassword("password");

        User user = new User();
        user.setName(registerDto.getName());
        user.setEmail(registerDto.getEmail());
        user.setPassword(registerDto.getPassword());

        when(userRepository.save(any(User.class))).thenReturn(user);

        User createdUser = userService.createUser(registerDto);

        assertNotNull(createdUser);
        assertEquals(user.getName(), createdUser.getName());
        assertEquals(user.getEmail(), createdUser.getEmail());
        assertEquals(user.getPassword(), createdUser.getPassword());

        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    public void testLogin_InvalidEmail() {
        LoginDto loginDto = new LoginDto();
        loginDto.setEmail("john.com");
        loginDto.setPassword("password");
        
        

        when(userRepository.findUserByEmail(loginDto.getEmail())).thenReturn(Optional.empty());

//        assertThrows(UserNotFoundException.class, () -> {
//            userService.login(loginDto);
//        });
    }

    @Test
    public void testLogin_InvalidPassword() {
        LoginDto loginDto = new LoginDto();
        loginDto.setEmail("john@example.com");
        loginDto.setPassword("password");

        User user = new User();
        user.setEmail(loginDto.getEmail());
        user.setPassword("wrong_password");

        when(userRepository.findUserByEmail(loginDto.getEmail())).thenReturn(Optional.of(user));

        assertThrows(UserNotFoundException.class, () -> {
            userService.login(loginDto);
        });

        verify(userRepository, times(1)).findUserByEmail(loginDto.getEmail());
    }

    @Test
    public void testLogin_Successful() {
        LoginDto loginDto = new LoginDto();
        loginDto.setEmail("john@example.com");
        loginDto.setPassword("password");

        User user = new User();
        user.setEmail(loginDto.getEmail());
        user.setPassword(loginDto.getPassword());

        when(userRepository.findUserByEmail(loginDto.getEmail())).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        User loggedInUser = userService.login(loginDto);

        assertNotNull(loggedInUser);
        assertTrue(loggedInUser.isLoggedIn());

        verify(userRepository, times(1)).findUserByEmail(loginDto.getEmail());
        verify(userRepository, times(1)).save(user);
    }

}
