export type Appointment = {
  id: number;
  time: string;
  pet: string;
  tutor: string;
  service: string;
  status: "Confirmado" | "Aguardando";
};

export const todayAppointments: Appointment[] = [
  { id: 1, time: "09:00", pet: "Luna", tutor: "Mariana Almeida", service: "Consulta dermatológica", status: "Confirmado" },
  { id: 2, time: "10:30", pet: "Thor", tutor: "Rafael Santos", service: "Retorno", status: "Aguardando" },
  { id: 3, time: "13:30", pet: "Mel", tutor: "Fernanda Costa", service: "Consulta dermatológica", status: "Confirmado" },
  { id: 4, time: "15:00", pet: "Theo", tutor: "Juliana Lima", service: "Avaliação de alergia", status: "Confirmado" },
  { id: 5, time: "16:30", pet: "Amora", tutor: "Carlos Pereira", service: "Retorno", status: "Aguardando" },
];

export const clients = [
  { id: 1, tutor: "Mariana Almeida", initials: "MA", pet: "Luna", species: "Cachorro", last: "20 ago 2026", next: "3 set 2026", status: "Com retorno", note: "Dermatite alérgica em acompanhamento." },
  { id: 2, tutor: "Rafael Santos", initials: "RS", pet: "Thor", species: "Gato", last: "15 ago 2026", next: "29 ago 2026", status: "Pendente", note: "Retorno para avaliação da pelagem." },
  { id: 3, tutor: "Carla Oliveira", initials: "CO", pet: "Mia", species: "Gato", last: "18 ago 2026", next: "2 set 2026", status: "Com retorno", note: "Acompanhamento preventivo." },
  { id: 4, tutor: "Fernanda Costa", initials: "FC", pet: "Mel", species: "Cachorro", last: "10 ago 2026", next: "—", status: "Novo", note: "Primeiro atendimento realizado." },
  { id: 5, tutor: "Juliana Lima", initials: "JL", pet: "Theo", species: "Cachorro", last: "14 ago 2026", next: "28 ago 2026", status: "Pendente", note: "Avaliação de alergia alimentar." },
  { id: 6, tutor: "Carlos Pereira", initials: "CP", pet: "Amora", species: "Gato", last: "12 ago 2026", next: "—", status: "Novo", note: "Sem observações pendentes." },
];

export const professionalServices = [
  { id: 1, title: "Consulta dermatológica", description: "Avaliação completa da pele e pelagem.", duration: "60 min", price: "R$ 150", category: "Consultas", icon: "stethoscope" },
  { id: 2, title: "Consulta veterinária", description: "Consulta clínica geral e orientação preventiva.", duration: "45 min", price: "R$ 120", category: "Consultas", icon: "stethoscope" },
  { id: 3, title: "Retorno dermatológico", description: "Reavaliação do tratamento e evolução do pet.", duration: "30 min", price: "R$ 80", category: "Retornos", icon: "history" },
  { id: 4, title: "Aplicação de medicamento", description: "Aplicação segura conforme prescrição médica.", duration: "20 min", price: "R$ 60", category: "Procedimentos", icon: "syringe" },
];

export const reviews = [
  { id: 1, tutor: "Juliana Lima", pet: "Mel", initials: "JL", service: "Consulta dermatológica", date: "23 mai 2026", rating: 5, comment: "Atendimento cuidadoso e muito atencioso.", replied: true },
  { id: 2, tutor: "Ricardo Souza", pet: "Thor", initials: "RS", service: "Retorno", date: "22 mai 2026", rating: 5, comment: "Explicou tudo com clareza e foi muito atencioso com o Thor.", replied: false },
  { id: 3, tutor: "Mariana Almeida", pet: "Luna", initials: "MA", service: "Consulta dermatológica", date: "18 mai 2026", rating: 5, comment: "A Luna ficou tranquila e o tratamento trouxe resultado rápido.", replied: false },
];

export const nearbyProfessionals = [
  { name: "Dra. Marina Souza", initials: "MS", role: "Veterinária", rating: "4,9", place: "Pituba", price: "R$ 120", tone: "rose" as const },
  { name: "Estética Pet Bella", initials: "PB", role: "Banho & Tosa", rating: "4,8", place: "Itaigara", price: "R$ 80", tone: "gold" as const },
  { name: "Pet Care Salvador", initials: "PC", role: "Pet sitter", rating: "4,9", place: "Graça", price: "R$ 65", tone: "teal" as const },
];

