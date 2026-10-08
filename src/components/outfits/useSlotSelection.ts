type UseSlotSelectionOptions = {
  selectedIds: string[];
  multiple: boolean;
  onChange: (ids: string[]) => void;
};

// Lógica de selección de un espacio del outfit:
// - Selección única (cabeza, piernas, pies): tocar elige la prenda o la quita.
// - Selección múltiple (torso): las prendas se apilan en el orden en que se tocan.
export function useSlotSelection({ selectedIds, multiple, onChange }: UseSlotSelectionOptions) {
  const isSelected = (id: string) => selectedIds.includes(id);

  // Posición de la capa empezando en 1 (0 si la prenda no está seleccionada).
  const orderOf = (id: string) => selectedIds.indexOf(id) + 1;

  const toggle = (id: string) => {
    if (multiple) {
      onChange(isSelected(id) ? selectedIds.filter((existing) => existing !== id) : [...selectedIds, id]);
    } else {
      onChange(isSelected(id) ? [] : [id]);
    }
  };

  return { isSelected, orderOf, toggle };
}