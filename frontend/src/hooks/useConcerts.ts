import { useCallback, useEffect, useState } from "react";
import { API_BASE } from "../utility/config";

export type Concert = {
  id: number;
  name: string;
  performer_name?: string;
  date?: string;
  base_price?: number;
  place_name?: string;
  room_total_rows?: number;
  room_total_columns?: number;
  room_name?: string | number;
  place_city?: string;
  genre_name?: string;
  status?: number;
};

function mapConcert(c: any): Concert {
  return {
    id: Number(c.id),
    name: String(c.name ?? ""),
    performer_name: c.performer_name ?? c.performerName,
    date: c.date ?? c.datetime,
    base_price: c.base_price ?? c.basePrice,
    place_name: c.place_name ?? c.placeName,
    room_total_rows: c.room_total_rows ?? c.roomTotalRows,
    room_total_columns: c.room_total_columns ?? c.roomTotalColumns,
    room_name: c.room_name ?? c.roomName,
    place_city: c.place_city ?? c.placeCity,
    genre_name: c.genre_name ?? c.genreName,
    status: c.status ?? c.state,
  };
}

export function useConcerts() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/api/concerts/all`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const raw = await res.json();
      const list = Array.isArray(raw) ? raw : (raw.data ?? raw.concerts ?? []);
      setConcerts(list.map(mapConcert));
    } catch (err) {
      console.error(err);
      setError("Nem sikerült betölteni a koncerteket.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return {
    concerts,
    loading,
    error,
    reload: load,
  };
}