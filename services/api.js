import { getData, saveData, removeData } from './storage';

const USER_KEY = '@cantina_user';
const SESSION_KEY = '@cantina_session';
const APP_STATE_KEY = '@cantina_app_state';

const INITIAL_BALANCE = 50;

function wait(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parsePriceToNumber(price) {
  if (typeof price === 'number') return price;

  return Number(
    String(price)
      .replace('R$', '')
      .replace(/\s/g, '')
      .replace(/\./g, '')
      .replace(',', '.')
  );
}

function formatNumberToBRL(value) {
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
}

export async function registerUser({ nome, email, senha }) {
  await wait();

  const existingUser = await getData(USER_KEY);

  if (existingUser && existingUser.email === email.toLowerCase().trim()) {
    return {
      success: false,
      message: 'Já existe um usuário cadastrado com este e-mail.',
    };
  }

  const newUser = {
    nome: nome.trim(),
    email: email.toLowerCase().trim(),
    senha,
  };

  const saved = await saveData(USER_KEY, newUser);

  if (!saved) {
    return {
      success: false,
      message: 'Não foi possível salvar o cadastro.',
    };
  }

  const existingAppState = await getData(APP_STATE_KEY);

  if (!existingAppState) {
    await saveData(APP_STATE_KEY, {
      balance: INITIAL_BALANCE,
      reservas: [],
      pagamentos: [],
    });
  }

  return { success: true };
}

export async function loginUser(email, senha) {
  await wait();

  const storedUser = await getData(USER_KEY);

  if (!storedUser) {
    return {
      success: false,
      message: 'Nenhum usuário cadastrado. Faça seu cadastro primeiro.',
    };
  }

  const validEmail = storedUser.email === email.toLowerCase().trim();
  const validPassword = storedUser.senha === senha;

  if (!validEmail || !validPassword) {
    return {
      success: false,
      message: 'E-mail ou senha inválidos.',
    };
  }

  const sessionData = {
    loggedIn: true,
    user: storedUser,
  };

  const saved = await saveData(SESSION_KEY, sessionData);

  if (!saved) {
    return {
      success: false,
      message: 'Erro ao iniciar sessão.',
    };
  }

  return {
    success: true,
    user: storedUser,
  };
}

export async function getSession() {
  return await getData(SESSION_KEY);
}

export async function logoutUser() {
  await removeData(SESSION_KEY);
  return { success: true };
}

export async function getAppState() {
  const appState = await getData(APP_STATE_KEY);

  if (appState) {
    return {
      balance: appState.balance ?? INITIAL_BALANCE,
      reservas: appState.reservas || [],
      pagamentos: appState.pagamentos || [],
    };
  }

  const initialState = {
    balance: INITIAL_BALANCE,
    reservas: [],
    pagamentos: [],
  };

  await saveData(APP_STATE_KEY, initialState);
  return initialState;
}

export async function reservarItem(item, quantity = 1) {
  await wait();

  const appState = await getAppState();
  const unitPrice = parsePriceToNumber(item.preco);
  const total = unitPrice * quantity;

  if (quantity < 1) {
    return {
      success: false,
      message: 'A quantidade precisa ser maior que zero.',
    };
  }

  const novaReserva = {
    id: Date.now().toString(),
    nome: item.nome,
    precoUnitario: formatNumberToBRL(unitPrice),
    precoUnitarioNumero: unitPrice,
    quantidade: quantity,
    total: formatNumberToBRL(total),
    totalNumero: total,
    data: new Date().toLocaleString(),
    status: 'Pendente',
  };

  const updatedState = {
    ...appState,
    reservas: [...appState.reservas, novaReserva],
  };

  await saveData(APP_STATE_KEY, updatedState);

  return {
    success: true,
    reserva: novaReserva,
    appState: updatedState,
  };
}

export async function confirmarCompraApi(reservaId) {
  await wait();

  const appState = await getAppState();

  const reserva = appState.reservas.find((item) => item.id === reservaId);

  if (!reserva) {
    return {
      success: false,
      message: 'Reserva não encontrada.',
    };
  }

  if (reserva.status === 'Confirmado') {
    return {
      success: false,
      message: 'Essa compra já foi confirmada.',
    };
  }

  if (appState.balance < reserva.totalNumero) {
    return {
      success: false,
      message: 'Saldo insuficiente para confirmar a compra.',
    };
  }

  const reservasAtualizadas = appState.reservas.map((item) =>
    item.id === reservaId
      ? {
          ...item,
          status: 'Confirmado',
          confirmadoEm: new Date().toLocaleString(),
        }
      : item
  );

  const updatedState = {
    ...appState,
    balance: Number((appState.balance - reserva.totalNumero).toFixed(2)),
    reservas: reservasAtualizadas,
  };

  await saveData(APP_STATE_KEY, updatedState);

  return {
    success: true,
    message: 'Compra confirmada com sucesso.',
    appState: updatedState,
  };
}

export async function adicionarSaldoApi(valor) {
  await wait();

  const appState = await getAppState();
  const valorNumerico = Number(valor);

  if (!valorNumerico || valorNumerico <= 0) {
    return {
      success: false,
      message: 'Informe um valor válido.',
    };
  }

  const novoPagamento = {
    id: Date.now().toString(),
    valor: formatNumberToBRL(valorNumerico),
    valorNumero: valorNumerico,
    data: new Date().toLocaleString(),
    status: 'Aprovado',
    metodo: 'Recarga via App',
  };

  const updatedState = {
    ...appState,
    balance: Number((appState.balance + valorNumerico).toFixed(2)),
    pagamentos: [...appState.pagamentos, novoPagamento],
  };

  await saveData(APP_STATE_KEY, updatedState);

  return {
    success: true,
    appState: updatedState,
    pagamento: novoPagamento,
    message: `Saldo adicionado com sucesso: ${formatNumberToBRL(valorNumerico)}`,
  };
}

export async function limparReservasApi() {
  await wait();

  const appState = await getAppState();

  const totalConfirmado = appState.reservas
    .filter((reserva) => reserva.status === 'Confirmado')
    .reduce((acc, reserva) => acc + reserva.totalNumero, 0);

  const updatedState = {
    ...appState,
    balance: Number((appState.balance + totalConfirmado).toFixed(2)),
    reservas: [],
  };

  await saveData(APP_STATE_KEY, updatedState);

  return {
    success: true,
    appState: updatedState,
  };
}

export { formatNumberToBRL, parsePriceToNumber, INITIAL_BALANCE };