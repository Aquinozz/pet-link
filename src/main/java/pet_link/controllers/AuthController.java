package pet_link.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import pet_link.dtos.LoginRequestDto;
import pet_link.dtos.MeResponseDto;
import pet_link.dtos.RegisterRequestDto;
import pet_link.dtos.TokenResponseDto;
import pet_link.models.Users;
import pet_link.repositories.UserRepository;
import pet_link.services.AuthenticationService;

@Slf4j
@RestController
@Tag(name = "Authentication", description = "Operações relacionadas a controle de acesso, login e registros de novos usuários")
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final UserRepository userRepository;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Registrar um novo usuário")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuário registrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados cadastrais inválidos ou e-mail já em uso")
    })
    public void register(@RequestBody @Valid RegisterRequestDto registerRequestDto) throws Exception {
        log.info("Recebendo requisição de registro para o e-mail: {}", registerRequestDto.getEmail());
        authenticationService.register(registerRequestDto);
    }

    @PostMapping("/login")
    @Operation(summary = "Realizar login / Autenticação")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Autenticação bem-sucedida.",
                    content = @Content(schema = @Schema(implementation = TokenResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "Credenciais inválidas"),
            @ApiResponse(responseCode = "400", description = "Formato de requisição inválido")
    })
    public TokenResponseDto login(@RequestBody @Valid LoginRequestDto loginRequestDto) throws Exception {
        log.info("Iniciando tentativa de login para o usuário: {}", loginRequestDto.getEmail());
        return authenticationService.login(loginRequestDto);
    }

    @GetMapping("/me")
    @Operation(summary = "Retorna dados do usuário autenticado")
    @ApiResponse(responseCode = "200", description = "Dados do usuário logado")
    public ResponseEntity<MeResponseDto> me(@AuthenticationPrincipal UserDetails userDetails) {
        Users user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return ResponseEntity.ok(new MeResponseDto(user));
    }
}