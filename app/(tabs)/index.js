import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { reservas, balanceFormatted } = useAppData();
  const { theme } = useTheme();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🍔</Text>
        <Text style={[styles.titulo, { color: theme.text }]}>Cantina FIAP</Text>
        <Text style={[styles.subtitulo, { color: theme.textLight }]}>
          Olá, {user?.nome?.split(' ')[0] || 'Aluno'}! Sua pausa sem filas.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.cardGrande, { backgroundColor: theme.primary }]}
        onPress={() => router.push('/cardapio')}
      >
        <Ionicons name="restaurant" size={40} color="#fff" />
        <Text style={styles.cardTexto}>Ver Cardápio</Text>
      </TouchableOpacity>

      <View style={[styles.statsCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <Text style={[styles.statsTitle, { color: theme.text }]}>Resumo</Text>
        <Text style={[styles.statsText, { color: theme.textLight }]}>Reservas: {reservas.length}</Text>
        <Text style={[styles.statsText, { color: theme.textLight }]}>Saldo: {balanceFormatted}</Text>
      </View>

      <View style={styles.linha}>
        <TouchableOpacity
          style={[styles.cardPequeno, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.push('/cardapio')}
        >
          <Ionicons name="time" size={24} color={theme.primary} />
          <Text style={[styles.cardTextoPequeno, { color: theme.text }]}>Reservas</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { marginTop: 60, marginBottom: 25, alignItems: 'center' },
  emoji: { fontSize: 50 },
  titulo: { fontSize: 30, fontWeight: '800', marginTop: 10 },
  subtitulo: { fontSize: 15, textAlign: 'center', marginTop: 8 },
  cardGrande: {
    height: 170,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 6,
  },
  cardTexto: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  statsCard: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  statsText: {
    marginBottom: 4,
  },
  linha: {
    flexDirection: 'row',
    gap: 15,
  },
  cardPequeno: {
    flex: 1,
    height: 100,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  cardTextoPequeno: {
    fontWeight: '600',
    marginTop: 5,
  },
});