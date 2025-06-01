import { useState } from 'react';
import './App.css';

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

function App() {
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

    const updateRepoData = (
        value: string,
        key: 'repoOwner' | 'project' | 'dateStart' | 'dateEnd'
    ) => {
        setRepoData({ ...repoData, [key]: value });
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
            setChangelogData({
                title: `${repoData.dateEnd}`,
                description: data.content,
            });
        }
    };

    const updateChangelogData = (
        value: string,
        key: 'title' | 'description'
    ) => {
        setChangelogData({ ...changelogData, [key]: value });
    };

    const submitChangelog = async () => {
        // submit changelog to api and save to db somehow
    };

    return (
        <div className="App">
            <div>
                <input
                    type="text"
                    onChange={(e) =>
                        updateRepoData(e.target.value, 'repoOwner')
                    }
                    value={repoData.repoOwner}
                />
                <input
                    type="text"
                    onChange={(e) => updateRepoData(e.target.value, 'project')}
                    value={repoData.project}
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
            {!!changelogData.title && !!changelogData.description && (
                <div>
                    <div>
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            name="title"
                            onChange={(e) =>
                                updateChangelogData(e.target.value, 'title')
                            }
                            value={changelogData.title}
                        />
                    </div>
                    <div>
                        <label htmlFor="description">Description</label>
                        <textarea
                            name="description"
                            onChange={(e) =>
                                updateChangelogData(
                                    e.target.value,
                                    'description'
                                )
                            }
                            value={changelogData.description}
                        />
                    </div>
                    <button type="button" onClick={submitChangelog}>
                        Submit Changelog
                    </button>
                </div>
            )}
        </div>
    );
}

export default App;
