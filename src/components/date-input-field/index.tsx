import styles from './index.module.css';

type Props = {
    id: string;
    hasError?: boolean;
    labelText: string;
    min?: string;
    max?: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const DateInputField = ({
    id,
    hasError,
    labelText,
    min,
    max,
    value,
    onChange,
}: Props) => (
    <div className={styles.formField}>
        <label className={styles.label} htmlFor={id}>
            {labelText}
        </label>
        <input
            id={id}
            type="date"
            className={`${hasError ?? styles.error} ${styles.input}`}
            min={min}
            max={max}
            value={value}
            onChange={onChange}
        />
    </div>
);

export default DateInputField;
