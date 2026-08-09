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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import pet_link.dtos.PetRequestDTO;
import pet_link.dtos.PetResponseDTO;
import pet_link.services.PetService;

import java.util.List;

@Tag(name = "Pets", description = "Endpoints relacionados ao gerenciamento de animais de estimação (Pets)")
@RestController
@RequestMapping("/pets")
@RequiredArgsConstructor
public class PetController {

    private final PetService service;

    @PostMapping
    @Operation(summary = "Cadastrar um novo pet", description = "Registra um pet vinculado ao tutor autenticado.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Pet cadastrado com sucesso",
                    content = @Content(schema = @Schema(implementation = PetResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados da requisição inválidos ou falha na validação"),
            @ApiResponse(responseCode = "403", description = "Pet de outro tutor")
    })
    public ResponseEntity<PetResponseDTO> criar(@Valid @RequestBody PetRequestDTO dto,
                                                @AuthenticationPrincipal UserDetails principal) {
        PetResponseDTO petCriado = service.criar(dto, principal.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(petCriado);
    }

    @GetMapping
    @Operation(summary = "Listar os pets do tutor autenticado", description = "Retorna apenas os pets do usuário logado.")
    @ApiResponse(responseCode = "200", description = "Lista de pets recuperada com sucesso")
    public ResponseEntity<List<PetResponseDTO>> listar(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(service.listarTodos(principal.getUsername()));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar um pet por ID", description = "Busca os detalhes de um pet específico (apenas o dono).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pet encontrado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Nenhum pet encontrado com o ID fornecido"),
            @ApiResponse(responseCode = "403", description = "Pet de outro tutor")
    })
    public ResponseEntity<PetResponseDTO> buscar(
            @Parameter(description = "ID do pet que deseja buscar", example = "1")
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(service.buscarPorId(id, principal.getUsername()));
    }

    @PostMapping("/{id}/upload-foto")
    @Operation(summary = "Upload da foto do pet", description = "Apenas o tutor dono do pet pode alterar a foto.")
    public ResponseEntity<PetResponseDTO> uploadFoto(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(service.uploadFoto(id, file, principal.getUsername()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover um pet do sistema", description = "Exclui permanentemente um pet (apenas o dono).")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Pet removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Pet não encontrado para exclusão"),
            @ApiResponse(responseCode = "403", description = "Pet de outro tutor")
    })
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(
            @Parameter(description = "ID do pet que será excluído", example = "1")
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        service.deletar(id, principal.getUsername());
    }
}