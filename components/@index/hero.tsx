export const Hero = () => {
  return (
    <section className="flex h-screen flex-col items-center justify-center text-center">
      <h1 className="max-w-3xl font-serif text-4xl leading-tight text-stone-900 md:text-5xl lg:text-6xl">
        Building. Shooting. Moving.
      </h1>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-stone-600">
        <p>
          <span className="text-stone-400">currently in</span> Zagreb
        </p>
        <span className="text-stone-300">·</span>
        <p>
          <span className="text-stone-400">building</span> stamped.today
        </p>
        <span className="text-stone-300">·</span>
        <p>
          <span className="text-stone-400">last saw</span> Bladee in Vienna
        </p>
      </div>
    </section>
  );
};
