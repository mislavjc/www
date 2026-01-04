import Link from 'next/link';

const links = [
  { href: 'https://github.com/mislavjc', label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/mislavjc/', label: 'LinkedIn' },
  { href: 'https://x.com/mislavjc', label: 'X' },
  { href: 'https://instagram.com/mislavjc', label: 'Instagram' },
];

export const Footer = () => {
  return (
    <footer className="border-t border-stone-200 py-16">
      <div className="mx-auto max-w-3xl px-6">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="font-serif text-lg text-stone-900">Mislav</p>
            <p className="mt-1 text-sm text-stone-600">
              <a
                href="mailto:mislavjc@gmail.com"
                className="hover:text-stone-900"
              >
                mislavjc@gmail.com
              </a>
            </p>
          </div>
          <nav>
            <ul className="flex gap-6">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-stone-600 hover:text-stone-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};
