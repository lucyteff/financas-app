// src/components/Grafico.js
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import Card from './Card';
import './Grafico.css';

const Grafico = ({ transacoes, metas }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null);
  const [touchTimer, setTouchTimer] = useState(null);

  const prepareData = () => {
    const gastos = transacoes
      .filter(t => t.tipo === 'gasto')
      .reduce((sum, t) => sum + t.valor, 0);
    
    const poupancas = transacoes
      .filter(t => t.tipo === 'poupanca')
      .reduce((sum, t) => sum + t.valor, 0);
    
    const totalMetas = metas.reduce((sum, m) => sum + m.valor, 0);

    return {
      labels: ['Gastos', 'Poupanças', 'Metas'],
      datasets: [{
        label: 'Valores em R$',
        data: [gastos, poupancas, totalMetas],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(54, 162, 235, 0.7)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }]
    };
  };

  const handleTouchStart = (index) => {
    // Inicia o timer para toque longo
    const timer = setTimeout(() => {
      setActiveIndex(index);
    }, 500);
    setTouchTimer(timer);
  };

  const handleTouchEnd = () => {
    // Cancela o timer se o toque for curto
    clearTimeout(touchTimer);
    setTouchTimer(null);
  };

  const handleMouseOver = (index) => {
    setActiveIndex(index);
  };

  const handleMouseOut = () => {
    setActiveIndex(null);
  };

  useEffect(() => {
    if (chartRef.current && (transacoes.length > 0 || metas.length > 0)) {
      const ctx = chartRef.current.getContext('2d');

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: prepareData(),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return 'R$ ' + value.toLocaleString('pt-BR');
                }
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': R$ ' + context.raw.toLocaleString('pt-BR');
                }
              }
            }
          },
          onClick: (event, elements) => {
            if (elements.length > 0) {
              setActiveIndex(elements[0].index);
            }
          }
        }
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [transacoes, metas]);

  const getDetailsForIndex = (index) => {
    const data = prepareData();
    const label = data.labels[index];
    const value = data.datasets[0].data[index];
    
    if (label === 'Gastos') {
      const gastosItems = transacoes.filter(t => t.tipo === 'gasto');
      return {
        label,
        value,
        items: gastosItems
      };
    } else if (label === 'Poupanças') {
      const poupancasItems = transacoes.filter(t => t.tipo === 'poupanca');
      return {
        label,
        value,
        items: poupancasItems
      };
    } else {
      return {
        label,
        value,
        items: metas
      };
    }
  };

  const activeDetails = activeIndex !== null ? getDetailsForIndex(activeIndex) : null;

  return (
    <Card title="Gráfico Comparativo">
      <div className="grafico-wrapper">
        <div className="chart-container">
          <canvas 
            ref={chartRef}
            onTouchStart={(e) => {
              const canvas = e.target;
              const rect = canvas.getBoundingClientRect();
              const x = e.touches[0].clientX - rect.left;
              const y = e.touches[0].clientY - rect.top;
              const points = chartInstance.current.getElementsAtEventForMode(
                {x, y, chart: chartInstance.current},
                'nearest',
                { intersect: true },
                false
              );
              if (points.length) handleTouchStart(points[0].index);
            }}
            onTouchEnd={handleTouchEnd}
            onMouseOut={handleMouseOut}
          />
        </div>
        
        {activeDetails && (
          <div className="grafico-detalhes">
            <h3>{activeDetails.label}: R$ {activeDetails.value.toFixed(2)}</h3>
            {activeDetails.items.length > 0 ? (
              <ul>
                {activeDetails.items.map(item => (
                  <li key={item.id}>
                    {item.descricao}: R$ {item.valor.toFixed(2)}
                    {item.data && <span> ({item.data})</span>}
                    {item.prazo && <span> - Prazo: {new Date(item.prazo).toLocaleDateString('pt-BR')}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum item registrado</p>
            )}
            <button 
              className="close-button"
              onClick={() => setActiveIndex(null)}
              aria-label="Fechar detalhes"
            >
              ×
            </button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default Grafico;