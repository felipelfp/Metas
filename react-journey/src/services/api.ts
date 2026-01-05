import { Objective } from '../components/Objectives';
import { Deposit } from '../components/DepositForm';

const API_URL = 'http://localhost:5011/api'; // Adjust port if needed (dotnet run usually uses 5000-5200)

export const api = {
    // Settings (Exchange Rate)
    getSettings: async () => {
        const response = await fetch(`${API_URL}/settings`);
        if (!response.ok) throw new Error('Failed to fetch settings');
        return response.json();
    },
    updateSettings: async (settings: { exchangeRate: number }) => {
        const response = await fetch(`${API_URL}/settings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
        });
        if (!response.ok) throw new Error('Failed to update settings');
        return response.json();
    },

    // Objectives
    getObjectives: async () => {
        const response = await fetch(`${API_URL}/objectives`);
        if (!response.ok) throw new Error('Failed to fetch objectives');
        return response.json();
    },
    saveObjective: async (objective: Objective) => {
        const response = await fetch(`${API_URL}/objectives`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(objective),
        });
        if (!response.ok) throw new Error('Failed to save objective');
        return response.json();
    },
    updateObjective: async (objective: Objective) => {
        const response = await fetch(`${API_URL}/objectives/${objective.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(objective),
        });
        if (!response.ok) throw new Error('Failed to update objective');
        // PUT usually returns 204 No Content, so we might not get JSON back
        return true;
    },

    // Transactions
    getTransactions: async () => {
        const response = await fetch(`${API_URL}/transactions`);
        if (!response.ok) throw new Error('Failed to fetch transactions');
        return response.json();
    },
    addTransaction: async (transaction: Deposit) => {
        const response = await fetch(`${API_URL}/transactions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction),
        });
        if (!response.ok) throw new Error('Failed to add transaction');
        return response.json();
    },
    deleteTransaction: async (id: number) => {
        const response = await fetch(`${API_URL}/transactions/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete transaction');
        return true;
    },
};
