package pet_link.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pet_link.dtos.PetRequestDTO;
import pet_link.dtos.PetResponseDTO;
import pet_link.dtos.TutorResponseDTO;
import pet_link.exceptions.ResourceNotFoundException;
import pet_link.models.PetModel;
import pet_link.models.Users;
import pet_link.repositories.PetRepository;
import pet_link.repositories.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PetService {

    private final PetRepository repository;
    private final UserRepository userRepository;

    @Transactional
    public PetResponseDTO criar(PetRequestDTO dto) {
        Users tutor = userRepository.findById(dto.getTutorId())
                .orElseThrow(() -> new ResourceNotFoundException("Tutor com ID " + dto.getTutorId() + " não encontrado."));

        PetModel pet = new PetModel();
        pet.setTutor(tutor);
        pet.setEspecie(dto.getEspecie());
        pet.setRaca(dto.getRaca());
        pet.setNome(dto.getNome());
        pet.setIdade(dto.getIdade());

        PetModel petSalvo = repository.save(pet);

        PetResponseDTO response = new PetResponseDTO();
        response.setId(petSalvo.getId());
        response.setRaca(petSalvo.getRaca());
        response.setEspecie(petSalvo.getEspecie());
        response.setNome(petSalvo.getNome());
        response.setIdade(petSalvo.getIdade());

        if (petSalvo.getTutor() != null) {
            response.setTutor(new TutorResponseDTO(petSalvo.getTutor()));
        }

        return response;
    }

    public List<PetResponseDTO> listarTodos() {
        return repository.findAll().stream()
                .map(pet -> {
                    PetResponseDTO res = new PetResponseDTO();
                    res.setId(pet.getId());
                    res.setRaca(pet.getRaca());
                    res.setEspecie(pet.getEspecie());
                    res.setNome(pet.getNome());
                    res.setIdade(pet.getIdade());
                    if (pet.getTutor() != null) {
                        res.setTutor(new TutorResponseDTO(pet.getTutor()));
                    }
                    return res;
                })
                .toList();
    }

    public PetResponseDTO buscarPorId(Long id) {
        PetModel pet = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet com ID " + id + " não encontrado."));

        PetResponseDTO response = new PetResponseDTO();
        response.setId(pet.getId());
        response.setRaca(pet.getRaca());
        response.setEspecie(pet.getEspecie());
        response.setNome(pet.getNome());
        response.setIdade(pet.getIdade());

        if (pet.getTutor() != null) {
            response.setTutor(new TutorResponseDTO(pet.getTutor()));
        }

        return response;
    }

    @Transactional
    public void deletar(Long id) {
        PetModel pet = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet com ID " + id + " não encontrado."));

        repository.delete(pet);
    }
}