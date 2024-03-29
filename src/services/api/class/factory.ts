import { supabase } from '@/lib';

import * as Class from './type';

function ClassFactory() {
  return {
    async create(data: Class.Insert) {
      const result = await supabase
        .from('turmas')
        .insert({
          horario: data.horario,
          id_professor: data.id_professor,
          unidade: data.unidade,
          nome: data.nome,
        })
        .select();

      return result;
    },
    async edit(turmaId: string, data: Class.Update) {
      return await supabase.from('turmas').update(data).eq('id', turmaId);
    },
    async delete(id: string) {
      return await supabase.from('turmas').delete().eq('id', id);
    },
    async listPresences(id: string, studentId: string) {
      return await supabase
        .from('presenca_alunos')
        .select('*')
        .eq('id_aluno', studentId)
        .eq('id_turma', id)
        .order('data_aula', { ascending: false });
    },
    async get(id: string) {
      const { data: listaEspera, error: listaEsperaError } = await this.listWaitList(id);
      const { data, error } = await supabase
        .from('turmas')
        .select(
          `id, unidade, horario, nome, presenca:presenca_alunos(aluno:alunos(nome, id), data:data_aula, estaPresente:esta_presente), alunosTurmas:alunos_turmas(alunos(nome, id))`,
        )
        .eq('id', id)
        .order('data_aula', {
          ascending: false,
          foreignTable: 'presenca_alunos',
        });
      const presencas = data![0].presenca.reduce(
        (presences, item) => {
          const alunoId = item.aluno?.id;
          const existingPresence = presences.find((p) => p.aluno.id === alunoId);
          if (existingPresence) {
            existingPresence.presencas.push({
              data: item.data,
              estaPresente: item.estaPresente,
            });
          } else {
            const presenca = {
              aluno: item.aluno,
              presencas: [{ data: item.data, estaPresente: item.estaPresente }],
            };
            presences.push(presenca);
          }

          return presences;
        },
        [] as { aluno: any; presencas: { data: any; estaPresente: any }[] }[],
      );
      const turma = {
        id: data![0].id,
        unidade: data![0].unidade,
        horario: data![0].horario,
        nome: data![0].nome,
        presencas: presencas,
        listaEspera: listaEspera,
        alunosTurmas: data![0].alunosTurmas.map((item) => {
          return {
            id: item.alunos!.id,
            nome: item.alunos!.nome,
            presenca: presencas.find((p) => {
              return p.aluno.id === item.alunos!.id;
            }),
          };
        }),
      };

      return { turma, error };
    },
    async addStudent(id: string, studentId: string) {
      const verifyIfStudentIsAlreadyInClass = await supabase
        .from('alunos_turmas')
        .select()
        .eq('id_aluno', studentId)
        .eq('id_turma', id);
      if (verifyIfStudentIsAlreadyInClass?.data!.length > 0)
        throw new Error('Aluno já está cadastrado na turma');
      const result = await supabase.from('alunos_turmas').insert({
        id_aluno: studentId,
        id_turma: id,
      });

      return result;
    },
    async addStudentWaitList(data: Class.WaitListStudent) {
      return await supabase.from('turma_lista_de_espera').insert({
        id_turma: data.id_turma,
        nome: data.nome,
        telefone: data.telefone,
        email: data.email,
        cpf: data.cpf,
      });
    },
    async deleteStudentWaitList(id: string) {
      return await supabase.from('turma_lista_de_espera').delete().eq('id', id);
    },
    async listWaitList(id: string) {
      return await supabase.from('turma_lista_de_espera').select('*').eq('id_turma', id);
    },
    async handleStudentPresence(id: string, studentId: string) {
      const alreadyHavePresence = await supabase
        .from('presenca_alunos')
        .select()
        .eq('id_aluno', studentId)
        .eq('id_turma', id)
        .eq('data_aula', new Date().toDateString());
      if (alreadyHavePresence.data?.length! > 0)
        return await supabase
          .from('presenca_alunos')
          .update({
            esta_presente: !alreadyHavePresence.data![0].esta_presente,
          })
          .eq('id', alreadyHavePresence.data![0].id);
      const result = await supabase.from('presenca_alunos').insert({
        data_aula: new Date().toDateString(),
        esta_presente: true,
        id_aluno: studentId,
        id_turma: id,
      });

      return result;
    },
    async deleteStudent(id: string, studentId: string) {
      const result = await supabase
        .from('alunos_turmas')
        .delete()
        .eq('id_aluno', studentId)
        .eq('id_turma', id);
      await supabase.from('presenca_alunos').delete().eq('id_aluno', studentId).eq('id_turma', id);

      return result;
    },
    async list() {
      const result = await supabase
        .from('turmas')
        .select(
          `id, unidade, horario, nome, alunosTurmas:alunos_turmas(alunos(*)), professor:perfis(*)`,
        );

      return result;
    },
  };
}

export const classService = ClassFactory();
