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
          <nav className="navbar px-4 sm:px-6 py-3 flex justify-between items-center border-b border-border/30">
            <Button variant="ghost" size="icon" className="p-0 m-0 bg-transparent border-transparent shadow-none focus:bg-transparent transition-colors hover:bg-white/5 active:bg-white/10" style={{color: 'hsl(var(--foreground))'}}>
              <img src="/logo.png" alt="VhybZ Logo" className='logo h-6 w-6'/>
            </Button>
            
            <div className="flex items-center bg-transparent border-transparent">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('render')}
                className="p-0 m-0 px-3 py-2 bg-transparent border-transparent shadow-none focus:bg-transparent transition-colors hover:bg-white/5 active:bg-white/10"
                style={{color: view === 'render' ? 'hsl(var(--foreground))' : 'hsl(var(--foreground) / 0.7)'}}
              >
                <Smartphone className="size-5" style={{color: 'hsl(var(--foreground))'}} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setView('chat')}
                className="p-0 m-0 px-3 py-2 bg-transparent border-transparent shadow-none focus:bg-transparent transition-colors hover:bg-white/5 active:bg-white/10"
                style={{color: view === 'chat' ? 'hsl(var(--foreground))' : 'hsl(var(--foreground) / 0.7)'}}
              >
                <MessageCircle className="size-5" style={{color: 'hsl(var(--foreground))'}} />
              </Button>
            </div>
            
            <Button variant="ghost" size="icon" onClick={handleShare} className="p-0 m-0 bg-transparent border-transparent shadow-none focus:bg-transparent transition-colors hover:bg-white/5 active:bg-white/10" style={{color: 'hsl(var(--foreground))'}}>
              <Share2 className="size-5 text-foreground" />
            </Button>
          </nav>
        </header>

        {/* Main Content */}
        <main className='content px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col justify-center'>
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
        <div className="toolbar px-4 sm:px-6 py-2 flex justify-between items-center border-t border-border/30 mt-auto mb-2 sm:mb-3">
          <div className="commands flex gap-1 sm:gap-2">
            <Button variant="ghost" size="icon" onClick={handleUndo} className="text-foreground border-0 shadow-none bg-transparent hover:bg-accent/10 active:bg-accent/20 focus-visible:ring-0 focus-visible:ring-offset-0 p-1.5 rounded-lg transition-colors" title="Undo">
              <Undo className="size-5 text-foreground" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleRedo} className="text-foreground border-0 shadow-none bg-transparent hover:bg-accent/10 active:bg-accent/20 focus-visible:ring-0 focus-visible:ring-offset-0 p-1.5 rounded-lg transition-colors" title="Redo">
              <Redo className="size-5 text-foreground" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleSave} className="text-foreground border-0 shadow-none bg-transparent hover:bg-accent/10 active:bg-accent/20 focus-visible:ring-0 focus-visible:ring-offset-0 p-1.5 rounded-lg transition-colors" title="Save">
              <Save className="size-5 text-foreground" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleRevert} className="text-foreground border-0 shadow-none bg-transparent hover:bg-accent/10 active:bg-accent/20 focus-visible:ring-0 focus-visible:ring-offset-0 p-1.5 rounded-lg transition-colors" title="Restore">
              <RotateCcw className="size-5 text-foreground" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={handleRevert} className="text-foreground border-0 shadow-none bg-transparent hover:bg-accent/10 active:bg-accent/20 focus-visible:ring-0 focus-visible:ring-offset-0 p-1.5 rounded-lg transition-colors" title="Add">
            <Plus className="size-5 text-foreground" />
          </Button>
        </div>

        {/* Prompt Input */}
        <div className="px-2 sm:px-4 pt-1 pb-3 sm:pb-4">
          <div className="prompt-container bg-neutral-800 rounded-2xl sm:rounded-3xl p-1.5 sm:p-2 flex items-center gap-1.5 sm:gap-2">
            <Button
              asChild
              onClick={handleTools}
              className="p-0 m-0 border-none shadow-none bg-transparent hover:bg-transparent focus:ring-0 focus:ring-offset-0 active:bg-transparent appearance-none focus-visible:outline-none outline-none ring-0 flex items-center justify-center"
              title="Tools"
            >
              <div className="h-9 px-2.5 py-0 flex items-center text-neutral-300 bg-transparent hover:text-neutral-100 hover:bg-neutral-700/80 active:bg-neutral-600/80 rounded-lg transition-colors cursor-pointer">
                <Plus className="size-5 mr-1.5 shrink-0" />
                <span className="text-sm font-medium shrink-0">Tools</span>
              </div>
            </Button>
            
            <Textarea
              placeholder="Craft something beautiful..."
              value={message}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
              className="flex-1 bg-transparent border-0 focus:ring-0 text-foreground placeholder:text-neutral-500 resize-none text-sm py-2 h-9 min-h-0 outline-none"
              rows={1}
            />
            
            <Button
              asChild
              onClick={handleMicrophone}
              className="p-0 m-0 border-none shadow-none bg-transparent hover:bg-transparent focus:ring-0 focus:ring-offset-0 active:bg-transparent appearance-none focus-visible:outline-none outline-none ring-0 flex items-center justify-center"
              title="Microphone"
            >
              <div className="w-9 h-9 p-0 flex items-center justify-center text-neutral-300 bg-transparent hover:text-neutral-100 hover:bg-neutral-700/80 active:bg-neutral-600/80 rounded-lg transition-colors cursor-pointer">
                <Mic className="size-5 shrink-0" />
              </div>
            </Button>
            
            <Button
              asChild
              onClick={handleSendMessage}
              className="p-0 m-0 border-none shadow-none bg-transparent hover:bg-transparent focus:ring-0 focus:ring-offset-0 active:bg-transparent appearance-none focus-visible:outline-none outline-none ring-0 flex items-center justify-center"
              disabled={!message.trim()}
              title="Send Message"
            >
              {message.trim() ? (
                <div className="w-9 h-9 p-0 flex items-center justify-center rounded-full bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-500 text-neutral-100 transition-colors cursor-pointer">
                  <ArrowUp className="size-5 shrink-0" />
                </div>
              ) : (
                <div className="w-9 h-9 p-0 flex items-center justify-center rounded-full bg-neutral-600/50 text-neutral-400/70 transition-colors cursor-not-allowed">
                  <ArrowUp className="size-5 shrink-0" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VhybZApp;