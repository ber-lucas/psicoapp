"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { SmilePlus, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EMOTIONS, type Emotion } from "@/lib/emotions";
import { createEmotionLog } from "@/lib/actions/emotion";

/**
 * Formulário interativo para o paciente registrar uma emoção do dia.
 *
 * Componente de cliente porque depende de estado controlado (Select + Textarea),
 * `useTransition` para indicar pendência da Server Action e `toast` para feedback.
 * O Select valida no cliente que apenas emoções da lista oficial podem ser submetidas;
 * a Server Action revalida no servidor para defesa em profundidade.
 *
 * @returns Card com Select de emoções, Textarea para anotações e botão de submissão.
 */
export function EmotionLogForm() {
  const [emotion, setEmotion] = useState<Emotion | "">("");
  const [notes, setNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emotion) {
      toast.error("Selecione um sentimento antes de salvar.");
      return;
    }

    startTransition(async () => {
      try {
        await createEmotionLog(emotion, notes);
        toast.success("Registro salvo com sucesso!");
        setEmotion("");
        setNotes("");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erro inesperado.";
        toast.error("Não foi possível salvar o registro.", {
          description: message,
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="emotion">Sentimento Principal</Label>
        <Select
          value={emotion}
          onValueChange={(value) => setEmotion(value as Emotion)}
        >
          <SelectTrigger id="emotion" className="w-full">
            <SelectValue placeholder="Como você está se sentindo?" />
          </SelectTrigger>
          <SelectContent>
            {EMOTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Anotações (opcional)</Label>
        <Textarea
          id="notes"
          className="min-h-[100px]"
          placeholder="Escreva um pouco sobre o porquê, gatilhos ou contexto..."
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          disabled={isPending}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <SmilePlus className="mr-2 h-4 w-4" />
        )}
        {isPending ? "Salvando..." : "Salvar Registro"}
      </Button>
    </form>
  );
}
