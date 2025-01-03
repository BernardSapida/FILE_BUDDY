'use client';

import { User } from '@prisma/client';
import {
   createContext,
   Dispatch,
   FunctionComponent,
   SetStateAction,
   useEffect,
   useState
} from 'react';

interface MathWrapperProps {
   children: React.ReactNode;
}

export const UserContext = createContext<{
   user: User | undefined;
   setUser: Dispatch<SetStateAction<User | undefined>>;
}>({ user: undefined, setUser: () => {} });

const UserContextWrapper: FunctionComponent<MathWrapperProps> = ({ children }) => {
   const [user, setUser] = useState<User>();

   // Load the person from localStorage on initial render
   useEffect(() => {
      const storedPerson = localStorage.getItem('user');
      if (storedPerson) {
         setUser(JSON.parse(storedPerson));
      }
   }, []);

   // Save the person to localStorage whenever it changes
   useEffect(() => {
      if (user) {
         localStorage.setItem('user', JSON.stringify(user));
      } else {
         localStorage.removeItem('user');
      }
   }, [user]);

   return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export default UserContextWrapper;
