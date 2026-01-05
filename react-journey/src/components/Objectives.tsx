import React from 'react';
import './Objectives.css';

export interface Objective {
    id: string;
    icon: string;
    name: string;
    targetBRL: number;
    targetUSD: number;
    accumulatedBRL: number;
    completed: boolean;
    category: 'BR' | 'USA' | 'EMERGENCY';
}

export const initialObjectives: Objective[] = [
    {
        id: 'peugeot',
        icon: '🚘',
        name: 'Peugeot 308',
        targetBRL: 44500,
        targetUSD: 44500 / 5,
        accumulatedBRL: 0,
        completed: false,
        category: 'BR',
    },
    {
        id: 'iphone',
        icon: '📱',
        name: 'iPhone 15 Pro (x2)',
        targetBRL: 10000,
        targetUSD: 2000,
        accumulatedBRL: 0,
        completed: false,
        category: 'BR',
    },
    {
        id: 'passport',
        icon: '📘',
        name: 'Passaporte (2 pessoas)',
        targetUSD: 300 * 2,
        targetBRL: 300 * 2 * 5,
        accumulatedBRL: 0,
        completed: false,
        category: 'USA',
    },
    {
        id: 'visa',
        icon: '🛂',
        name: 'Visto (2 pessoas)',
        targetUSD: (1400 * 2) / 5,
        targetBRL: 1400 * 2,
        accumulatedBRL: 0,
        completed: false,
        category: 'USA',
    },
    {
        id: 'flights',
        icon: '✈️',
        name: 'Passagens (2 pessoas)',
        targetUSD: (3000 * 2) / 5,
        targetBRL: 3000 * 2,
        accumulatedBRL: 0,
        completed: false,
        category: 'USA',
    },
    {
        id: 'first_shop',
        icon: '🛒',
        name: 'Primeira Compra USA',
        targetUSD: 600,
        targetBRL: 600 * 5,
        accumulatedBRL: 0,
        completed: false,
        category: 'USA',
    },
    {
        id: 'clothes',
        icon: '👕',
        name: 'Roupas Novas',
        targetUSD: 1000,
        targetBRL: 1000 * 5,
        accumulatedBRL: 0,
        completed: false,
        category: 'USA',
    },
    {
        id: 'rent',
        icon: '🏠',
        name: 'Aluguel USA (1º Mês)',
        targetUSD: 10000,
        targetBRL: 10000 * 5,
        accumulatedBRL: 0,
        completed: false,
        category: 'USA',
    },
    {
        id: 'car_usa',
        icon: '🚙',
        name: 'Carro USA',
        targetUSD: 5000,
        targetBRL: 5000 * 5,
        accumulatedBRL: 0,
        completed: false,
        category: 'USA',
    },
    {
        id: 'furniture',
        icon: '🛋️',
        name: 'Mobília USA',
        targetUSD: 3000,
        targetBRL: 3000 * 5,
        accumulatedBRL: 0,
        completed: false,
        category: 'USA',
    },
    {
        id: 'return_ticket',
        icon: '🔙',
        name: 'Passagem de Volta',
        targetUSD: 1440,
        targetBRL: 7200,
        accumulatedBRL: 0,
        completed: false,
        category: 'EMERGENCY',
    },
    {
        id: 'emergency_fund',
        icon: '🆘',
        name: 'Uso de Emergência',
        targetUSD: 5700,
        targetBRL: 28500,
        accumulatedBRL: 0,
        completed: false,
        category: 'EMERGENCY',
    },
];

interface ObjectivesProps {
    category: 'BR' | 'USA' | 'EMERGENCY';
    objectives: Objective[];
    onToggleComplete: (id: string) => void;
    exchangeRate: number;
}

const Objectives: React.FC<ObjectivesProps> = ({ category, objectives, onToggleComplete, exchangeRate }) => {
    const filteredObjectives = objectives
        .filter(obj => obj.category === category);

    const getDisplayValues = (obj: Objective) => {
        let displayTargetBRL = obj.targetBRL;
        let displayTargetUSD = obj.targetUSD;

        // Recalculate based on category and current rate
        if (obj.category === 'USA') {
            // Fixed in USD, fluctuate BRL
            displayTargetBRL = obj.targetUSD * exchangeRate;
        } else {
            // Fixed in BRL (BR/EMERGENCY), fluctuate USD
            displayTargetUSD = obj.targetBRL / exchangeRate;
        }

        return { displayTargetBRL, displayTargetUSD };
    };

    return (
        <div className="objectives-section">
            <h2 className="objectives-title">Objetivos {category}</h2>
            <div className="objectives-list">
                {filteredObjectives.map((obj) => {
                    const { displayTargetBRL, displayTargetUSD } = getDisplayValues(obj);
                    return (
                        <div
                            key={obj.id}
                            className={`objective-card-expanded glass ${obj.completed ? 'completed' : ''}`}
                        >
                            <div className="card-header">
                                <span className="objective-icon">{obj.icon}</span>
                                <div className="header-info">
                                    <h3 className="card-title">{obj.name}</h3>
                                    <div className="status-badge">
                                        {obj.completed ? 'Concluído' : 'Em andamento'}
                                    </div>
                                </div>
                                <label className="complete-checkbox-compact">
                                    <input
                                        type="checkbox"
                                        checked={obj.completed}
                                        onChange={() => onToggleComplete(obj.id)}
                                    />
                                </label>
                            </div>

                            <div className="card-body">
                                <div className="stat-row">
                                    <span>Meta (BRL)</span>
                                    <strong>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(displayTargetBRL)}</strong>
                                </div>
                                <div className="stat-row">
                                    <span>Meta (USD)</span>
                                    <strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(displayTargetUSD)}</strong>
                                </div>
                                <div className="stat-row">
                                    <span>Acumulado (BRL)</span>
                                    <strong className="highlight-value">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(obj.accumulatedBRL)}</strong>
                                </div>
                                <div className="stat-row">
                                    <span>Acumulado (USD)</span>
                                    <strong className="highlight-value-usd">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(obj.accumulatedBRL / exchangeRate)}</strong>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Objectives;
