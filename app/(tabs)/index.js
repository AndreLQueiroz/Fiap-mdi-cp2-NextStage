import { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useAppData } from '../../context/AppDataContext';
import { useTheme } from '../../context/ThemeContext';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const { reservas, balanceFormatted, pagamentos } = useAppData();
  const { theme } = useTheme();

  const reservasPendentes = reservas.filter((item) => item.status === 'Pendente').length;
  const reservasConfirmadas = reservas.filter((item) => item.status === 'Confirmado').length;

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) return null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.welcome, { color: theme.textLight }]}>Olá,</Text>
          <Text style={[styles.name, { color: theme.text }]}>
            {user?.nome?.split(' ')[0] || 'Aluno'} 👋
          </Text>
        </View>

        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <Text style={styles.avatarText}>
            {user?.nome?.charAt(0)?.toUpperCase() || 'A'}
          </Text>
        </View>
      </View>

      <View style={[styles.heroCard, { backgroundColor: theme.primary }]}>
        <View>
          <Text style={styles.heroLabel}>Saldo disponível</Text>
          <Text style={styles.heroValue}>{balanceFormatted}</Text>
          <Text style={styles.heroText}>Use seu saldo para confirmar reservas na cantina.</Text>
        </View>

        <TouchableOpacity
          style={styles.heroButton}
          onPress={() => router.push('/pagamentos')}
        >
          <Ionicons name="add-circle-outline" size={20} color={theme.primary} />
          <Text style={[styles.heroButtonText, { color: theme.primary }]}>Adicionar saldo</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Ações rápidas</Text>

      <View style={styles.quickGrid}>
        <TouchableOpacity
          style={[styles.quickCardLarge, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.push('/cardapio')}
        >
          <View style={[styles.iconCircle, { backgroundColor: theme.primary }]}>
            <Ionicons name="restaurant" size={26} color="#fff" />
          </View>
          <Text style={[styles.quickTitle, { color: theme.text }]}>Ver cardápio</Text>
          <Text style={[styles.quickSubtitle, { color: theme.textLight }]}>
            Reserve lanches, bebidas e doces.
          </Text>
        </TouchableOpacity>

        <View style={styles.quickColumn}>
          <TouchableOpacity
            style={[styles.quickCardSmall, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.push('/perfil')}
          >
            <Ionicons name="receipt-outline" size={24} color={theme.primary} />
            <Text style={[styles.smallTitle, { color: theme.text }]}>Pedidos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickCardSmall, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.push('/pagamentos')}
          >
            <Ionicons name="card-outline" size={24} color={theme.primary} />
            <Text style={[styles.smallTitle, { color: theme.text }]}>Pagamentos</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Resumo da conta</Text>

      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="time-outline" size={22} color={theme.primary} />
          <Text style={[styles.statNumber, { color: theme.text }]}>{reservasPendentes}</Text>
          <Text style={[styles.statLabel, { color: theme.textLight }]}>Pendentes</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="checkmark-circle-outline" size={22} color={theme.primary} />
          <Text style={[styles.statNumber, { color: theme.text }]}>{reservasConfirmadas}</Text>
          <Text style={[styles.statLabel, { color: theme.textLight }]}>Confirmadas</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Ionicons name="wallet-outline" size={22} color={theme.primary} />
          <Text style={[styles.statNumber, { color: theme.text }]}>{pagamentos?.length || 0}</Text>
          <Text style={[styles.statLabel, { color: theme.textLight }]}>Recargas</Text>
        </View>
      </View>

      <View style={[styles.infoBox, { backgroundColor: theme.cardSoft, borderColor: theme.border }]}>
        <Ionicons name="information-circle-outline" size={22} color={theme.primary} />
        <Text style={[styles.infoText, { color: theme.textLight }]}>
          As reservas ficam pendentes até você confirmar a compra no perfil.
        </Text>
      </View>
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
    marginTop: 38,
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  welcome: {
    fontSize: 15,
    fontWeight: '500',
  },

  name: {
    fontSize: 30,
    fontWeight: '900',
    marginTop: 2,
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
  },

  heroCard: {
    borderRadius: 28,
    padding: 24,
    marginBottom: 26,
  },

  heroLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 14,
    fontWeight: '700',
  },

  heroValue: {
    color: '#fff',
    fontSize: 38,
    fontWeight: '900',
    marginTop: 6,
  },

  heroText: {
    color: 'rgba(255,255,255,0.82)',
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
  },

  heroButton: {
    marginTop: 20,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  heroButtonText: {
    fontWeight: '800',
    fontSize: 14,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 14,
  },

  quickGrid: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 26,
  },

  quickCardLarge: {
    flex: 1.25,
    minHeight: 172,
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
    justifyContent: 'space-between',
  },

  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quickTitle: {
    fontSize: 18,
    fontWeight: '900',
    marginTop: 14,
  },

  quickSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },

  quickColumn: {
    flex: 1,
    gap: 14,
  },

  quickCardSmall: {
    flex: 1,
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  smallTitle: {
    marginTop: 8,
    fontWeight: '800',
  },

  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 22,
  },

  statCard: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '900',
    marginTop: 8,
  },

  statLabel: {
    fontSize: 12,
    marginTop: 2,
    textAlign: 'center',
  },

  infoBox: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },

  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
});