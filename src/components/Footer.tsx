import { Link } from '@tanstack/react-router'
import { Group, Divider } from '@mantine/core'
import { Ticket, Github, Twitter, Linkedin } from 'lucide-react'

const FOOTER_LINKS = {
  Product: [
    { label: 'Browse Events', to: '/' },
    { label: 'How it works', to: '/about' },
    { label: 'Pricing', to: '/pricing' },
  ],
  Support: [
    { label: 'Contact us', to: '/contact' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Terms of service', to: '/terms' },
    { label: 'Privacy policy', to: '/privacy' },
  ],
}

export default function Footer() {
  return (
    <footer className="border-t w-full  border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto  px-4 py-10 sm:px-6">

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">

          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2 no-underline">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Ticket size={16} className="text-white" />
              </div>
              <span className="text-base font-bold text-slate-900 dark:text-slate-50">
                Evenue
              </span>
            </Link>
            <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
              Discover and book events happening around you. Simple, fast, and reliable.
            </p>
            <Group gap="sm">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200">
                <Github size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200">
                <Twitter size={18} />
              </a>
              <a href="https://linkedin.com/in/abdallahshee" target="_blank" rel="noreferrer" className="text-slate-400 transition hover:text-slate-600 dark:hover:text-slate-200">
                <Linkedin size={18} />
              </a>
            </Group>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
                {section}
              </p>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-slate-500 no-underline transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Divider my="lg" />

        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Evenue. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Built in Nairobi, Kenya 🇰🇪
          </p>
        </div>

      </div>
    </footer>
  )
}