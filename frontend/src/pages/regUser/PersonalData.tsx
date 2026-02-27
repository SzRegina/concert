import { useState } from "react";

type PersonalDataProps = {
  onUserUpdated?: (u: any | null) => void;
};

export function PersonalData({ onUserUpdated }: PersonalDataProps) {
  // demo adatok (később backendből)
  const [username, setUsername] = useState("Felhasználónév");
  const [password, setPassword] = useState("********");
  const [email, setEmail] = useState("user@mail.com");

  const save = () => {
    const updated = { username, email }; 
    console.log("PERSONAL_DATA_UPDATE (dummy)", { username, password, email });

    onUserUpdated?.({
      name: username,
      email,
      role: 2, 
    });

    alert("Frissítés (dummy) – nézd a konzolt 🙂");
  };

  return (
    <section className="userCard">
      <div className="userCardHead">
        <h2>Személyes adatai</h2>
      </div>

      <div className="userFormWrap">
        <div className="userFormRow">
          <label className="userLabel">Felhasználónév</label>
          <input
            className="userInput"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="userFormRow">
          <label className="userLabel">Jelszó</label>
          <input
            className="userInput"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
          />
        </div>

        <div className="userFormRow">
          <label className="userLabel">Email cím</label>
          <input
            className="userInput"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="userFormActions">
          <button className="userBtn userBtn--solid" type="button" onClick={save}>
            Frissítés
          </button>
        </div>
      </div>
    </section>
  );
}