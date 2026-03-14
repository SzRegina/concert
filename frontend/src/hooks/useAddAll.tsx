import { useCallback, useEffect, useState } from "react";
import { API_BASE } from "../utility/config";

const API = `${API_BASE}/api/admin`;

export type PlaceRow = {
  id: number;
  name: string;
  city: string;
  address: string;
};
export type NewPlace = Omit<PlaceRow, "id"> & {
  name: string;
  city: string;
  address: string;
};

function authHeaders(): HeadersInit {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function useNewPlaces() {
  const [places, setPlaces] = useState<PlaceRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API}/places`, {
        method: "GET",
        credentials: "include",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      const list = Array.isArray(data) ? data : (data.data ?? []);
      setPlaces(
        list.map((p: any) => ({
          id: Number(p.id),
          name: String(p.name ?? p.place_name ?? ""),
          city: p.city ?? p.place_city,
          address: p.address ?? p.place_address,
        }))
      );
    } catch (e) {
      console.error(e);
      setError("");
    } finally {
      setLoading(false);
    }
  }, []);

    const addPlace = useCallback(
      async (place: NewPlace) => {
        const res = await fetch(`${API}/places`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...authHeaders(),
          },
            body: JSON.stringify({
            name: place.name,
            city: place.city,
            address: place.address,
            }),
        });
  
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Hiba a felhasználó létrehozásakor.");
        }
        await load();
      },
      [load]
    );

      const removePlace = useCallback(
        async (id: number) => {
          const res = await fetch(`${API}/places/${id}`, {
            method: "DELETE",
            headers: { Accept: "application/json", ...authHeaders() },
          });
    
          if (!res.ok) throw new Error("Hiba a törléskor.");
          await load();
        },
        [load]
      );

  useEffect(() => { load(); }, [load]);

  return { places, loading, error, reload: load, addPlace, removePlace };
}