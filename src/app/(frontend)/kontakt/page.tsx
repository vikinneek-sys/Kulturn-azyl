export default function KontaktPage() {
  return (
    <>
      <section className="page-header">
        <div className="container">
          <p className="eyebrow">napiš nám</p>
          <h1>Kontakt</h1>
          <p className="page-intro">
            Chceš nám poradit cool akci? Znáš se s někým cool? JSI TY COOL? Jsme otevření jakému
            dialogu. Ať už jsi pořadatel, muzikant, malíř, kdokoliv!
          </p>
          <p className="page-intro">
            Chceš se zapojit? Píšeš? Fotíš? CHCEME TĚ! NAPIŠ NÁM! Poznáme se, pokecáme, domluvíme se.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-box">
          <div className="static-card">
            <h2>Redakce</h2>
            <p>Email: redakce@kulturniazyl.cz</p>
            <p>Instagram: @kulturniazyl</p>
          </div>
          <div className="static-card">
            <h2>Tipy na akce</h2>
            <p>
              Pošli datum, místo, název akce, plakát/fotky a pár vět, proč to není jen další kulturní
              párek v rohlíku.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
