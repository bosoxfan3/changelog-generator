import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import GeneratePage from './pages/generate';
import ChangelogsPage from './pages/changelogs';

const App = () => (
    <Router>
        <Routes>
            <Route path="/" element={<GeneratePage />} />
            <Route path="/changelogs" element={<ChangelogsPage />} />
        </Routes>
    </Router>
);

export default App;
