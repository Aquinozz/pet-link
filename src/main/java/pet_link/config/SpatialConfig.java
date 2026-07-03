package pet_link.config;

import org.locationtech.jts.geom.GeometryFactory;
import org.locationtech.jts.geom.PrecisionModel;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpatialConfig {
    @Bean
    public GeometryFactory geometryFactory() {
        // Inicializa com o SRID 4326 (WGS 84 usado por GPS global)
        return new GeometryFactory(new PrecisionModel(), 4326);
    }
}
