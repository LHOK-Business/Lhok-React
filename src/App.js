// import logo from './logo.svg';
import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Lhok Platform - Coming Soon!
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

function App() {
  const platformName = "Lhok";

  return (
    <div className="App">
      <div className="welcome-box">
        <h1 className="highlight">{platformName}</h1>
        <p>Building the future of professional networking</p>
      </div>
    </div>
  );
}

export default App;