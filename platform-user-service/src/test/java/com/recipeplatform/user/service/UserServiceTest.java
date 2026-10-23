package com.recipeplatform.user.service;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.web.client.RestTemplate;

import com.recipeplatform.user.dao.UserRepository;
import com.recipeplatform.user.dto.LoginDto;
import com.recipeplatform.user.dto.Rating;
import com.recipeplatform.user.dto.Recipe;
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

    @Test
    public void testFindUserById_RatedRecipeMissing() {
        User user = new User();
        user.setId("u1");
        user.setName("John");

        Rating kept = new Rating("r1", "u1", "rec-other", 8, "nice");
        Rating orphan = new Rating("r2", "u1", "rec-deleted", 5, "gone");
        Recipe other = new Recipe("Soup", "u2", null, null, null, 100);
        other.setRecipeId("rec-other");
        User author = new User();
        author.setId("u2");
        author.setName("Jane");

        when(userRepository.findById("u1")).thenReturn(Optional.of(user));
        when(restTemplate.getForObject("http://RATING-SERVICE/ratings/user/u1", Rating[].class))
                .thenReturn(new Rating[] { kept, orphan });
        when(restTemplate.getForObject("http://RECIPE-SERVICE/recipes/user/u1", Recipe[].class))
                .thenReturn(new Recipe[0]);
        when(restTemplate.postForObject("http://RECIPE-SERVICE/recipes/batch", List.of("rec-other", "rec-deleted"),
                Recipe[].class)).thenReturn(new Recipe[] { other });
        when(userRepository.findAllById(List.of("u2"))).thenReturn(List.of(author));

        User result = userService.findUserById("u1");

        assertEquals(2, result.getRatings().size());
        assertEquals("Jane", result.getRatings().get(0).getRecipe().getUserName());
        assertNull(result.getRatings().get(1).getRecipe());
        verify(restTemplate, times(1)).postForObject(anyString(), any(), eq(Recipe[].class));
    }

    @Test
    public void testFindAllUsers_OneCallPerService() {
        User john = new User();
        john.setId("u1");
        john.setName("John");
        User jane = new User();
        jane.setId("u2");
        jane.setName("Jane");

        Recipe soup = new Recipe("Soup", "u2", null, null, null, 100);
        soup.setRecipeId("rec1");
        Rating rating = new Rating("r1", "u1", "rec1", 9, "great");

        when(userRepository.findAll()).thenReturn(List.of(john, jane));
        when(restTemplate.getForObject("http://RATING-SERVICE/ratings/all-ratings", Rating[].class))
                .thenReturn(new Rating[] { rating });
        when(restTemplate.getForObject("http://RECIPE-SERVICE/recipes/all-recipes", Recipe[].class))
                .thenReturn(new Recipe[] { soup });

        List<User> users = userService.findAllUsers();

        assertEquals("Soup", users.get(0).getRatings().get(0).getRecipe().getName());
        assertEquals("Jane", users.get(0).getRatings().get(0).getRecipe().getUserName());
        assertEquals(1, users.get(1).getRecipes().size());
        assertTrue(users.get(1).getRatings().isEmpty());
        verify(restTemplate, times(2)).getForObject(anyString(), any());
        verify(restTemplate, never()).postForObject(anyString(), any(), any());
        verify(userRepository, never()).findAllById(any());
    }

}
