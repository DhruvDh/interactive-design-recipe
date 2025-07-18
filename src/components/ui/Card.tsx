// src/components/ui/Card.tsx
export const Card: React.FC<React.PropsWithChildren> = ({ children }) => (
  <main className="flex-1 flex justify-center overflow-y-auto bg-neutral-100 p-0.5">
    <div className="w-full max-w-4xl bg-white rounded-3xl m-0.5 p-10">
      {children}
    </div>
  </main>
);
