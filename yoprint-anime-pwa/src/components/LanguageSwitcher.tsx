"use client";

import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const pathname = usePathname();

  return (
    <div className='fixed top-4 right-4 flex gap-2'>
      {routing.locales.map((locale) => (
        <Link
          key={locale}
          href={pathname}
          locale={locale}
          className='px-3 py-1 rounded-md text-sm bg-gray-200 hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700'
        >
          {locale.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}
