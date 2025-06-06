import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  Share, 
  Undo, 
  Redo, 
  Save, 
  Plus, 
  Send, 
  MessageCircle, 
  Smartphone, 
  RotateCcw 
} from 'lucide-react';
import './App.css';

const VhybZApp: React.FC = () => {
  const [view, setView] = useState<string>('render');
  const [message, setMessage] = useState('');

  const handleUndo = () => {
    // Placeholder for undo logic
  };

  const handleRedo = () => {
    // Placeholder for redo logic
  };

  const handleSave = () => {
    // Placeholder for quick save logic
  };

  const handleRevert = () => {
    // Placeholder for revert logic
  };

  const handleShare = () => {
    // Placeholder for revert logic
  };

  const handleSendMessage = () => {
    // Placeholder for sending message logic
    setMessage('');
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className='window'>
        {/* Header */}
        <header className='appbar'>
          <nav className='navbar'>
            <Button variant="ghost" size="icon" className="p-2">
              <img src="/logo.png" alt="VhybZ Logo" className='logo h-8 w-8'/>
            </Button>
            
            <ToggleGroup type="single" value={view} onValueChange={(value: string) => value && setView(value)} className="mx-4">
              <ToggleGroupItem value="render" aria-label="Render view">
                <Smartphone className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="chat" aria-label="Chat view">
                <MessageCircle className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share className="h-4 w-4" />
            </Button>
          </nav>
        </header>

        {/* Main Content */}
        <main className='content'>
          <Card className='container'>
            <div className="p-6 text-center text-muted-foreground">
              {view === 'render' ? 'Rendered content' : 'Chat history'}
            </div>
          </Card>
        </main>

        {/* Toolbar */}
        <div className='toolbar'>
          <div className="commands">
            <Button variant="ghost" size="icon" onClick={handleUndo}>
              <Undo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleRedo}>
              <Redo className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSave}>
              <Save className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleRevert}>
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRevert}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Prompt Input */}
        <div className="prompt">
          <Textarea
            placeholder="Prompt"
            value={message}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
            className="min-h-0 resize-none"
            rows={2}
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VhybZApp;