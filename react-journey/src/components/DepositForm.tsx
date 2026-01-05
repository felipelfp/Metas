import React, { useState, useEffect } from 'react';
import './DepositForm.css';
import { Objective } from './Objectives';

interface DepositFormProps {
    exchangeRate: number;
    onDeposit: (deposit: Deposit, objectiveId?: string) => void;
    objectives: Objective[];
}

export interface Deposit {
    id: number | string;
    date: string;
    time: string;
    amountBRL: number;
    amountUSD: number;
    bank: string;
    objectiveId?: string;
}

const DepositForm: React.FC<DepositFormProps> = ({ exchangeRate, onDeposit, objectives }) => {
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [amountBRL, setAmountBRL] = useState('');
    const [amountUSD, setAmountUSD] = useState('');
    const [bank, setBank] = useState('');
    const [selectedObjectiveId, setSelectedObjectiveId] = useState<string>('');

    useEffect(() => {
        // Set default date and time to now
        const now = new Date();
        setDate(now.toISOString().split('T')[0]);
        setTime(now.toTimeString().split(' ')[0].substring(0, 5));
    }, []);

    const handleBRLChange = (value: string) => {
        setAmountBRL(value);
        const brl = parseFloat(value);
        if (!isNaN(brl) && exchangeRate > 0) {
            setAmountUSD((brl / exchangeRate).toFixed(2));
        } else {
            setAmountUSD('');
        }
    };

    const handleUSDChange = (value: string) => {
        setAmountUSD(value);
        const usd = parseFloat(value);
        if (!isNaN(usd) && exchangeRate > 0) {
            setAmountBRL((usd * exchangeRate).toFixed(2));
        } else {
            setAmountBRL('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amountBRL || !bank) return;

        const newDeposit: Deposit = {
            id: 0, // Backend will generate ID
            date,
            time,
            amountBRL: parseFloat(amountBRL),
            amountUSD: parseFloat(amountUSD),
            bank,
            objectiveId: selectedObjectiveId || undefined,
        };

        onDeposit(newDeposit, selectedObjectiveId || undefined);

        // Reset amount fields but keep date/time/bank for convenience
        setAmountBRL('');
        setAmountUSD('');
        setSelectedObjectiveId('');
    };

    return (
        <form className="deposit-form glass" onSubmit={handleSubmit}>
            <h3 className="form-title">Novo Depósito</h3>

            <div className="form-row">
                <div className="form-group">
                    <label>Data</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Hora</label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Valor (BRL)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={amountBRL}
                        onChange={(e) => handleBRLChange(e.target.value)}
                        placeholder="R$ 0,00"
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Valor (USD)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={amountUSD}
                        onChange={(e) => handleUSDChange(e.target.value)}
                        placeholder="$ 0.00"
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Banco / Origem</label>
                <input
                    type="text"
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    placeholder="Ex: Nubank, Inter, Bradesco..."
                    required
                />
            </div>

            <div className="form-group">
                <label>Destino (Opcional)</label>
                <select
                    value={selectedObjectiveId}
                    onChange={(e) => setSelectedObjectiveId(e.target.value)}
                    className="objective-select"
                >
                    <option value="">Saldo Geral (Sem objetivo específico)</option>
                    {objectives.map((obj) => (
                        <option key={obj.id} value={obj.id}>
                            {obj.icon} {obj.name}
                        </option>
                    ))}
                </select>
            </div>

            <button type="submit" className="submit-btn">
                Adicionar Depósito
            </button>
        </form>
    );
};

export default DepositForm;
