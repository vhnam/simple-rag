import { Toaster } from 'sonner';
import Header from './Header';
import type { PropsWithChildren } from 'react';

const PublicLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <main className="mt-16">{children}</main>
      <Toaster />
    </>
  );
};

export default PublicLayout;
