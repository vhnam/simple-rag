import PublicLayout from './Public/PublicLayout';
import type { PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
  return <PublicLayout>{children}</PublicLayout>;
};

export default Layout;
