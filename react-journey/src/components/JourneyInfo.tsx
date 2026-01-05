import React, { useState } from 'react';
import './JourneyInfo.css';

interface JourneyInfoProps {
    exchangeRate: number;
    accumulatedBRL: number;
}

const JourneyInfo: React.FC<JourneyInfoProps> = ({ exchangeRate, accumulatedBRL }) => {
    console.log('JourneyInfo rendering with:', { exchangeRate, accumulatedBRL });
    const [currentMonth, setCurrentMonth] = useState(1);
    const totalMonths = 100;
    const targetBRL = 200000;
    const monthlyContribution = 2000;

    const handlePrevMonth = () => {
        if (currentMonth > 1) setCurrentMonth(prev => prev - 1);
    };

    const handleNextMonth = () => {
        if (currentMonth < totalMonths) setCurrentMonth(prev => prev + 1);
    };

    // Use real accumulated value for progress, but keep month nav for projection/simulation if desired
    // Or we can just show the real progress based on accumulatedBRL
    const progress = (accumulatedBRL / targetBRL) * 100;
    const targetUSD = targetBRL / exchangeRate;

    return (
        <div className="journey-card glass">
            <h2>Test Journey Info</h2>
        </div>
    );
};

export default JourneyInfo;
