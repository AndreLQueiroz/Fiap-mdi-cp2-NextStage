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

export default function Login() {
  const { login } = useAuth();
  const { theme } = useTheme();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);

  function validate() {
    const newErrors = {};

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const formValid = useMemo(() => {
    return /\S+@\S+\.\S+/.test(email) && senha.length >= 6;
  }, [email, senha]);

  async function handleLogin() {
    setAuthError('');

    if (!validate()) return;

    setLoading(true);
    const result = await login(email, senha);
    setLoading(false);

    if (!result.success) {
      setAuthError(result.message);
      return;
    }

    router.replace('/');
  }

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={[styles.title, { color: theme.text }]}>Entrar 😀</Text>
          <Text style={[styles.subtitle, { color: theme.textLight }]}>
            Acesse sua conta da Cantina FIAP
          </Text>

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
            placeholder="Digite sua senha"
            secureTextEntry
            error={errors.senha}
          />

          {!!authError && (
            <Text
              style={[
                styles.authError,
                {
                  backgroundColor: theme.errorBg,
                  color: theme.error,
                },
              ]}
            >
              {authError}
            </Text>
          )}

          <CustomButton
            title="Entrar"
            onPress={handleLogin}
            disabled={!formValid}
            loading={loading}
          />

          <Text style={[styles.footerText, { color: theme.textLight }]}>
            Não tem conta?{' '}
            <Link href="/cadastro" style={[styles.link, { color: theme.primary }]}>
              Cadastre-se
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
  authError: {
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