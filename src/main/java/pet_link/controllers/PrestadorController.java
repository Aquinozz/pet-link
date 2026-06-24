package pet_link.controllers;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import pet_link.dtos.AtualizarPrestadorDto;
import pet_link.dtos.PrestadorRequestDTO;
import pet_link.dtos.PrestadorResponseDTO;
import pet_link.services.PrestadorService;

import java.util.List;

@Tag(name = "Prestadores", description = "Endpoints relacionados ao gerenciamento de profissionais e clínicas")
@RestController
@RequestMapping("/prestadores")
@RequiredArgsConstructor
public class PrestadorController {

    private final PrestadorService service;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Cadastrar um novo prestador (Apenas ADMIN)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Prestador cadastrado com sucesso",
                    content = @Content(schema = @Schema(implementation = PrestadorResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou e-mail duplicado"),
            @ApiResponse(responseCode = "403", description = "Acesso negado")
    })
    public ResponseEntity<PrestadorResponseDTO> criar(@RequestBody @Valid PrestadorRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar um prestador por ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Prestador encontrado"),
            @ApiResponse(responseCode = "404", description = "Prestador não encontrado")
    })
    public ResponseEntity<PrestadorResponseDTO> buscarPorId(
            @Parameter(description = "ID do prestador", example = "1")
            @PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping
    @Operation(summary = "Listar todos os prestadores")
    @ApiResponse(responseCode = "200", description = "Lista de prestadores recuperada com sucesso")
    public ResponseEntity<List<PrestadorResponseDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodosProfissionais());
    }

    @PatchMapping("/meu-perfil")
    @Operation(summary = "Atualizar perfil do prestador logado",
            description = "Permite que o prestador atualize seus serviços, descrição, telefone, cidade e bairro.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Perfil atualizado com sucesso"),
            @ApiResponse(responseCode = "403", description = "Acesso negado")
    })
    public ResponseEntity<PrestadorResponseDTO> atualizarMeuPerfil(
            @RequestBody AtualizarPrestadorDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(service.atualizarPerfil(dto, userDetails.getUsername()));
    }
}