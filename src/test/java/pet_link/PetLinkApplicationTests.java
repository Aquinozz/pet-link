package pet_link;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
        "spring.flyway.enabled=false",
        "jwt.expiration=900000",
        "jwt.secret=ci-only-secret-nao-usar-em-producao-9f3a1c8e2b7d4f6a0c5e8d1b"
})
class PetLinkApplicationTests {

	@Test
	void contextLoads() {
	}

}
