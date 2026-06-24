package pet_link.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pet_link.dtos.*;
import pet_link.enums.AppointmentStatus;
import pet_link.exceptions.BadRequestException;
import pet_link.exceptions.ResourceNotFoundException;
import pet_link.models.*;
import pet_link.repositories.*;
import pet_link.utils.DataUtils;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository repository;
    private final UserRepository userRepository;
    private final PetRepository petRepository;

    @Transactional
    public AppointmentResponseDTO criar(AppointmentRequestDTO dto) {
        log.info("Iniciando criação de agendamento");

        Users tutor = userRepository.findById(dto.getTutorId())
                .orElseThrow(() -> new ResourceNotFoundException("Tutor com ID " + dto.getTutorId() + " não encontrado."));

        PetModel pet = petRepository.findById(dto.getPetId())
                .orElseThrow(() -> new ResourceNotFoundException("Pet com ID " + dto.getPetId() + " não encontrado."));

        Users prestador = userRepository.findById(dto.getPrestadorId())
                .orElseThrow(() -> new ResourceNotFoundException("Profissional com ID " + dto.getPrestadorId() + " não encontrado."));

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

    public List<AppointmentResponseDTO> listarTodos() {
        return repository.findAll().stream()
                .map(this::converterParaDTO)
                .toList();
    }

    @Transactional
    public void deletar(Long id) {
        AppointmentModel appointment = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento com ID " + id + " não encontrado."));
        repository.delete(appointment);
        log.info("Agendamento ID {} deletado com sucesso.", id);
    }

    @Transactional
    public AppointmentResponseDTO atualizar(Long id, AppointmentRequestDTO dto) {
        log.info("Iniciando atualização do agendamento ID {}", id);

        AppointmentModel appointment = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento com ID " + id + " não encontrado."));

        if (dto.getDataHora() != null) {
            if (!DataUtils.isFuture(dto.getDataHora())) {
                throw new BadRequestException("A nova data do agendamento deve ser uma data futura.");
            }
            appointment.setDataHora(dto.getDataHora());
        }

        if (dto.getTutorId() != null) {
            Users tutor = userRepository.findById(dto.getTutorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Tutor com ID " + dto.getTutorId() + " não encontrado."));
            appointment.setTutor(tutor);
        }

        if (dto.getPetId() != null) {
            PetModel pet = petRepository.findById(dto.getPetId())
                    .orElseThrow(() -> new ResourceNotFoundException("Pet com ID " + dto.getPetId() + " não encontrado."));
            appointment.setPet(pet);
        }

        if (dto.getPrestadorId() != null) {
            Users prestador = userRepository.findById(dto.getPrestadorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Profissional com ID " + dto.getPrestadorId() + " não encontrado."));
            appointment.setPrestador(prestador);
        }

        AppointmentModel salvo = repository.save(appointment);
        log.info("Agendamento ID {} atualizado com sucesso.", salvo.getId());

        return converterParaDTO(salvo);
    }

    @Transactional
    public AppointmentResponseDTO atualizarStatus(Long id, String status) {
        AppointmentModel appointment = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Agendamento com ID " + id + " não encontrado."));

        try {
            appointment.setStatus(AppointmentStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Status inválido: " + status + ". Use: AGENDADO, CONFIRMADO, FINALIZADO ou CANCELADO");
        }

        AppointmentModel salvo = repository.save(appointment);
        log.info("Status do agendamento ID {} atualizado para {}", id, status);

        return converterParaDTO(salvo);
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