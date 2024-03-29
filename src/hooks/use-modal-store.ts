import { create } from 'zustand';

import { WaitListStudent } from '@/services/api/class/type';

import {
  Aluno,
  AlunoTurma,
  ClassType,
  Pagamento,
  Payment,
  Presence,
  Professor,
  Student,
  Teacher,
} from '@/utils/types';

export type ModalType =
  | 'addAluno'
  | 'addAlunos'
  | 'editAluno'
  | 'excluirAluno'
  | 'addTurma'
  | 'editTurma'
  | 'excluirTurma'
  | 'excluirAlunoTurma'
  | 'listaEspera'
  | 'addProfessor'
  | 'editProfessor'
  | 'excluirProfessor'
  | 'logout'
  | 'historicoAlunoTurma'
  | 'pagamentoAluno'
  | 'excluirPagamentoAluno'
  | 'excluirAlunoListaEspera'
  | 'addAlunoTurma';

interface ModalData {
  student?: Student;
  payment?: Payment;
  teacher?: Teacher;
  turma?: ClassType;
  presences?: Presence[];
  alunoEspera?: WaitListStudent;
  aluno?: AlunoTurma;
  alunoNormal?: Aluno;
  professor?: Professor;
  pagamento?: Pagamento;
}
interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false }),
}));
