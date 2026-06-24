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
import pet_link.dtos.ReviewRequestDTO;
import pet_link.dtos.ReviewResponseDTO;
import pet_link.services.ReviewService;

import java.util.List;

@Tag(name = "Reviews", description = "Endpoints relacionados às avaliações deixadas para os prestadores")
@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService service;

    @PostMapping
    @Operation(summary = "Criar uma nova avaliação", description = "Registra uma avaliação/nota de um tutor para um prestador de serviços após um atendimento.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Avaliação criada com sucesso",
                    content = @Content(schema = @Schema(implementation = ReviewResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados da requisição inválidos (ex: nota fora do limite permitido)"),
            @ApiResponse(responseCode = "404", description = "Tutor ou Prestador não encontrado no sistema")
    })
    public ResponseEntity<ReviewResponseDTO> criar(@Valid @RequestBody ReviewRequestDTO dto) {
        ReviewResponseDTO review = service.criar(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }

    @GetMapping
    @Operation(summary = "Listar todas as avaliações", description = "Retorna uma lista contendo todas as avaliações cadastradas de forma limpa e mascarada.")
    @ApiResponse(responseCode = "200", description = "Lista de avaliações recuperada com sucesso")
    public ResponseEntity<List<ReviewResponseDTO>> listarTodos() {
        List<ReviewResponseDTO> reviews = service.listarTodos();
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar uma avaliação", description = "Remove permanentemente o registro de uma avaliação do sistema usando o ID fornecido.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Avaliação removida com sucesso (sem conteúdo no corpo)"),
            @ApiResponse(responseCode = "404", description = "Avaliação não encontrada para o ID informado")
    })
    public ResponseEntity<Void> deletar(
            @Parameter(description = "ID da avaliação a ser deletada", example = "1")
            @PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }
}