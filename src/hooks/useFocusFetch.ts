import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router/react-navigation';

// Patrón que se repetía en las listas: cargar datos cada vez que la pantalla
// vuelve a estar visible, con estados de carga, refresco y error.
//
// IMPORTANTE: `fetcher` debe ser una función estable (declarada fuera del
// componente). Si se crea una nueva en cada render, la pantalla recargaría
// en bucle.
export function useFocusFetch<T>(fetcher: () => Promise<T>, initialData: T) {
  const [data, setData] = useState<T>(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setData(await fetcher());
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }, [fetcher]);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      load().finally(() => setIsLoading(false));
    }, [load])
  );

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await load();
    setIsRefreshing(false);
  }, [load]);

  return { data, isLoading, isRefreshing, error, onRefresh };
}