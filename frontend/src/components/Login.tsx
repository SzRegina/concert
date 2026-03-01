import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRole } from "../utility/Auth";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = useAuth();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") as string) ?? "";
    const password = (fd.get("password") as string) ?? "";

    if (!email || !password) {
      setError("Minden mező kitöltése kötelező.");
      setLoading(false);
      return;
    }

    try {
      const user = await auth.login(email, password);
      const role = getRole(user);

      if (role === 0) {
        navigate("/admin", { replace: true });
      } else if (role === 2) {
        navigate("/user", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    } catch (err: any) {
      setError(err?.message ?? "Nem sikerült belépni.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <div className="miniCard">
          <h3>Bejelentkezés</h3>

          <form
            onSubmit={handleSubmit}
            className="searchPanel"
            style={{ gridTemplateColumns: "1fr 1fr auto" }}
          >
            <div className="field">
              <label className="label">E-mail</label>
              <input className="input" name="email" type="email" required />
            </div>

            <div className="field">
              <label className="label">Jelszó</label>
              <input className="input" name="password" type="password" required />
            </div>

            <button className="searchBtn" type="submit" disabled={loading}>
              {loading ? "Belépés..." : "Belépés"}
            </button>
          </form>

          {error && <p style={{ marginTop: 10, color: "red" }}>{error}</p>}
        </div>
      </div>
    </section>
  );
}
