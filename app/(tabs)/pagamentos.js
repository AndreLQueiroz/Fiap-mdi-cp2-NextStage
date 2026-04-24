import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';
import EmptyState from '../../components/EmptyState';

export default function Pagamentos() {
  const { balanceFormatted, pagamentos, adicionarSaldo, loadingData } = useAppData();
  const { theme } = useTheme();

  const [valor, setValor] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');
  const [loading, setLoading] = useState(false);

  const valoresRapidos = [10, 20, 50, 100];

  function parseValor(texto) {
    return Number(
      String(texto)
        .replace('R$', '')
        .replace(/\s/g, '')
        .replace(',', '.')
    );
  }

  async function handleAdicionarSaldo(valorSelecionado) {
    const valorFinal = valorSelecionado || parseValor(valor);

    setLoading(true);
    const result = await adicionarSaldo(valorFinal);
    setLoading(false);

    if (result.success) {
      setFeedbackType('success');
      setFeedback(result.message);
      setValor('');
    } else {
      setFeedbackType('error');
      setFeedback(result.message);
    }

    setTimeout(() => {
      setFeedback('');
    }, 2500);
  }

  if (loadingData) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.textLight }]}>
          Carregando pagamentos...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Ionicons name="card-outline" size={44} color={theme.primary} />
        <Text style={[styles.title, { color: theme.text }]}>Pagamentos</Text>
        <Text style={[styles.subtitle, { color: theme.textLight }]}>
          Adicione saldo para reservar produtos na cantina.
        </Text>
      </View>

      <View style={[styles.balanceCard, { backgroundColor: theme.primary }]}>
        <Text style={styles.balanceLabel}>Saldo atual</Text>
        <Text style={styles.balanceValue}>{balanceFormatted}</Text>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Adicionar saldo rápido
      </Text>

      <View style={styles.quickGrid}>
        {valoresRapidos.map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.quickButton,
              { backgroundColor: theme.card, borderColor: theme.border },
            ]}
            onPress={() => handleAdicionarSaldo(item)}
            disabled={loading}
          >
            <Text style={[styles.quickButtonText, { color: theme.primary }]}>
              R$ {item},00
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Outro valor</Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.inputBg,
            borderColor: theme.border,
            color: theme.text,
          },
        ]}
        placeholder="Ex: 25,50"
        placeholderTextColor={theme.textLight}
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />

      <TouchableOpacity
        style={[
          styles.mainButton,
          { backgroundColor: theme.secondary },
          loading && styles.disabledButton,
        ]}
        onPress={() => handleAdicionarSaldo()}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            style={[
              styles.mainButtonText,
              { color: theme.mode === 'dark' ? '#0F1115' : '#fff' },
            ]}
          >
            Adicionar saldo
          </Text>
        )}
      </TouchableOpacity>

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
        Histórico de pagamentos
      </Text>

      {pagamentos.length === 0 ? (
        <EmptyState
          title="Nenhum pagamento ainda"
          message="Quando você adicionar saldo, o histórico aparecerá aqui."
        />
      ) : (
        pagamentos
          .slice()
          .reverse()
          .map((pagamento) => (
            <View
              key={pagamento.id}
              style={[
                styles.paymentCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <View style={styles.paymentHeader}>
                <View>
                  <Text style={[styles.paymentMethod, { color: theme.text }]}>
                    {pagamento.metodo}
                  </Text>
                  <Text style={[styles.paymentDate, { color: theme.textLight }]}>
                    {pagamento.data}
                  </Text>
                </View>

                <Text style={[styles.paymentValue, { color: theme.primary }]}>
                  {pagamento.valor}
                </Text>
              </View>

              <View style={[styles.statusBadge, { backgroundColor: theme.successBg }]}>
                <Text style={[styles.statusText, { color: theme.success }]}>
                  {pagamento.status}
                </Text>
              </View>
            </View>
          ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 22, paddingBottom: 40 },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 10 },
  header: {
    marginTop: 28,
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginTop: 10,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 6,
    lineHeight: 22,
  },
  balanceCard: {
    borderRadius: 24,
    padding: 24,
    marginBottom: 26,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '600',
    marginBottom: 8,
  },
  balanceValue: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '900',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 14,
    marginTop: 8,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 22,
  },
  quickButton: {
    width: '47%',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
  },
  quickButtonText: {
    fontWeight: '800',
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    marginBottom: 12,
  },
  mainButton: {
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  disabledButton: {
    opacity: 0.7,
  },
  mainButtonText: {
    fontWeight: '800',
    fontSize: 15,
  },
  feedbackBox: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 18,
  },
  feedbackText: {
    fontWeight: '700',
  },
  paymentCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  paymentMethod: {
    fontSize: 15,
    fontWeight: '800',
  },
  paymentDate: {
    fontSize: 12,
    marginTop: 4,
  },
  paymentValue: {
    fontWeight: '900',
    fontSize: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusText: {
    fontWeight: '800',
    fontSize: 12,
  },
});