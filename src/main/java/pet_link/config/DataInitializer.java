package pet_link.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import pet_link.enums.PrestadorType;
import pet_link.enums.UserRole;
import pet_link.models.PetModel;
import pet_link.models.PrestadorModel;
import pet_link.models.RolesEntity;
import pet_link.models.Users;
import pet_link.repositories.PetRepository;
import pet_link.repositories.PrestadorRepository;
import pet_link.repositories.RolesRepository;
import pet_link.repositories.UserRepository;

@RequiredArgsConstructor
@Component
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RolesRepository rolesRepository;
    private final PetRepository petRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final PrestadorRepository prestadorRepository;

    @Value("${ADMIN_EMAIL:admin@petlink.com}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD:admin123}")
    private String adminPassword;

    @Override
    public void run(String... args) {

        for (UserRole roleEnum : UserRole.values()) {
            if (rolesRepository.findByNome(roleEnum.name()).isEmpty()) {
                RolesEntity novaRole = new RolesEntity();
                novaRole.setNome(roleEnum.name());
                rolesRepository.save(novaRole);
            }
        }

        RolesEntity roleTutor = rolesRepository
                .findByNome(UserRole.ROLE_TUTOR.name())
                .orElseThrow(() -> new RuntimeException("ROLE_TUTOR não encontrada"));

        RolesEntity roleProfissional = rolesRepository
                .findByNome(UserRole.ROLE_PROFISSIONAL.name())
                .orElseThrow(() -> new RuntimeException("ROLE_PROFISSIONAL não encontrada"));

        RolesEntity roleAdmin = rolesRepository
                .findByNome(UserRole.ROLE_ADMIN.name())
                .orElseThrow(() -> new RuntimeException("ROLE_ADMIN não encontrada"));

        // Admin de acesso
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            Users admin = new Users();
            admin.setNome("Administrador");
            admin.setEmail(adminEmail);
            admin.setSenha(passwordEncoder.encode(adminPassword));
            admin.getRoles().add(roleAdmin);
            userRepository.save(admin);
            log.warn("Usuário admin criado com credenciais padrão. Altere a senha no .env.");
        }

        // Tutor de teste
        if (userRepository.findByEmail("bianca@email.com").isEmpty()) {
            Users tutor = new Users();
            tutor.setNome("Bianca");
            tutor.setEmail("bianca@email.com");
            tutor.setSenha(passwordEncoder.encode("123456"));
            tutor.getRoles().add(roleTutor);
            tutor = userRepository.save(tutor);

            PetModel pet = new PetModel();
            pet.setNome("Rex");
            pet.setEspecie("Cachorro");
            pet.setRaca("Labrador");
            pet.setIdade(3);
            pet.setTutor(tutor);
            petRepository.save(pet);
        }

        // Prestador 1 — Clínica Pet Feliz
        if (userRepository.findByEmail("clinica@petfeliz.com").isEmpty()) {
            Users usuarioPrestador = new Users();
            usuarioPrestador.setNome("Clínica Pet Feliz");
            usuarioPrestador.setEmail("clinica@petfeliz.com");
            usuarioPrestador.setSenha(passwordEncoder.encode("123456"));
            usuarioPrestador.getRoles().add(roleProfissional);
            usuarioPrestador = userRepository.save(usuarioPrestador);

            PrestadorModel prestador = new PrestadorModel();
            prestador.setNome("Clínica Pet Feliz");
            prestador.setType(PrestadorType.CLINICA_VETERINARIA);
            prestador.setDescricao("Atendimento veterinário completo com equipe especializada");
            prestador.setCidade("Salvador");
            prestador.setBairro("Cajazeiras");
            prestador.setServicos("Consulta, Vacinação, Cirurgia, Banho e Tosa");
            prestador.setAvaliacaoMedia(4.8);
            prestador.setTelefone("71 98459613");
            prestador.setHorarioFuncionamento("Seg a Sex: 08h às 18h | Sáb: 08h às 13h");
            prestador.setUser(usuarioPrestador);
            prestador.setLatitude(-12.9027);
            prestador.setLongitude(-38.4411);
            prestadorRepository.save(prestador);
        }

        // Prestador 2 — Creche Pet Feliz
        if (userRepository.findByEmail("crechepetfeliz@email.com").isEmpty()) {
            Users usuarioCreche = new Users();
            usuarioCreche.setNome("Creche Pet Feliz");
            usuarioCreche.setEmail("crechepetfeliz@email.com");
            usuarioCreche.setSenha(passwordEncoder.encode("123456"));
            usuarioCreche.getRoles().add(roleProfissional);
            usuarioCreche = userRepository.save(usuarioCreche);

            PrestadorModel creche = new PrestadorModel();
            creche.setNome("Creche Pet Feliz");
            creche.setType(PrestadorType.CRECHE_PET);
            creche.setDescricao("Cuidamos do seu pet com amor enquanto você trabalha");
            creche.setCidade("Salvador");
            creche.setBairro("Pituba");
            creche.setServicos("Hospedagem diária, Passeio, Alimentação especial, Banho e Tosa");
            creche.setAvaliacaoMedia(4.5);
            creche.setTelefone("71 98765-4321");
            creche.setHorarioFuncionamento("Seg a Sex: 07h às 19h | Sáb: 08h às 17h");
            creche.setUser(usuarioCreche);
            creche.setLatitude(-13.0039);
            creche.setLongitude(-38.4507);
            prestadorRepository.save(creche);
        }

        // Prestador 3 — Pet Shop Top Dog
        if (userRepository.findByEmail("petshoptopdog@email.com").isEmpty()) {
            Users usuarioPetshop = new Users();
            usuarioPetshop.setNome("Pet Shop Top Dog");
            usuarioPetshop.setEmail("petshoptopdog@email.com");
            usuarioPetshop.setSenha(passwordEncoder.encode("123456"));
            usuarioPetshop.getRoles().add(roleProfissional);
            usuarioPetshop = userRepository.save(usuarioPetshop);

            PrestadorModel petshop = new PrestadorModel();
            petshop.setNome("Pet Shop Top Dog");
            petshop.setType(PrestadorType.PETSHOP);
            petshop.setDescricao("Tudo que seu pet precisa em um só lugar");
            petshop.setCidade("Salvador");
            petshop.setBairro("Barra");
            petshop.setServicos("Banho e Tosa, Acessórios, Ração Premium, Farmácia Pet, Transporte");
            petshop.setAvaliacaoMedia(4.2);
            petshop.setTelefone("71 93333-2222");
            petshop.setHorarioFuncionamento("Seg a Sáb: 09h às 20h | Dom: 10h às 16h");
            petshop.setUser(usuarioPetshop);
            petshop.setLatitude(-13.0086);
            petshop.setLongitude(-38.5322);
            prestadorRepository.save(petshop);
        }

        // Prestador 4 — Dr. Carlos Veterinário
        if (userRepository.findByEmail("drcarlos@vet.com").isEmpty()) {
            Users usuarioVet = new Users();
            usuarioVet.setNome("Dr. Carlos Mendes");
            usuarioVet.setEmail("drcarlos@vet.com");
            usuarioVet.setSenha(passwordEncoder.encode("123456"));
            usuarioVet.getRoles().add(roleProfissional);
            usuarioVet = userRepository.save(usuarioVet);

            PrestadorModel vet = new PrestadorModel();
            vet.setNome("Dr. Carlos Mendes");
            vet.setType(PrestadorType.VETERINARIO);
            vet.setDescricao("Veterinário especialista em clínica de pequenos animais");
            vet.setCidade("Salvador");
            vet.setBairro("Rio Vermelho");
            vet.setServicos("Consulta, Vacinação, Check-up, Exames, Cirurgia");
            vet.setAvaliacaoMedia(4.9);
            vet.setTelefone("71 99999-1111");
            vet.setHorarioFuncionamento("Seg a Sex: 08h às 18h");
            vet.setUser(usuarioVet);
            vet.setLatitude(-12.9880);
            vet.setLongitude(-38.5068);
            prestadorRepository.save(vet);
        }

        // Prestador 5 — Banho & Tosa Amigo Pet
        if (userRepository.findByEmail("banhotosa@amigopet.com").isEmpty()) {
            Users usuarioBanho = new Users();
            usuarioBanho.setNome("Banho & Tosa Amigo Pet");
            usuarioBanho.setEmail("banhotosa@amigopet.com");
            usuarioBanho.setSenha(passwordEncoder.encode("123456"));
            usuarioBanho.getRoles().add(roleProfissional);
            usuarioBanho = userRepository.save(usuarioBanho);

            PrestadorModel banho = new PrestadorModel();
            banho.setNome("Banho & Tosa Amigo Pet");
            banho.setType(PrestadorType.BANHO_E_TOSA);
            banho.setDescricao("Banho e tosa com produtos naturais e carinho");
            banho.setCidade("Salvador");
            banho.setBairro("Ondina");
            banho.setServicos("Banho, Tosa, Hidratação, Perfumaria Pet");
            banho.setAvaliacaoMedia(4.6);
            banho.setTelefone("71 98888-2222");
            banho.setHorarioFuncionamento("Seg a Sáb: 08h às 18h");
            banho.setUser(usuarioBanho);
            banho.setLatitude(-13.0012);
            banho.setLongitude(-38.5089);
            prestadorRepository.save(banho);
        }

        // Prestador 6 — Passeador João
        if (userRepository.findByEmail("joao@passeador.com").isEmpty()) {
            Users usuarioPasseador = new Users();
            usuarioPasseador.setNome("João Passeador");
            usuarioPasseador.setEmail("joao@passeador.com");
            usuarioPasseador.setSenha(passwordEncoder.encode("123456"));
            usuarioPasseador.getRoles().add(roleProfissional);
            usuarioPasseador = userRepository.save(usuarioPasseador);

            PrestadorModel passeador = new PrestadorModel();
            passeador.setNome("João Passeador");
            passeador.setType(PrestadorType.PASSEADOR);
            passeador.setDescricao("Passeios seguros e divertidos para seu cão");
            passeador.setCidade("Salvador");
            passeador.setBairro("Graça");
            passeador.setServicos("Passeio individual, Passeio em grupo, Adestramento básico");
            passeador.setAvaliacaoMedia(4.3);
            passeador.setTelefone("71 97777-3333");
            passeador.setHorarioFuncionamento("Seg a Dom: 06h às 20h");
            passeador.setUser(usuarioPasseador);
            passeador.setLatitude(-12.9855);
            passeador.setLongitude(-38.5120);
            prestadorRepository.save(passeador);
        }

        // Prestador 7 — Pet Sitter Maria
        if (userRepository.findByEmail("maria@petsitter.com").isEmpty()) {
            Users usuarioSitter = new Users();
            usuarioSitter.setNome("Maria Pet Sitter");
            usuarioSitter.setEmail("maria@petsitter.com");
            usuarioSitter.setSenha(passwordEncoder.encode("123456"));
            usuarioSitter.getRoles().add(roleProfissional);
            usuarioSitter = userRepository.save(usuarioSitter);

            PrestadorModel sitter = new PrestadorModel();
            sitter.setNome("Maria Pet Sitter");
            sitter.setType(PrestadorType.PET_SITTER);
            sitter.setDescricao("Cuido do seu pet na sua casa com todo carinho");
            sitter.setCidade("Salvador");
            sitter.setBairro("Barra");
            sitter.setServicos("Visitas domiciliares, Alimentação, Medicação, Companhia");
            sitter.setAvaliacaoMedia(4.7);
            sitter.setTelefone("71 96666-4444");
            sitter.setHorarioFuncionamento("Seg a Dom: 24h (sob agendamento)");
            sitter.setUser(usuarioSitter);
            sitter.setLatitude(-13.0068);
            sitter.setLongitude(-38.5315);
            prestadorRepository.save(sitter);
        }

        // Prestador 8 — Clínica Vida Animal
        if (userRepository.findByEmail("clinica@vidanimal.com").isEmpty()) {
            Users usuarioClinica2 = new Users();
            usuarioClinica2.setNome("Clínica Vida Animal");
            usuarioClinica2.setEmail("clinica@vidanimal.com");
            usuarioClinica2.setSenha(passwordEncoder.encode("123456"));
            usuarioClinica2.getRoles().add(roleProfissional);
            usuarioClinica2 = userRepository.save(usuarioClinica2);

            PrestadorModel clinica2 = new PrestadorModel();
            clinica2.setNome("Clínica Vida Animal");
            clinica2.setType(PrestadorType.CLINICA_VETERINARIA);
            clinica2.setDescricao("Clínica 24h com emergência e internação");
            clinica2.setCidade("Salvador");
            clinica2.setBairro("Itaigara");
            clinica2.setServicos("Emergência 24h, Internação, Cirurgia, UTI, Exames");
            clinica2.setAvaliacaoMedia(4.4);
            clinica2.setTelefone("71 95555-5555");
            clinica2.setHorarioFuncionamento("24 horas");
            clinica2.setUser(usuarioClinica2);
            clinica2.setLatitude(-12.9740);
            clinica2.setLongitude(-38.4825);
            prestadorRepository.save(clinica2);
        }

        // Prestador 9 — Pet Shop Meu Bicho
        if (userRepository.findByEmail("meubicho@petshop.com").isEmpty()) {
            Users usuarioPetshop2 = new Users();
            usuarioPetshop2.setNome("Pet Shop Meu Bicho");
            usuarioPetshop2.setEmail("meubicho@petshop.com");
            usuarioPetshop2.setSenha(passwordEncoder.encode("123456"));
            usuarioPetshop2.getRoles().add(roleProfissional);
            usuarioPetshop2 = userRepository.save(usuarioPetshop2);

            PrestadorModel petshop2 = new PrestadorModel();
            petshop2.setNome("Pet Shop Meu Bicho");
            petshop2.setType(PrestadorType.PETSHOP);
            petshop2.setDescricao("Produtos naturais e alimentação saudável para pets");
            petshop2.setCidade("Salvador");
            petshop2.setBairro("Caminho das Árvores");
            petshop2.setServicos("Ração natural, Suplementos, Brinquedos, Acessórios, Banho");
            petshop2.setAvaliacaoMedia(4.1);
            petshop2.setTelefone("71 94444-6666");
            petshop2.setHorarioFuncionamento("Seg a Sáb: 10h às 20h");
            petshop2.setUser(usuarioPetshop2);
            petshop2.setLatitude(-12.9650);
            petshop2.setLongitude(-38.4600);
            prestadorRepository.save(petshop2);
        }

        // Prestador 10 — Creche & Hotel Pet Paradise
        if (userRepository.findByEmail("paradise@pet.com").isEmpty()) {
            Users usuarioParadise = new Users();
            usuarioParadise.setNome("Creche & Hotel Pet Paradise");
            usuarioParadise.setEmail("paradise@pet.com");
            usuarioParadise.setSenha(passwordEncoder.encode("123456"));
            usuarioParadise.getRoles().add(roleProfissional);
            usuarioParadise = userRepository.save(usuarioParadise);

            PrestadorModel paradise = new PrestadorModel();
            paradise.setNome("Creche & Hotel Pet Paradise");
            paradise.setType(PrestadorType.CRECHE_PET);
            paradise.setDescricao("Hotel e creche de luxo para cães e gatos");
            paradise.setCidade("Salvador");
            paradise.setBairro("Stiep");
            paradise.setServicos("Hospedagem, Creche, Spa, Adestramento, Transporte");
            paradise.setAvaliacaoMedia(4.0);
            paradise.setTelefone("71 93333-7777");
            paradise.setHorarioFuncionamento("Seg a Dom: 07h às 22h");
            paradise.setUser(usuarioParadise);
            paradise.setLatitude(-12.9800);
            paradise.setLongitude(-38.5000);
            prestadorRepository.save(paradise);
        }

        // Prestador 11 — Veterinário Dr. Pedro
        if (userRepository.findByEmail("drpedro@vet.com").isEmpty()) {
            Users usuarioVet2 = new Users();
            usuarioVet2.setNome("Dr. Pedro Santos");
            usuarioVet2.setEmail("drpedro@vet.com");
            usuarioVet2.setSenha(passwordEncoder.encode("123456"));
            usuarioVet2.getRoles().add(roleProfissional);
            usuarioVet2 = userRepository.save(usuarioVet2);

            PrestadorModel vet2 = new PrestadorModel();
            vet2.setNome("Dr. Pedro Santos");
            vet2.setType(PrestadorType.VETERINARIO);
            vet2.setDescricao("Clínica geral e dermatologia veterinária");
            vet2.setCidade("Salvador");
            vet2.setBairro("Cabula");
            vet2.setServicos("Consulta, Dermatologia, Vacinação, Exames laboratoriais");
            vet2.setAvaliacaoMedia(3.9);
            vet2.setTelefone("71 92222-8888");
            vet2.setHorarioFuncionamento("Seg a Sex: 09h às 17h");
            vet2.setUser(usuarioVet2);
            vet2.setLatitude(-12.9400);
            vet2.setLongitude(-38.4800);
            prestadorRepository.save(vet2);
        }

        // Prestador 12 — Banho & Tosa Fofura
        if (userRepository.findByEmail("fofura@banhotosa.com").isEmpty()) {
            Users usuarioBanho2 = new Users();
            usuarioBanho2.setNome("Banho & Tosa Fofura");
            usuarioBanho2.setEmail("fofura@banhotosa.com");
            usuarioBanho2.setSenha(passwordEncoder.encode("123456"));
            usuarioBanho2.getRoles().add(roleProfissional);
            usuarioBanho2 = userRepository.save(usuarioBanho2);

            PrestadorModel banho2 = new PrestadorModel();
            banho2.setNome("Banho & Tosa Fofura");
            banho2.setType(PrestadorType.BANHO_E_TOSA);
            banho2.setDescricao("Tosa criativa e banho relaxante para pets");
            banho2.setCidade("Salvador");
            banho2.setBairro("Pernambués");
            banho2.setServicos("Banho, Tosa na tesoura, Tosa máquina, Hidratação");
            banho2.setAvaliacaoMedia(3.8);
            banho2.setTelefone("71 91111-9999");
            banho2.setHorarioFuncionamento("Seg a Sáb: 08h às 18h");
            banho2.setUser(usuarioBanho2);
            banho2.setLatitude(-12.9500);
            banho2.setLongitude(-38.4500);
            prestadorRepository.save(banho2);
        }
    }
}
