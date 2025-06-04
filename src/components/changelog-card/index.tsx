import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import styles from './index.module.css';

type Props = {
    title: string;
    content: string;
    index: number;
};

function ChangelogCard({ title, content, index }: Props) {
    const [expanded, setExpanded] = useState<boolean>(index === 0);

    return (
        <div className={styles.changelogCard}>
            <div
                onClick={() => setExpanded(!expanded)}
                className={styles.cardHeader}
            >
                {expanded ? '▼' : '▶'} {title}
            </div>
            {expanded && (
                <div className={styles.cardContent}>
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            )}
        </div>
    );
}

export default ChangelogCard;
