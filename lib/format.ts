import type { TipoPrestador } from "./types";

export const prestadorTypeLabels: Record<TipoPrestador, string> = {
  CLINICA_VETERINARIA: "Clínica veterinária",
  VETERINARIO: "Médico-veterinário",
  PETSHOP: "Pet Shop",
  PASSEADOR: "Passeador",
  CRECHE_PET: "Hospedagem",
  BANHO_E_TOSA: "Banho e Tosa",
  PET_SITTER: "Pet sitter",
};

export function formatPrestadorType(type?: TipoPrestador | string | null): string {
  if (!type) return "";
  return prestadorTypeLabels[type as TipoPrestador] ?? type;
}
