'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'Generate Tweets' },
  { href: '/scheduled', label: 'Scheduled Tweets' },
];

export default function NavTabs() {
  const pathname = usePathname();
  return (
    <nav className="flex justify-center space-x-4 mb-6 mt-4">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`px-3 py-1 rounded-md text-sm ${
            pathname === tab.href
              ? 'bg-gray-800 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}
