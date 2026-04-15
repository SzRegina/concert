import { useEffect, useMemo, useState } from "react";
import { Search, SearchFilters } from "../../components/Search";
import { Footer } from "../../components/Footer";
import { useConcerts } from "../../hooks/useConcerts";
import { usePlaces } from "../../hooks/usePlaces";
import { useGenres } from "../../hooks/useGenres";
import { ConcertSlider } from "../../components/ConcertSlider";

function getWindowSize() {
  const w = window.innerWidth;
  if (w <= 400) return 1;   
  if (w <= 520) return 1;   
  if (w <= 980) return 2;   
  if (w <= 1280) return 3;  
  return 4;                 
}

export function Home() {
  const { concerts, loading, error } = useConcerts();
  const { places } = usePlaces();
  const { genres } = useGenres();

  const [filters, setFilters] = useState<SearchFilters>({
    q: "",
    date: "",
    placeId: "",
    genreId: "",
  });

  const [windowSize, setWindowSize] = useState<number>(() => getWindowSize());

  useEffect(() => {
    const onResize = () => setWindowSize(getWindowSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const filtered = useMemo(() => {
    const q = filters.q.trim().toLowerCase();
    const date = filters.date.trim();

    return concerts.filter((concert: any) => {
      const name = String(concert.name ?? "").toLowerCase();
      const performer = String(concert.performer_name ?? "").toLowerCase();

      const placeOk = !filters.placeId || String(concert.place_id ?? "") === filters.placeId;
      const genreOk = !filters.genreId || String(concert.genre_id ?? "") === filters.genreId;
      const qOk = !q || name.includes(q) || performer.includes(q);
      const dateOk = !date || String(concert.date ?? "").startsWith(date);

      return placeOk && genreOk && qOk && dateOk;
    });
  }, [concerts, filters]);

  if (loading) return <p>Betöltés…</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <div className="heroCard">
        <Search concerts={concerts} places={places} genres={genres} onSearch={setFilters} />
      </div>

      {filtered.length === 0 ? (
        <p className="emptyState">Nincs találat a megadott szűrésre.</p>
      ) : (
        <ConcertSlider items={filtered} windowSize={windowSize} />
      )}

      <Footer />
    </>
  );
}