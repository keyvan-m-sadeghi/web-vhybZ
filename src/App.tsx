import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { 
  Share2, 
  Undo, 
  Redo, 
  Save, 
  Plus, 
  ArrowUp, 
  MessageCircle, 
  Smartphone, 
  RotateCcw,
  Mic 
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

  const handleTools = () => {
    // Placeholder for tools logic
  };

  const handleMicrophone = () => {
    // Placeholder for microphone logic
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground antialiased">
      <div className='window'>
        {/* Header */}
        <header className='appbar'>
          <nav className='navbar'>
            <Button variant="ghost" size="icon" className="p-0 m-0 bg-transparent border-transparent shadow-none hover:bg-accent/10 focus:bg-transparent active:bg-transparent transition-colors" style={{color: 'hsl(var(--foreground))'}}>
              <img src="/logo.png" alt="VhybZ Logo" className='logo h-6 w-6'/>
            </Button>
            
            <div className="flex items-center bg-transparent border-transparent">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('render')}
                className="p-0 m-0 px-3 py-2 bg-transparent border-transparent shadow-none hover:bg-accent/10 focus:bg-transparent active:bg-transparent transition-colors"
                style={{color: view === 'render' ? 'hsl(var(--foreground))' : 'hsl(var(--foreground) / 0.7)'}}
              >
                <Smartphone className="size-5" style={{color: 'hsl(var(--foreground))'}} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('chat')}
                className="p-0 m-0 px-3 py-2 bg-transparent border-transparent shadow-none hover:bg-accent/10 focus:bg-transparent active:bg-transparent transition-colors"
                style={{color: view === 'chat' ? 'hsl(var(--foreground))' : 'hsl(var(--foreground) / 0.7)'}}
              >
                <MessageCircle className="size-5" style={{color: 'hsl(var(--foreground))'}} />
              </Button>
            </div>
            
            <Button variant="ghost" size="icon" onClick={handleShare} className="p-0 m-0 bg-transparent border-transparent shadow-none hover:bg-accent/10 focus:bg-transparent active:bg-transparent transition-colors" style={{color: 'hsl(var(--foreground))'}}>
              <Share2 className="size-5" style={{color: 'hsl(var(--foreground))'}} />
            </Button>
          </nav>
        </header>

        {/* Main Content */}
        <main className='content'>
          <Card className='container border-transparent shadow-none bg-transparent'>
            <CardHeader className="flex flex-col items-center justify-center text-center pb-4">
              <CardTitle className="text-2xl font-semibold text-foreground mb-3">
                {view === 'render' ? 'Rendered content' : 'Chat history'}
              </CardTitle>
              <CardDescription className="text-center text-foreground/75 text-lg leading-relaxed max-w-md">
                {view === 'render' 
                  ? 'Your generated artifacts will appear here' 
                  : 'Your conversation history will be displayed here'
                }
              </CardDescription>
            </CardHeader>
          </Card>
        </main>

        {/* Toolbar */}
        <div className='toolbar'>
          <div className="commands">
            <Button variant="ghost" size="icon" onClick={handleUndo} className="text-foreground hover:bg-neutral-700/50 active:bg-neutral-600/50 transition-colors" title="Undo">
              <Undo className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleRedo} className="text-foreground hover:bg-neutral-700/50 active:bg-neutral-600/50 transition-colors" title="Redo">
              <Redo className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSave} className="text-foreground hover:bg-neutral-700/50 active:bg-neutral-600/50 transition-colors" title="Save">
              <Save className="size-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleRevert} className="text-foreground hover:bg-neutral-700/50 active:bg-neutral-600/50 transition-colors" title="Restore">
              <RotateCcw className="size-5" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRevert} className="text-foreground hover:bg-neutral-700/50 active:bg-neutral-600/50 transition-colors" title="Add">
            <Plus className="size-5" />
          </Button>
        </div>

        {/* Prompt Input */}
        <div className="px-4 pb-4">
          <div className="prompt mb-3">
            <Button 
              variant="ghost" 
              onClick={handleTools}
              className="p-0 border-0 shadow-none bg-transparent hover:bg-transparent focus:bg-transparent"
              title="Tools"
            >
              <div className="flex items-center px-2 py-1.5 text-neutral-300 hover:text-neutral-100 hover:bg-neutral-700 active:bg-neutral-600 rounded-lg transition-colors">
                <Plus className="size-5 mr-1.5" />
                <span className="text-sm">Tools</span>
              </div>
            </Button>
            
            <Textarea
              placeholder="Craft something beautiful..."
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              className="flex-1 bg-transparent border-0 focus:ring-0 text-foreground placeholder:text-neutral-400 resize-none text-sm py-1.5 min-h-0 outline-none focus:outline-none"
              rows={1}
            />
            
            <Button 
              variant="ghost" 
              onClick={handleMicrophone}
              className="p-0 border-0 shadow-none bg-transparent hover:bg-transparent focus:bg-transparent"
              title="Microphone"
            >
              <div className="w-8 h-8 flex items-center justify-center text-neutral-300 hover:text-neutral-100 hover:bg-neutral-700 active:bg-neutral-600 rounded-lg transition-colors">
                <Mic className="size-5" />
              </div>
            </Button>
            
            <Button 
              variant="ghost"
              onClick={handleSendMessage} 
              className="p-0 border-0 shadow-none bg-transparent hover:bg-transparent focus:bg-transparent"
              disabled={!message.trim()}
              title="Send Message"
            >
              <div className="w-8 h-8 rounded-full bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-500 flex items-center justify-center transition-colors">
                <ArrowUp className="size-5 text-neutral-200" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VhybZApp;