// ROOT COMPONENT — the top of your component tree.
//   Everything in your app is a child (or grandchild, etc.) of App.

//   App does two jobs:
//   1. Sets up the ROUTER — maps URL paths to page components
//   2. Sets the LAYOUT — Header and Footer wrap around all pages

//   Component Tree (what renders on /about):
//   ┌── App
//   │   ├── Header        (always visible)
//   │   ├── Routes
//   │   │   └── About     (only on /about)
//   │   └── Footer        (always visible)

// React Router — these three work together:
// HashRouter  → manages URL state using the # character
//               Use this for GitHub Pages (explained below)
// Routes      → container that looks at the URL and picks the right Route
// Route       → maps one URL path to one component


import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import About   from './pages/About/About';
import Contact from './pages/Contact/Contact';
import Home    from './pages/Home/Home';

function App() {
    return (
        <HashRouter>
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <main style={{ flex: 1 }}>
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about"   element={<About />} />
                <Route path="/contact" element={<Contact />} />
                </Routes>
            </main>
            <Footer />
            </div>
        </HashRouter>
    );
}

export default App;