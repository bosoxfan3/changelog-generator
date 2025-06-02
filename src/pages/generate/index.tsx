import { useState } from 'react';
import './style.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

type ChangelogSuccessResponse = {
    status: number;
    content: string;
};

type ChangelogErrorResponse = {
    status: number;
    error: string;
};

type ChangelogResponse = ChangelogSuccessResponse | ChangelogErrorResponse;

const GeneratePage = () => {
    const [repoData, setRepoData] = useState({
        repoOwner: '',
        project: '',
        dateStart: '',
        dateEnd: '',
    });

    const [changelogData, setChangelogData] = useState({
        title: '',
        description: '',
    });

    const [repoDataFetched, setRepoDataFetched] = useState(false);

    const updateRepoData = (
        value: string,
        key: 'repoOwner' | 'project' | 'dateStart' | 'dateEnd'
    ) => {
        setRepoData({ ...repoData, [key]: value });
    };

    const updateChangelogData = (
        value: string,
        key: 'title' | 'description'
    ) => {
        setChangelogData({ ...changelogData, [key]: value });
    };

    const generateChangelog = async () => {
        const res = await fetch(`${API_BASE_URL}/generate-changelog`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(repoData),
        });

        const data: ChangelogResponse = await res.json();

        if ('error' in data) {
            console.error(data.error);
        } else {
            setRepoDataFetched(true);
            setChangelogData({
                title: `${repoData.dateEnd}`,
                description: data.content,
            });
        }
    };

    const submitChangelog = async () => {
        const res = await fetch(`${API_BASE_URL}/submit-changelog`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...repoData, ...changelogData }),
        });

        const data = await res.json();

        if (res.ok) {
            console.log('Saved', data);
        } else {
            console.error('Error saving changelog:', data.error);
        }
    };

    return (
        <div className="container">
            <h1 className="title">AI-Powered Changelog Generator</h1>
            <p className="subtitle">
                Quickly summarize recent commits into a clean, public changelog.
                Just enter a repo and date range.
            </p>
            <div className="input-section">
                <input
                    type="text"
                    onChange={(e) =>
                        updateRepoData(e.target.value, 'repoOwner')
                    }
                    value={repoData.repoOwner}
                    placeholder="Repository Owner (i.e. vercel)"
                />
                <input
                    type="text"
                    onChange={(e) => updateRepoData(e.target.value, 'project')}
                    value={repoData.project}
                    placeholder="Repository Name (i.e. next.js)"
                />
                <input
                    type="date"
                    onChange={(e) =>
                        updateRepoData(e.target.value, 'dateStart')
                    }
                    value={repoData.dateStart}
                />
                <input
                    type="date"
                    onChange={(e) => updateRepoData(e.target.value, 'dateEnd')}
                    value={repoData.dateEnd}
                />
                <button type="button" onClick={generateChangelog}>
                    Generate Changelog
                </button>
            </div>
            {repoDataFetched && (
                <div>
                    <div className="form-group">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            onChange={(e) =>
                                updateChangelogData(e.target.value, 'title')
                            }
                            value={changelogData.title}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            rows={8}
                            onChange={(e) =>
                                updateChangelogData(
                                    e.target.value,
                                    'description'
                                )
                            }
                            value={changelogData.description}
                        />
                    </div>
                    <div className="submit-button-container">
                        <button type="button" onClick={submitChangelog}>
                            Submit Changelog
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GeneratePage;
