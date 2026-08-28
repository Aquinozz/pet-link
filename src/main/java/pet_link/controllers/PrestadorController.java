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
import org.springframework.web.multipart.MultipartFile;
import pet_link.dtos.AtualizarPrestadorDto;
import pet_link.dtos.PrestadorRequestDTO;
import pet_link.dtos.PrestadorResponseDTO;
import pet_link.services.PrestadorService;

import java.util.List;
import java.util.Map;

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

    @GetMapping
    @Operation(summary = "Listar todos os prestadores")
    @ApiResponse(responseCode = "200", description = "Lista de prestadores recuperada com sucesso")
    public ResponseEntity<List<PrestadorResponseDTO>> listarTodos() {
        return ResponseEntity.ok(service.listarTodosProfissionais());
    }

    @GetMapping("/top-avaliados")
    @Operation(summary = "Listar prestadores mais bem avaliados",
            description = "Retorna os prestadores com maior avaliação média, limitado ao parâmetro limit")
    @ApiResponse(responseCode = "200", description = "Lista de prestadores mais bem avaliados")
    public ResponseEntity<List<PrestadorResponseDTO>> listarTopAvaliados(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(service.listarTopAvaliados(limit));
    }

    @GetMapping("/proximos")
    @Operation(summary = "Listar prestadores próximos",
            description = "Retorna prestadores ordenados por distância dentro de um raio em km")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de prestadores próximos"),
            @ApiResponse(responseCode = "400", description = "Parâmetros inválidos")
    })
    public ResponseEntity<List<PrestadorResponseDTO>> listarProximos(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "50") double raio) {
        return ResponseEntity.ok(service.listarProximos(lat, lng, raio));
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

    @PostMapping("/backfill-coords")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Backfill coordenadas de prestadores sem latitude/longitude",
            description = "Varre todos os prestadores com latitude nula e geocodifica cidade+bairro via Nominatim")
    public ResponseEntity<Map<String, Object>> backfillCoords() {
        int atualizados = service.backfillCoords();
        return ResponseEntity.ok(Map.of(
                "atualizados", atualizados,
                "mensagem", atualizados + " prestador(es) atualizado(s) com coordenadas"
        ));
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

    @PostMapping("/upload-foto")
    @Operation(summary = "Upload da foto de perfil do prestador logado")
    public ResponseEntity<PrestadorResponseDTO> uploadFoto(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(service.uploadFoto(userDetails.getUsername(), file));
    }

    @PostMapping("/upload-banner")
    @Operation(summary = "Upload do banner do prestador logado")
    public ResponseEntity<PrestadorResponseDTO> uploadBanner(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(service.uploadBanner(userDetails.getUsername(), file));
    }

    @DeleteMapping("/banner")
    @Operation(summary = "Remove o banner do prestador logado")
    public ResponseEntity<PrestadorResponseDTO> removerBanner(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(service.removerBanner(userDetails.getUsername()));
    }
}