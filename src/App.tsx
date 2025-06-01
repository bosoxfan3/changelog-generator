import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import Generate from './pages/generate';
import ChangelogPage from './pages/changelog';

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<Generate />} />
            <Route path="/changelogs" element={<ChangelogPage />} />
        </Routes>
    </Router>
);

export default App;
