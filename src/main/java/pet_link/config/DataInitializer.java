package pet_link.config;

import lombok.RequiredArgsConstructor;
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
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RolesRepository rolesRepository;
    private final PetRepository petRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    private final PrestadorRepository prestadorRepository;

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
            prestador.setAvaliacaoMedia(0.0);
            prestador.setTelefone("71 98459613");
            prestador.setHorarioFuncionamento("Seg a Sex: 08h às 18h | Sáb: 08h às 13h");
            prestador.setUser(usuarioPrestador);
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
            creche.setAvaliacaoMedia(0.0);
            creche.setTelefone("71 98765-4321");
            creche.setHorarioFuncionamento("Seg a Sex: 07h às 19h | Sáb: 08h às 17h");
            creche.setUser(usuarioCreche);
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
            petshop.setAvaliacaoMedia(0.0);
            petshop.setTelefone("71 93333-2222");
            petshop.setHorarioFuncionamento("Seg a Sáb: 09h às 20h | Dom: 10h às 16h");
            petshop.setUser(usuarioPetshop);
            prestadorRepository.save(petshop);
        }
    }
}
