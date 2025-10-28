
import React from 'react';

interface ToggleSwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    'aria-label': string;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, ...props }) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`${
                checked ? 'bg-primary-DEFAULT' : 'bg-slate-300 dark:bg-slate-600'
            } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT focus:ring-offset-2 focus:ring-offset-surface`}
            {...props}
        >
            <span
                aria-hidden="true"
                className={`${
                    checked ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
            />
        </button>
    );
};
