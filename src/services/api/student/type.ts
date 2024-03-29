import { Database } from '../../../lib/database.types';

type HasResponsable = Database['public']['Tables']['alunos']['Insert'] & {
  tem_responsavel: true;
  id_responsavel: string;
  responsavel: Database['public']['Tables']['responsaveis']['Insert'];
};

type NoResponsable = Database['public']['Tables']['alunos']['Insert'] & {
  tem_responsavel: false;
};

export type Insert = HasResponsable | NoResponsable;

export type Update = Database['public']['Tables']['alunos']['Update'];
export type Responsable = Database['public']['Tables']['responsaveis']['Update'];
export type Payment = {
  datePagamento: Date;
  valor: number;
  plano: 'mensal' | 'trimestral' | 'semestral' | 'anual';
};
