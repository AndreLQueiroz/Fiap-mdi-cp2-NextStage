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
import { COLORS } from '../../constants/colors';
import EmptyState from '../../components/EmptyState';

export default function Pagamentos() {
  const { balanceFormatted, pagamentos, adicionarSaldo, loadingData } = useAppData();

  const [valor, setValor] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');
  const [loading, setLoading] = useState(false);

  const valoresRapidos = [10, 20, 50, 100];

  function parseValor(texto) {
    const valorTratado = String(texto)
      .replace('R$', '')
      .replace(/\s/g, '')
      .replace(',', '.');

    return Number(valorTratado);
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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Carregando pagamentos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Ionicons name="card-outline" size={44} color={COLORS.primary} />
        <Text style={styles.title}>Pagamentos</Text>
        <Text style={styles.subtitle}>
          Adicione saldo para reservar produtos na cantina.
        </Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Saldo atual</Text>
        <Text style={styles.balanceValue}>{balanceFormatted}</Text>
      </View>

      <Text style={styles.sectionTitle}>Adicionar saldo rápido</Text>

      <View style={styles.quickGrid}>
        {valoresRapidos.map((item) => (
          <TouchableOpacity
            key={item}
            style={styles.quickButton}
            onPress={() => handleAdicionarSaldo(item)}
            disabled={loading}
          >
            <Text style={styles.quickButtonText}>R$ {item},00</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Outro valor</Text>

      <TextInput
        style={styles.input}
        placeholder="Ex: 25,50"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />

      <TouchableOpacity
        style={[styles.mainButton, loading && styles.disabledButton]}
        onPress={() => handleAdicionarSaldo()}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.mainButtonText}>Adicionar saldo</Text>
        )}
      </TouchableOpacity>

      {!!feedback && (
        <View
          style={[
            styles.feedbackBox,
            feedbackType === 'success' ? styles.feedbackSuccess : styles.feedbackError,
          ]}
        >
          <Text
            style={[
              styles.feedbackText,
              feedbackType === 'success' ? styles.feedbackTextSuccess : styles.feedbackTextError,
            ]}
          >
            {feedback}
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Histórico de pagamentos</Text>

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
            <View key={pagamento.id} style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                <View>
                  <Text style={styles.paymentMethod}>{pagamento.metodo}</Text>
                  <Text style={styles.paymentDate}>{pagamento.data}</Text>
                </View>

                <Text style={styles.paymentValue}>{pagamento.valor}</Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{pagamento.status}</Text>
              </View>
            </View>
          ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 22,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: COLORS.textLight,
  },
  header: {
    marginTop: 28,
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 10,
  },
  subtitle: {
    color: COLORS.textLight,
    fontSize: 15,
    marginTop: 6,
    lineHeight: 22,
  },
  balanceCard: {
    backgroundColor: COLORS.primary,
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
    color: COLORS.text,
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
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  quickButtonText: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
    marginBottom: 12,
  },
  mainButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 14,
  },
  disabledButton: {
    opacity: 0.7,
  },
  mainButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  feedbackBox: {
    padding: 14,
    borderRadius: 12,
    marginBottom: 18,
  },
  feedbackSuccess: {
    backgroundColor: COLORS.successBg,
  },
  feedbackError: {
    backgroundColor: COLORS.errorBg,
  },
  feedbackText: {
    fontWeight: '700',
  },
  feedbackTextSuccess: {
    color: COLORS.success,
  },
  feedbackTextError: {
    color: COLORS.error,
  },
  paymentCard: {
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#EEE',
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
    color: COLORS.text,
  },
  paymentDate: {
    color: COLORS.textLight,
    fontSize: 12,
    marginTop: 4,
  },
  paymentValue: {
    color: COLORS.primary,
    fontWeight: '900',
    fontSize: 16,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    marginTop: 12,
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  statusText: {
    color: COLORS.success,
    fontWeight: '800',
    fontSize: 12,
  },
});