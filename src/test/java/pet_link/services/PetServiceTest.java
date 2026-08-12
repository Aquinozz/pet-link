package pet_link.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pet_link.dtos.PetRequestDTO;
import pet_link.dtos.PetResponseDTO;
import pet_link.exceptions.ForbiddenException;
import pet_link.exceptions.ResourceNotFoundException;
import pet_link.models.PetModel;
import pet_link.models.RolesEntity;
import pet_link.models.Users;
import pet_link.repositories.PetRepository;
import pet_link.repositories.UserRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PetServiceTest {

    @Mock
    private PetRepository repository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private PetService service;

    private Users tutor;
    private PetModel pet;

    @BeforeEach
    void setUp() {
        tutor = usuario(1L, "ROLE_TUTOR");
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

    private PetRequestDTO dto(Long tutorId) {
        PetRequestDTO dto = new PetRequestDTO();
        dto.setNome("Rex");
        dto.setEspecie("Cachorro");
        dto.setRaca("Labrador");
        dto.setIdade(3);
        dto.setTutorId(tutorId);
        return dto;
    }

    @Test
    void criar_quandoTutorIdDivergente_lancaForbidden() {
        when(userRepository.findByEmail(tutor.getEmail())).thenReturn(Optional.of(tutor));

        assertThatThrownBy(() -> service.criar(dto(99L), tutor.getEmail()))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void criar_quandoNaoEhTutor_lancaForbidden() {
        Users prestador = usuario(2L, "ROLE_PROFISSIONAL");
        when(userRepository.findByEmail(prestador.getEmail())).thenReturn(Optional.of(prestador));

        assertThatThrownBy(() -> service.criar(dto(prestador.getId()), prestador.getEmail()))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void criar_tutorAutenticadoViraDono() {
        when(userRepository.findByEmail(tutor.getEmail())).thenReturn(Optional.of(tutor));
        when(repository.save(any(PetModel.class))).thenAnswer(inv -> inv.getArgument(0));

        PetResponseDTO result = service.criar(dto(tutor.getId()), tutor.getEmail());

        assertThat(result.getNome()).isEqualTo("Rex");
        assertThat(result.getTutor()).isNotNull();
        verify(repository).save(any(PetModel.class));
    }

    @Test
    void listar_tutorUsaRepositorioPorTutor() {
        when(userRepository.findByEmail(tutor.getEmail())).thenReturn(Optional.of(tutor));
        when(repository.findByTutor_Id(tutor.getId())).thenReturn(List.of());

        service.listarTodos(tutor.getEmail());

        verify(repository).findByTutor_Id(tutor.getId());
    }

    @Test
    void listar_adminUsaFindAll() {
        Users admin = usuario(1L, "ROLE_ADMIN");
        when(userRepository.findByEmail(admin.getEmail())).thenReturn(Optional.of(admin));
        when(repository.findAll()).thenReturn(List.of());

        service.listarTodos(admin.getEmail());

        verify(repository).findAll();
    }

    @Test
    void buscar_quandoPetDeOutroTutor_lancaForbidden() {
        when(userRepository.findByEmail(tutor.getEmail())).thenReturn(Optional.of(tutor));
        when(repository.findByIdAndTutor_Id(5L, tutor.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.buscarPorId(5L, tutor.getEmail()))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void buscar_donoEncontra() {
        when(userRepository.findByEmail(tutor.getEmail())).thenReturn(Optional.of(tutor));
        when(repository.findByIdAndTutor_Id(5L, tutor.getId())).thenReturn(Optional.of(pet));
        when(repository.findById(5L)).thenReturn(Optional.of(pet));

        PetResponseDTO result = service.buscarPorId(5L, tutor.getEmail());

        assertThat(result.getId()).isEqualTo(5L);
    }

    @Test
    void deletar_quandoPetDeOutroTutor_lancaForbidden() {
        when(userRepository.findByEmail(tutor.getEmail())).thenReturn(Optional.of(tutor));
        when(repository.findByIdAndTutor_Id(5L, tutor.getId())).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.deletar(5L, tutor.getEmail()))
                .isInstanceOf(ForbiddenException.class);
    }

    @Test
    void deletar_adminPodeDeletar() {
        Users admin = usuario(1L, "ROLE_ADMIN");
        when(userRepository.findByEmail(admin.getEmail())).thenReturn(Optional.of(admin));
        when(repository.findById(5L)).thenReturn(Optional.of(pet));

        service.deletar(5L, admin.getEmail());

        verify(repository).deleteById(5L);
    }

    @Test
    void deletar_quandoNaoExiste_lancaNotFound() {
        Users admin = usuario(1L, "ROLE_ADMIN");
        when(userRepository.findByEmail(admin.getEmail())).thenReturn(Optional.of(admin));
        when(repository.findById(5L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.deletar(5L, admin.getEmail()))
                .isInstanceOf(ResourceNotFoundException.class);
    }
}