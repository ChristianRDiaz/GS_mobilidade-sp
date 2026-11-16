import { SPTRANS_TOKEN } from "./config";
import { getCachedStops, saveCachedStops } from "../storage/storage";

const BASE_URL = "https://api.olhovivo.sptrans.com.br/v2.1";

let isAuthenticated = false;

export const authenticateSPTrans = async (token) => {
  try {
    const response = await fetch(
      `${BASE_URL}/Login/Autenticar?token=${encodeURIComponent(token.trim())}`,
      {
        method: "POST",
        credentials: "include",
        headers: { "Content-Length": "0" },
      },
    );
    const data = await response.json();
    if (data === true) {
      isAuthenticated = true;
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const apiGet = async (path) => {
  if (!isAuthenticated) {
    await authenticateSPTrans(SPTRANS_TOKEN);
  }

  let response = await fetch(`${BASE_URL}${path}`, {
    method: "GET",
    credentials: "include",
  });

  if (response.status === 401) {
    isAuthenticated = false;
    await authenticateSPTrans(SPTRANS_TOKEN);
    response = await fetch(`${BASE_URL}${path}`, {
      method: "GET",
      credentials: "include",
    });
  }

  return response.json();
};

export const searchBusLines = async (term) => {
  try {
    const data = await apiGet(
      `/Linha/Buscar?termosBusca=${encodeURIComponent(term)}`,
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const searchStops = async (term) => {
  try {
    const data = await apiGet(
      `/Parada/Buscar?termosBusca=${encodeURIComponent(term)}`,
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const getBusPositions = async (codigoLinha) => {
  try {
    const data = await apiGet(`/Posicao/Linha?codigoLinha=${codigoLinha}`);
    if (data && typeof data === "object") {
      return {
        hr: data.hr || "",
        vs: Array.isArray(data.vs) ? data.vs : [],
      };
    }
    return { hr: "", vs: [] };
  } catch (error) {
    return { hr: "", vs: [] };
  }
};

export const getLineStops = async (codigoLinha) => {
  try {
    const data = await apiGet(
      `/Parada/BuscarParadasPorLinha?codigoLinha=${codigoLinha}`,
    );
    return Array.isArray(data) ? data : [];
  } catch (error) {
    return [];
  }
};

export const getLinePredictions = async (codigoLinha) => {
  try {
    const data = await apiGet(`/Previsao/Linha?codigoLinha=${codigoLinha}`);
    return data && Array.isArray(data.ps) ? data.ps : [];
  } catch (error) {
    return [];
  }
};

export const getStopPredictions = async (codigoParada) => {
  try {
    const data = await apiGet(`/Previsao/Parada?codigoParada=${codigoParada}`);
    return data && typeof data === "object" ? data : null;
  } catch (error) {
    return null;
  }
};

export const getStopsCached = async (codigoLinha) => {
  const cached = await getCachedStops(codigoLinha);
  if (cached && cached.length > 0) return cached;

  const stops = await getLineStops(codigoLinha);
  if (stops.length > 0) {
    await saveCachedStops(codigoLinha, stops);
  }
  return stops;
};

export const getStopsWithFallback = async (linha) => {
  const stops = await getStopsCached(linha.cl);
  if (stops.length > 0) {
    return { stops, codigo: linha.cl, sentidoAlternativo: false };
  }

  const candidatos = await searchBusLines(String(linha.lt));
  const irmaos = candidatos.filter(
    (c) => c.lt === linha.lt && c.cl !== linha.cl,
  );

  for (const irmao of irmaos) {
    const stopsIrmao = await getStopsCached(irmao.cl);
    if (stopsIrmao.length > 0) {
      return {
        stops: stopsIrmao,
        codigo: irmao.cl,
        sentidoAlternativo: true,
      };
    }
  }

  return { stops: [], codigo: linha.cl, sentidoAlternativo: false };
};