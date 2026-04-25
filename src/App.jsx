import { useState, useEffect } from 'react';
import ServiceExplorer from './components/ServiceExplorer';
import ArchitectureLab from './components/ArchitectureLab';
import IamPlayground from './components/IamPlayground';
import CloudQuiz from './components/CloudQuiz';
import CliCheatsheet from './components/CliCheatsheet';

const TOOLS = [
  { id: 'services', label: 'Services', icon: '☁️', component: ServiceExplorer },
  { id: 'architecture', label: 'Architecture', icon: '🏗️', component: ArchitectureLab },
  { id: 'iam', label: 'IAM Builder', icon: '🛡️', component: IamPlayground },
  { id: 'quiz', label: 'Quiz', icon: '🧠', component: CloudQuiz },
  { id: 'cli', label: 'CLI Reference', icon: '⌨️', component: CliCheatsheet },
];

function App() {
  const [activeTool, setActiveTool] = useState('services');
  const [toast, setToast] = useState('');
  const [totalLearned, setTotalLearned] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('cloudcamp-visited');
    if (stored) {
      try {
        setTotalLearned(JSON.parse(stored).length);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('cloudcamp-visited');
    let visited = [];
    try { visited = stored ? JSON.parse(stored) : []; } catch {}
    if (!visited.includes(activeTool)) {
      visited.push(activeTool);
      localStorage.setItem('cloudcamp-visited', JSON.stringify(visited));
      setTotalLearned(visited.length);
    }
  }, [activeTool]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const ActiveComponent = TOOLS.find(t => t.id === activeTool)?.component;

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">☁️</span>
            <span className="logo-text">CloudCamp</span>
            <span className="logo-badge">AWS</span>
          </div>
          <div className="header-right">
            <div className="header-stats">
              <div className="header-stat">
                📚 Sections explored: <span className="header-stat-value">{totalLearned}/{TOOLS.length}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="main-content">
        {/* Tool Tabs */}
        <nav className="tool-tabs" id="tool-navigation">
          {TOOLS.map(tool => (
            <button
              key={tool.id}
              id={`tab-${tool.id}`}
              className={`tool-tab ${activeTool === tool.id ? 'active' : ''}`}
              onClick={() => setActiveTool(tool.id)}
            >
              <span className="tool-tab-icon">{tool.icon}</span>
              {tool.label}
            </button>
          ))}
        </nav>

        {/* Active Tool Panel */}
        {ActiveComponent && (
          <ActiveComponent key={activeTool} onCopy={showToast} />
        )}
      </main>

      {/* Toast */}
      <div className={`copy-toast ${toast ? 'show' : ''}`}>
        ✓ {toast}
      </div>
    </div>
  );
}

export default App;
