import { FunctionComponent, ReactNode } from 'react';

interface BaseContainerProps {
   children: ReactNode;
   styles?: string;
   id?: string;
}

const BaseContainer: FunctionComponent<BaseContainerProps> = ({ children, styles, id }) => {
   return (
      <section
         className={`mx-auto px-5 py-10 sm:py-20 md:px-10 ${styles}`}
         id={id}
      >
         {children}
      </section>
   );
};

export default BaseContainer;
