'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Payment, Student } from '@/utils/types';
import { EditAlunoMenuItem } from './edit-aluno-menu-item';
import { ExcluirAlunoMenuItem } from './delete-aluno-menu-item';
import { PagamentoAlunoButton } from './pagamentos-aluno-menu-item';

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: 'nome',
    header: 'Nome',
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'telefone',
    header: 'Telefone',
  },
  {
    accessorKey: 'cpf',
    header: 'CPF',
  },
  {
    accessorKey: 'responsavel',
    header: 'Responsável',
    cell: ({ row }) => {
      const responsavel = row.getValue('responsavel');
      return <>{responsavel !== null ? 'Possui' : 'Não Possuí'}</>;
    },
  },
  {
    accessorKey: 'plano',
    header: 'Plano',
    cell: ({ row }) => {
      const plano: string = row.getValue('plano');
      return <>{plano.charAt(0).toUpperCase() + plano.slice(1)}</>;
    },
  },
  {
    accessorKey: 'pagamentos',
    header: 'Pagamento',
    cell: ({ row }) => {
      const payment: Payment[] = row.getValue('pagamentos');
      const aluno = row.original;

      return <PagamentoAlunoButton pagamento={payment} student={aluno} />;
    },
  },
  {
    id: 'ações',
    accessorKey: 'Ações',
    header: 'Ações',
    cell: ({ row }) => {
      const aluno = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Ações</DropdownMenuLabel>
            <EditAlunoMenuItem student={aluno} />
            <DropdownMenuSeparator />
            <ExcluirAlunoMenuItem student={aluno} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
