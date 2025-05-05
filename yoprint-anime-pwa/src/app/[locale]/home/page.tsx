import { getTopAnime, searchAnime, Anime } from "@/services";
import HomeContent from "../../../components/HomeContent";

// Default number of results per page
const ITEMS_PER_PAGE = 12;

// Set revalidation time for this page (60 seconds)
export const revalidate = 60;

// Server Component for data fetching only
export default async function HomePage({
  searchParams,
  params,
}: {
  searchParams?: Promise<{ page?: string; q?: string }>;
  params: Promise<{ locale: string }>;
}) {
  // Await the searchParams and params before accessing properties
  const resolvedSearchParams = (await searchParams) || {};
  const resolvedParams = await params;

  const page = resolvedSearchParams.page ? Number(resolvedSearchParams.page) : 1;
  const searchQuery = resolvedSearchParams.q || "";

  let animeData: Anime[] = [];
  let totalPages = 0;
  let error: string | null = null;

  try {
    // Fetch data on the server side
    // If search query exists, use search API, otherwise get top anime
    const response = searchQuery
      ? await searchAnime(searchQuery, page, ITEMS_PER_PAGE)
      : await getTopAnime(page, ITEMS_PER_PAGE);

    animeData = response.data;
    totalPages = response.pagination.last_visible_page;
  } catch (err) {
    console.error("Error fetching anime data:", err);
    if (err instanceof Error) {
      if (err.message.includes("429")) {
        error = "Rate limit reached. Please try again in a few seconds.";
      } else {
        error = "Failed to load anime data. Please try again later.";
      }
    }
  }

  // Pass all data to client component
  return (
    <HomeContent
      animeData={animeData}
      totalPages={totalPages}
      currentPage={page}
      error={error}
      searchQuery={searchQuery}
    />
  );
}
