export const fetchCotacoes = async () => {
  try {
    const response = await fetch('https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,ARS-BRL');
    const data = await response.json();
    return {
      USD: parseFloat(data.USD.bid), // Dólar Americano
      EUR: parseFloat(data.EUR.bid), // Euro
      ARS: parseFloat(data.ARS.bid), // Peso Argentino
      BRL: 1.0 // Real Brasileiro (base)
    };
  } catch (error) {
    console.error("Erro ao buscar cotações:", error);
    // Fallback caso a API falhe
    return {
      USD: 5.20,
      EUR: 5.60,
      ARS: 0.020,
      BRL: 1.0
    };
  }
};