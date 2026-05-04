"use client";

import { useMemo, useState } from "react";

import { PatientCard } from "./PatientCard";
import { PatientDetailDialog } from "./PatientDetailDialog";
import type { PatientWithLatestLog } from "@/lib/actions/emotion";

/**
 * Wrapper cliente que renderiza o grid de `PatientCard` e mantém o
 * estado de qual paciente está aberto no `PatientDetailDialog`.
 *
 * Centraliza o estado aqui para evitar prop drilling — cada `PatientCard`
 * recebe apenas o callback de abertura.
 *
 * @param patients - Pacientes vinculados com último log embutido.
 */
export function PatientGrid({
  patients,
}: {
  patients: PatientWithLatestLog[];
}) {
  const [openId, setOpenId] = useState<string | null>(null);

  const patientById = useMemo(
    () => new Map(patients.map((p) => [p.id, p])),
    [patients],
  );

  const openPatient = openId ? (patientById.get(openId) ?? null) : null;

  if (patients.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <p className="font-heading text-lg font-semibold text-foreground">
          Nenhum paciente vinculado ainda
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Compartilhe seu código de convite (no Dashboard) para que pacientes
          possam se cadastrar e aparecer aqui.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            onOpen={setOpenId}
          />
        ))}
      </div>

      <PatientDetailDialog
        patient={openPatient}
        onClose={() => setOpenId(null)}
      />
    </>
  );
}
