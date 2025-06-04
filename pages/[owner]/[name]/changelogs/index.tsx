import { GetServerSideProps } from 'next';
import styles from './index.module.css';

import ChangelogCard from '../../../../components/changelog-card';

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

type Props = {
    changelogs: Changelog[];
    owner: string;
    name: string;
};

const ChangelogsPage = ({ changelogs, owner, name }: Props) => {
    const repoTitle = `Changelog for ${owner}/${name}`;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{repoTitle}</h1>
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

type Params = {
    owner: string;
    name: string;
};

export const getServerSideProps: GetServerSideProps<Props, Params> = async ({
    params,
}) => {
    if (!params) {
        return { notFound: true };
    }

    const { owner, name } = params;

    const res = await fetch(`/changelogs`);
    const changelogs = await res.json();

    return {
        props: {
            changelogs,
            owner,
            name,
        },
    };
};

export default ChangelogsPage;
