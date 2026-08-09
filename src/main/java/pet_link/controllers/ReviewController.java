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
    @Operation(summary = "Criar uma nova avaliação", description = "Registra uma avaliação do tutor autenticado para um prestador.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Avaliação criada com sucesso",
                    content = @Content(schema = @Schema(implementation = ReviewResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados da requisição inválidos ou autoavaliação"),
            @ApiResponse(responseCode = "404", description = "Tutor ou Prestador não encontrado no sistema"),
            @ApiResponse(responseCode = "403", description = "Avaliação como outro usuário")
    })
    public ResponseEntity<ReviewResponseDTO> criar(@Valid @RequestBody ReviewRequestDTO dto,
                                                   @AuthenticationPrincipal UserDetails principal) {
        ReviewResponseDTO review = service.criar(dto, principal.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(review);
    }

    @GetMapping
    @Operation(summary = "Listar avaliações do usuário autenticado",
            description = "Tutores veem as avaliações que escreveram; prestadores veem as recebidas; admins veem todas.")
    @ApiResponse(responseCode = "200", description = "Lista de avaliações recuperada com sucesso")
    public ResponseEntity<List<ReviewResponseDTO>> listarTodos(@AuthenticationPrincipal UserDetails principal) {
        List<ReviewResponseDTO> reviews = service.listarTodos(principal.getUsername());
        return ResponseEntity.ok(reviews);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar uma avaliação", description = "Apenas o autor ou um admin pode remover.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Avaliação removida com sucesso (sem conteúdo no corpo)"),
            @ApiResponse(responseCode = "404", description = "Avaliação não encontrada para o ID informado"),
            @ApiResponse(responseCode = "403", description = "Avaliação de outro usuário")
    })
    public ResponseEntity<Void> deletar(
            @Parameter(description = "ID da avaliação a ser deletada", example = "1")
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        service.deletar(id, principal.getUsername());
        return ResponseEntity.noContent().build();
    }
}