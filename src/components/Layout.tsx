import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { ChatInterface } from './ChatInterface';

interface LayoutProps {
  children?: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [selectedGPT, setSelectedGPT] = useState<{ id: string; name: string; type: 'prebuilt' | 'custom' } | null>(null);

  const handleGPTSelect = (gpt: { id: string; name: string; type: 'prebuilt' | 'custom' }) => {
    setSelectedGPT(gpt);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar onGPTSelect={handleGPTSelect} selectedGPT={selectedGPT} />
        <main className="flex-1">
          {children || <ChatInterface selectedGPT={selectedGPT} />}
        </main>
      </div>
    </div>
  );
};