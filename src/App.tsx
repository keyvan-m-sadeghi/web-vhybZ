import React, { useState } from 'react';
import './App.css';

// const darkTheme = createTheme({
//   palette: {
//     mode: 'dark',
//   },
// });

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
    // <ThemeProvider theme={darkTheme}>
    //   <CssBaseline />
      <div className='window'>
        <header className='appbar'>
          <div className='navbar'>
            <button>
              <img src="/logo.png" alt="VhybZ Logo" className='logo'/>
            </button>
            <div role="group"> {/* Replaced ButtonGroup */}
              <button onClick={() => setView('render')}>
                {/* SmartphoneIcon */} Render
              </button>
              <button onClick={() => setView('chat')}>
                {/* ChatIcon */} Chat
              </button>
            </div>
            <button onClick={handleShare}>
              {/* ShareIcon */} Share
            </button>
          </div>
        </header>

        <main className='content'>
          <div className='container'> {/* Replaced Paper */}
            {view === 'render' ? 'Rendered content' : 'Chat history'}
          </div>
        </main>

        <div className='toolbar'>
          <div className="commands">
            <button onClick={handleUndo}>{/* UndoIcon */}Undo</button>
            <button onClick={handleRedo}>{/* RedoIcon */}Redo</button>
            <button onClick={handleSave}>{/* SaveIcon */}Save</button>
            <button onClick={handleRevert}>{/* RestoreIcon */}Revert</button>
          </div>
          <button onClick={handleRevert}>{/* AddIcon */}Add</button>
        </div>

        <div className="prompt">
          <textarea
            className="fullWidth" // Assuming fullWidth is a class that provides this style
            placeholder="Prompt"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={2} // Replaced multiline and maxRows
          />
          <button onClick={handleSendMessage}>
            {/* SendIcon */} Send
          </button>
        </div>
      </div>
    // </ThemeProvider>
  );
};

export default VhybZApp;
