package pet_link.services;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

@Service
public class GeocodingService {

    private static final Logger log = LoggerFactory.getLogger(GeocodingService.class);
    private static final String NOMINATIM_URL =
            "https://nominatim.openstreetmap.org/search?q=%s&format=json&limit=1";

    private final RestTemplate restTemplate;

    public GeocodingService() {
        this.restTemplate = new RestTemplate();
    }

    public Optional<double[]> geocode(String cidade, String bairro) {
        try {
            String query = (bairro != null ? bairro + ", " : "") + cidade + ", Brasil";
            String url = String.format(NOMINATIM_URL, java.net.URLEncoder.encode(query, "UTF-8"));

            NominatimResponse[] results = restTemplate.getForObject(url, NominatimResponse[].class);

            if (results != null && results.length > 0) {
                double lat = Double.parseDouble(results[0].lat);
                double lon = Double.parseDouble(results[0].lon);
                log.info("Geocoded '{}' -> lat={}, lng={}", query, lat, lon);
                return Optional.of(new double[]{lat, lon});
            }

            log.warn("No geocoding results for '{}'", query);
        } catch (Exception e) {
            log.error("Geocoding error for cidade={}, bairro={}: {}", cidade, bairro, e.getMessage());
        }
        return Optional.empty();
    }

    @SuppressWarnings("unused")
    private static class NominatimResponse {
        public String lat;
        public String lon;
    }
}
