package pet_link.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import pet_link.dtos.PetRequestDTO;
import pet_link.dtos.PetResponseDTO;
import pet_link.dtos.TutorResponseDTO;
import pet_link.exceptions.BadRequestException;
import pet_link.exceptions.ResourceNotFoundException;
import pet_link.models.PetModel;
import pet_link.models.Users;
import pet_link.repositories.PetRepository;
import pet_link.repositories.UserRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
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
                    res.setFotoUrl(pet.getFotoUrl());
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
        response.setFotoUrl(pet.getFotoUrl());

        if (pet.getTutor() != null) {
            response.setTutor(new TutorResponseDTO(pet.getTutor()));
        }

        return response;
    }

    @Transactional
    public PetResponseDTO uploadFoto(Long petId, MultipartFile file) {
        PetModel pet = repository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet com ID " + petId + " não encontrado."));

        try {
            String ext = "";
            String originalName = file.getOriginalFilename();
            if (originalName != null && originalName.contains(".")) {
                ext = originalName.substring(originalName.lastIndexOf("."));
            }
            String filename = pet.getId() + ext;
            Path uploadDir = Paths.get("uploads", "pets");
            Files.createDirectories(uploadDir);
            Path filePath = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fotoUrl = "/uploads/pets/" + filename;
            pet.setFotoUrl(fotoUrl);
            repository.save(pet);

            PetResponseDTO response = new PetResponseDTO();
            response.setId(pet.getId());
            response.setNome(pet.getNome());
            response.setEspecie(pet.getEspecie());
            response.setRaca(pet.getRaca());
            response.setIdade(pet.getIdade());
            response.setFotoUrl(pet.getFotoUrl());
            if (pet.getTutor() != null) {
                response.setTutor(new TutorResponseDTO(pet.getTutor()));
            }
            return response;
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo de foto.", e);
        }
    }

    @Transactional
    public void deletar(Long id) {
        PetModel pet = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pet com ID " + id + " não encontrado."));

        repository.delete(pet);
    }
}