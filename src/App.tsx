import { useState } from 'react';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function App() {
    const [formData, setFormData] = useState({
        repoOwner: '',
        project: '',
        dateStart: '',
        dateEnd: '',
    });

    const updateFormData = (
        value: string,
        key: 'repoOwner' | 'project' | 'dateStart' | 'dateEnd'
    ) => {
        setFormData({ ...formData, [key]: value });
    };

    const generateChangelog = async () => {
        const res = await fetch(`${API_BASE_URL}/generate-changelog`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const data = await res.json();
        console.log(data);
    };

    return (
        <div className="App">
            <input
                type="text"
                onChange={(e) => updateFormData(e.target.value, 'repoOwner')}
                value={formData.repoOwner}
            />
            <input
                type="text"
                onChange={(e) => updateFormData(e.target.value, 'project')}
                value={formData.project}
            />
            <input
                type="date"
                onChange={(e) => updateFormData(e.target.value, 'dateStart')}
                value={formData.dateStart}
            />
            <input
                type="date"
                onChange={(e) => updateFormData(e.target.value, 'dateEnd')}
                value={formData.dateEnd}
            />
            <button type="button" onClick={generateChangelog}>
                Generate Changelog
            </button>
        </div>
    );
}

export default App;
