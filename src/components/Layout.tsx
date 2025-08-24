import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChatInterface } from './ChatInterface';
import { PrebuiltGPTsInterface } from './PrebuiltGPTsInterface';
import { CustomGPTsInterface } from './CustomGPTsInterface';
import { TrainingModeInterface } from './TrainingModeInterface';
import { DashboardInterface } from './DashboardInterface';

interface LayoutProps {
  children?: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [selectedGPT, setSelectedGPT] = useState<{ id: string; name: string; type: 'prebuilt' | 'custom' } | null>(null);
  const [activeInterface, setActiveInterface] = useState<'chat' | 'prebuilt' | 'custom' | 'training' | 'dashboard'>('chat');

  const handleGPTSelect = (gpt: { id: string; name: string; type: 'prebuilt' | 'custom' }) => {
    setSelectedGPT(gpt);
    setActiveInterface('chat');
  };

  const handleInterfaceChange = (interfaceType: 'chat' | 'prebuilt' | 'custom' | 'training' | 'dashboard') => {
    setActiveInterface(interfaceType);
  };

  const renderMainContent = () => {
    if (children) return children;
    
    switch (activeInterface) {
      case 'prebuilt':
        return <PrebuiltGPTsInterface onGPTSelect={handleGPTSelect} />;
      case 'custom':
        return <CustomGPTsInterface onGPTSelect={handleGPTSelect} />;
      case 'training':
        return <TrainingModeInterface />;
      case 'dashboard':
        return <DashboardInterface />;
      default:
        return <ChatInterface selectedGPT={selectedGPT} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar 
          onGPTSelect={handleGPTSelect} 
          selectedGPT={selectedGPT}
          onInterfaceChange={handleInterfaceChange}
          activeInterface={activeInterface}
        />
        <main className="flex-1">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};