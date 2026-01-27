export const SectionTitle = ({ children }: { children: string }) => {
  const id = children.toLowerCase().replace(/\s+/g, '-');
  return (
    <h2 className="mb-8 font-grotesk text-4xl text-neutral-900" id={id}>
      {children}
    </h2>
  );
};
