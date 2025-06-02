import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import './style.css';

function ChangelogCard({ title, content }: { title: string; content: string }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="changelog-card">
            <button
                onClick={() => setExpanded(!expanded)}
                className="card-header"
            >
                {expanded ? '▼' : '▶'} {title}
            </button>
            {expanded && (
                <div className="card-content">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            )}
        </div>
    );
}

export default ChangelogCard;
