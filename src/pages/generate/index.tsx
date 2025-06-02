import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

// RepoData corresponds to the 4 main inputs
interface RepoData {
    repoOwner: string;
    project: string;
    dateStart: string;
    dateEnd: string;
}

// ChangelogData corresponds to the 2 outputs that will be published
interface ChangelogData {
    title: string;
    description: string;
}

const GeneratePage = () => {
    const navigate = useNavigate();

    const [repoData, setRepoData] = useState<RepoData>({
        repoOwner: '',
        project: '',
        dateStart: '',
        dateEnd: '',
    });
    const [changelogData, setChangelogData] = useState<ChangelogData>({
        title: '',
        description: '',
    });

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [repoDataFetched, setRepoDataFetched] = useState<boolean>(false);

    const [hasRepoDataError, setHasRepoDataError] = useState<boolean>(false);
    const [hasChangelogDataError, setHasChangelogDataError] =
        useState<boolean>(false);

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
        const error =
            !repoData.repoOwner ||
            !repoData.project ||
            !repoData.dateStart ||
            !repoData.dateEnd;

        if (error) {
            // don't set that there is an error until the user tries to submit
            setHasRepoDataError(true);
            return;
        }

        setHasRepoDataError(false);
        setIsLoading(true);

        const res = await fetch(`${API_BASE_URL}/generate-changelog`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(repoData),
        });

        const data: ChangelogResponse = await res.json();

        if ('error' in data) {
            console.error(data.error);
        } else {
            // I use this to show/hide the changelog data fields, because I didn't want to rely to !!changelogData.title or something
            setRepoDataFetched(true);
            setChangelogData({
                title: repoData.dateEnd,
                description: data.content,
            });
        }
        setIsLoading(false);
    };

    const submitChangelog = async () => {
        const error = !changelogData.title || !changelogData.description;

        if (error) {
            // don't set that there is an error until the user tries to submit
            setHasChangelogDataError(true);
            return;
        }

        setHasChangelogDataError(false);
        setIsLoading(true);

        const res = await fetch(`${API_BASE_URL}/submit-changelog`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...repoData, ...changelogData }),
        });

        const data = await res.json();

        if (res.ok) {
            setRepoDataFetched(false);
            setRepoData({
                repoOwner: '',
                project: '',
                dateStart: '',
                dateEnd: '',
            });
            setChangelogData({ title: '', description: '' });

            // just felt like I wanted to show a spinner even though it isn't necessary. UX decision on my end
            setTimeout(() => {
                setIsLoading(false);
                navigate('/changelogs');
            }, 1000);
        } else {
            console.error('Error saving changelog:', data.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <h1 className="title">AI-Powered Changelog Generator</h1>
            <p className="subtitle">
                Quickly summarize recent commits into a clean, public changelog.
                Just enter a repo and date range.
            </p>

            {/* 4 main inputs and changelog generating button */}
            <div className="input-section">
                <div className="input-group">
                    <label htmlFor="owner">Repository Owner</label>
                    <input
                        className={
                            hasRepoDataError && !repoData.repoOwner
                                ? 'error-input'
                                : ''
                        }
                        id="owner"
                        type="text"
                        onChange={(e) =>
                            updateRepoData(e.target.value, 'repoOwner')
                        }
                        value={repoData.repoOwner}
                        placeholder="ex. vercel"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="project">Repository Name</label>
                    <input
                        className={
                            hasRepoDataError && !repoData.project
                                ? 'error-input'
                                : ''
                        }
                        id="project"
                        type="text"
                        onChange={(e) =>
                            updateRepoData(e.target.value, 'project')
                        }
                        value={repoData.project}
                        placeholder="ex. next.js"
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="start">Start Date</label>
                    <input
                        className={
                            hasRepoDataError && !repoData.dateStart
                                ? 'error-input'
                                : ''
                        }
                        id="start"
                        type="date"
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) =>
                            updateRepoData(e.target.value, 'dateStart')
                        }
                        value={repoData.dateStart}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="end">End Date</label>
                    <input
                        className={
                            hasRepoDataError && !repoData.dateEnd
                                ? 'error-input'
                                : ''
                        }
                        id="end"
                        type="date"
                        min={repoData.dateStart}
                        max={new Date().toISOString().split('T')[0]}
                        onChange={(e) =>
                            updateRepoData(e.target.value, 'dateEnd')
                        }
                        value={repoData.dateEnd}
                    />
                </div>
            </div>
            <div className="button-container">
                <button type="button" onClick={generateChangelog}>
                    Generate Changelog
                </button>
            </div>

            {isLoading && (
                <div className="spinner-overlay">
                    <div className="spinner" />
                </div>
            )}

            {/* The inputs pre-filled by ChatGPT that can be saved to the changelog */}
            {repoDataFetched && (
                <div>
                    <div className="output-group">
                        <label htmlFor="title">Title</label>
                        <input
                            className={
                                hasChangelogDataError && !changelogData.title
                                    ? 'error-input'
                                    : ''
                            }
                            type="text"
                            id="title"
                            onChange={(e) =>
                                updateChangelogData(e.target.value, 'title')
                            }
                            value={changelogData.title}
                        />
                    </div>
                    <div className="output-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            className={
                                hasChangelogDataError &&
                                !changelogData.description
                                    ? 'error-input'
                                    : ''
                            }
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
                    <div className="button-container">
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
