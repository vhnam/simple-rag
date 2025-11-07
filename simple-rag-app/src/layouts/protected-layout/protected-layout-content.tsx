import type { PropsWithChildren } from 'react';

const ProtectedLayoutContent = ({ children }: PropsWithChildren) => {
  return (
    <main className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 p-4 md:gap-6 md:py-6 lg:px-6">
          {children}
        </div>
      </div>
    </main>
  );
};

export default ProtectedLayoutContent;
