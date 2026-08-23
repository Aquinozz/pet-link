package pet_link.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pet_link.dtos.AppointmentRequestDTO;
import pet_link.dtos.AppointmentResponseDTO;
import pet_link.enums.AppointmentStatus;
import pet_link.exceptions.BadRequestException;
import pet_link.exceptions.ForbiddenException;
import pet_link.models.AppointmentModel;
import pet_link.models.PetModel;
import pet_link.models.PrestadorModel;
import pet_link.models.RolesEntity;
import pet_link.models.Users;
import pet_link.repositories.AppointmentRepository;
import pet_link.repositories.PetRepository;
import pet_link.repositories.UserRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository repository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PetRepository petRepository;

    @InjectMocks
    private AppointmentService service;

    private Users tutor;
    private Users prestador;
    private PetModel pet;

    @BeforeEach
    void setUp() {
        tutor = usuario(1L, "ROLE_TUTOR");
        prestador = usuario(2L, "ROLE_PROFISSIONAL");
        PrestadorModel perfil = new PrestadorModel();
        perfil.setId(10L);
        perfil.setUser(prestador);
        prestador.setPrestador(perfil);

        pet = new PetModel();
        pet.setId(5L);
        pet.setTutor(tutor);
    }

    private Users usuario(Long id, String role) {
        return Users.builder()
                .id(id)
                .nome("Usuário " + id)
                .email("user" + id + "@test.com")
                .senha("x")
                .roles(Set.of(new RolesEntity(role)))
                .build();
    }

    private AppointmentModel agendamento(AppointmentStatus status) {
        AppointmentModel app = new AppointmentModel();
        app.setId(1L);
        app.setTutor(tutor);
        app.setPrestador(prestador);
        app.setDataHora(LocalDateTime.now().plusDays(2));
        app.setStatus(status);
        return app;
    }

    private AppointmentRequestDTO dto(Long petId, Long prestadorId, Long tutorId) {
        AppointmentRequestDTO dto = new AppointmentRequestDTO();
        dto.setTutorId(tutorId);
        dto.setPetId(petId);
        dto.setPrestadorId(prestadorId);
        dto.setServico("Consulta");
        dto.setDataHora(LocalDateTime.now().plusDays(2));
        return dto;
    }

    @Test
    void criar_vinculaTutorAutenticado() {
        when(userRepository.findByEmail(tutor.getEmail())).thenReturn(Optional.of(tutor));
        when(userRepository.findById(prestador.getId())).thenReturn(Optional.of(prestador));
        when(petRepository.findById(pet.getId())).thenReturn(Optional.of(pet));
        when(repository.save(any(AppointmentModel.class))).thenAnswer(inv -> inv.getArgument(0));

        AppointmentResponseDTO result = service.criar(dto(pet.getId(), prestador.getId(), tutor.getId()), tutor.getEmail());

        assertThat(result.getStatus()).isEqualTo("AGENDADO");
        assertThat(result.getTutor()).isNotNull();
        verify(repository).save(any(AppointmentModel.class));
    }

    @Test
    void criar_quandoTutorIdDivergente_lancaForbidden() {
        when(userRepository.findByEmail(tutor.getEmail())).thenReturn(Optional.of(tutor));

        assertThatThrownBy(() -> service.criar(dto(pet.getId(), prestador.getId(), 99L), tutor.getEmail()))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void criar_quandoPrestadorSemPerfil_lancaBadRequest() {
        Users semPerfil = usuario(3L, "ROLE_PROFISSIONAL");
        when(userRepository.findByEmail(tutor.getEmail())).thenReturn(Optional.of(tutor));
        when(userRepository.findById(semPerfil.getId())).thenReturn(Optional.of(semPerfil));

        assertThatThrownBy(() -> service.criar(dto(pet.getId(), semPerfil.getId(), tutor.getId()), tutor.getEmail()))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void criar_quandoPetDeOutroTutor_lancaForbidden() {
        Users outro = usuario(99L, "ROLE_TUTOR");
        pet.setTutor(outro);

        when(userRepository.findByEmail(tutor.getEmail())).thenReturn(Optional.of(tutor));
        when(userRepository.findById(prestador.getId())).thenReturn(Optional.of(prestador));
        when(petRepository.findById(pet.getId())).thenReturn(Optional.of(pet));

        assertThatThrownBy(() -> service.criar(dto(pet.getId(), prestador.getId(), tutor.getId()), tutor.getEmail()))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void criar_quandoDataPassada_lancaBadRequest() {
        AppointmentRequestDTO dto = dto(pet.getId(), prestador.getId(), tutor.getId());
        dto.setDataHora(LocalDateTime.now().minusDays(1));

        when(userRepository.findByEmail(tutor.getEmail())).thenReturn(Optional.of(tutor));
        when(userRepository.findById(prestador.getId())).thenReturn(Optional.of(prestador));
        when(petRepository.findById(pet.getId())).thenReturn(Optional.of(pet));

        assertThatThrownBy(() -> service.criar(dto, tutor.getEmail()))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void criar_comAtendimentoDomiciliar_salvaEndereco() {
        AppointmentRequestDTO dto = dto(pet.getId(), prestador.getId(), tutor.getId());
        dto.setAtendimentoDomiciliar(true);
        dto.setEnderecoAtendimento("Rua das Flores, 123 - Centro");

        when(userRepository.findByEmail(tutor.getEmail())).thenReturn(Optional.of(tutor));
        when(userRepository.findById(prestador.getId())).thenReturn(Optional.of(prestador));
        when(petRepository.findById(pet.getId())).thenReturn(Optional.of(pet));
        when(repository.save(any(AppointmentModel.class))).thenAnswer(inv -> inv.getArgument(0));

        AppointmentResponseDTO result = service.criar(dto, tutor.getEmail());

        assertThat(result.getAtendimentoDomiciliar()).isTrue();
        assertThat(result.getEnderecoAtendimento()).isEqualTo("Rua das Flores, 123 - Centro");
    }

    @Test
    void criar_quandoDomiciliarSemEndereco_lancaBadRequest() {
        AppointmentRequestDTO dto = dto(pet.getId(), prestador.getId(), tutor.getId());
        dto.setAtendimentoDomiciliar(true);

        when(userRepository.findByEmail(tutor.getEmail())).thenReturn(Optional.of(tutor));
        when(userRepository.findById(prestador.getId())).thenReturn(Optional.of(prestador));
        when(petRepository.findById(pet.getId())).thenReturn(Optional.of(pet));

        assertThatThrownBy(() -> service.criar(dto, tutor.getEmail()))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void criar_semDomiciliar_enderecoNulo() {
        AppointmentRequestDTO dto = dto(pet.getId(), prestador.getId(), tutor.getId());
        dto.setAtendimentoDomiciliar(false);

        when(userRepository.findByEmail(tutor.getEmail())).thenReturn(Optional.of(tutor));
        when(userRepository.findById(prestador.getId())).thenReturn(Optional.of(prestador));
        when(petRepository.findById(pet.getId())).thenReturn(Optional.of(pet));
        when(repository.save(any(AppointmentModel.class))).thenAnswer(inv -> inv.getArgument(0));

        AppointmentResponseDTO result = service.criar(dto, tutor.getEmail());

        assertThat(result.getAtendimentoDomiciliar()).isFalse();
        assertThat(result.getEnderecoAtendimento()).isNull();
    }

    @Test
    void atualizar_propagaEnderecoDomiciliar() {
        AppointmentModel app = agendamento(AppointmentStatus.AGENDADO);
        AppointmentRequestDTO dto = dto(pet.getId(), prestador.getId(), tutor.getId());
        dto.setAtendimentoDomiciliar(true);
        dto.setEnderecoAtendimento("Av. Brasil, 456");

        when(userRepository.findByEmail(tutor.getEmail())).thenReturn(Optional.of(tutor));
        when(repository.findByIdAndTutor_Id(app.getId(), tutor.getId())).thenReturn(Optional.of(app));
        when(userRepository.findById(prestador.getId())).thenReturn(Optional.of(prestador));
        when(petRepository.findById(pet.getId())).thenReturn(Optional.of(pet));
        when(repository.save(any(AppointmentModel.class))).thenAnswer(inv -> inv.getArgument(0));

        AppointmentResponseDTO result = service.atualizar(app.getId(), dto, tutor.getEmail());

        assertThat(result.getAtendimentoDomiciliar()).isTrue();
        assertThat(result.getEnderecoAtendimento()).isEqualTo("Av. Brasil, 456");
    }

    @Test
    void atualizarStatus_prestadorPodeConfirmar() {
        AppointmentModel app = agendamento(AppointmentStatus.AGENDADO);
        when(userRepository.findByEmail(prestador.getEmail())).thenReturn(Optional.of(prestador));
        when(repository.findById(app.getId())).thenReturn(Optional.of(app));
        when(repository.save(any(AppointmentModel.class))).thenAnswer(inv -> inv.getArgument(0));

        AppointmentResponseDTO result = service.atualizarStatus(1L, "CONFIRMADO", prestador.getEmail());

        assertThat(result.getStatus()).isEqualTo("CONFIRMADO");
    }

    @Test
    void atualizarStatus_tutorNaoPodeConfirmar_lancaForbidden() {
        AppointmentModel app = agendamento(AppointmentStatus.AGENDADO);
        when(userRepository.findByEmail(tutor.getEmail())).thenReturn(Optional.of(tutor));
        when(repository.findById(app.getId())).thenReturn(Optional.of(app));

        assertThatThrownBy(() -> service.atualizarStatus(1L, "CONFIRMADO", tutor.getEmail()))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void atualizarStatus_tutorPodeCancelar() {
        AppointmentModel app = agendamento(AppointmentStatus.CONFIRMADO);
        when(userRepository.findByEmail(tutor.getEmail())).thenReturn(Optional.of(tutor));
        when(repository.findById(app.getId())).thenReturn(Optional.of(app));
        when(repository.save(any(AppointmentModel.class))).thenAnswer(inv -> inv.getArgument(0));

        AppointmentResponseDTO result = service.atualizarStatus(1L, "CANCELADO", tutor.getEmail());

        assertThat(result.getStatus()).isEqualTo("CANCELADO");
    }

    @Test
    void atualizarStatus_transicaoInvalida_lancaBadRequest() {
        AppointmentModel app = agendamento(AppointmentStatus.AGENDADO);
        Users admin = usuario(1L, "ROLE_ADMIN");
        when(userRepository.findByEmail(admin.getEmail())).thenReturn(Optional.of(admin));
        when(repository.findById(app.getId())).thenReturn(Optional.of(app));

        assertThatThrownBy(() -> service.atualizarStatus(1L, "FINALIZADO", admin.getEmail()))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void atualizarStatus_mesmoStatus_lancaBadRequest() {
        AppointmentModel app = agendamento(AppointmentStatus.CANCELADO);
        Users admin = usuario(1L, "ROLE_ADMIN");
        when(userRepository.findByEmail(admin.getEmail())).thenReturn(Optional.of(admin));
        when(repository.findById(app.getId())).thenReturn(Optional.of(app));

        assertThatThrownBy(() -> service.atualizarStatus(1L, "CANCELADO", admin.getEmail()))
                .isInstanceOf(BadRequestException.class);
    }

    @Test
    void listarTodos_tutorUsaRepositorioDoTutor() {
        when(userRepository.findByEmail(tutor.getEmail())).thenReturn(Optional.of(tutor));
        when(repository.findByTutor_Id(tutor.getId())).thenReturn(List.of());

        service.listarTodos(tutor.getEmail());

        verify(repository).findByTutor_Id(tutor.getId());
    }

    @Test
    void listarTodos_prestadorUsaRepositorioDoPrestador() {
        when(userRepository.findByEmail(prestador.getEmail())).thenReturn(Optional.of(prestador));
        when(repository.findByPrestador_Id(prestador.getId())).thenReturn(List.of());

        service.listarTodos(prestador.getEmail());

        verify(repository).findByPrestador_Id(prestador.getId());
    }

    @Test
    void listarTodos_adminUsaFindAll() {
        Users admin = usuario(1L, "ROLE_ADMIN");
        when(userRepository.findByEmail(admin.getEmail())).thenReturn(Optional.of(admin));
        when(repository.findAll()).thenReturn(List.of());

        service.listarTodos(admin.getEmail());

        verify(repository).findAll();
    }

    @Test
    void deletar_quandoNaoDonos_lancaForbidden() {
        when(userRepository.findByEmail(tutor.getEmail())).thenReturn(Optional.of(tutor));
        when(repository.findByIdAndTutor_Id(1L, tutor.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.deletar(1L, tutor.getEmail()))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void deletar_adminPodeDeletarQualquer() {
        Users admin = usuario(1L, "ROLE_ADMIN");
        AppointmentModel app = agendamento(AppointmentStatus.AGENDADO);
        when(userRepository.findByEmail(admin.getEmail())).thenReturn(Optional.of(admin));
        when(repository.findById(app.getId())).thenReturn(Optional.of(app));

        service.deletar(app.getId(), admin.getEmail());

        verify(repository).delete(app);
    }
}