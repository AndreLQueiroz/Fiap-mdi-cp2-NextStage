import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useAppData } from '../../context/AppDataContext';
import { COLORS } from '../../constants/colors';
import EmptyState from '../../components/EmptyState';

export default function Cardapio() {
  const { reservas, loadingData, adicionarReserva } = useAppData();
  const [successMessage, setSuccessMessage] = useState('');
  const [busca, setBusca] = useState('');

  const itens = [
    {
      id: 1,
      nome: 'Hambúrgao',
      desc: 'Pão brioche, carne 150g e queijo cheddar.',
      preco: 'R$ 22,00',
      img: require('../../assets/Hamburgao.webp'),
    },
    {
      id: 2,
      nome: 'Combo Coxinha + Suco',
      desc: 'A clássica coxinha da FIAP com suco natural.',
      preco: 'R$ 12,00',
      img: require('../../assets/coxinha.jpg'),
    },
    {
      id: 3,
      nome: 'Croissant de Chocolate',
      desc: 'Venha comer o melhor croissant de chocolate.',
      preco: 'R$ 11,00',
      img: require('../../assets/croissant.jpg'),
    },
    {
      id: 4,
      nome: 'Coca-Cola 356ml',
      desc: 'Venha tomar a melhor Coca-Cola que você já viu.',
      preco: 'R$ 9,00',
      img: require('../../assets/coca.jpg'),
    },
    {
      id: 5,
      nome: 'Pão de Queijo',
      desc: 'Pão de queijo direto de Minas, apenas na FIAP.',
      preco: 'R$ 9,00',
      img: require('../../assets/pao.jpg'),
    },
    {
      id: 6,
      nome: 'Café Quentinho',
      desc: 'Venha tomar nosso café coado na hora, apenas na FIAP.',
      preco: 'R$ 7,00',
      img: require('../../assets/cafe.jpg'),
    },
  ];

  const itensFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();

    if (!termo) return itens;

    return itens.filter((item) => {
      return (
        item.nome.toLowerCase().includes(termo) ||
        item.desc.toLowerCase().includes(termo) ||
        item.preco.toLowerCase().includes(termo)
      );
    });
  }, [busca]);

  async function reservarItem(item) {
    await adicionarReserva(item);
    setSuccessMessage(`✅ ${item.nome} reservado com sucesso!`);

    setTimeout(() => {
      setSuccessMessage('');
    }, 2500);
  }

  if (loadingData) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10 }}>Carregando cardápio...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.sessao}>Mais Pedidos 🔥</Text>
      <Text style={styles.subinfo}>Reservas salvas: {reservas.length}</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar item no cardápio"
        value={busca}
        onChangeText={setBusca}
      />

      {itensFiltrados.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image source={item.img} style={styles.img} resizeMode="cover" />

          <View style={styles.info}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
            <Text style={styles.preco}>{item.preco}</Text>

            <TouchableOpacity style={styles.btn} onPress={() => reservarItem(item)}>
              <Text style={styles.btnTxt}>Reservar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {!!successMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastTxt}>{successMessage}</Text>
        </View>
      )}

      {itensFiltrados.length === 0 && (
        <EmptyState
          title="Nenhum item encontrado"
          message="Tente buscar por outro nome ou descrição."
        />
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
    padding: 20,
    paddingBottom: 30,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessao: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 6,
    color: COLORS.text,
  },
  subinfo: {
    color: COLORS.textLight,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 18,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 20,
    marginBottom: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  img: {
    width: 110,
    height: 110,
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  desc: {
    fontSize: 13,
    color: '#666',
    marginVertical: 4,
  },
  preco: {
    fontSize: 18,
    color: COLORS.primary,
    fontWeight: '800',
    marginBottom: 8,
  },
  btn: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnTxt: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  toast: {
    backgroundColor: COLORS.successBg,
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  toastTxt: {
    color: COLORS.success,
    fontWeight: '600',
  },
});