import styles from './index.module.css';

type Props = {
    id: string;
    className?: string;
    labelText: string;
    placeholder?: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const TextInputField = ({
    id,
    className,
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
            className={`${className} ${styles.input}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    </div>
);

export default TextInputField;
