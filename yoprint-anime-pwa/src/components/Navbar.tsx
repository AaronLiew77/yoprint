"use client";

import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navbar() {
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const pages = [
    { name: "home", path: "/" },
    { name: "about", path: "/about" },
  ];

  return (
    <AppBar position='sticky' color='default' elevation={1}>
      <Container maxWidth='lg'>
        <Toolbar disableGutters>
          {/* Logo/Title - visible on desktop */}
          <Typography
            variant='h6'
            noWrap
            component={Link}
            href='/'
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            YoPrint Anime
          </Typography>

          {/* Mobile menu icon */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size='large'
              aria-label='navigation menu'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleOpenNavMenu}
              color='inherit'
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  component={Link}
                  href={page.path}
                  selected={pathname === page.path}
                >
                  <Typography textAlign='center'>{t(page.name)}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* Logo/Title - visible on mobile */}
          <Typography
            variant='h6'
            noWrap
            component={Link}
            href='/'
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            YoPrint Anime
          </Typography>

          {/* Desktop navigation links */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Typography
                key={page.name}
                component={Link}
                href={page.path}
                sx={{
                  my: 2,
                  mx: 1,
                  color: "inherit",
                  display: "block",
                  textDecoration: pathname === page.path ? "underline" : "none",
                  fontWeight: pathname === page.path ? "bold" : "normal",
                }}
              >
                {t(page.name)}
              </Typography>
            ))}
          </Box>

          {/* Right side actions */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {!isMobile && <LanguageSwitcher />}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
