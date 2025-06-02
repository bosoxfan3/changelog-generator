import { useState, useEffect } from 'react';
import ChangelogCard from '../../components/changelog-card';
import './style.css';

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
    const [changelogs, setChangelogs] = useState<Changelog[]>([]);

    useEffect(() => {
        const getChangelogs = async () => {
            const response = await fetch(`${API_BASE_URL}/changelogs`);
            const data = await response.json();
            console.log(data);
            setChangelogs(data);
        };
        getChangelogs();
    }, []);

    return (
        <div>
            <div>
                {changelogs.map((changelog) => (
                    <ChangelogCard
                        key={changelog.id}
                        title={changelog.title}
                        content={changelog.content}
                    />
                ))}
            </div>
        </div>
    );
};

export default ChangelogsPage;
