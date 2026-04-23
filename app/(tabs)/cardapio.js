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
  const { reservas, balanceFormatted, loadingData, adicionarReserva } = useAppData();
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('success');
  const [busca, setBusca] = useState('');
  const [quantidades, setQuantidades] = useState({});

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

  function getQuantidade(itemId) {
    return quantidades[itemId] || 1;
  }

  function aumentarQuantidade(itemId) {
    setQuantidades((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 1) + 1,
    }));
  }

  function diminuirQuantidade(itemId) {
    setQuantidades((prev) => {
      const atual = prev[itemId] || 1;
      return {
        ...prev,
        [itemId]: atual > 1 ? atual - 1 : 1,
      };
    });
  }

  async function reservar(item) {
    const quantidade = getQuantidade(item.id);
    const result = await adicionarReserva(item, quantidade);

    if (result.success) {
      setFeedbackType('success');
      setFeedback(`✅ ${item.nome} reservado com sucesso (${quantidade}x).`);
      setQuantidades((prev) => ({ ...prev, [item.id]: 1 }));
    } else {
      setFeedbackType('error');
      setFeedback(`⚠️ ${result.message}`);
    }

    setTimeout(() => {
      setFeedback('');
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
      <Text style={styles.saldo}>Saldo disponível: {balanceFormatted}</Text>

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

            <View style={styles.actionsRow}>
              <View style={styles.quantityBox}>
                <TouchableOpacity style={styles.qtdBtn} onPress={() => diminuirQuantidade(item.id)}>
                  <Text style={styles.qtdBtnText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.qtdValue}>{getQuantidade(item.id)}</Text>

                <TouchableOpacity style={styles.qtdBtn} onPress={() => aumentarQuantidade(item.id)}>
                  <Text style={styles.qtdBtnText}>+</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.btn} onPress={() => reservar(item)}>
                <Text style={styles.btnTxt}>Reservar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      {!!feedback && (
        <View
          style={[
            styles.toast,
            feedbackType === 'success' ? styles.toastSuccess : styles.toastError,
          ]}
        >
          <Text
            style={[
              styles.toastTxt,
              feedbackType === 'success' ? styles.toastTxtSuccess : styles.toastTxtError,
            ]}
          >
            {feedback}
          </Text>
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
    marginBottom: 6,
  },
  saldo: {
    color: COLORS.primary,
    fontWeight: '700',
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
    height: 140,
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
  actionsRow: {
    gap: 10,
  },
  quantityBox: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#F1F1F1',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  qtdBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.secondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtdBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  qtdValue: {
    minWidth: 30,
    textAlign: 'center',
    fontWeight: '700',
    color: COLORS.text,
  },
  btn: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnTxt: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  toast: {
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  toastSuccess: {
    backgroundColor: COLORS.successBg,
  },
  toastError: {
    backgroundColor: COLORS.errorBg,
  },
  toastTxt: {
    fontWeight: '600',
  },
  toastTxtSuccess: {
    color: COLORS.success,
  },
  toastTxtError: {
    color: COLORS.error,
  },
});