import { useState } from 'react';
import type { GarmentInput } from '@/api/garments';
import { CATEGORIES, SWATCH_OPTIONS } from '@/constants/garments';

type UseGarmentFormOptions = {
  initialValues?: GarmentInput;
  onSubmit: (values: Partial<GarmentInput>) => Promise<void>;
};

// Toda la lógica del formulario de prendas: estado de los campos,
// validación y cálculo de lo que cambió. El componente solo dibuja.
export function useGarmentForm({ initialValues, onSubmit }: UseGarmentFormOptions) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [category, setCategory] = useState(initialValues?.category ?? CATEGORIES[0]);
  const [color, setColor] = useState(initialValues?.color ?? '');
  const [swatchColor, setSwatchColor] = useState(initialValues?.swatchColor ?? SWATCH_OPTIONS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!name.trim() || !color.trim()) {
      setError('El nombre y el color son obligatorios');
      return;
    }
    setError(null);

    const current: GarmentInput = { name: name.trim(), category, color: color.trim(), swatchColor };

    // En edición solo se manda lo que cambió; en creación se manda todo.
    let payload: Partial<GarmentInput> = current;
    if (initialValues) {
      payload = {};
      (Object.keys(current) as (keyof GarmentInput)[]).forEach((key) => {
        if (current[key] !== initialValues[key]) payload[key] = current[key];
      });

      if (Object.keys(payload).length === 0) {
        setError('No hiciste ningún cambio');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    setName,
    category,
    setCategory,
    color,
    setColor,
    swatchColor,
    setSwatchColor,
    submit,
    isSubmitting,
    error,
  };
}