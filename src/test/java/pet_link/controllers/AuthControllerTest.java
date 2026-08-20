package pet_link.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;
import pet_link.config.JwtAuthenticationFilter;
import pet_link.config.SecurityConfiguration;
import pet_link.config.TokenProvider;
import pet_link.dtos.TokenResponseDto;
import pet_link.models.RolesEntity;
import pet_link.models.Users;
import pet_link.repositories.UserRepository;
import pet_link.services.AuthenticationService;

import java.util.Set;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import({SecurityConfiguration.class, JwtAuthenticationFilter.class})
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TokenProvider tokenProvider;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private AuthenticationService authenticationService;

    @MockBean
    private UserRepository userRepository;

    private HttpHeaders auth(String email, String... roles) {
        when(tokenProvider.getUsername(anyString())).thenReturn(email);
        when(userDetailsService.loadUserByUsername(email))
                .thenReturn(ControllerTestSupport.userDetails(email, roles));
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth("token-de-teste");
        return headers;
    }

    @Test
    void login_ok_retorna200() throws Exception {
        when(authenticationService.login(any())).thenReturn(new TokenResponseDto("jwt-token", 86400000L));

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"a@b.com\",\"senha\":\"123456\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("jwt-token"));
    }

    @Test
    void login_bodyInvalido_retorna400() throws Exception {
        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_credenciaisErradas_retorna401() throws Exception {
        when(authenticationService.login(any())).thenThrow(new BadCredentialsException("bad"));

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"a@b.com\",\"senha\":\"errada\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void me_semToken_retorna401() throws Exception {
        mockMvc.perform(get("/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void me_comToken_retorna200() throws Exception {
        when(userRepository.findByEmail("tutor@email.com"))
                .thenReturn(java.util.Optional.of(Users.builder()
                        .id(1L)
                        .nome("Tutor")
                        .email("tutor@email.com")
                        .roles(Set.of(new RolesEntity("ROLE_TUTOR")))
                        .build()));

        mockMvc.perform(get("/auth/me").headers(auth("tutor@email.com", "ROLE_TUTOR")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("tutor@email.com"));
    }
}