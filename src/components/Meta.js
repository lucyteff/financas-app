import React, { useState } from 'react';
import Card from './Card';
import './Meta.css';

const Meta = ({ onAdicionarMeta }) => {
  const [formData, setFormData] = useState({
    descricao: '',
    valor: '',
    prazo: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Validação em tempo real
    if (name === 'valor' && value && isNaN(value)) {
      setErrors({...errors, valor: 'Digite um valor numérico'});
    } else if (name === 'prazo' && value) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(value);
      
      if (selectedDate < today) {
        setErrors({...errors, prazo: 'A data não pode ser no passado'});
      } else {
        const newErrors = {...errors};
        delete newErrors.prazo;
        setErrors(newErrors);
      }
    } else {
      const newErrors = {...errors};
      delete newErrors[name];
      setErrors(newErrors);
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
    if (!formData.prazo) newErrors.prazo = 'Prazo é obrigatório';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }
    
    try {
      const novaMeta = {
        descricao: formData.descricao.trim(),
        valor: parseFloat(formData.valor),
        prazo: formData.prazo,
        dataCriacao: new Date().toLocaleDateString('pt-BR')
      };
      
      await onAdicionarMeta(novaMeta);
      
      // Reset form on success
      setFormData({
        descricao: '',
        valor: '',
        prazo: ''
      });
      setErrors({});
    } catch (error) {
      console.error("Erro ao adicionar meta:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calcula a data mínima (amanhã) para o campo de data
  const today = new Date();
  today.setDate(today.getDate() + 1);
  const minDate = today.toISOString().split('T')[0];

  return (
    <Card title="Adicionar Meta Financeira">
      <form onSubmit={handleSubmit} className="meta-form">
        <div className={`form-group ${errors.descricao ? 'has-error' : ''}`}>
          <label htmlFor="descricao">Descrição</label>
          <input
            type="text"
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Ex: Viagem, Carro novo..."
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
        
        <div className={`form-group ${errors.prazo ? 'has-error' : ''}`}>
          <label htmlFor="prazo">Prazo</label>
          <input
            type="date"
            id="prazo"
            name="prazo"
            value={formData.prazo}
            onChange={handleChange}
            min={minDate}
            aria-describedby={errors.prazo ? "prazo-error" : undefined}
          />
          {errors.prazo && (
            <span id="prazo-error" className="error-message">{errors.prazo}</span>
          )}
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adicionando...' : 'Adicionar Meta'}
        </button>
      </form>
    </Card>
  );
};

export default Meta;