package pet_link.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import pet_link.exceptions.BadRequestException;
import pet_link.exceptions.ResourceNotFoundException;
import pet_link.models.PrestadorModel;
import pet_link.models.RolesEntity;
import pet_link.models.Users;
import pet_link.repositories.PrestadorRepository;
import pet_link.repositories.UserRepository;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PrestadorServiceTest {

    @Mock
    private PrestadorRepository prestadorRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PrestadorService service;

    @TempDir
    Path tempDir;

    private Users usuario;
    private PrestadorModel prestador;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(service, "uploadDir", tempDir.toString());
        usuario = Users.builder()
                .id(1L)
                .nome("Vet Teste")
                .email("vet@test.com")
                .senha("x")
                .roles(Set.of(new RolesEntity()))
                .build();
        prestador = new PrestadorModel();
        prestador.setId(5L);
        prestador.setUser(usuario);
        usuario.setPrestador(prestador);
    }

    private MockMultipartFile arquivo(String nome) {
        return new MockMultipartFile("file", nome, "image/jpeg", new byte[] { 1, 2, 3 });
    }

    @Test
    void uploadFoto_salvaArquivoComTimestampENovaUrl() {
        when(userRepository.findByEmail(usuario.getEmail())).thenReturn(Optional.of(usuario));

        var result = service.uploadFoto(usuario.getEmail(), arquivo("antiga.jpg"));

        assertThat(result.getFotoUrl()).startsWith("/uploads/prestadores/p5-").endsWith(".jpg");
        assertThat(result.getFotoUrl()).doesNotMatch(".*/p5\\.jpg");
        assertThat(Files.exists(tempDir.resolve("prestadores").resolve(
                result.getFotoUrl().substring(result.getFotoUrl().lastIndexOf('/') + 1)))).isTrue();
    }

    @Test
    void uploadBanner_salvaEmSubpastaBannersERetornaUrl() {
        when(userRepository.findByEmail(usuario.getEmail())).thenReturn(Optional.of(usuario));

        var result = service.uploadBanner(usuario.getEmail(), arquivo("capa.png"));

        assertThat(result.getBannerUrl()).startsWith("/uploads/prestadores/banners/banner-5-").endsWith(".png");
        assertThat(Files.exists(tempDir.resolve("prestadores").resolve("banners").resolve(
                result.getBannerUrl().substring(result.getBannerUrl().lastIndexOf('/') + 1)))).isTrue();
    }

    @Test
    void removerBanner_limpaUrlEApagaArquivo() throws Exception {
        when(userRepository.findByEmail(usuario.getEmail())).thenReturn(Optional.of(usuario));
        Path banners = tempDir.resolve("prestadores").resolve("banners");
        Files.createDirectories(banners);
        Files.write(banners.resolve("banner-5-123.png"), new byte[] { 1 });
        prestador.setBannerUrl("/uploads/prestadores/banners/banner-5-123.png");

        var result = service.removerBanner(usuario.getEmail());

        assertThat(result.getBannerUrl()).isNull();
        assertThat(prestador.getBannerUrl()).isNull();
        assertThat(Files.exists(banners.resolve("banner-5-123.png"))).isFalse();
    }

    @Test
    void removerBanner_quandoNaoHaBanner_naoSalvaNovamente() {
        when(userRepository.findByEmail(usuario.getEmail())).thenReturn(Optional.of(usuario));

        var result = service.removerBanner(usuario.getEmail());

        assertThat(result.getBannerUrl()).isNull();
    }

    @Test
    void uploadBanner_quandoUsuarioSemPerfilPrestador_lancaBadRequest() {
        usuario.setPrestador(null);
        when(userRepository.findByEmail(usuario.getEmail())).thenReturn(Optional.of(usuario));

        assertThatThrownBy(() -> service.uploadBanner(usuario.getEmail(), arquivo("capa.png")))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void uploadBanner_quandoUsuarioInexistente_lancaNotFound() {
        when(userRepository.findByEmail("fantasma@test.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.uploadBanner("fantasma@test.com", arquivo("capa.png")))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}
