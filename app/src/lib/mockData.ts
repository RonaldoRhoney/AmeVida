export type HealthUnitStatus = "verificado" | "pendente";

export interface HealthUnit {
  id: string;
  nome: string;
  endereco: string;
  status: HealthUnitStatus;
  familiasAdesao?: number;
  maisProxima?: boolean;
}

export const healthUnits: HealthUnit[] = [
  {
    id: "ubs-guama",
    nome: "UBS Guamá",
    endereco: "Trav. Vileta, 890 — a 12 min andando de onde você mora",
    status: "verificado",
    familiasAdesao: 127,
    maisProxima: true,
  },
  {
    id: "ubs-terra-firme",
    nome: "UBS Terra Firme",
    endereco: "Passagem São José, s/n — endereço importado do CNES, ainda sem confirmação da equipe AmaVida",
    status: "pendente",
  },
];

export const municipalProgram = {
  nome: "Mexa-se pela Vida",
  descricao: "Atividade física em grupo, terças e quintas, 7h — mesma UBS.",
};

export const activeReferral = {
  tipo: "Avaliação Multidimensional da Pessoa Idosa — Funpapa",
  texto: "Sua UBS já fez o encaminhamento.",
};

export interface CaregiverLogEntry {
  hora: string;
  texto: string;
}

export const caregiverLog: CaregiverLogEntry[] = [
  { hora: "9:12", texto: "Check-in diário confirmado por Seu Antônio." },
  { hora: "8:05", texto: "Losartana (8h) confirmada." },
  { hora: "ontem", texto: "UBS Guamá registrou encaminhamento para avaliação multidimensional." },
];

export const defaultCaregiverName = "Marta";
