import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { COLORS } from '../../constants/colors';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { reservas } = useAppData();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.emoji}>🍔</Text>
        <Text style={styles.titulo}>Cantina FIAP</Text>
        <Text style={styles.subtitulo}>
          Olá, {user?.nome?.split(' ')[0] || 'Aluno'}! Sua pausa para o café, sem filas e sem estresse.
        </Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Resumo rápido</Text>
        <Text style={styles.statsText}>Reservas realizadas: {reservas.length}</Text>
        <Text style={styles.statsText}>Conta ativa: {user?.email || '---'}</Text>
      </View>

      <View style={styles.menuRapido}>
        <TouchableOpacity style={styles.cardGrande} onPress={() => router.push('/(tabs)/cardapio')}>
          <Ionicons name="restaurant" size={40} color="#fff" />
          <Text style={styles.cardTexto}>Ver Cardápio</Text>
        </TouchableOpacity>

        <View style={styles.linha}>
          <TouchableOpacity style={styles.cardPequeno} onPress={() => router.push('/(tabs)/perfil')}>
            <Ionicons name="wallet" size={24} color={COLORS.primary} />
            <Text style={styles.cardTextoPequeno}>Perfil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cardPequeno} onPress={() => router.push('/(tabs)/cardapio')}>
            <Ionicons name="time" size={24} color={COLORS.primary} />
            <Text style={styles.cardTextoPequeno}>Reservas</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, padding: 20 },
  header: { marginTop: 60, marginBottom: 24, alignItems: 'center' },
  emoji: { fontSize: 50 },
  titulo: { fontSize: 32, fontWeight: '800', color: COLORS.text, marginTop: 10 },
  subtitulo: {
    fontSize: 16,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  statsCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  statsText: {
    color: COLORS.textLight,
    marginBottom: 4,
  },
  menuRapido: { gap: 15 },
  cardGrande: {
    backgroundColor: COLORS.primary,
    height: 180,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  cardTexto: { color: '#fff', fontSize: 20, fontWeight: 'bold', marginTop: 10 },
  linha: { flexDirection: 'row', gap: 15 },
  cardPequeno: {
    flex: 1,
    backgroundColor: '#fff',
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardTextoPequeno: { color: '#333', fontWeight: '600', marginTop: 5 },
});