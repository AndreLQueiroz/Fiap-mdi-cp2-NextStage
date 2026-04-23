import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';
import EmptyState from '../../components/EmptyState';

export default function Perfil() {
  const { user, logout } = useAuth();
  const { reservas, balanceFormatted, limparReservas } = useAppData();
  const { theme, isDark, toggleTheme } = useTheme();

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  async function handleLimparReservas() {
    await limparReservas();
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <View style={[styles.cartao, { backgroundColor: theme.primary }]}>
        <Text style={styles.cartaoLabel}>Saldo na Cantina</Text>
        <Text style={styles.cartaoValor}>{balanceFormatted}</Text>
        <View style={styles.cartaoFooter}>
          <Text style={styles.cartaoUser}>{user?.nome?.toUpperCase() || 'ALUNO'}</Text>
          <Text style={styles.cartaoChip}>FIAP Card</Text>
        </View>
      </View>

      <View style={[styles.listaInfo, { backgroundColor: theme.card }]}>
        <View style={styles.itemInfo}>
          <Text style={[styles.label, { color: theme.textLight }]}>Nome</Text>
          <Text style={[styles.valor, { color: theme.text }]}>{user?.nome || 'Não informado'}</Text>
        </View>

        <View style={styles.itemInfo}>
          <Text style={[styles.label, { color: theme.textLight }]}>E-mail</Text>
          <Text style={[styles.valor, { color: theme.text }]}>{user?.email || 'Não informado'}</Text>
        </View>

        <View style={styles.itemInfo}>
          <Text style={[styles.label, { color: theme.textLight }]}>Reservas realizadas</Text>
          <Text style={[styles.valor, { color: theme.text }]}>{reservas.length}</Text>
        </View>
      </View>

      <View style={[styles.themeBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.themeTitle, { color: theme.text }]}>
          {isDark ? 'Modo escuro ativado' : 'Modo claro ativado'}
        </Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#CCC', true: theme.primary }}
          thumbColor="#fff"
        />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Histórico de reservas</Text>

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
            <View key={reserva.id} style={[styles.reservaCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={styles.reservaHeader}>
                <Text style={[styles.reservaNome, { color: theme.text }]}>{reserva.nome}</Text>
                <Text style={[styles.reservaTotal, { color: theme.primary }]}>{reserva.total}</Text>
              </View>

              <Text style={[styles.reservaInfo, { color: theme.textLight }]}>
                Quantidade: {reserva.quantidade} • Unitário: {reserva.precoUnitario}
              </Text>

              <Text style={[styles.reservaData, { color: theme.textLight }]}>{reserva.data}</Text>
            </View>
          ))
      )}

      {reservas.length > 0 && (
        <TouchableOpacity
          style={[styles.clearBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={handleLimparReservas}
        >
          <Text style={[styles.clearBtnText, { color: theme.text }]}>
            Limpar reservas e restaurar saldo
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: theme.secondary }]} onPress={handleLogout}>
        <Text style={[styles.logoutText, { color: theme.buttonTextOnSecondary }]}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 25, paddingBottom: 40 },
  cartao: {
    width: '100%',
    height: 200,
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
  listaInfo: { width: '100%', marginTop: 30, borderRadius: 18, paddingHorizontal: 16 },
  itemInfo: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  label: { fontSize: 12, textTransform: 'uppercase', marginBottom: 4 },
  valor: { fontSize: 16, fontWeight: '500' },
  themeBox: {
    marginTop: 18,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  themeTitle: {
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    paddingRight: 10,
  },
  sectionTitle: { marginTop: 30, marginBottom: 14, fontSize: 18, fontWeight: '700' },
  reservaCard: { borderWidth: 1, borderRadius: 14, padding: 14, marginBottom: 10 },
  reservaHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  reservaNome: { flex: 1, fontSize: 16, fontWeight: '700' },
  reservaTotal: { fontWeight: '800' },
  reservaInfo: { marginTop: 6, fontSize: 13 },
  reservaData: { marginTop: 6, fontSize: 12 },
  clearBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  clearBtnText: {
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  logoutBtn: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    fontWeight: '700',
    fontSize: 16,
  },
});