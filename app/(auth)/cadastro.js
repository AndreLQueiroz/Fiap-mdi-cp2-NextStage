import React, { useMemo, useState } from 'react';
import {
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
import { COLORS } from '../../constants/colors';

export default function Cadastro() {
  const { register } = useAuth();

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

    if (!nome.trim()) {
      newErrors.nome = 'O nome completo é obrigatório';
    }

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
      router.replace('/(auth)/login');
    }, 1200);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Cadastro</Text>
        <Text style={styles.subtitle}>Crie sua conta para usar a Cantina FIAP</Text>

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

        {!!submitError && <Text style={styles.errorMessage}>{submitError}</Text>}
        {!!submitMessage && <Text style={styles.successMessage}>{submitMessage}</Text>}

        <CustomButton
          title="Cadastrar"
          onPress={handleRegister}
          disabled={!formValid}
          loading={loading}
        />

        <Text style={styles.footerText}>
          Já tem conta?{' '}
          <Link href="/(auth)/login" style={styles.link}>
            Entrar
          </Link>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    marginBottom: 28,
  },
  errorMessage: {
    backgroundColor: COLORS.errorBg,
    color: COLORS.error,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  successMessage: {
    backgroundColor: COLORS.successBg,
    color: COLORS.success,
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  footerText: {
    marginTop: 18,
    textAlign: 'center',
    color: COLORS.textLight,
  },
  link: {
    color: COLORS.primary,
    fontWeight: '700',
  },
});