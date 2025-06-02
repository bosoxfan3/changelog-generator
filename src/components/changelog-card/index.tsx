import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './style.css';

type Props = {
    title: string;
    content: string;
    index: number;
};

function ChangelogCard({ title, content, index }: Props) {
    const [expanded, setExpanded] = useState<boolean>(index === 0);

    return (
        <div className="changelog-card">
            <div onClick={() => setExpanded(!expanded)} className="card-header">
                {expanded ? '▼' : '▶'} {title}
            </div>
            {expanded && (
                <div className="card-content">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            )}
        </div>
    );
}

export default ChangelogCard;
