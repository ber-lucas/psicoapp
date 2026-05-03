import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina condicionalmente classes Tailwind CSS e resolve possíveis conflitos.
 * Utiliza o `clsx` para classes condicionais e o `tailwind-merge` para lidar com as precedências do Tailwind.
 * 
 * @param inputs - Um array ou conjunto de valores de classe a serem combinados.
 * @returns Uma string limpa com as classes Tailwind fundidas e sem conflitos.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
