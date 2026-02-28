import { Concerts } from "../../components/Concert";

export function ConcertPage() {
  return (
    <Concerts>
      {({ concerts, loading, error, reload }) => (

        <section className="section">
          <div className="">
            <div className="sectionHead">
              <h2>Összes koncert</h2>
              <button className="btn" onClick={reload}>Frissítés</button>
            </div>

            {loading && <p>Betöltés…</p>}
            {error && <p>{error}</p>}

            {!loading && !error && (
              <ul className="c_list">
                {concerts.map((c) => (
                  <li className="c_element" key={c.id}>
                    <div className="c_element_thumb">
                      <button className="btn">Tovább</button>
                    </div>
                    <div className="c_element_data">
                    <h3 className="cardTitle">{c.name}</h3> 
                    <ul>
                      <li>Előadó: {c.performer_name}</li>
                      <li>Időpont: {c.date} </li>
                      <li>Ár: {c.base_price} forinttól</li>
                      <li>Helyszín: {c.place_name}</li>
                    </ul>
                  </div>
                </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}
    </Concerts>
  );
}