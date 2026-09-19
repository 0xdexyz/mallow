'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandLogo from './BrandLogo';
import WalletConnectButton from './WalletConnectButton';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/history', label: 'History' },
  { href: '/about', label: 'About' },
];

export default function NavBar() {
  const pathname = usePathname();

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="nav-brand" aria-label="Mallow home">
          <BrandLogo />
        </Link>
        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((link) => {
            const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href} className={active ? 'is-active' : undefined}>
                {link.label}
              </Link>
            );
          })}
        </nav>
        <div className="nav-actions">
          <a href="https://x.com/MallowThesis" className="nav-social" aria-label="Mallow on X" target="_blank" rel="noreferrer">
            <img src="/x.svg" alt="" width={16} height={16} />
          </a>
          <WalletConnectButton />
        </div>
      </div>
    </header>
  );
}
