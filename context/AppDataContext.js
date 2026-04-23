import React, { createContext, useContext, useEffect, useState } from 'react';
import { getData, saveData } from '../services/storage';

const AppDataContext = createContext({});

const RESERVAS_KEY = '@cantina_reservas';

export function AppDataProvider({ children }) {
  const [reservas, setReservas] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadReservas();
  }, []);

  async function loadReservas() {
    try {
      const data = await getData(RESERVAS_KEY);
      setReservas(data || []);
    } catch (error) {
      console.log('Erro ao carregar reservas:', error);
    } finally {
      setLoadingData(false);
    }
  }

  async function adicionarReserva(item) {
    const novaReserva = {
      id: Date.now().toString(),
      nome: item.nome,
      preco: item.preco,
      data: new Date().toLocaleString(),
    };

    const updated = [...reservas, novaReserva];
    setReservas(updated);
    await saveData(RESERVAS_KEY, updated);
    return novaReserva;
  }

  async function limparReservas() {
    setReservas([]);
    await saveData(RESERVAS_KEY, []);
  }

  return (
    <AppDataContext.Provider
      value={{
        reservas,
        loadingData,
        adicionarReserva,
        limparReservas,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}