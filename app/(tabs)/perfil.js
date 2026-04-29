import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Image } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';
import EmptyState from '../../components/EmptyState';

export default function Perfil() {
  const { user, logout } = useAuth();
  const { reservas, limparReservas, confirmarCompra } = useAppData();
  const { theme, isDark, toggleTheme } = useTheme();

  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');

  const reservasPendentes = reservas.filter((item) => item.status === 'Pendente').length;
  const reservasConfirmadas = reservas.filter((item) => item.status === 'Confirmado').length;

  async function handleLogout() {
    await logout();
    router.replace('/login');
  }

  async function handleLimparReservas() {
    const result = await limparReservas();

    if (result.success) {
      setFeedbackType('success');
      setFeedback('Reservas limpas com sucesso.');
    } else {
      setFeedbackType('error');
      setFeedback('Erro ao limpar reservas.');
    }

    setTimeout(() => setFeedback(''), 2500);
  }

  async function handleConfirmarCompra(reservaId) {
    const result = await confirmarCompra(reservaId);

    if (result.success) {
      setFeedbackType('success');
      setFeedback(result.message);
    } else {
      setFeedbackType('error');
      setFeedback(result.message);
    }

    setTimeout(() => setFeedback(''), 2500);
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View style={styles.avatar}>
  <Image
    source={require('../../assets/avatar.webp')}
    style={styles.avatarImage}
  />
</View>

        <Text style={[styles.name, { color: theme.text }]}>
          {user?.nome || 'Aluno'}
        </Text>

        <Text style={[styles.email, { color: theme.textLight }]}>
          {user?.email || 'E-mail não informado'}
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statNumber, { color: theme.text }]}>{reservas.length}</Text>
          <Text style={[styles.statLabel, { color: theme.textLight }]}>Reservas</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statNumber, { color: theme.primary }]}>{reservasPendentes}</Text>
          <Text style={[styles.statLabel, { color: theme.textLight }]}>Pendentes</Text>
        </View>

        <View style={[styles.statBox, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[styles.statNumber, { color: theme.success }]}>{reservasConfirmadas}</Text>
          <Text style={[styles.statLabel, { color: theme.textLight }]}>Confirmadas</Text>
        </View>
      </View>

      <View style={[styles.preferenceCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <View style={styles.preferenceLeft}>
          <View style={[styles.preferenceIcon, { backgroundColor: theme.cardSoft }]}>
            <Ionicons
              name={isDark ? 'moon' : 'sunny'}
              size={22}
              color={theme.primary}
            />
          </View>

          <View>
            <Text style={[styles.preferenceTitle, { color: theme.text }]}>
              Aparência
            </Text>
            <Text style={[styles.preferenceText, { color: theme.textLight }]}>
              {isDark ? 'Modo escuro ativado' : 'Modo claro ativado'}
            </Text>
          </View>
        </View>

        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          trackColor={{ false: '#CCC', true: theme.primary }}
          thumbColor="#fff"
        />
      </View>

      {!!feedback && (
        <View
          style={[
            styles.feedbackBox,
            {
              backgroundColor:
                feedbackType === 'success' ? theme.successBg : theme.errorBg,
            },
          ]}
        >
          <Text
            style={[
              styles.feedbackText,
              {
                color: feedbackType === 'success' ? theme.success : theme.error,
              },
            ]}
          >
            {feedback}
          </Text>
        </View>
      )}

      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Minhas reservas
        </Text>

        {reservas.length > 0 && (
          <TouchableOpacity onPress={handleLimparReservas}>
            <Text style={[styles.clearText, { color: theme.primary }]}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

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
            <View
              key={reserva.id}
              style={[
                styles.reservaCard,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.reservaTop}>
                <View style={styles.reservaTitleArea}>
                  <Text style={[styles.reservaNome, { color: theme.text }]}>
                    {reserva.nome}
                  </Text>

                  <Text style={[styles.reservaInfo, { color: theme.textLight }]}>
                    {reserva.quantidade}x • Unitário: {reserva.precoUnitario}
                  </Text>
                </View>

                <Text style={[styles.reservaTotal, { color: theme.primary }]}>
                  {reserva.total}
                </Text>
              </View>

              <Text style={[styles.reservaData, { color: theme.textLight }]}>
                Reservado em: {reserva.data}
              </Text>

              {reserva.status === 'Confirmado' && (
                <Text style={[styles.reservaData, { color: theme.textLight }]}>
                  Confirmado em: {reserva.confirmadoEm || 'Não informado'}
                </Text>
              )}

              <View style={styles.reservaFooter}>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        reserva.status === 'Confirmado'
                          ? theme.successBg
                          : theme.errorBg,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color:
                          reserva.status === 'Confirmado'
                            ? theme.success
                            : theme.error,
                      },
                    ]}
                  >
                    {reserva.status}
                  </Text>
                </View>

                {reserva.status === 'Pendente' && (
                  <TouchableOpacity
                    style={[styles.confirmBtn, { backgroundColor: theme.primary }]}
                    onPress={() => handleConfirmarCompra(reserva.id)}
                  >
                    <Text style={styles.confirmBtnText}>Confirmar compra</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))
      )}

      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color={theme.error} />
        <Text style={[styles.logoutText, { color: theme.error }]}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 22,
    paddingBottom: 40,
  },

  header: {
    marginTop: 35,
    alignItems: 'center',
    marginBottom: 24,
  },

  avatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    overflow: 'hidden',
  },

  avatarImage: {
    width: '100%',
  height: '100%',
  },

  name: {
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
  },

  email: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 18,
  },

  statBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '900',
  },

  statLabel: {
    fontSize: 12,
    marginTop: 3,
  },

  preferenceCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },

  preferenceIcon: {
    width: 46,
    height: 46,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  preferenceTitle: {
    fontSize: 16,
    fontWeight: '900',
  },

  preferenceText: {
    marginTop: 3,
    fontSize: 13,
  },

  feedbackBox: {
    padding: 14,
    borderRadius: 14,
    marginBottom: 18,
  },

  feedbackText: {
    fontWeight: '800',
  },

  sectionHeader: {
    marginTop: 6,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
  },

  clearText: {
    fontWeight: '800',
  },

  reservaCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },

  reservaTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },

  reservaTitleArea: {
    flex: 1,
  },

  reservaNome: {
    fontSize: 16,
    fontWeight: '900',
  },

  reservaInfo: {
    marginTop: 5,
    fontSize: 13,
  },

  reservaTotal: {
    fontSize: 16,
    fontWeight: '900',
  },

  reservaData: {
    marginTop: 8,
    fontSize: 12,
  },

  reservaFooter: {
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },

  statusBadge: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 999,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '900',
  },

  confirmBtn: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 999,
  },

  confirmBtnText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 12,
  },

  logoutBtn: {
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
  },

  logoutText: {
    fontWeight: '900',
    fontSize: 15,
  },
});