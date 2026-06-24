package pet_link.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pet_link.dtos.AtualizarPrestadorDto;
import pet_link.dtos.PrestadorRequestDTO;
import pet_link.dtos.PrestadorResponseDTO;
import pet_link.enums.UserRole;
import pet_link.exceptions.BadRequestException;
import pet_link.exceptions.ResourceNotFoundException;
import pet_link.models.PrestadorModel;
import pet_link.models.RolesEntity;
import pet_link.models.Users;
import pet_link.repositories.PrestadorRepository;
import pet_link.repositories.RolesRepository;
import pet_link.repositories.UserRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PrestadorService {

    private final PrestadorRepository prestadorRepository;
    private final UserRepository userRepository;
    private final RolesRepository rolesRepository;

    @Transactional
    public PrestadorResponseDTO criar(PrestadorRequestDTO dto) {
        RolesEntity roleProfissional = rolesRepository.findByNome(UserRole.ROLE_PROFISSIONAL.name())
                .orElseThrow(() -> new ResourceNotFoundException("Role ROLE_PROFISSIONAL não encontrada no sistema."));

        String emailGerado = dto.getNomePrestador().toLowerCase().replace(" ", "") + "@email.com";

        if (userRepository.existsByEmail(emailGerado)) {
            throw new BadRequestException("Já existe um usuário cadastrado com o e-mail: " + emailGerado);
        }

        Users usuario = new Users();
        usuario.setNome(dto.getNomePrestador());
        usuario.setEmail(emailGerado);
        usuario.setSenha("123456");
        usuario.getRoles().add(roleProfissional);
        Users usuarioSalvo = userRepository.save(usuario);

        PrestadorModel prestador = new PrestadorModel();
        prestador.setNome(dto.getNomePrestador());
        prestador.setType(dto.getType());
        prestador.setDescricao(dto.getDescricao());
        prestador.setCidade(dto.getCidade());
        prestador.setBairro(dto.getBairro());
        prestador.setServicos(dto.getServicos());
        prestador.setTelefone(dto.getTelefone());
        prestador.setAvaliacaoMedia(0.0);
        prestador.setUser(usuarioSalvo);
        prestadorRepository.save(prestador);

        return new PrestadorResponseDTO(usuarioSalvo);
    }

    public PrestadorResponseDTO buscarPorId(Long id) {
        Users profissional = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Profissional com ID " + id + " não foi encontrado."));

        boolean ehProfissional = profissional.getRoles().stream()
                .anyMatch(role -> role.getAuthority().equals(UserRole.ROLE_PROFISSIONAL.name()));

        if (!ehProfissional) {
            throw new BadRequestException("O usuário informado não possui permissões de um profissional cadastrado.");
        }

        return new PrestadorResponseDTO(profissional);
    }

    public List<PrestadorResponseDTO> listarTodosProfissionais() {
        return userRepository.findAll().stream()
                .filter(user -> user.getRoles().stream()
                        .anyMatch(role -> role.getAuthority().equals(UserRole.ROLE_PROFISSIONAL.name())))
                .map(PrestadorResponseDTO::new)
                .toList();
    }

    @Transactional
    public PrestadorResponseDTO atualizarPerfil(AtualizarPrestadorDto dto, String email) {
        Users usuario = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        PrestadorModel prestador = usuario.getPrestador();
        if (prestador == null) {
            throw new BadRequestException("Usuário não possui perfil de prestador.");
        }

        if (dto.getTelefone() != null) prestador.setTelefone(dto.getTelefone());
        if (dto.getDescricao() != null) prestador.setDescricao(dto.getDescricao());
        if (dto.getCidade() != null) prestador.setCidade(dto.getCidade());
        if (dto.getBairro() != null) prestador.setBairro(dto.getBairro());
        if (dto.getServicos() != null) prestador.setServicos(dto.getServicos());
        if (dto.getHorarioFuncionamento() != null) prestador.setHorarioFuncionamento(dto.getHorarioFuncionamento());

        prestadorRepository.save(prestador);
        return new PrestadorResponseDTO(usuario);
    }
}