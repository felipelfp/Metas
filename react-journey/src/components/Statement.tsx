import React from 'react';
import { Deposit } from './DepositForm';
import './Statement.css';

interface StatementProps {
    transactions: Deposit[];
    onDelete: (id: number) => void;
}

const Statement: React.FC<StatementProps> = ({ transactions, onDelete }) => {
    return (
        <div className="statement-container glass">
            <h3 className="statement-title">Extrato Recente</h3>

            <div className="statement-list">
                {transactions.length === 0 ? (
                    <div className="empty-state">
                        <span>Nenhuma transação registrada</span>
                    </div>
                ) : (
                    transactions.map((tx) => (
                        <div key={tx.id} className="transaction-item">
                            <div className="tx-left">
                                <span className="tx-icon">🏦</span>
                                <div className="tx-details">
                                    <span className="tx-bank">{tx.bank}</span>
                                    <span className="tx-date">{new Date(tx.date).toLocaleDateString('pt-BR')} • {tx.time}</span>
                                </div>
                            </div>
                            <div className="tx-right">
                                <div className="tx-values">
                                    <span className="tx-amount positive">
                                        + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(tx.amountBRL)}
                                    </span>
                                    <span className="tx-usd">
                                        ({new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tx.amountUSD)})
                                    </span>
                                </div>
                                <button
                                    className="delete-btn"
                                    onClick={() => onDelete(Number(tx.id))}
                                    title="Excluir transação"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Statement;
