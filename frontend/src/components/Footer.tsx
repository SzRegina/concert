import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footGrid">
          <div>
            <div className="brand footerBrand">
              <img src="/SEATY_newLogo_Black.png" alt="SEATY logó" className="logoImg logoImg--dark" />
              <img src="/SEATY_newLogo_White.jpg" alt="SEATY logó" className="logoImg logoImg--light" />
            </div>
          </div>

          <div>
            <h5>Menü</h5>
            <Link to="/concerts">Koncertek</Link>
            <Link to="/">Kedvencek</Link>
          </div>

          <div>
            <h5>Fiók</h5>
            <Link to="/login">Bejelentkezés</Link>
          </div>

        </div>

        <div className="authors">
          <br />© 2026 SEATY –
          <br />Bíró Eszter &amp; Szépréthy Regina
        </div>
      </div>
    </footer>
  );
}
