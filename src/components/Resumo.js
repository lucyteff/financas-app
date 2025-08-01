import React from 'react';
import Card from './Card';
import './Resumo.css';

const Resumo = ({ transacoes, metas }) => {
  const gastos = transacoes
    .filter(t => t.tipo === 'gasto')
    .reduce((sum, t) => sum + t.valor, 0);
  
  const poupancas = transacoes
    .filter(t => t.tipo === 'poupanca')
    .reduce((sum, t) => sum + t.valor, 0);
  
  const totalMetas = metas.reduce((sum, m) => sum + m.valor, 0);

  return (
    <Card title="Resumo Financeiro">
      <div className="resumo-grid">
        <div className="resumo-item gastos">
          <h3>Gastos</h3>
          <p>R$ {gastos.toFixed(2)}</p>
        </div>
        <div className="resumo-item poupancas">
          <h3>Poupanças</h3>
          <p>R$ {poupancas.toFixed(2)}</p>
        </div>
        <div className="resumo-item metas">
          <h3>Metas</h3>
          <p>R$ {totalMetas.toFixed(2)}</p>
        </div>
      </div>
    </Card>
  );
};

export default Resumo;