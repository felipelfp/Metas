import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './Sidebar.css';

interface SidebarProps {
    activeSection: string;
    setActiveSection: (section: string) => void;
    isOpen: boolean;
    onClose: () => void;
    onLogout?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection, isOpen, onClose, onLogout }) => {
    const { theme, toggleTheme } = useTheme();

    const menuItems = [
        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
        { id: 'meta', icon: '🎯', label: 'Meta & Saldo' },
        { id: 'br_goals', icon: '🇧🇷', label: 'Objetivos BR' },
        { id: 'usa_goals', icon: '🇺🇸', label: 'Objetivos USA' },
        { id: 'emergency', icon: '🚨', label: 'Emergência' },
        { id: 'report', icon: '📈', label: 'Relatório' },
    ];

    const handleItemClick = (id: string) => {
        console.log('Sidebar item clicked:', id);
        setActiveSection(id);
        onClose(); // Close sidebar on mobile when item clicked
    };

    return (
        <div className={`sidebar glass ${isOpen ? 'mobile-open' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <span className="logo-icon">🚀</span>
                </div>
                <button className="close-sidebar-btn" onClick={onClose}>✕</button>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        className={`nav-item ${activeSection === item.id ? 'active' : ''}`}
                        onClick={() => handleItemClick(item.id)}
                        title={item.label}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <button className="logout-btn" onClick={onLogout} title="Sair do Sistema">
                    <span className="nav-icon">🚪</span>
                    <span className="nav-label">Sair</span>
                </button>
                <button className="theme-toggle-btn" onClick={toggleTheme} title="Alternar Tema">
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
            </div>
        </div>
    );
};


export default Sidebar;
