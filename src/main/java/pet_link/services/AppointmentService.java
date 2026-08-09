package pet_link.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pet_link.dtos.*;
import pet_link.enums.AppointmentStatus;
import pet_link.enums.UserRole;
import pet_link.exceptions.BadRequestException;
import pet_link.exceptions.ForbiddenException;
import pet_link.exceptions.ResourceNotFoundException;
import pet_link.models.*;
import pet_link.repositories.*;
import pet_link.utils.DataUtils;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository repository;
    private final UserRepository userRepository;
    private final PetRepository petRepository;

    private static final Map<AppointmentStatus, Set<AppointmentStatus>> TRANSICOES = new EnumMap<>(AppointmentStatus.class);

    static {
        TRANSICOES.put(AppointmentStatus.AGENDADO, Set.of(AppointmentStatus.CONFIRMADO, AppointmentStatus.CANCELADO));
        TRANSICOES.put(AppointmentStatus.CONFIRMADO, Set.of(AppointmentStatus.FINALIZADO, AppointmentStatus.CANCELADO));
        TRANSICOES.put(AppointmentStatus.FINALIZADO, Set.of());
        TRANSICOES.put(AppointmentStatus.CANCELADO, Set.of());
    }

    private Users usuarioAtual(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
    }

    private boolean temRole(Users user, UserRole role) {
        return user.getRoles().stream().anyMatch(r -> r.getAuthority().equals(role.name()));
    }

    @Transactional
    public AppointmentResponseDTO criar(AppointmentRequestDTO dto, String email) {
        log.info("Iniciando criação de agendamento");

        Users tutor = usuarioAtual(email);

        if (dto.getTutorId() != null && !dto.getTutorId().equals(tutor.getId())) {
            throw new ForbiddenException("Só é possível agendar para a sua própria conta.");
        }

        Users prestador = userRepository.findById(dto.getPrestadorId())
                .orElseThrow(() -> new ResourceNotFoundException("Profissional com ID " + dto.getPrestadorId() + " não encontrado."));

        if (!temRole(prestador, UserRole.ROLE_PROFISSIONAL) || prestador.getPrestador() == null) {
            throw new BadRequestException("O usuário informado não é um profissional cadastrado.");
        }

        PetModel pet = petRepository.findById(dto.getPetId())
                .orElseThrow(() -> new ResourceNotFoundException("Pet com ID " + dto.getPetId() + " não encontrado."));

        if (pet.getTutor() == null || !pet.getTutor().getId().equals(tutor.getId())) {
            throw new ForbiddenException("O pet informado não pertence à sua conta.");
        }

        if (!DataUtils.isFuture(dto.getDataHora())) {
            throw new BadRequestException("A data do agendamento deve ser uma data futura.");
        }

        AppointmentModel appointment = new AppointmentModel();
        appointment.setTutor(tutor);
        appointment.setPet(pet);
        appointment.setPrestador(prestador);
        appointment.setDataHora(dto.getDataHora());
        appointment.setStatus(AppointmentStatus.AGENDADO);
        appointment.setServico(dto.getServico());

        AppointmentModel salvo = repository.save(appointment);
        log.info("Agendamento criado com sucesso. ID: {}", salvo.getId());

        return converterParaDTO(salvo);
    }

    public List<AppointmentResponseDTO> listarTodos(String email) {
        Users current = usuarioAtual(email);

        List<AppointmentModel> appointments;
        if (temRole(current, UserRole.ROLE_ADMIN)) {
            appointments = repository.findAll();
        } else if (temRole(current, UserRole.ROLE_PROFISSIONAL)) {
            appointments = repository.findByPrestador_Id(current.getId());
        } else if (temRole(current, UserRole.ROLE_TUTOR)) {
            appointments = repository.findByTutor_Id(current.getId());
        } else {
            throw new ForbiddenException("Usuário sem permissão para listar agendamentos.");
        }

        return appointments.stream()
                .map(this::converterParaDTO)
                .toList();
    }

    @Transactional
    public void deletar(Long id, String email) {
        Users current = usuarioAtual(email);
        AppointmentModel appointment = appointmentDoTutorOuAdmin(id, current);
        repository.delete(appointment);
        log.info("Agendamento ID {} deletado com sucesso.", id);
    }

    @Transactional
    public AppointmentResponseDTO atualizar(Long id, AppointmentRequestDTO dto, String email) {
        log.info("Atualizando agendamento ID {}", id);

        Users current = usuarioAtual(email);
        AppointmentModel appointment = appointmentDoTutorOuAdmin(id, current);

        if (dto.getDataHora() != null) {
            if (!DataUtils.isFuture(dto.getDataHora())) {
                throw new BadRequestException("A nova data do agendamento deve ser uma data futura.");
            }
            appointment.setDataHora(dto.getDataHora());
        }

        if (dto.getPetId() != null) {
            PetModel pet = petRepository.findById(dto.getPetId())
                    .orElseThrow(() -> new ResourceNotFoundException("Pet com ID " + dto.getPetId() + " não encontrado."));
            if (pet.getTutor() == null || !pet.getTutor().getId().equals(current.getId())) {
                throw new ForbiddenException("O pet informado não pertence à sua conta.");
            }
            appointment.setPet(pet);
        }

        if (dto.getPrestadorId() != null) {
            Users prestador = userRepository.findById(dto.getPrestadorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Profissional com ID " + dto.getPrestadorId() + " não encontrado."));
            if (!temRole(prestador, UserRole.ROLE_PROFISSIONAL) || prestador.getPrestador() == null) {
                throw new BadRequestException("O usuário informado não é um profissional cadastrado.");
            }
            appointment.setPrestador(prestador);
        }

        AppointmentModel salvo = repository.save(appointment);
        log.info("Agendamento ID {} atualizado com sucesso.", salvo.getId());

        return converterParaDTO(salvo);
    }

    @Transactional
    public AppointmentResponseDTO atualizarStatus(Long id, String status, String email) {
        Users current = usuarioAtual(email);
        AppointmentModel appointment = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento com ID " + id + " não encontrado."));

        AppointmentStatus novoStatus;
        try {
            novoStatus = AppointmentStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Status inválido: " + status + ". Use: AGENDADO, CONFIRMADO, FINALIZADO ou CANCELADO");
        }

        validarTransicao(appointment, novoStatus, current);

        appointment.setStatus(novoStatus);
        AppointmentModel salvo = repository.save(appointment);
        log.info("Status do agendamento ID {} atualizado para {}", id, status);

        return converterParaDTO(salvo);
    }

    private void validarTransicao(AppointmentModel appointment, AppointmentStatus novo, Users current) {
        AppointmentStatus atual = appointment.getStatus();

        if (atual.equals(novo)) {
            throw new BadRequestException("O agendamento já está como " + atual + ".");
        }

        if (!TRANSICOES.getOrDefault(atual, Set.of()).contains(novo)) {
            throw new BadRequestException("Transição de status inválida de " + atual + " para " + novo + ".");
        }

        if (temRole(current, UserRole.ROLE_ADMIN)) {
            return;
        }

        boolean ehPrestadorDono = temRole(current, UserRole.ROLE_PROFISSIONAL)
                && appointment.getPrestador() != null
                && appointment.getPrestador().getId().equals(current.getId());
        boolean ehTutorDono = temRole(current, UserRole.ROLE_TUTOR)
                && appointment.getTutor() != null
                && appointment.getTutor().getId().equals(current.getId());

        boolean pode = switch (novo) {
            case CONFIRMADO, FINALIZADO -> ehPrestadorDono;
            case CANCELADO -> ehPrestadorDono || ehTutorDono;
            default -> false;
        };

        if (!pode) {
            throw new ForbiddenException("Você não tem permissão para realizar esta ação neste agendamento.");
        }
    }

    private AppointmentModel appointmentDoTutorOuAdmin(Long id, Users current) {
        if (temRole(current, UserRole.ROLE_ADMIN)) {
            return repository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Agendamento com ID " + id + " não encontrado."));
        }
        return repository.findByIdAndTutor_Id(id, current.getId())
                .orElseThrow(() -> new ForbiddenException("Você não tem permissão para acessar este agendamento."));
    }

    private AppointmentResponseDTO converterParaDTO(AppointmentModel model) {
        AppointmentResponseDTO response = new AppointmentResponseDTO();
        response.setId(model.getId());
        response.setDataHora(model.getDataHora());
        response.setStatus(model.getStatus().name());
        response.setServico(model.getServico());

        if (model.getTutor() != null) {
            response.setTutor(new TutorResponseDTO(model.getTutor()));
        }
        if (model.getPet() != null) {
            PetResponseDTO petDTO = new PetResponseDTO();
            petDTO.setId(model.getPet().getId());
            petDTO.setNome(model.getPet().getNome());
            petDTO.setEspecie(model.getPet().getEspecie());
            petDTO.setRaca(model.getPet().getRaca());
            petDTO.setIdade(model.getPet().getIdade());
            if (model.getPet().getTutor() != null) {
                petDTO.setTutor(new TutorResponseDTO(model.getPet().getTutor()));
            }
            response.setPet(petDTO);
        }
        if (model.getPrestador() != null) {
            response.setPrestador(new PrestadorResponseDTO(model.getPrestador()));
        }

        return response;
    }
}