import React, { useState, useEffect } from 'react';
import Grafico from './components/Grafico';
import Moedas from './components/Moedas';
import Transacao from './components/Transacao';
import Meta from './components/Meta';
import ConversorMoedas from './components/ConversorMoedas';
import { fetchCotacoes } from './api';
import './styles/main.css';

function App() {
  const [transacoes, setTransacoes] = useState([]);
  const [metas, setMetas] = useState([]);
  const [cotacoes, setCotacoes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const cotacoesData = await fetchCotacoes();
        setCotacoes(cotacoesData);
        setLoading(false);
      } catch (error) {
        console.error("Erro ao carregar cotações:", error);
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const adicionarTransacao = (novaTransacao) => {
    setTransacoes([...transacoes, {
      ...novaTransacao,
      id: Date.now()
    }]);
  };

  const adicionarMeta = (novaMeta) => {
    setMetas([...metas, {
      ...novaMeta,
      id: Date.now()
    }]);
  };

  const renderMobileView = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <>
            <Moedas cotacoes={cotacoes} />
            <ConversorMoedas />
            <Grafico transacoes={transacoes} metas={metas} />
          </>
        );
      case 'transactions':
        return <Transacao onAdicionarTransacao={adicionarTransacao} />;
      case 'goals':
        return <Meta onAdicionarMeta={adicionarMeta} />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="loading">Carregando...</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Finanças Pessoais</h1>
      </header>
      
      <nav className="mobile-nav">
        <button 
          className={`nav-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Visão Geral
        </button>
        <button 
          className={`nav-button ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          Transações
        </button>
        <button 
          className={`nav-button ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          Metas
        </button>
      </nav>
      
      <div className="app-container">
        <div className="desktop-view">
          <div className="row">
            <Moedas cotacoes={cotacoes} />
            <ConversorMoedas />
          </div>
          <div className="row">
            <Transacao onAdicionarTransacao={adicionarTransacao} />
            <Meta onAdicionarMeta={adicionarMeta} />
          </div>
          <div className="row">
            <Grafico transacoes={transacoes} metas={metas} />
          </div>
        </div>
        
        <div className="mobile-view">
          {renderMobileView()}
        </div>
      </div>
    </div>
  );
}

export default App;