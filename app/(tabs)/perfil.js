import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';
import EmptyState from '../../components/EmptyState';

export default function Perfil() {
  const { user, logout } = useAuth();
  const { reservas, balanceFormatted, limparReservas, confirmarCompra } = useAppData();
  const { theme, isDark, toggleTheme } = useTheme();

  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');

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
    >
      <View style={[styles.cartao, { backgroundColor: theme.primary }]}>
        <Text style={styles.cartaoLabel}>Saldo na Cantina</Text>
        <Text style={styles.cartaoValor}>{balanceFormatted}</Text>

        <View style={styles.cartaoFooter}>
          <Text style={styles.cartaoUser}>{user?.nome?.toUpperCase() || 'ALUNO'}</Text>
          <Text style={styles.cartaoChip}>FIAP Card</Text>
        </View>
      </View>

      <View
        style={[
          styles.themeBox,
          {
            backgroundColor: theme.card,
            borderColor: theme.border,
          },
        ]}
      >
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

      <View style={[styles.listaInfo, { backgroundColor: theme.card }]}>
        <View style={[styles.itemInfo, { borderBottomColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.textLight }]}>Nome</Text>
          <Text style={[styles.valor, { color: theme.text }]}>
            {user?.nome || 'Não informado'}
          </Text>
        </View>

        <View style={[styles.itemInfo, { borderBottomColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.textLight }]}>E-mail</Text>
          <Text style={[styles.valor, { color: theme.text }]}>
            {user?.email || 'Não informado'}
          </Text>
        </View>

        <View style={[styles.itemInfo, { borderBottomColor: theme.border }]}>
          <Text style={[styles.label, { color: theme.textLight }]}>Reservas realizadas</Text>
          <Text style={[styles.valor, { color: theme.text }]}>{reservas.length}</Text>
        </View>
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

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Histórico de reservas
      </Text>

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
              <View style={styles.reservaHeader}>
                <Text style={[styles.reservaNome, { color: theme.text }]}>
                  {reserva.nome}
                </Text>

                <Text style={[styles.reservaTotal, { color: theme.primary }]}>
                  {reserva.total}
                </Text>
              </View>

              <Text style={[styles.reservaInfo, { color: theme.textLight }]}>
                Quantidade: {reserva.quantidade} • Unitário: {reserva.precoUnitario}
              </Text>

              <Text style={[styles.reservaData, { color: theme.textLight }]}>
                Reservado em: {reserva.data}
              </Text>

              {reserva.status === 'Confirmado' && (
                <Text style={[styles.reservaData, { color: theme.textLight }]}>
                  Confirmado em: {reserva.confirmadoEm || 'Não informado'}
                </Text>
              )}

              {reserva.status === 'Pendente' && (
                <TouchableOpacity
                  style={[styles.confirmBtn, { backgroundColor: theme.primary }]}
                  onPress={() => handleConfirmarCompra(reserva.id)}
                >
                  <Text style={styles.confirmBtnText}>Confirmar compra</Text>
                </TouchableOpacity>
              )}

              {reserva.status === 'Confirmado' && (
                <View
                  style={[
                    styles.confirmadoBadge,
                    { backgroundColor: theme.successBg },
                  ]}
                >
                  <Text style={[styles.confirmadoText, { color: theme.success }]}>
                    Compra confirmada
                  </Text>
                </View>
              )}
            </View>
          ))
      )}

      {reservas.length > 0 && (
        <TouchableOpacity
          style={[
            styles.clearBtn,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
          onPress={handleLimparReservas}
        >
          <Text style={[styles.clearBtnText, { color: theme.text }]}>
            Limpar reservas
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.logoutBtn, { backgroundColor: theme.secondary }]}
        onPress={handleLogout}
      >
        <Text
          style={[
            styles.logoutText,
            { color: theme.mode === 'dark' ? '#0F1115' : '#fff' },
          ]}
        >
          Sair da conta
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 25,
    paddingBottom: 40,
  },

  cartao: {
    width: '100%',
    height: 200,
    borderRadius: 25,
    padding: 25,
    justifyContent: 'space-between',
    elevation: 12,
    marginTop: 20,
  },

  cartaoLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '600',
  },

  cartaoValor: {
    color: '#fff',
    fontSize: 38,
    fontWeight: 'bold',
  },

  cartaoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },

  cartaoUser: {
    color: '#fff',
    fontSize: 14,
    letterSpacing: 1,
  },

  cartaoChip: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    opacity: 0.5,
  },

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

  listaInfo: {
    width: '100%',
    marginTop: 24,
    borderRadius: 18,
    paddingHorizontal: 16,
  },

  itemInfo: {
    paddingVertical: 15,
    borderBottomWidth: 1,
  },

  label: {
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 4,
  },

  valor: {
    fontSize: 16,
    fontWeight: '500',
  },

  feedbackBox: {
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
  },

  feedbackText: {
    fontWeight: '700',
  },

  sectionTitle: {
    marginTop: 30,
    marginBottom: 14,
    fontSize: 18,
    fontWeight: '700',
  },

  reservaCard: {
    borderWidth: 1,
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
  },

  reservaTotal: {
    fontWeight: '800',
  },

  reservaInfo: {
    marginTop: 6,
    fontSize: 13,
  },

  reservaData: {
    marginTop: 6,
    fontSize: 12,
  },

  confirmBtn: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },

  confirmBtnText: {
    color: '#fff',
    fontWeight: '700',
  },

  confirmadoBadge: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
    alignSelf: 'flex-start',
  },

  confirmadoText: {
    fontWeight: '700',
    fontSize: 12,
  },

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