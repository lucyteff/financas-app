import React, { useState, useEffect } from 'react';
import { fetchCotacoes } from '../api';
import Card from './Card';
import './Moedas.css';

const Moedas = () => {
  const [cotacoes, setCotacoes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const loadData = async (force = false) => {
    try {
      setLoading(true);
      const data = await fetchCotacoes(force);
      setCotacoes(data);
      setLastUpdated(data.lastUpdated);
      setError(null);
    } catch (err) {
      setError("Não foi possível carregar as cotações. Verifique sua conexão.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Atualização automática a cada 5 minutos
    const interval = setInterval(() => {
      loadData(true);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Gestos touch para atualizar
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      // Swipe para cima 
      loadData(true);
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  if (error) {
    return (
      <Card title="Cotações" className="error">
        <p>{error}</p>
        <button onClick={() => loadData(true)}>Tentar novamente</button>
      </Card>
    );
  }

  if (loading && !cotacoes) {
    return (
      <Card title="Cotações" className="loading">
        <p>Carregando...</p>
      </Card>
    );
  }

  return (
    <Card 
      title="Cotações"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="moedas-grid">
        <div className="moeda-item">
          <span className="moeda-simbolo">US$</span>
          <span className="moeda-valor">{cotacoes.USD.toFixed(2)}</span>
        </div>
        <div className="moeda-item">
          <span className="moeda-simbolo">€</span>
          <span className="moeda-valor">{cotacoes.EUR.toFixed(2)}</span>
        </div>
        <div className="moeda-item">
          <span className="moeda-simbolo">ARS$</span>
          <span className="moeda-valor">{cotacoes.ARS.toFixed(2)}</span>
        </div>
        <div className="moeda-item">
          <span className="moeda-simbolo">R$</span>
          <span className="moeda-valor">{cotacoes.BRL.toFixed(2)}</span>
        </div>
      </div>
      
      {lastUpdated && (
        <div className="moedas-footer">
          <small>Atualizado em: {new Date(lastUpdated).toLocaleTimeString()}</small>
          <button 
            className="refresh-button"
            onClick={() => loadData(true)}
            aria-label="Atualizar cotações"
          >
            ↻ Atualizar
          </button>
        </div>
      )}
    </Card>
  );
};

export default Moedas;