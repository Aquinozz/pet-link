package pet_link.services;

import java.util.Set;

import pet_link.config.TokenProvider;
import pet_link.dtos.LoginRequestDto;
import pet_link.dtos.RegisterRequestDto;
import pet_link.dtos.TokenResponseDto;
import pet_link.enums.UserRole;
import pet_link.models.RolesEntity;
import pet_link.models.Users;
import pet_link.repositories.RolesRepository;
import pet_link.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.BadRequestException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final RolesRepository rolesRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;

    private final long expiration = 86400000; // 24 horas

    @Transactional
    public void register(RegisterRequestDto registerRequestDto) throws BadRequestException {

        log.info("Tentando registrar usuário com email: {}", registerRequestDto.getEmail());

        if (userRepository.existsByEmail(registerRequestDto.getEmail())) {
            log.warn("Tentativa de registro com email já existente: {}", registerRequestDto.getEmail());
            throw new BadRequestException("Usuário já cadastrado");
        }

        RolesEntity role = rolesRepository.findByNome(UserRole.ROLE_TUTOR.name())
                .orElseGet(() -> {
                    log.info("Role ROLE_TUTOR não encontrada, criando nova");
                    return rolesRepository.save(
                            RolesEntity.builder()
                                    .nome(UserRole.ROLE_TUTOR.name())
                                    .build()
                    );
                });

        Users user = Users.builder()
                .nome(registerRequestDto.getNome())
                .email(registerRequestDto.getEmail())
                .senha(passwordEncoder.encode(registerRequestDto.getSenha()))
                .roles(Set.of(role))
                .build();

        userRepository.save(user);

        log.info("Usuário registrado com sucesso: {}", registerRequestDto.getEmail());
    }

    public TokenResponseDto login(LoginRequestDto dto) throws Exception {

        log.info("Tentativa de login para email: {}", dto.getEmail());

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getSenha())
            );

            String token = tokenProvider.gerarToken(authentication);

            log.info("Login realizado com sucesso para: {}", dto.getEmail());

            return new TokenResponseDto(token, expiration);

        } catch (BadCredentialsException e) {
            log.warn("Falha no login (credenciais inválidas) para: {}", dto.getEmail());
            throw new BadRequestException("Credenciais inválidas");
        } catch (Exception e) {
            log.error("Erro inesperado no login para: {}", dto.getEmail(), e);
            throw e;
        }
    }
}