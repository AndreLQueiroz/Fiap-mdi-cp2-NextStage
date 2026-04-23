import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Link, router } from 'expo-router';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function Cadastro() {
  const { register } = useAuth();
  const { theme } = useTheme();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    const newErrors = {};

    if (!nome.trim()) newErrors.nome = 'O nome completo é obrigatório';

    if (!email.trim()) {
      newErrors.email = 'O e-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Formato de e-mail inválido';
    }

    if (!senha.trim()) {
      newErrors.senha = 'A senha é obrigatória';
    } else if (senha.length < 6) {
      newErrors.senha = 'A senha deve ter no mínimo 6 caracteres';
    }

    if (!confirmarSenha.trim()) {
      newErrors.confirmarSenha = 'Confirme sua senha';
    } else if (confirmarSenha !== senha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const formValid = useMemo(() => {
    return (
      nome.trim().length > 0 &&
      /\S+@\S+\.\S+/.test(email) &&
      senha.length >= 6 &&
      confirmarSenha === senha
    );
  }, [nome, email, senha, confirmarSenha]);

  async function handleRegister() {
    setSubmitMessage('');
    setSubmitError('');

    if (!validate()) return;

    setLoading(true);
    const result = await register({ nome, email, senha });
    setLoading(false);

    if (!result.success) {
      setSubmitError(result.message);
      return;
    }

    setSubmitMessage('Cadastro realizado com sucesso! Agora faça login.');

    setTimeout(() => {
      router.replace('/login');
    }, 1200);
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.title, { color: theme.text }]}>Cadastro</Text>
          <Text style={[styles.subtitle, { color: theme.textLight }]}>
            Crie sua conta para usar a Cantina FIAP
          </Text>

          <CustomInput
            label="Nome completo"
            value={nome}
            onChangeText={setNome}
            placeholder="Digite seu nome"
            error={errors.nome}
          />

          <CustomInput
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="usuario@dominio.com"
            keyboardType="email-address"
            error={errors.email}
          />

          <CustomInput
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            placeholder="Mínimo 6 caracteres"
            secureTextEntry
            error={errors.senha}
          />

          <CustomInput
            label="Confirmar senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            placeholder="Repita sua senha"
            secureTextEntry
            error={errors.confirmarSenha}
          />

          {!!submitError && (
            <Text style={[styles.message, { backgroundColor: theme.errorBg, color: theme.error }]}>
              {submitError}
            </Text>
          )}

          {!!submitMessage && (
            <Text style={[styles.message, { backgroundColor: theme.successBg, color: theme.success }]}>
              {submitMessage}
            </Text>
          )}

          <CustomButton
            title="Cadastrar"
            onPress={handleRegister}
            disabled={!formValid}
            loading={loading}
          />

          <Text style={[styles.footerText, { color: theme.textLight }]}>
            Já tem conta?{' '}
            <Link href="/login" style={[styles.link, { color: theme.primary }]}>
              Entrar
            </Link>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 28,
  },
  message: {
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  footerText: {
    marginTop: 18,
    textAlign: 'center',
  },
  link: {
    fontWeight: '700',
  },
});