import styles from './index.module.css';

type Props = {
    id: string;
    hasError?: boolean;
    labelText: string;
    placeholder?: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const TextInputField = ({
    id,
    hasError,
    labelText,
    placeholder,
    value,
    onChange,
}: Props) => (
    <div className={styles.formField}>
        <label className={styles.label} htmlFor={id}>
            {labelText}
        </label>
        <input
            id={id}
            type="text"
            className={`${hasError ?? styles.error} ${styles.input}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    </div>
);

export default TextInputField;
