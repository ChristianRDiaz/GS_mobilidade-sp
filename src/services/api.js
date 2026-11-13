import axios from "axios";

const BASE_URL = "http://api.olhovivo.sptrans.com.br/v2.1";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let isAuthenticated = false;

export const authenticateSPTrans = async (token) => {
  try {
    // Passamos null no corpo do POST para o servidor não rejeitar por falta de Content-Length
    const response = await api.post(
      `/Login/Autenticar?token=${token.trim()}`,
      null,
    );

    console.log("Resposta SPTrans Auth:", response.data);

    if (response.data === true) {
      isAuthenticated = true;
      return true;
    }
    return false;
  } catch (error) {
    console.error(
      "Erro detalhado SPTrans:",
      error.response?.status,
      error.config?.url,
    );
    return false;
  }
};

export const searchBusLines = async (token, term) => {
  try {
    if (!isAuthenticated) {
      const authSuccess = await authenticateSPTrans(token);
      if (!authSuccess) return [];
    }

    const response = await api.get(
      `/Linha/Buscar?termosBusca=${encodeURIComponent(term)}`,
    );
    return response.data || [];
  } catch (error) {
    console.error("Erro ao buscar linhas:", error.message);
    return [];
  }
};
  