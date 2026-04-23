import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  getAppState,
  limparReservasApi,
  reservarItem,
  formatNumberToBRL,
} from '../services/api';

const AppDataContext = createContext({});

export function AppDataProvider({ children }) {
  const [reservas, setReservas] = useState([]);
  const [balance, setBalance] = useState(50);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    loadAppData();
  }, []);

  async function loadAppData() {
    try {
      const data = await getAppState();
      setReservas(data.reservas || []);
      setBalance(data.balance ?? 50);
    } catch (error) {
      console.log('Erro ao carregar dados do app:', error);
    } finally {
      setLoadingData(false);
    }
  }

  async function adicionarReserva(item, quantity) {
    const result = await reservarItem(item, quantity);

    if (result.success) {
      setReservas(result.appState.reservas);
      setBalance(result.appState.balance);
    }

    return result;
  }

  async function limparReservas() {
    const result = await limparReservasApi();

    if (result.success) {
      setReservas(result.appState.reservas);
      setBalance(result.appState.balance);
    }

    return result;
  }

  return (
    <AppDataContext.Provider
      value={{
        reservas,
        balance,
        balanceFormatted: formatNumberToBRL(balance),
        loadingData,
        adicionarReserva,
        limparReservas,
        recarregarDados: loadAppData,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  return useContext(AppDataContext);
}