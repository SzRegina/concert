import { useState } from "react";
import { NewPlace, useNewPlaces } from "../../hooks/useAddAll";

const NEW_PLACE: NewPlace = {
  name: "",
  city: "",
  address: "",
};

export function AddNewPage() {
  const { places, loading, error, addPlace, removePlace, reload } = useNewPlaces();

  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState<NewPlace>(NEW_PLACE);

  const startAdd = () => {
    setIsAdding(true);
    setDraft(NEW_PLACE);
  };

  const cancelAdd = () => {
    setIsAdding(false);
    setDraft(NEW_PLACE);
  };

  const saveAdd = async () => {
    if (!draft.name.trim() || !draft.city.trim() || !draft.address.trim()) {
      alert("A név, város és cím megadása kötelező.");
      return;
    }

    try {
      await addPlace({
        name: draft.name.trim(),
        city: draft.city.trim(),
        address: draft.address.trim(),
      });
      setIsAdding(false);
      setDraft(NEW_PLACE);
    } catch (e: any) {
      alert(e?.message ?? "Nem sikerült menteni.");
    }
  };

  const onRemove = async (id: number) => {
    if (!window.confirm("Biztosan törlöd a helyszínt?")) return;
    try {
      await removePlace(id);
    } catch (e: any) {
      alert(e?.message ?? "Nem sikerült törölni.");
    }
  };

  return (
    <section className="adminCard">
      <div className="adminCardHead">
        <h2>Helyszínek</h2>

        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button className="adminBtn" type="button" onClick={reload} disabled={loading}>
            Frissítés
          </button>

          {!isAdding ? (
            <button className="adminBtn adminBtn--solid" type="button" onClick={startAdd}>
              + Új helyszín felvétele
            </button>
          ) : (
            <>
              <button className="adminBtn adminBtn--solid" type="button" onClick={saveAdd}>
                Mentés
              </button>
              <button className="adminBtn" type="button" onClick={cancelAdd}>
                Mégse
              </button>
            </>
          )}
        </div>
      </div>

      {error && <p style={{ marginTop: 10, color: "red" }}>{error}</p>}

      <div className="adminTableWrap">
        <table className="adminTable">
          <thead>
            <tr>
              <th>Név</th>
              <th>Város</th>
              <th>Cím</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} style={{ padding: 14, opacity: 0.8 }}>
                  Betöltés…
                </td>
              </tr>
            )}

            {!loading &&
              places.map((u) => (
                <tr key={u.id}>
                  <td>{u.city}</td>
                  <td>{u.address}</td>
                  <td>
                    <button className="adminDanger" type="button" onClick={() => onRemove(u.id)}>
                      Helyszín
                    </button>
                  </td>
                </tr>
              ))}

            {isAdding && (
              <>
                <tr>
                  <td>
                    <input
                      className="adminInput"
                      placeholder="helyszín neve"
                      value={draft.name}
                      onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                    />
                  </td>
                  <td>
                    <input
                      className="adminInput"
                      placeholder="város"
                      value={draft.city}
                      onChange={(e) => setDraft((d) => ({ ...d, city: e.target.value }))}
                    />
                  </td>
                  <td>
                    <input
                      className="adminInput"
                      placeholder="cím"
                      value={draft.address}
                      onChange={(e) => setDraft((d) => ({ ...d, address: e.target.value }))}
                    />
                  </td>
                </tr>
              </>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
