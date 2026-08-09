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
import pet_link.dtos.AppointmentRequestDTO;
import pet_link.dtos.AppointmentResponseDTO;
import pet_link.services.AppointmentService;

import java.util.List;

@Tag(name = "Appointments", description = "Endpoints relacionados ao agendamento de consultas e serviços pet")
@RestController
@RequestMapping("/appointment")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService service;

    @PostMapping
    @Operation(summary = "Criar um novo agendamento")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Agendamento criado com sucesso",
                    content = @Content(schema = @Schema(implementation = AppointmentResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou data inserida não é futura"),
            @ApiResponse(responseCode = "404", description = "Pet ou Prestador não encontrado"),
            @ApiResponse(responseCode = "403", description = "Pet de outro tutor")
    })
    public ResponseEntity<AppointmentResponseDTO> criar(@Valid @RequestBody AppointmentRequestDTO dto,
                                                        @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.criar(dto, principal.getUsername()));
    }

    @GetMapping
    @Operation(summary = "Listar agendamentos do usuário autenticado",
            description = "Tutores veem seus agendamentos; prestadores veem os recebidos; admins veem todos.")
    @ApiResponse(responseCode = "200", description = "Lista de agendamentos recuperada com sucesso")
    public ResponseEntity<List<AppointmentResponseDTO>> listarTodos(@AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(service.listarTodos(principal.getUsername()));
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar um agendamento existente", description = "Apenas o tutor dono pode editar o agendamento.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Agendamento atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Agendamento não encontrado"),
            @ApiResponse(responseCode = "403", description = "Agendamento de outro usuário")
    })
    public ResponseEntity<AppointmentResponseDTO> atualizar(
            @Parameter(description = "ID do agendamento a ser atualizado", example = "1")
            @PathVariable Long id,
            @RequestBody AppointmentRequestDTO appointment,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(service.atualizar(id, appointment, principal.getUsername()));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Atualizar status do agendamento",
            description = "Confirmação e finalização são feitas pelo prestador; cancelamento pelo tutor ou prestador. Valida dono e transição de estado.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Status atualizado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Status ou transição inválida"),
            @ApiResponse(responseCode = "403", description = "Ação não permitida para este usuário"),
            @ApiResponse(responseCode = "404", description = "Agendamento não encontrado")
    })
    public ResponseEntity<AppointmentResponseDTO> atualizarStatus(
            @Parameter(description = "ID do agendamento", example = "1")
            @PathVariable Long id,
            @RequestParam String status,
            @AuthenticationPrincipal UserDetails principal) {
        return ResponseEntity.ok(service.atualizarStatus(id, status, principal.getUsername()));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar um agendamento", description = "Apenas o tutor dono ou admin pode remover.")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Agendamento excluído com sucesso"),
            @ApiResponse(responseCode = "404", description = "Agendamento não encontrado"),
            @ApiResponse(responseCode = "403", description = "Agendamento de outro usuário")
    })
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(
            @Parameter(description = "ID do agendamento a ser removido", example = "1")
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails principal) {
        service.deletar(id, principal.getUsername());
    }
}