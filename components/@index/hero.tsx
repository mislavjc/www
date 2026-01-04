'use client';

import { motion } from 'motion/react';

export const Hero = () => {
  return (
    <section className="flex min-h-[80vh] flex-col justify-center">
      <motion.p
        className="mb-4 text-sm uppercase tracking-widest text-stone-400"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Mislav
      </motion.p>
      <motion.h1
        className="max-w-3xl font-serif text-4xl leading-tight text-stone-900 md:text-5xl lg:text-6xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        Building. Shooting. Moving.
      </motion.h1>
      <motion.div
        className="mt-8 flex flex-col gap-1 text-sm text-stone-500"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <p>
          <span className="text-stone-400">currently in</span> Zagreb
        </p>
        <p>
          <span className="text-stone-400">building</span> stamped.today
        </p>
        <p>
          <span className="text-stone-400">last saw</span> Bladee in Vienna
        </p>
      </motion.div>
    </section>
  );
};
