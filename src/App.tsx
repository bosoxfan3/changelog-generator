import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import GeneratePage from './pages/generate';
import ChangelogPage from './pages/changelog';

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<GeneratePage />} />
            <Route path="/changelogs" element={<ChangelogPage />} />
        </Routes>
    </Router>
);

export default App;
