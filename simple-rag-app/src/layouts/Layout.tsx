import { PublicLayout } from './public-layout';
import type { PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
  return <PublicLayout>{children}</PublicLayout>;
};

export default Layout;
