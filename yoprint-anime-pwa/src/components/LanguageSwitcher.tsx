"use client";

import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Box, Button } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

export default function LanguageSwitcher() {
  const pathname = usePathname();

  return (
    <Box sx={{ display: "flex", alignItems: "center", ml: 1 }}>
      <LanguageIcon sx={{ mr: 0.5 }} fontSize='small' />
      <Box sx={{ display: "flex" }}>
        {routing.locales.map((locale) => (
          <Button
            key={locale}
            component={Link}
            href={pathname}
            locale={locale}
            size='small'
            sx={{
              minWidth: "40px",
              textTransform: "uppercase",
              fontWeight: "medium",
              fontSize: "0.75rem",
            }}
          >
            {locale}
          </Button>
        ))}
      </Box>
    </Box>
  );
}
