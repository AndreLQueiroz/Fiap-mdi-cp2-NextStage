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
  const { reservas, balanceFormatted } = useAppData();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <View style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.emoji}>🍔</Text>
        <Text style={styles.titulo}>Cantina FIAP</Text>
        <Text style={styles.subtitulo}>
          Olá, {user?.nome?.split(' ')[0] || 'Aluno'}! Sua pausa sem filas.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.cardGrande}
        onPress={() => router.push('/cardapio')}
      >
        <Ionicons name="restaurant" size={40} color="#fff" />
        <Text style={styles.cardTexto}>Ver Cardápio</Text>
      </TouchableOpacity>

      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>Resumo</Text>
        <Text style={styles.statsText}>Reservas: {reservas.length}</Text>
        <Text style={styles.statsText}>Saldo: {balanceFormatted}</Text>
      </View>

      <View style={styles.linha}>
        <TouchableOpacity
          style={styles.cardPequeno}
          onPress={() => router.push('/cardapio')}
        >
          <Ionicons name="time" size={24} color={COLORS.primary} />
          <Text style={styles.cardTextoPequeno}>Reservas</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
    padding: 20,
  },

  header: {
    marginTop: 60,
    marginBottom: 25,
    alignItems: 'center',
  },

  emoji: {
    fontSize: 50,
  },

  titulo: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 10,
  },

  subtitulo: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
  },

  cardGrande: {
    backgroundColor: COLORS.primary,
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
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },

  statsTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },

  statsText: {
    color: COLORS.textLight,
    marginBottom: 4,
  },

  linha: {
    flexDirection: 'row',
    gap: 15,
  },

  cardPequeno: {
    flex: 1,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },

  cardTextoPequeno: {
    color: COLORS.text,
    fontWeight: '600',
    marginTop: 5,
  },
});