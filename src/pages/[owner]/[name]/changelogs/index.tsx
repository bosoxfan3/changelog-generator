import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './index.module.css';

import ChangelogCard from '../../../../components/changelog-card';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface Changelog {
    id: string;
    repoOwner: string;
    project: string;
    from: string;
    to: string;
    title: string;
    content: string;
    createdAt: string;
}

const ChangelogsPage = () => {
    const router = useRouter();
    const { owner, name } = router.query;

    const [changelogs, setChangelogs] = useState<Changelog[]>([]);

    useEffect(() => {
        const getChangelogs = async () => {
            const response = await fetch(`${API_BASE_URL}/changelogs`);
            const data = await response.json();
            setChangelogs(data);
        };
        getChangelogs();
    }, []);

    const repoTitle = `Changelog for ${owner}/${name}`;

    return (
        <div className="container">
            <h1 className="title">{repoTitle}</h1>
            <div>
                {changelogs.map((changelog, index) => (
                    <ChangelogCard
                        key={changelog.id}
                        title={changelog.title}
                        content={changelog.content}
                        index={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default ChangelogsPage;
