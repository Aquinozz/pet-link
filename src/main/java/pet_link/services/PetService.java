package pet_link.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import pet_link.dtos.PetRequestDTO;
import pet_link.dtos.PetResponseDTO;
import pet_link.dtos.TutorResponseDTO;
import pet_link.enums.UserRole;
import pet_link.exceptions.ForbiddenException;
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

    @Value("${app.upload-dir:./uploads}")
    private String uploadDir;

    private Users usuarioAtual(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
    }

    private boolean isAdmin(Users user) {
        return user.getRoles().stream()
                .anyMatch(r -> r.getAuthority().equals(UserRole.ROLE_ADMIN.name()));
    }

    private boolean isTutor(Users user) {
        return user.getRoles().stream()
                .anyMatch(r -> r.getAuthority().equals(UserRole.ROLE_TUTOR.name()));
    }

    @Transactional
    public PetResponseDTO criar(PetRequestDTO dto, String email) {
        Users current = usuarioAtual(email);

        if (!isTutor(current) && !isAdmin(current)) {
            throw new ForbiddenException("Apenas tutores podem cadastrar pets.");
        }

        if (dto.getTutorId() != null && !dto.getTutorId().equals(current.getId())) {
            throw new ForbiddenException("Só é possível cadastrar pets para a sua própria conta.");
        }

        PetModel pet = new PetModel();
        pet.setTutor(current);
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
        response.setFotoUrl(petSalvo.getFotoUrl());

        if (petSalvo.getTutor() != null) {
            response.setTutor(new TutorResponseDTO(petSalvo.getTutor()));
        }

        return response;
    }

    public List<PetResponseDTO> listarTodos(String email) {
        Users current = usuarioAtual(email);
        List<PetModel> pets = isAdmin(current)
                ? repository.findAll()
                : repository.findByTutor_Id(current.getId());

        return pets.stream().map(pet -> {
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
        }).toList();
    }

    public PetResponseDTO buscarPorId(Long id, String email) {
        petDoAutenticadoOu404(id, email);
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
    public PetResponseDTO uploadFoto(Long petId, MultipartFile file, String email) {
        petDoAutenticadoOu404(petId, email);

        PetModel pet = repository.findById(petId)
                .orElseThrow(() -> new ResourceNotFoundException("Pet com ID " + petId + " não encontrado."));

        try {
            String ext = extrairExtensao(file.getOriginalFilename());
            String filename = pet.getId() + ext;
            Path dir = Paths.get(uploadDir).resolve("pets");
            Files.createDirectories(dir);
            Path filePath = dir.resolve(filename);
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
    public void deletar(Long id, String email) {
        petDoAutenticadoOu404(id, email);
        repository.deleteById(id);
    }

    private void petDoAutenticadoOu404(Long petId, String email) {
        Users current = usuarioAtual(email);
        if (isAdmin(current)) {
            repository.findById(petId)
                    .orElseThrow(() -> new ResourceNotFoundException("Pet com ID " + petId + " não encontrado."));
            return;
        }
        repository.findByIdAndTutor_Id(petId, current.getId())
                .orElseThrow(() -> new ForbiddenException("Você não tem permissão para acessar este pet."));
    }

    private String extrairExtensao(String nomeOriginal) {
        if (nomeOriginal != null && nomeOriginal.contains(".")) {
            return nomeOriginal.substring(nomeOriginal.lastIndexOf("."));
        }
        return "";
    }
}