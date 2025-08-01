import React, { useState, useEffect } from 'react';
import { fetchCotacoes } from '../api';
import './ConversorMoedas.css';

const ConversorMoedas = () => {
  const [cotacoes, setCotacoes] = useState(null);
  const [valor, setValor] = useState('');
  const [moedaOrigem, setMoedaOrigem] = useState('BRL');
  const [moedaDestino, setMoedaDestino] = useState('USD');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarCotacoes = async () => {
      try {
        const dados = await fetchCotacoes();
        setCotacoes(dados);
      } catch (error) {
        console.error("Erro ao carregar cotações:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarCotacoes();
  }, []);

  const converterMoeda = () => {
    if (!cotacoes || !valor) return;

    // Converter para BRL primeiro
    let valorEmBRL;
    switch (moedaOrigem) {
      case 'USD':
        valorEmBRL = parseFloat(valor) * cotacoes.USD;
        break;
      case 'EUR':
        valorEmBRL = parseFloat(valor) * cotacoes.EUR;
        break;
      case 'ARS':
        valorEmBRL = parseFloat(valor) * cotacoes.ARS;
        break;
      default: // BRL
        valorEmBRL = parseFloat(valor);
    }

    // Converter de BRL para moeda destino
    let valorConvertido;
    switch (moedaDestino) {
      case 'USD':
        valorConvertido = valorEmBRL / cotacoes.USD;
        break;
      case 'EUR':
        valorConvertido = valorEmBRL / cotacoes.EUR;
        break;
      case 'ARS':
        valorConvertido = valorEmBRL / cotacoes.ARS;
        break;
      default: // BRL
        valorConvertido = valorEmBRL;
    }

    setResultado({
      valorOriginal: parseFloat(valor),
      moedaOrigem,
      valorConvertido,
      moedaDestino
    });
  };

  if (loading) {
    return <div className="loading">Carregando cotações...</div>;
  }

  return (
    <div className="conversor-container">
      <h2>Conversor de Moedas</h2>
      
      <div className="conversor-form">
        <div className="form-group">
          <label>Valor:</label>
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            placeholder="Digite o valor"
            min="0"
            step="0.01"
          />
        </div>

        <div className="form-group">
          <label>De:</label>
          <select value={moedaOrigem} onChange={(e) => setMoedaOrigem(e.target.value)}>
            <option value="BRL">Real Brasileiro (BRL)</option>
            <option value="USD">Dólar Americano (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="ARS">Peso Argentino (ARS)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Para:</label>
          <select value={moedaDestino} onChange={(e) => setMoedaDestino(e.target.value)}>
            <option value="USD">Dólar Americano (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="ARS">Peso Argentino (ARS)</option>
            <option value="BRL">Real Brasileiro (BRL)</option>
          </select>
        </div>

        <button onClick={converterMoeda} className="converter-button">
          Converter
        </button>
      </div>

      {resultado && (
        <div className="resultado-container">
          <h3>Resultado:</h3>
          <p>
            {resultado.valorOriginal.toFixed(2)} {resultado.moedaOrigem} = 
            {' '}
            <strong>
              {resultado.valorConvertido.toFixed(2)} {resultado.moedaDestino}
            </strong>
          </p>
          {cotacoes.isMocked && (
            <p className="warning-message">
              ⚠ Usando dados simulados - API offline
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ConversorMoedas;