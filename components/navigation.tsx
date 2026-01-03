import Link from 'next/link';

const navItems = [
  { number: '1', label: 'Music', href: '#music' },
  { number: '2', label: 'Photography', href: '#photography' },
  { number: '3', label: 'Code', href: '#code' },
  { number: '4', label: 'Travel', href: '#travel' },
];

export const Navigation = () => {
  return (
    <nav className="fixed left-8 top-1/2 z-50 hidden -translate-y-1/2 lg:block">
      <ul className="flex flex-col gap-3">
        {navItems.map((item) => (
          <li key={item.number}>
            <Link
              href={item.href}
              className="group flex items-center gap-3 text-sm text-stone-400 transition-colors hover:text-stone-900"
            >
              <span className="font-serif text-xs">{item.number}</span>
              <span className="opacity-0 transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
