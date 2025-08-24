import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { DemoChatInterface } from './DemoChatInterface';
import { PrebuiltGPTsInterface } from './PrebuiltGPTsInterface';
import { CustomGPTsInterface } from './CustomGPTsInterface';
import { TrainingModeInterface } from './TrainingModeInterface';
import { DashboardInterface } from './DashboardInterface';

interface DemoLayoutProps {
  children?: ReactNode;
}

export const DemoLayout = ({ children }: DemoLayoutProps) => {
  const [selectedGPT, setSelectedGPT] = useState<{ id: string; name: string; type: 'prebuilt' | 'custom' } | null>(null);
  const [activeInterface, setActiveInterface] = useState<'chat' | 'prebuilt' | 'custom' | 'training' | 'dashboard'>('chat');
  const navigate = useNavigate();

  const handleGPTSelect = (gpt: { id: string; name: string; type: 'prebuilt' | 'custom' }) => {
    setSelectedGPT(gpt);
    setActiveInterface('chat');
  };

  const handleInterfaceChange = (interfaceType: 'chat' | 'prebuilt' | 'custom' | 'training' | 'dashboard') => {
    setActiveInterface(interfaceType);
    // Clear selected GPT when navigating away from chat OR when explicitly going to chat (home)
    if (interfaceType !== 'chat' || interfaceType === 'chat') {
      setSelectedGPT(null);
    }
  };

  const handleHomeClick = () => {
    setActiveInterface('chat');
    setSelectedGPT(null);
  };

  const handleUpgrade = () => {
    navigate('/auth');
  };

  const renderMainContent = () => {
    if (children) return children;
    
    switch (activeInterface) {
      case 'prebuilt':
        return <PrebuiltGPTsInterface onGPTSelect={handleGPTSelect} isDemo={true} onUpgrade={handleUpgrade} />;
      case 'custom':
        return <CustomGPTsInterface onGPTSelect={handleGPTSelect} isDemo={true} onUpgrade={handleUpgrade} />;
      case 'training':
        return <TrainingModeInterface isDemo={true} onUpgrade={handleUpgrade} />;
      case 'dashboard':
        return <DashboardInterface isDemo={true} onUpgrade={handleUpgrade} />;
      default:
        return <DemoChatInterface selectedGPT={selectedGPT} onInterfaceChange={handleInterfaceChange} onUpgrade={handleUpgrade} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header onHomeClick={handleHomeClick} isDemo={true} onUpgrade={handleUpgrade} />
      <div className="flex">
        <Sidebar 
          onGPTSelect={handleGPTSelect} 
          selectedGPT={selectedGPT}
          onInterfaceChange={handleInterfaceChange}
          activeInterface={activeInterface}
          isDemo={true}
        />
        <main className="flex-1">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};