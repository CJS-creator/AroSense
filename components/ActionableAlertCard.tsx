import React from 'react';
import { Button } from './common/Button';
import { IconArrowRight } from '../constants';

type AlertVariant = 'danger' | 'warning' | 'info' | 'success';

interface ActionableAlertCardProps {
  variant: AlertVariant;
  title: string;
  message: string;
  buttonText?: string;
  onButtonClick?: () => void;
  icon: React.ReactNode;
}

const variantStyles: { [key in AlertVariant]: { container: string; icon: string } } = {
  danger: {
    container: 'bg-red-500/10 border-red-500/20',
    icon: 'text-red-500 dark:text-red-400',
  },
  warning: {
    container: 'bg-yellow-500/10 border-yellow-500/20',
    icon: 'text-yellow-500 dark:text-yellow-400',
  },
  info: {
    container: 'bg-blue-500/10 border-blue-500/20',
    icon: 'text-blue-500 dark:text-blue-400',
  },
  success: {
    container: 'bg-green-500/10 border-green-500/20',
    icon: 'text-green-500 dark:text-green-400',
  },
};

export const ActionableAlertCard: React.FC<ActionableAlertCardProps> = ({
  variant,
  title,
  message,
  buttonText,
  onButtonClick,
  icon
}) => {
  const styles = variantStyles[variant];

  return (
    <div className={`p-4 rounded-lg border flex items-start gap-4 ${styles.container}`}>
      <div className={`flex-shrink-0 w-6 h-6 mt-1 ${styles.icon}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-textPrimary">{title}</h4>
        <p className="text-sm text-textSecondary mt-1">{message}</p>
        {buttonText && onButtonClick && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onButtonClick} 
            className="mt-3 -ml-2 text-primary-dark dark:text-primary-light"
            rightIcon={<IconArrowRight className="w-4 h-4" />}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
};
