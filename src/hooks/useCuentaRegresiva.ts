import { useCallback, useEffect, useState } from "react";

/**
 * Segundos que faltan para poder volver a intentarlo. 0 si no hay espera.
 * Cuenta contra la hora de fin: si la pestaña se duerme, no se atrasa.
 */
export function useCuentaRegresiva() {
  const [fin, setFin] = useState<number | null>(null);
  const [segundos, setSegundos] = useState(0);

  const empezar = useCallback((espera: number) => {
    setFin(Date.now() + espera * 1000);
    setSegundos(espera);
  }, []);

  useEffect(() => {
    if (fin === null) return;
    const reloj = setInterval(() => {
      const faltan = Math.max(0, Math.ceil((fin - Date.now()) / 1000));
      setSegundos(faltan);
      if (faltan === 0) setFin(null);
    }, 1000);
    return () => clearInterval(reloj);
  }, [fin]);

  return { segundos, empezar };
}
