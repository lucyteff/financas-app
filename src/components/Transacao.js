import React, { useState } from 'react';
import Card from './Card';
import './Transacao.css';

const Transacao = ({ onAdicionarTransacao }) => {
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    tipo: 'gasto'
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validação
    if (name === 'valor') {
      if (value && isNaN(value)) {
        setErrors({...errors, valor: 'Digite um valor numérico'});
      } else {
        const newErrors = {...errors};
        delete newErrors.valor;
        setErrors(newErrors);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validação final
    const newErrors = {};
    if (!formData.descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!formData.valor) newErrors.valor = 'Valor é obrigatório';
    if (formData.valor && isNaN(formData.valor)) newErrors.valor = 'Valor inválido';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      const novaTransacao = {
        descricao: formData.descricao.trim(),
        valor: parseFloat(formData.valor),
        tipo: formData.tipo,
        data: new Date().toLocaleDateString('pt-BR')
      };
      
      await onAdicionarTransacao(novaTransacao);
      
      setFormData({
        descricao: '',
        valor: '',
        tipo: 'gasto'
      });
      setErrors({});
    } catch (error) {
      console.error("Erro ao adicionar transação:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card title="Adicionar Transação">
      <form onSubmit={handleSubmit} className="transacao-form">
        <div className={`form-group ${errors.descricao ? 'has-error' : ''}`}>
          <label htmlFor="descricao">Descrição</label>
          <input
            type="text"
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Ex: Aluguel, Salário..."
            aria-describedby={errors.descricao ? "descricao-error" : undefined}
          />
          {errors.descricao && (
            <span id="descricao-error" className="error-message">{errors.descricao}</span>
          )}
        </div>
        
        <div className={`form-group ${errors.valor ? 'has-error' : ''}`}>
          <label htmlFor="valor">Valor (R$)</label>
          <input
            type="text"
            inputMode="decimal"
            id="valor"
            name="valor"
            value={formData.valor}
            onChange={handleChange}
            placeholder="0,00"
            aria-describedby={errors.valor ? "valor-error" : undefined}
          />
          {errors.valor && (
            <span id="valor-error" className="error-message">{errors.valor}</span>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="tipo">Tipo</label>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                name="tipo"
                value="gasto"
                checked={formData.tipo === 'gasto'}
                onChange={handleChange}
              />
              <span>Gasto</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="tipo"
                value="poupanca"
                checked={formData.tipo === 'poupanca'}
                onChange={handleChange}
              />
              <span>Poupança</span>
            </label>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adicionando...' : 'Adicionar Transação'}
        </button>
      </form>
    </Card>
  );
};

export default Transacao;