package pet_link.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
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

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PrestadorService {

    private final PrestadorRepository prestadorRepository;
    private final UserRepository userRepository;
    private final RolesRepository rolesRepository;
    private final GeocodingService geocodingService;

    @Value("${app.upload-dir:./uploads}")
    private String uploadDir;

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

        geocodePrestador(prestador, dto.getCidade(), dto.getBairro(), dto.getLatitude(), dto.getLongitude());

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

        String cidade = dto.getCidade() != null ? dto.getCidade() : prestador.getCidade();
        String bairro = dto.getBairro() != null ? dto.getBairro() : prestador.getBairro();
        geocodePrestador(prestador, cidade, bairro, dto.getLatitude(), dto.getLongitude());

        prestadorRepository.save(prestador);
        return new PrestadorResponseDTO(usuario);
    }

    @Transactional
    public PrestadorResponseDTO uploadFoto(String email, MultipartFile file) {
        Users usuario = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        PrestadorModel prestador = usuario.getPrestador();
        if (prestador == null) {
            throw new BadRequestException("Usuário não possui perfil de prestador.");
        }

        try {
            String ext = "";
            String originalName = file.getOriginalFilename();
            if (originalName != null && originalName.contains(".")) {
                ext = originalName.substring(originalName.lastIndexOf("."));
            }
            String filename = prestador.getId() + ext;
            Path dir = Paths.get(uploadDir).resolve("prestadores");
            Files.createDirectories(dir);
            Path filePath = dir.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String fotoUrl = "/uploads/prestadores/" + filename;
            prestador.setFotoUrl(fotoUrl);
            prestadorRepository.save(prestador);

            return new PrestadorResponseDTO(usuario);
        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar arquivo de foto.", e);
        }
    }

    public List<PrestadorResponseDTO> listarProximos(double lat, double lng, double raioKm) {
        return userRepository.findAll().stream()
                .filter(user -> user.getRoles().stream()
                        .anyMatch(role -> role.getAuthority().equals("ROLE_PROFISSIONAL")))
                .filter(user -> user.getPrestador() != null
                        && user.getPrestador().getLatitude() != null
                        && user.getPrestador().getLongitude() != null)
                .map(user -> {
                    double distancia = calcularDistancia(
                            lat, lng,
                            user.getPrestador().getLatitude(),
                            user.getPrestador().getLongitude()
                    );
                    PrestadorResponseDTO dto = new PrestadorResponseDTO(user);
                    dto.setDistanciaKm(Math.round(distancia * 10.0) / 10.0);
                    return dto;
                })
                .filter(dto -> dto.getDistanciaKm() <= raioKm)
                .sorted(Comparator.comparingDouble(PrestadorResponseDTO::getDistanciaKm))
                .toList();
    }

    @Transactional
    public int backfillCoords() {
        List<PrestadorModel> semCoords = prestadorRepository.findByLatitudeIsNull();
        int atualizados = 0;

        for (PrestadorModel p : semCoords) {
            Optional<double[]> coords = geocodingService.geocode(p.getCidade(), p.getBairro());
            if (coords.isPresent()) {
                p.setLatitude(coords.get()[0]);
                p.setLongitude(coords.get()[1]);
                prestadorRepository.save(p);
                atualizados++;
            }
        }

        return atualizados;
    }

    private void geocodePrestador(PrestadorModel prestador, String cidade, String bairro,
                                   Double latitude, Double longitude) {
        if (latitude != null && longitude != null) {
            prestador.setLatitude(latitude);
            prestador.setLongitude(longitude);
        } else {
            Optional<double[]> coords = geocodingService.geocode(cidade, bairro);
            coords.ifPresent(c -> {
                prestador.setLatitude(c[0]);
                prestador.setLongitude(c[1]);
            });
        }
    }

    private double calcularDistancia(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);
        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }
}