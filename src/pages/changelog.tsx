import { useState, useEffect } from 'react';

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

const ChangelogPage = () => {
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
                    <div key={changelog.id}>{changelog.content}</div>
                ))}
            </div>
        </div>
    );
};

export default ChangelogPage;
