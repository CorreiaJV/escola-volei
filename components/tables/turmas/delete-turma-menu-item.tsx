"use client";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";
import { Trash2Icon } from "lucide-react";

export const ExcluirTurmaMenuItem = () => {
  const { onOpen } = useModal();
  return (
    <DropdownMenuItem
      onClick={() => {
        onOpen("excluirTurma");
      }}
      className="gap-2 text-red-500"
    >
      Excluir <Trash2Icon className="h-4 w-4" />
    </DropdownMenuItem>
  );
};
