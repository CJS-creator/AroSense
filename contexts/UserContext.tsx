import React, { createContext, useState, ReactNode, useContext } from 'react';
import { UserProfile } from '../types';

interface UserContextType {
  currentUser: UserProfile;
  // In a real app, you'd have a function like:
  // setCurrentUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser] = useState<UserProfile>({ 
    id: 'user1', 
    name: 'Alex Johnson', 
    email: 'alex.johnson@example.com' 
  });

  return (
    <UserContext.Provider value={{ currentUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
