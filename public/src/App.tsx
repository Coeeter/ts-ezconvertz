import { useEffect, useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    (async () => {
      if (true) return
      const blob = await fetch('http://localhost:8080/convert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videos: [
            {
              name: 'Chainsaw Man',
              videoId: '494STlRAn3A',
              start: 0,
              end: -1
            },
            {
              name: 'Shinunoga E-wa',
              videoId: 'w-vVSeeCf1k',
              start: 0,
              end: 120
            },
            {
              name: 'Comedy',
              videoId: 'G3qQtf7jahE',
              start: 0,
              end: -1
            },
            {
              name: 'Taikutsuwo Saienshinaide',
              videoId: 'Pv56oBAfRhY',
              start: 0,
              end: -1
            },
          ],
        }),
      }).then(response => response.blob());
      const file = window.URL.createObjectURL(blob);
      window.location.assign(file);
    })();
  }, []);

  return (
    <div className="App">
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount(count => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  );
}

export default App;
