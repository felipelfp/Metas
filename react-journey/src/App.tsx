import React, { useEffect, useState } from 'react';
import Clock from './components/Clock';
import JourneyInfo from './components/JourneyInfo';
import ReportView from './components/ReportView';
import Objectives, { initialObjectives, Objective } from './components/Objectives';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import LoginView from './components/LoginView';
import { Deposit } from './components/DepositForm';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import './App.css';

import { api } from './services/api';

const AppContent: React.FC = () => {
    const { theme } = useTheme();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [activeSection, setActiveSection] = useState('dashboard');

    // Exchange Rate State
    const [exchangeRate, setExchangeRate] = useState<number>(5.0);
    const [loadingRate, setLoadingRate] = useState<boolean>(true);
    const [isAutoRate, setIsAutoRate] = useState<boolean>(true);

    // Financial State
    const [transactions, setTransactions] = useState<Deposit[]>([]);
    const [accumulatedBRL, setAccumulatedBRL] = useState<number>(0);
    const [objectives, setObjectives] = useState<Objective[]>(initialObjectives);
    const [isSaving, setIsSaving] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        if (!isAuthenticated) return;

        const loadData = async () => {
            try {
                setLoadingRate(true);

                // Load Settings
                const settings = await api.getSettings();
                setExchangeRate(settings.exchangeRate);

                // Load Objectives
                const objs = await api.getObjectives();
                if (objs && objs.length > 0) {
                    setObjectives(objs);
                } else {
                    // Seed initial objectives if empty
                    for (const obj of initialObjectives) {
                        await api.saveObjective(obj);
                    }
                }

                // Load Transactions
                const txs = await api.getTransactions();
                setTransactions(txs);

                // Calculate total accumulated
                const total = txs.reduce((acc: number, tx: Deposit) => acc + tx.amountBRL, 0);
                setAccumulatedBRL(total);

            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoadingRate(false);
            }
        };
        loadData();
    }, [isAuthenticated]);

    const fetchRate = async () => {
        setLoadingRate(true);
        try {
            const response = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL');
            const data = await response.json();
            if (data.USDBRL && data.USDBRL.bid) {
                const newRate = parseFloat(data.USDBRL.bid);
                setExchangeRate(newRate);
                // Update backend
                await api.updateSettings({ exchangeRate: newRate });
            }
        } catch (error) {
            console.error('Error fetching exchange rate:', error);
        } finally {
            setLoadingRate(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && isAutoRate) {
            fetchRate();
            // Optional: Set up an interval for auto-updates if desired
        }
    }, [isAuthenticated, isAutoRate]);

    const handleDeposit = async (deposit: Deposit, objectiveId?: string) => {
        setIsSaving(true);
        try {
            // Save transaction
            const savedTx = await api.addTransaction(deposit);
            const updatedTransactions = [savedTx, ...transactions];
            setTransactions(updatedTransactions);
            setAccumulatedBRL(prev => prev + deposit.amountBRL);

            if (objectiveId) {
                const objToUpdate = objectives.find(o => o.id === objectiveId);
                if (objToUpdate) {
                    const updatedObj = {
                        ...objToUpdate,
                        accumulatedBRL: objToUpdate.accumulatedBRL + deposit.amountBRL
                    };

                    // Update local state
                    setObjectives(prev => prev.map(o => o.id === objectiveId ? updatedObj : o));

                    // Update backend
                    await api.updateObjective(updatedObj);
                }
            }
        } catch (error) {
            console.error('Error saving deposit:', error);
            alert('Erro ao salvar depósito. Tente novamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleComplete = async (id: string) => {
        const objToUpdate = objectives.find(o => o.id === id);
        if (objToUpdate) {
            const updatedObj = { ...objToUpdate, completed: !objToUpdate.completed };

            // Optimistic update
            setObjectives(prev => prev.map(o => o.id === id ? updatedObj : o));

            try {
                await api.updateObjective(updatedObj);
            } catch (error) {
                console.error('Error updating objective:', error);
                // Revert on error
                setObjectives(prev => prev.map(o => o.id === id ? objToUpdate : o));
            }
        }
    };

    const handleManualRateChange = async (newRate: number) => {
        setExchangeRate(newRate);
        setIsAutoRate(false);
        try {
            await api.updateSettings({ exchangeRate: newRate });
        } catch (error) {
            console.error('Error saving rate:', error);
        }
    };

    const handleDeleteTransaction = async (id: number) => {
        if (!window.confirm('Tem certeza que deseja excluir esta transação?')) return;

        try {
            await api.deleteTransaction(id);

            const txToDelete = transactions.find(t => t.id === id);
            if (txToDelete) {
                // Update transactions list
                setTransactions(prev => prev.filter(t => t.id !== id));

                // Update accumulated balance
                setAccumulatedBRL(prev => prev - txToDelete.amountBRL);

                // Update objective if linked
                if (txToDelete.objectiveId) {
                    const objToUpdate = objectives.find(o => o.id === txToDelete.objectiveId);
                    if (objToUpdate) {
                        const updatedObj = {
                            ...objToUpdate,
                            accumulatedBRL: objToUpdate.accumulatedBRL - txToDelete.amountBRL
                        };
                        setObjectives(prev => prev.map(o => o.id === txToDelete.objectiveId ? updatedObj : o));

                        await api.updateObjective(updatedObj);
                    }
                }
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('Erro ao excluir transação.');
        }
    };

    const renderContent = () => {
        console.log('Rendering content for section:', activeSection);
        switch (activeSection) {
            case 'dashboard':
                return (
                    <DashboardView
                        exchangeRate={exchangeRate}
                        transactions={transactions}
                        onDeposit={handleDeposit}
                        accumulatedBRL={accumulatedBRL}
                        objectives={objectives}
                        onDelete={handleDeleteTransaction}
                    />
                );
            case 'meta':
                return <JourneyInfo exchangeRate={exchangeRate} accumulatedBRL={accumulatedBRL} />;
            case 'br_goals':
                return <Objectives category="BR" objectives={objectives} onToggleComplete={handleToggleComplete} exchangeRate={exchangeRate} />;
            case 'usa_goals':
                return <Objectives category="USA" objectives={objectives} onToggleComplete={handleToggleComplete} exchangeRate={exchangeRate} />;

            case 'emergency':
                return <Objectives category="EMERGENCY" objectives={objectives} onToggleComplete={handleToggleComplete} exchangeRate={exchangeRate} />;
            case 'report':
                return <ReportView accumulatedBRL={accumulatedBRL} objectives={objectives} />;
            default:
                return (
                    <DashboardView
                        exchangeRate={exchangeRate}
                        transactions={transactions}
                        onDeposit={handleDeposit}
                        accumulatedBRL={accumulatedBRL}
                        objectives={objectives}
                        onDelete={handleDeleteTransaction}
                    />
                );
        }
    };

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    const handleLogout = () => {
        setIsAuthenticated(false);
        setActiveSection('dashboard');
    };

    if (!isAuthenticated) {
        return <LoginView onLogin={setIsAuthenticated} />;
    }

    return (
        <div className="app-layout">
            <Sidebar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                onLogout={handleLogout}
            />

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
            )}

            <main className="main-content">
                <header className="top-bar glass">
                    <div className="header-left">
                        <button className="hamburger-btn" onClick={toggleSidebar}>
                            ☰
                        </button>
                        <h1 className="page-title">
                            {activeSection === 'dashboard' && 'Dashboard'}
                            {activeSection === 'meta' && 'Meta & Saldo'}
                            {activeSection === 'br_goals' && 'Objetivos Brasil'}
                            {activeSection === 'usa_goals' && 'Objetivos USA'}
                            {activeSection === 'emergency' && 'Reserva de Emergência'}
                            {activeSection === 'report' && 'Relatório Financeiro'}
                        </h1>
                    </div>

                    <div className="header-controls">
                        <Clock />

                        <div className="exchange-rate-badge">
                            <span className="rate-label">USD/BRL</span>
                            {loadingRate ? (
                                <span className="rate-value">...</span>
                            ) : (
                                <div className="rate-controls">
                                    <input
                                        type="number"
                                        value={exchangeRate}
                                        onChange={(e) => handleManualRateChange(parseFloat(e.target.value))}
                                        step="0.01"
                                        className={`rate-input-small ${!isAutoRate ? 'manual' : ''}`}
                                        title={isAutoRate ? "Atualização Automática" : "Valor Manual"}
                                    />
                                    <button
                                        className={`rate-toggle-btn ${isAutoRate ? 'active' : ''}`}
                                        onClick={() => {
                                            if (!isAutoRate) {
                                                setIsAutoRate(true);
                                            } else {
                                                fetchRate(); // Refresh if already auto
                                            }
                                        }}
                                        title={isAutoRate ? "Atualizar Agora" : "Ativar Atualização Automática"}
                                    >
                                        {isAutoRate ? '🔄' : '✏️'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </header>

                <div className="content-area">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
};

export default App;
