package pet_link.controllers;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.test.web.servlet.MockMvc;
import pet_link.config.JwtAuthenticationFilter;
import pet_link.config.SecurityConfiguration;
import pet_link.config.TokenProvider;
import pet_link.dtos.PrestadorResponseDTO;
import pet_link.services.PrestadorService;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PrestadorController.class)
@Import({SecurityConfiguration.class, JwtAuthenticationFilter.class})
class PrestadorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TokenProvider tokenProvider;

    @MockBean
    private UserDetailsService userDetailsService;

    @MockBean
    private PrestadorService prestadorService;

    private HttpHeaders auth(String email, String... roles) {
        when(tokenProvider.getUsername(anyString())).thenReturn(email);
        when(userDetailsService.loadUserByUsername(email))
                .thenReturn(ControllerTestSupport.userDetails(email, roles));
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth("token-de-teste");
        return headers;
    }

    private MockMultipartFile arquivo() {
        return new MockMultipartFile("file", "foto.jpg", "image/jpeg", "imagem".getBytes());
    }

    @Test
    void listar_semToken_retorna200Publico() throws Exception {
        when(prestadorService.listarTodosProfissionais()).thenReturn(java.util.List.of());

        mockMvc.perform(get("/prestadores"))
                .andExpect(status().isOk());
    }

    @Test
    void uploadFoto_semToken_retorna401() throws Exception {
        mockMvc.perform(multipart("/prestadores/upload-foto").file(arquivo()))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void uploadFoto_profissional_retorna200() throws Exception {
        when(prestadorService.uploadFoto(anyString(), any())).thenReturn(new PrestadorResponseDTO());

        mockMvc.perform(multipart("/prestadores/upload-foto")
                        .file(arquivo())
                        .headers(auth("prof@email.com", "ROLE_PROFISSIONAL")))
                .andExpect(status().isOk());
    }

    @Test
    void uploadFoto_tutor_retorna403() throws Exception {
        mockMvc.perform(multipart("/prestadores/upload-foto")
                        .file(arquivo())
                        .headers(auth("tutor@email.com", "ROLE_TUTOR")))
                .andExpect(status().isForbidden());
    }

    @Test
    void atualizarMeuPerfil_tutor_retorna403() throws Exception {
        mockMvc.perform(patch("/prestadores/meu-perfil")
                        .headers(auth("tutor@email.com", "ROLE_TUTOR"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"telefone\":\"71 99999-9999\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void atualizarMeuPerfil_profissional_retorna200() throws Exception {
        when(prestadorService.atualizarPerfil(any(), eq("prof@email.com")))
                .thenReturn(new PrestadorResponseDTO());

        mockMvc.perform(patch("/prestadores/meu-perfil")
                        .headers(auth("prof@email.com", "ROLE_PROFISSIONAL"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"telefone\":\"71 99999-9999\"}"))
                .andExpect(status().isOk());
    }

    @Test
    void criarPrestador_tutor_retorna403() throws Exception {
        mockMvc.perform(post("/prestadores")
                        .headers(auth("tutor@email.com", "ROLE_TUTOR"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"nomePrestador\":\"Pet Shop X\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    void criarPrestador_admin_retorna201() throws Exception {
        when(prestadorService.criar(any())).thenReturn(new PrestadorResponseDTO());

        mockMvc.perform(post("/prestadores")
                        .headers(auth("admin@email.com", "ROLE_ADMIN"))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"type\":\"PETSHOP\",\"nomePrestador\":\"Pet Shop X\",\"email\":\"x@x.com\",\"senha\":\"123456\",\"telefone\":\"71 99999-9999\",\"servicos\":\"Banho e Tosa\",\"cidade\":\"Salvador\",\"bairro\":\"Barra\"}"))
                .andExpect(status().isCreated());
    }

    @Test
    void backfillCoords_tutor_retorna403() throws Exception {
        mockMvc.perform(post("/prestadores/backfill-coords")
                        .headers(auth("tutor@email.com", "ROLE_TUTOR")))
                .andExpect(status().isForbidden());
    }

    @Test
    void backfillCoords_admin_retorna200() throws Exception {
        when(prestadorService.backfillCoords()).thenReturn(0);

        mockMvc.perform(post("/prestadores/backfill-coords")
                        .headers(auth("admin@email.com", "ROLE_ADMIN")))
                .andExpect(status().isOk());
    }
}