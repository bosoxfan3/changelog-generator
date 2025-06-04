import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.css';

import TextInputField from '../../../../components/text-input-field';
import DateInputField from '../../../../components/date-input-field';
import TextAreaField from '../../../../components/text-area-field';
import Button from '../../../../components/button';

type ChangelogSuccessResponse = {
    status: number;
    content: string;
};
type ChangelogErrorResponse = {
    status: number;
    error: string;
};
type ChangelogResponse = ChangelogSuccessResponse | ChangelogErrorResponse;

// RepoData corresponds to the 2 date inputs
interface RepoData {
    dateStart: string;
    dateEnd: string;
}

// ChangelogData corresponds to the 2 outputs that will be published
interface ChangelogData {
    title: string;
    description: string;
}

const GeneratePage = () => {
    const router = useRouter();
    const { owner, name } = router.query;

    const [repoData, setRepoData] = useState<RepoData>({
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

    const updateRepoData = (value: string, key: 'dateStart' | 'dateEnd') => {
        setRepoData({ ...repoData, [key]: value });
    };

    const updateChangelogData = (
        value: string,
        key: 'title' | 'description'
    ) => {
        setChangelogData({ ...changelogData, [key]: value });
    };

    const generateChangelog = async () => {
        const error = !repoData.dateStart || !repoData.dateEnd;

        if (error) {
            // don't set that there is an error until the user tries to submit
            setHasRepoDataError(true);
            return;
        }

        setHasRepoDataError(false);
        setIsLoading(true);

        const res = await fetch(`/generate-changelog`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ owner, name, ...repoData }),
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

        const res = await fetch(`/submit-changelog`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...repoData, ...changelogData }),
        });

        const data = await res.json();

        if (res.ok) {
            setRepoDataFetched(false);
            setRepoData({
                dateStart: '',
                dateEnd: '',
            });
            setChangelogData({ title: '', description: '' });

            // just felt like I wanted to show a spinner even though it isn't necessary. UX decision on my end
            setTimeout(() => {
                setIsLoading(false);
                router.push(`/${owner}/${name}/changelogs`);
            }, 1000);
        } else {
            console.error('Error saving changelog:', data.error);
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <h1 className={styles.title}>
                Generate Commit History for {owner}/{name}
            </h1>
            <p className={styles.subtitle}>
                Quickly summarize recent commits into a clean, public changelog.
                Just enter a date range.
            </p>
            {/* 2 date inputs and changelog generating button */}
            <form onSubmit={generateChangelog}>
                <div className={styles.inputSection}>
                    <DateInputField
                        id="start"
                        hasError={hasRepoDataError && !repoData.dateStart}
                        labelText="Start Date"
                        max={new Date().toISOString().split('T')[0]}
                        value={repoData.dateStart}
                        onChange={(e) =>
                            updateRepoData(e.target.value, 'dateStart')
                        }
                    />
                    <DateInputField
                        id="end"
                        hasError={hasRepoDataError && !repoData.dateEnd}
                        labelText="End Date"
                        min={repoData.dateStart}
                        max={new Date().toISOString().split('T')[0]}
                        value={repoData.dateEnd}
                        onChange={(e) =>
                            updateRepoData(e.target.value, 'dateEnd')
                        }
                    />
                </div>
                <div className="buttonContainer">
                    <Button type="submit" disabled={hasRepoDataError}>
                        Generate Changelog
                    </Button>
                </div>
            </form>

            {isLoading && (
                <div className={styles.spinnerOverlay}>
                    <div className={styles.spinner} />
                </div>
            )}

            {/* The inputs pre-filled by ChatGPT that can be saved to the changelog */}
            {repoDataFetched && (
                <form onSubmit={submitChangelog}>
                    <TextInputField
                        id="title"
                        hasError={hasChangelogDataError && !changelogData.title}
                        labelText="Title"
                        value={changelogData.title}
                        onChange={(e) =>
                            updateChangelogData(e.target.value, 'title')
                        }
                    />
                    <TextAreaField
                        id="description"
                        hasError={
                            hasChangelogDataError && !changelogData.description
                        }
                        labelText="Description"
                        rows={8}
                        value={changelogData.description}
                        onChange={(e) =>
                            updateChangelogData(e.target.value, 'description')
                        }
                    />
                    <div className={styles.buttonContainer}>
                        <Button type="submit" disabled={hasChangelogDataError}>
                            Submit Changelog
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default GeneratePage;
