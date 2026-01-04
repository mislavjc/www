export const Hero = () => {
  return (
    <section className="flex min-h-[80vh] flex-col justify-center">
      <p className="mb-4 text-sm uppercase tracking-widest text-stone-500">
        Mislav
      </p>
      <h1 className="max-w-3xl font-serif text-4xl leading-tight text-stone-900 md:text-5xl lg:text-6xl">
        Building. Shooting. Moving.
      </h1>
      <div className="mt-8 flex flex-col gap-1 text-sm text-stone-600">
        <p>
          <span className="text-stone-500">currently in</span> Zagreb
        </p>
        <p>
          <span className="text-stone-500">building</span> stamped.today
        </p>
        <p>
          <span className="text-stone-500">last saw</span> Bladee in Vienna
        </p>
      </div>
    </section>
  );
};
