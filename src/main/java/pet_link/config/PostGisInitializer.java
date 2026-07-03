package pet_link.config;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;

@Slf4j
@Component
@RequiredArgsConstructor
public class PostGisInitializer {

    private final DataSource dataSource;

    @PostConstruct
    public void init() {
        try (Connection connection = dataSource.getConnection();
             Statement statement = connection.createStatement()) {
            log.info("Verificando e instalando a extensao PostGIS no Neon...");
            statement.execute("CREATE EXTENSION IF NOT EXISTS postgis;");
            log.info("Extensao PostGIS validada com sucesso!");
        } catch (Exception e) {
            log.error("Erro ao tentar ativar a extensao PostGIS: ", e);
        }
    }
}
