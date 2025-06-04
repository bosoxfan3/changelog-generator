import styles from './index.module.css';

type Props = {
    children: React.ReactNode;
    className?: string;
    type: 'button' | 'submit';
    onClick?: (e: React.SyntheticEvent) => void;
    disabled?: boolean;
};

const Button = ({ children, className, type, onClick, disabled }: Props) => {
    return (
        <button
            className={`${className} ${styles.button}`}
            type={type}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
