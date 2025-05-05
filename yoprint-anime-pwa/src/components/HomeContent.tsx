"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { Anime } from "@/services";
import {
  Typography,
  Box,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
  Pagination,
  Container,
  Rating,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

interface HomeContentProps {
  animeData: Anime[];
  totalPages: number;
  currentPage: number;
  error: string | null;
  searchQuery: string;
}

export default function HomeContent({
  animeData,
  totalPages,
  currentPage,
  error,
  searchQuery,
}: HomeContentProps) {
  const t = useTranslations("HomePage");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState(searchQuery);
  const router = useRouter();
  const pathname = usePathname();

  // Reset loading state when data changes
  useEffect(() => {
    setLoading(false);
  }, [animeData]);

  // Update search state when searchQuery prop changes
  useEffect(() => {
    setSearch(searchQuery);
  }, [searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    // Debounce search to avoid too many requests
    const timer = setTimeout(() => {
      setLoading(true);
      // Reset to page 1 when searching
      router.push(`${pathname}?q=${encodeURIComponent(value)}`);
    }, 250);

    return () => clearTimeout(timer);
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    // Show loading state
    setLoading(true);

    // Navigate to new page using query params, preserving search query
    const searchParam = search ? `&q=${encodeURIComponent(search)}` : "";
    router.push(`${pathname}?page=${value}${searchParam}`);

    // Scroll to top when changing page
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Typography variant='h3' component='h1' sx={{ textAlign: "center" }} gutterBottom>
        {t("title")}
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder={t("searchPlaceholder") || "Search anime..."}
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          variant='outlined'
        />
      </Box>

      {error && (
        <Alert severity='error' sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display='flex' justifyContent='center' py={8}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
              gap: 3,
            }}
          >
            {animeData.map((anime, index) => (
              <Card
                key={`${anime.mal_id}-${index}`}
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "scale(1.03)",
                  },
                }}
              >
                <CardMedia
                  component='img'
                  height='300'
                  image={anime.images.jpg.image_url}
                  alt={anime.title}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant='h6' component='h2' noWrap title={anime.title}>
                    {anime.title}
                  </Typography>

                  <Box display='flex' alignItems='center' mb={1}>
                    <Rating value={anime.score / 2} precision={0.1} readOnly size='small' />
                    <Typography variant='body2' color='text.secondary' ml={1}>
                      {anime.score}
                    </Typography>
                  </Box>

                  <Typography variant='body2' color='text.secondary'>
                    {anime.type} • {anime.episodes ? `${anime.episodes} eps` : "Unknown"} •{" "}
                    {anime.year || "Unknown"}
                  </Typography>

                  <Typography
                    variant='body2'
                    color='text.secondary'
                    sx={{
                      mt: 1,
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {anime.synopsis || "No description available."}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>

          {animeData.length === 0 && !loading && !error && (
            <Box textAlign='center' py={8}>
              <Typography variant='h6'>No results found. Try a different search.</Typography>
            </Box>
          )}

          {totalPages > 0 && (
            <Box display='flex' justifyContent='center' mt={4}>
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color='primary'
                size='large'
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
}
