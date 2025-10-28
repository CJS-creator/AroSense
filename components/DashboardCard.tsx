import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from './bits';


interface DashboardCardProps {
  title: string;
  description: string;
  linkTo: string;
  icon: React.ReactNode;
  count?: number;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, description, linkTo, icon, count }) => {
  return (
    // FIX: Wrapped Card in a Link component to handle navigation and avoid prop type errors on Card.
    <Link to={linkTo} className="block h-full group">
      <Card className="h-full transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:ring-2 hover:ring-primary-light">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="flex-shrink-0 text-primary-DEFAULT group-hover:text-primary-dark transition-colors duration-300">{icon}</div>
             {typeof count !== 'undefined' && (
                <span className="text-3xl font-bold text-primary-DEFAULT group-hover:text-primary-dark transition-colors duration-300">{count}</span>
            )}
        </CardHeader>
        <CardContent>
            <CardTitle className="text-xl group-hover:text-primary-dark transition-colors duration-300">{title}</CardTitle>
            <p className="mt-1 text-sm text-textSecondary">{description}</p>
        </CardContent>
    </Card>
    </Link>
  );
};