/**
 * Grid responsivo que envolve um conjunto de `MetricCard`s.
 *
 * Empilha em mobile, vira 2x2 em tablet e linha de 4 em desktop largo.
 * Mantido como wrapper simples para padronizar o gap e espaçamento
 * entre os dashboards do psicólogo e do paciente.
 */
export function MetricGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {children}
    </div>
  );
}
