import type { PropsWithChildren } from 'react';

import Header from './public-header';

const PublicLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Header />
      <main className="mt-16">{children}</main>
    </>
  );
};

export default PublicLayout;
