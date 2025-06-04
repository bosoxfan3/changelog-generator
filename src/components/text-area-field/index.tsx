import styles from './index.module.css';

type Props = {
    id: string;
    hasError?: boolean;
    labelText: string;
    rows: number;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

const TextAreaField = ({
    id,
    hasError,
    labelText,
    rows,
    value,
    onChange,
}: Props) => (
    <div className={styles.formField}>
        <label className={styles.label} htmlFor={id}>
            {labelText}
        </label>
        <textarea
            id={id}
            className={`${hasError ?? styles.error} ${styles.textarea}`}
            rows={rows}
            value={value}
            onChange={onChange}
        />
    </div>
);

export default TextAreaField;
