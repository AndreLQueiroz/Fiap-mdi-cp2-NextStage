import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { COLORS } from '../../constants/colors';
import EmptyState from '../../components/EmptyState';

export default function Perfil() {
  const { user, logout } = useAuth();
  const { reservas, balanceFormatted, limparReservas } = useAppData();

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  async function handleLimparReservas() {
    await limparReservas();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.cartao}>
        <Text style={styles.cartaoLabel}>Saldo na Cantina</Text>
        <Text style={styles.cartaoValor}>{balanceFormatted}</Text>
        <View style={styles.cartaoFooter}>
          <Text style={styles.cartaoUser}>{user?.nome?.toUpperCase() || 'ALUNO'}</Text>
          <Text style={styles.cartaoChip}>FIAP Card</Text>
        </View>
      </View>

      <View style={styles.listaInfo}>
        <View style={styles.itemInfo}>
          <Text style={styles.label}>Nome</Text>
          <Text style={styles.valor}>{user?.nome || 'Não informado'}</Text>
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.label}>E-mail</Text>
          <Text style={styles.valor}>{user?.email || 'Não informado'}</Text>
        </View>

        <View style={styles.itemInfo}>
          <Text style={styles.label}>Reservas realizadas</Text>
          <Text style={styles.valor}>{reservas.length}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Histórico de reservas</Text>

      {reservas.length === 0 ? (
        <EmptyState
          title="Nenhuma reserva ainda"
          message="Assim que você reservar itens do cardápio, eles aparecerão aqui."
        />
      ) : (
        reservas
          .slice()
          .reverse()
          .map((reserva) => (
            <View key={reserva.id} style={styles.reservaCard}>
              <View style={styles.reservaHeader}>
                <Text style={styles.reservaNome}>{reserva.nome}</Text>
                <Text style={styles.reservaTotal}>{reserva.total}</Text>
              </View>

              <Text style={styles.reservaInfo}>
                Quantidade: {reserva.quantidade} • Unitário: {reserva.precoUnitario}
              </Text>

              <Text style={styles.reservaData}>{reserva.data}</Text>
            </View>
          ))
      )}

      {reservas.length > 0 && (
        <TouchableOpacity style={styles.clearBtn} onPress={handleLimparReservas}>
          <Text style={styles.clearBtnText}>Limpar reservas e restaurar saldo</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 25, paddingBottom: 40 },
  cartao: {
    width: '100%',
    height: 200,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    padding: 25,
    justifyContent: 'space-between',
    elevation: 12,
    marginTop: 20,
  },
  cartaoLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600' },
  cartaoValor: { color: '#fff', fontSize: 38, fontWeight: 'bold' },
  cartaoFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  cartaoUser: { color: '#fff', fontSize: 14, letterSpacing: 1 },
  cartaoChip: { color: '#fff', fontWeight: 'bold', fontSize: 12, opacity: 0.5 },
  listaInfo: {
    width: '100%',
    marginTop: 30,
    backgroundColor: '#FAFAFA',
    borderRadius: 18,
    paddingHorizontal: 16,
  },
  itemInfo: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  label: { fontSize: 12, color: '#999', textTransform: 'uppercase', marginBottom: 4 },
  valor: { fontSize: 16, color: '#333', fontWeight: '500' },
  sectionTitle: {
    marginTop: 30,
    marginBottom: 14,
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  reservaCard: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  reservaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  reservaNome: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
  reservaTotal: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  reservaInfo: {
    marginTop: 6,
    color: COLORS.textLight,
    fontSize: 13,
  },
  reservaData: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.textLight,
  },
  clearBtn: {
    marginTop: 12,
    backgroundColor: '#EEE',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearBtnText: {
    color: COLORS.text,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  logoutBtn: {
    marginTop: 16,
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});