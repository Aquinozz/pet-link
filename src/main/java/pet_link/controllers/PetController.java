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
import org.springframework.web.bind.annotation.*;
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
    @Operation(summary = "Cadastrar um novo pet", description = "Registra um pet no sistema vinculando-o diretamente a um Tutor existente através do ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Pet cadastrado com sucesso",
                    content = @Content(schema = @Schema(implementation = PetResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados da requisição inválidos ou falha na validação"),
            @ApiResponse(responseCode = "404", description = "Tutor informado não foi encontrado")
    })
    public ResponseEntity<PetResponseDTO> criar(@Valid @RequestBody PetRequestDTO dto) {
        PetResponseDTO petCriado = service.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(petCriado);
    }

    @GetMapping
    @Operation(summary = "Listar todos os pets", description = "Retorna uma lista contendo todos os pets registrados na plataforma com seus respectivos tutores.")
    @ApiResponse(responseCode = "200", description = "Lista de pets recuperada com sucesso")
    public ResponseEntity<List<PetResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar um pet por ID", description = "Busca os detalhes informativos de um pet específico baseado no identificador único fornecido.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Pet encontrado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Nenhum pet encontrado com o ID fornecido")
    })
    public ResponseEntity<PetResponseDTO> buscar(
            @Parameter(description = "ID do pet que deseja buscar", example = "1")
            @PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Remover um pet do sistema", description = "Exclui permanentemente o registro de um pet do banco de dados através do seu ID.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Pet removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Pet não encontrado para exclusão")
    })
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(
            @Parameter(description = "ID do pet que será excluído", example = "1")
            @PathVariable Long id) {
        service.deletar(id);
    }
}