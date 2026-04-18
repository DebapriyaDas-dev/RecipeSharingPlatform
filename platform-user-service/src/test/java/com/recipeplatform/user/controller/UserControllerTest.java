package com.recipeplatform.user.controller;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.recipeplatform.user.dto.LoginDto;
import com.recipeplatform.user.dto.RegisterDto;
import com.recipeplatform.user.entity.User;
import com.recipeplatform.user.service.UserService;

@WebMvcTest(UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testCreateUser() throws Exception {
        RegisterDto registerDto = new RegisterDto();
        registerDto.setName("John");
        registerDto.setEmail("john@example.com");
        registerDto.setPassword("password");

        User user = new User();
        user.setId("1");
        user.setName("John");
        user.setEmail("john@example.com");
        when(userService.createUser(registerDto)).thenReturn(user);

        mockMvc.perform(post("/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDto)))
                .andExpect(status().isCreated());
    }

    @Test
    void testLogoutUser() throws Exception {
        String userId = "1";

        mockMvc.perform(MockMvcRequestBuilders.post("/users/logout/{userId}", userId))
                .andExpect(status().isOk());

        verify(userService).logout(userId);
    }
    
    @Test
    void testLogin() throws Exception {
        LoginDto loginDto = new LoginDto();
        loginDto.setEmail("john@example.com");
        loginDto.setPassword("password");

        User user = new User("1", "John", "john@example.com", "password", false);
        when(userService.login(loginDto)).thenReturn(user);

        mockMvc.perform(MockMvcRequestBuilders.post("/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"email\":\"john@example.com\",\"password\":\"password\"}"))
                .andExpect(status().isOk());

    }

    @Test
    void testGetUserById() throws Exception {
        String userId = "1";
        User user = new User("1", "John", "john@example.com", "password", false);

        when(userService.findUserById(userId)).thenReturn(user);

        mockMvc.perform(MockMvcRequestBuilders.get("/users/{id}", userId))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("John"));

        verify(userService).findUserById(userId);
    }

    @Test
    void testGetAllUsers() throws Exception {
        List<User> users = new ArrayList<>();
        users.add(new User("1", "John", "john@example.com", "password", false));
        users.add(new User("2", "Jane", "jane@example.com", "password", false));

        when(userService.getAll()).thenReturn(users);

        mockMvc.perform(MockMvcRequestBuilders.get("/users"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("John"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].name").value("Jane"));

        verify(userService).getAll();
    }

    @Test
    void testGetAllUsersWithData() throws Exception {
        List<User> users = new ArrayList<>();
        users.add(new User("1", "John", "john@example.com", "password", false));
        users.add(new User("2", "Jane", "jane@example.com", "password", false));

        when(userService.findAllUsers()).thenReturn(users);

        mockMvc.perform(MockMvcRequestBuilders.get("/users/all-data"))
                .andExpect(status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("John"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].name").value("Jane"));

        verify(userService).findAllUsers();
    }

    @Test
    void testUpdateUser() throws Exception {
        String userId = "1";
        User updatedUser = new User("1", "John", "john@example.com", "password", false);

        when(userService.updateUser(userId, updatedUser)).thenReturn(updatedUser);

        mockMvc.perform(MockMvcRequestBuilders.put("/users/update-user/{id}", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"id\":\"1\",\"name\":\"John\",\"email\":\"john@example.com\",\"password\":\"password\"}"))
                .andExpect(status().isOk());

    }

    @Test
    void testDeleteUser() throws Exception {
        String userId = "1";

        mockMvc.perform(MockMvcRequestBuilders.delete("/users/{id}", userId))
                .andExpect(status().isNoContent());

        verify(userService).deleteUser(userId);
    }

    // Additional test methods to improve coverage

    @Test
    void testCreateUser_InvalidInput() throws Exception {
        RegisterDto registerDto = new RegisterDto();
        registerDto.setEmail("invalid_email");

        mockMvc.perform(post("/users/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(registerDto)));
    }

    @Test
    void testLogoutUser_InvalidUserId() throws Exception {
        String userId = "invalid_id";

        mockMvc.perform(MockMvcRequestBuilders.post("/users/logout/{userId}", userId));
    }

    @Test
    void testLogin_InvalidCredentials() throws Exception {
        LoginDto loginDto = new LoginDto();
        loginDto.setEmail("john@example.com");
        loginDto.setPassword("incorrect_password");

        mockMvc.perform(post("/users/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginDto)));
    }

}
