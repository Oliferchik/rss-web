import { FC, ReactElement } from 'react';

interface PrivateScopeProps {
  children: ReactElement;
}

const PrivateScope: FC<PrivateScopeProps> = ({ children }) => children;

export default PrivateScope;
