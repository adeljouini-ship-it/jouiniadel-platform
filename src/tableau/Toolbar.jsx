export default function Toolbar({
  outil,
  setOutil,
  couleur,
  setCouleur,
  epaisseur,
  setEpaisseur,
  fond,
  setFond,
  peutAnnuler,
  peutRetablir,
  annuler,
  retablir,
  effacerTout,
  telechargerImage,
  retournerAccueil,
  texteGras,
  setTexteGras,
  texteItalique,
  setTexteItalique,
  tailleTexte,
  setTailleTexte,
}) {
  const bouton = (nom, icone, texte) => (
    <button
      type="button"
      onClick={() => setOutil(nom)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 14px",
        borderRadius: "10px",
        border: "1px solid #d1d5db",
        cursor: "pointer",
        background:
          outil === nom ? "#e0e7ff" : "#ffffff",
        fontWeight:
          outil === nom ? "600" : "400",
      }}
    >
      <span>{icone}</span>
      <span>{texte}</span>
    </button>
  );

  const styleBoutonTexte = {
    padding: "8px 12px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "12px",
        padding: "12px",
        background: "#ffffff",
        borderRadius: "14px",
        boxShadow:
          "0 2px 10px rgba(0,0,0,.08)",
      }}
    >
      <button
        type="button"
        onClick={retournerAccueil}
      >
        🏠 Accueil
      </button>

      <button
        type="button"
        onClick={annuler}
        disabled={!peutAnnuler}
      >
        ↩ Annuler
      </button>

      <button
        type="button"
        onClick={retablir}
        disabled={!peutRetablir}
      >
        ↪ Rétablir
      </button>

      {bouton("stylo", "✍", "Stylo")}
      {bouton("ligne", "➖", "Ligne")}
      {bouton("fleche", "➡️", "Flèche")}
      {bouton("texte", "📝", "Texte")}

      <button
        type="button"
        onClick={() =>
          setTexteGras(!texteGras)
        }
        style={{
          ...styleBoutonTexte,
          background: texteGras
            ? "#e0e7ff"
            : "#ffffff",
          fontWeight: "bold",
        }}
        title="Gras"
      >
        B
      </button>

      <button
        type="button"
        onClick={() =>
          setTexteItalique(!texteItalique)
        }
        style={{
          ...styleBoutonTexte,
          background: texteItalique
            ? "#e0e7ff"
            : "#ffffff",
          fontStyle: "italic",
        }}
        title="Italique"
      >
        I
      </button>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        Taille texte

        <select
          value={tailleTexte}
          onChange={(event) =>
            setTailleTexte(
              Number(event.target.value)
            )
          }
        >
          <option value={16}>16 px</option>
          <option value={20}>20 px</option>
          <option value={24}>24 px</option>
          <option value={32}>32 px</option>
          <option value={40}>40 px</option>
          <option value={48}>48 px</option>
          <option value={64}>64 px</option>
        </select>
      </label>

      {bouton(
        "rectangle",
        "▭",
        "Rectangle"
      )}

      {bouton("cercle", "⭕", "Cercle")}
      {bouton("gomme", "🧽", "Gomme")}

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        Couleur

        <input
          type="color"
          value={couleur}
          onChange={(event) =>
            setCouleur(event.target.value)
          }
        />
      </label>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        Épaisseur

        <input
          type="range"
          min="1"
          max="20"
          value={epaisseur}
          onChange={(event) =>
            setEpaisseur(
              Number(event.target.value)
            )
          }
        />
      </label>

      <span>{epaisseur}px</span>

      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        Fond

        <select
          value={fond}
          onChange={(event) =>
            setFond(event.target.value)
          }
        >
          <option value="blanc">
            Blanc
          </option>

          <option value="petits">
            Petits carreaux
          </option>

          <option value="grands">
            Grands carreaux
          </option>

          <option value="millimetre">
            Millimétré
          </option>

          <option value="repere">
            Repère
          </option>
        </select>
      </label>

      <button
        type="button"
        onClick={effacerTout}
      >
        🗑 Effacer
      </button>

      <button
        type="button"
        onClick={telechargerImage}
      >
        📥 PNG
      </button>
    </div>
  );
}