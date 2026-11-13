const BASE_URL = "https://api.olhovivo.sptrans.com.br/v2.1";

let isAuthenticated = false;

export const authenticateSPTrans = async (token) => {
  try {
    const response = await fetch(
      `${BASE_URL}/Login/Autenticar?token=${encodeURIComponent(token.trim())}`,
      {
        method: "POST",
        credentials: "include", // Faz o motor nativo do iOS/Android guardar o cookie HttpOnly automaticamente
        headers: {
          "Content-Length": "0",
        },
      },
    );

    const data = await response.json();
    console.log("SPTrans Auth Status:", data);

    if (data === true) {
      isAuthenticated = true;
      return true;
    }

    return false;
  } catch (error) {
    console.error("Erro na autenticação SPTrans:", error.message);
    return false;
  }
};

export const searchBusLines = async (token, term) => {
  try {
    if (!isAuthenticated) {
      const authenticated = await authenticateSPTrans(token);
      if (!authenticated) return [];
    }

    let response = await fetch(
      `${BASE_URL}/Linha/Buscar?termosBusca=${encodeURIComponent(term)}`,
      {
        method: "GET",
        credentials: "include", // Envia automaticamente o cookie apiCredentials salvo pelo sistema
      },
    );

    // Se a sessão expirou (401), reautentica uma vez e tenta a busca novamente
    if (response.status === 401) {
      isAuthenticated = false;
      const reauthenticated = await authenticateSPTrans(token);
      if (!reauthenticated) return [];

      response = await fetch(
        `${BASE_URL}/Linha/Buscar?termosBusca=${encodeURIComponent(term)}`,
        {
          method: "GET",
          credentials: "include",
        },
      );
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error("Erro ao buscar linhas na SPTrans:", error.message);
    return [];
  }
};

export const getBusPositions = async (codigoLinha) => {
  try {
    if (!isAuthenticated) {
      await authenticateSPTrans(token); // Garante que a sessão está ativa
    }

    const response = await fetch(
      `${BASE_URL}/Posicao?codigoLinha=${codigoLinha}`,
      {
        method: 'GET',
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar posições: ${response.status}`);
    }

    const data = await response.json();
    return data || { vs: [] };
  } catch (error) {
    console.error('Erro ao buscar posições dos ônibus:', error.message);
    return { vs: [] };
  }
};