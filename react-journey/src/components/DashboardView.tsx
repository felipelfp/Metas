import React from 'react';
import DepositForm, { Deposit } from './DepositForm';
import Statement from './Statement';
import './DashboardView.css';

import { Objective } from './Objectives';

interface DashboardViewProps {
    exchangeRate: number;
    transactions: Deposit[];
    onDeposit: (deposit: Deposit, objectiveId?: string) => void;
    accumulatedBRL: number;
    objectives: Objective[];
    onDelete: (id: number) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
    exchangeRate,
    transactions,
    onDeposit,
    accumulatedBRL,
    objectives,
    onDelete
}) => {
    const targetBRL = 200000;
    const totalMonths = 100;
    const totalDays = totalMonths * 30; // Approximation

    const monthlyGoal = targetBRL / totalMonths;
    const dailyGoal = targetBRL / totalDays;

    const progress = (accumulatedBRL / targetBRL) * 100;

    return (
        <div className="dashboard-view">
            <h2 className="section-title">Visão Geral</h2>

            <div className="dashboard-stats-grid">
                <div className="stat-card glass">
                    <span className="stat-icon">🎯</span>
                    <div className="stat-content">
                        <span className="stat-label">Meta Total</span>
                        <span className="stat-value">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(targetBRL)}
                        </span>
                    </div>
                </div>

                <div className="stat-card glass">
                    <span className="stat-icon">📅</span>
                    <div className="stat-content">
                        <span className="stat-label">Meta Mensal</span>
                        <span className="stat-value">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(monthlyGoal)}
                        </span>
                    </div>
                </div>

                <div className="stat-card glass">
                    <span className="stat-icon">📆</span>
                    <div className="stat-content">
                        <span className="stat-label">Meta Diária</span>
                        <span className="stat-value">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(dailyGoal)}
                        </span>
                    </div>
                </div>

                <div className="stat-card glass">
                    <span className="stat-icon">💰</span>
                    <div className="stat-content">
                        <span className="stat-label">Acumulado</span>
                        <span className="stat-value highlight">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(accumulatedBRL)}
                        </span>
                    </div>
                </div>

                <div className="stat-card glass">
                    <span className="stat-icon">📈</span>
                    <div className="stat-content">
                        <span className="stat-label">Progresso</span>
                        <span className="stat-value">{progress.toFixed(2)}%</span>
                        <div className="mini-progress-bar">
                            <div className="mini-progress-fill" style={{ width: `${Math.min(progress, 100)}%` }}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="dashboard-actions-area">
                <div className="action-section">
                    <DepositForm exchangeRate={exchangeRate} onDeposit={onDeposit} objectives={objectives} />
                </div>
                <div className="statement-section">
                    <Statement transactions={transactions} onDelete={onDelete} />
                </div>
            </div>
        </div>
    );
};

export default DashboardView;
