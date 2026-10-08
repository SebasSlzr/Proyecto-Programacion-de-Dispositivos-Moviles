import { useState } from 'react';
import type { OutfitInput } from '@/api/outfits';
import type { OutfitSlotKey } from '@/constants/outfits';

// Cada espacio guarda una lista de ids: cabeza, piernas y pies tienen 0 o 1; torso puede tener varios.
export type SlotsState = Record<OutfitSlotKey, string[]>;

function toSlotsState(values?: OutfitInput): SlotsState {
  return {
    head: values?.head ? [values.head] : [],
    torso: values?.torso ?? [],
    legs: values?.legs ? [values.legs] : [],
    feet: values?.feet ? [values.feet] : [],
  };
}

// Calcula solo los campos que cambiaron respecto al outfit original.
function getChanges(current: OutfitInput, initial: OutfitInput): Partial<OutfitInput> {
  const changes: Partial<OutfitInput> = {};
  if (current.name !== initial.name) changes.name = current.name;
  if (current.head !== initial.head) changes.head = current.head;
  if (current.legs !== initial.legs) changes.legs = current.legs;
  if (current.feet !== initial.feet) changes.feet = current.feet;
  if (JSON.stringify(current.torso) !== JSON.stringify(initial.torso)) changes.torso = current.torso;
  return changes;
}

type UseOutfitFormOptions = {
  initialValues?: OutfitInput;
  onSubmit: (values: Partial<OutfitInput>) => Promise<void>;
};

// Estado, validación y envío del formulario de outfits (crear y editar).
export function useOutfitForm({ initialValues, onSubmit }: UseOutfitFormOptions) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [slots, setSlots] = useState<SlotsState>(() => toSlotsState(initialValues));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setSlot = (key: OutfitSlotKey, ids: string[]) => {
    setSlots((prev) => ({ ...prev, [key]: ids }));
  };

  const submit = async () => {
    if (!name.trim()) {
      setError('El outfit necesita un nombre');
      return;
    }
    setError(null);

    const current: OutfitInput = {
      name: name.trim(),
      head: slots.head[0] ?? null,
      torso: slots.torso,
      legs: slots.legs[0] ?? null,
      feet: slots.feet[0] ?? null,
    };

    const payload = initialValues ? getChanges(current, initialValues) : current;
    if (Object.keys(payload).length === 0) {
      setError('No hiciste ningún cambio');
      return;
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

  return { name, setName, slots, setSlot, submit, isSubmitting, error };
}