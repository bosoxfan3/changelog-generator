import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from './index.module.css';

import Button from '../components/button';
import TextInputField from '../components/text-input-field';

interface RepoSearchParams {
    owner: string;
    name: string;
}

export default function HomePage() {
    const [repoSearchParams, setRepoSearchParams] = useState<RepoSearchParams>({
        owner: '',
        name: '',
    });
    const [hasClickedSubmit, setHasClickedSubmit] = useState<boolean>(false);

    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setHasClickedSubmit(true);

        const owner = repoSearchParams.owner.trim();
        const name = repoSearchParams.name.trim();

        if (!owner || !name) return;

        router.push(`/${owner}/${name}/generate`);
    };

    const hasRepoDataError =
        hasClickedSubmit && (!repoSearchParams.owner || !repoSearchParams.name);

    return (
        <>
            <Head>
                <title>Changelog Generator | AI GitHub Commit Summarizer</title>
                <meta
                    name="description"
                    content="A two-part app that uses AI to generate user-facing changelogs from GitHub commit messages."
                />
                <meta property="og:title" content="Changelog Generator" />
                <meta
                    property="og:description"
                    content="A two-part app that uses AI to generate user-facing changelogs from GitHub commit messages."
                />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <main className="container">
                <h1 className={styles.title}>Changelog Generator</h1>
                <p className={styles.subtitle}>
                    Enter a repository owner and name to get started
                </p>
                <form onSubmit={handleSubmit}>
                    <div className={styles.inputSection}>
                        <TextInputField
                            id="owner"
                            hasError={
                                hasRepoDataError && !repoSearchParams.owner
                            }
                            labelText="Repository Owner"
                            placeholder={'ex. vercel'}
                            value={repoSearchParams.owner}
                            onChange={(e) =>
                                setRepoSearchParams({
                                    ...repoSearchParams,
                                    owner: e.target.value,
                                })
                            }
                        />
                        <TextInputField
                            id="name"
                            hasError={
                                hasRepoDataError && !repoSearchParams.name
                            }
                            labelText="Repository Name"
                            placeholder={'ex. next.js'}
                            value={repoSearchParams.name}
                            onChange={(e) =>
                                setRepoSearchParams({
                                    ...repoSearchParams,
                                    name: e.target.value,
                                })
                            }
                        />
                    </div>
                    <div className={styles.buttonContainer}>
                        <Button type="submit" disabled={hasRepoDataError}>
                            Submit
                        </Button>
                    </div>
                </form>
            </main>
        </>
    );
}
// trigger rebuild
