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
  const couleursRapides = [
    "#000000",
    "#ffffff",
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#3b82f6",
    "#8b5cf6",
    "#92400e",
  ];

  const styleBoutonBase = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    padding: "8px 12px",
    minHeight: "38px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    cursor: "pointer",
    fontSize: "14px",
  };

  const styleSelect = {
    padding: "7px 10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    cursor: "pointer",
  };

  const styleGroupe = {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "8px",
  };

  const boutonOutil = (nom, icone, texte) => (
    <button
      type="button"
      onClick={() => setOutil(nom)}
      style={{
        ...styleBoutonBase,
        background: outil === nom ? "#e0e7ff" : "#ffffff",
        border:
          outil === nom
            ? "1px solid #6366f1"
            : "1px solid #d1d5db",
        fontWeight: outil === nom ? "600" : "400",
      }}
    >
      <span>{icone}</span>
      <span>{texte}</span>
    </button>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "14px",
        background: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Première ligne */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        {/* Navigation */}
        <div style={styleGroupe}>
          <button
            type="button"
            onClick={retournerAccueil}
            style={styleBoutonBase}
          >
            🏠 Accueil
          </button>

          <button
            type="button"
            onClick={annuler}
            disabled={!peutAnnuler}
            style={{
              ...styleBoutonBase,
              opacity: peutAnnuler ? 1 : 0.45,
              cursor: peutAnnuler ? "pointer" : "not-allowed",
            }}
          >
            ↩ Annuler
          </button>

          <button
            type="button"
            onClick={retablir}
            disabled={!peutRetablir}
            style={{
              ...styleBoutonBase,
              opacity: peutRetablir ? 1 : 0.45,
              cursor: peutRetablir ? "pointer" : "not-allowed",
            }}
          >
            ↪ Rétablir
          </button>
        </div>

        <div
          style={{
            width: "1px",
            height: "34px",
            background: "#e5e7eb",
          }}
        />

        {/* Outils de dessin */}
        <div style={styleGroupe}>
          {boutonOutil("stylo", "✍", "Stylo")}
          {boutonOutil("ligne", "➖", "Ligne")}
          {boutonOutil("fleche", "➡️", "Flèche")}
          {boutonOutil("texte", "📝", "Texte")}
          {boutonOutil("rectangle", "▭", "Rectangle")}
          {boutonOutil("cercle", "⭕", "Cercle")}
          {boutonOutil("gomme", "🧽", "Gomme")}
        </div>

        <div
          style={{
            width: "1px",
            height: "34px",
            background: "#e5e7eb",
          }}
        />

        {/* Options de texte */}
        <div style={styleGroupe}>
          <button
            type="button"
            onClick={() => setTexteGras(!texteGras)}
            title="Texte en gras"
            style={{
              ...styleBoutonBase,
              minWidth: "40px",
              background: texteGras ? "#e0e7ff" : "#ffffff",
              border:
                texteGras
                  ? "1px solid #6366f1"
                  : "1px solid #d1d5db",
              fontWeight: "bold",
            }}
          >
            B
          </button>

          <button
            type="button"
            onClick={() => setTexteItalique(!texteItalique)}
            title="Texte en italique"
            style={{
              ...styleBoutonBase,
              minWidth: "40px",
              background: texteItalique ? "#e0e7ff" : "#ffffff",
              border:
                texteItalique
                  ? "1px solid #6366f1"
                  : "1px solid #d1d5db",
              fontStyle: "italic",
            }}
          >
            I
          </button>

          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              fontSize: "14px",
            }}
          >
            Taille

            <select
              value={tailleTexte}
              onChange={(event) =>
                setTailleTexte(Number(event.target.value))
              }
              style={styleSelect}
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
        </div>
      </div>

      {/* Séparation */}
      <div
        style={{
          width: "100%",
          height: "1px",
          background: "#e5e7eb",
        }}
      />

      {/* Deuxième ligne */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        {/* Palette */}
        <div style={styleGroupe}>
          <span
            style={{
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Palette
          </span>

          {couleursRapides.map((couleurRapide) => (
            <button
              key={couleurRapide}
              type="button"
              aria-label={`Choisir la couleur ${couleurRapide}`}
              title={couleurRapide}
              onClick={() => setCouleur(couleurRapide)}
              style={{
                width: "27px",
                height: "27px",
                padding: 0,
                borderRadius: "50%",
                border:
                  couleur === couleurRapide
                    ? "3px solid #2563eb"
                    : "1px solid #9ca3af",
                background: couleurRapide,
                cursor: "pointer",
                boxShadow:
                  couleurRapide === "#ffffff"
                    ? "inset 0 0 0 1px #d1d5db"
                    : "none",
              }}
            />
          ))}

          <label
            title="Choisir une couleur personnalisée"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Autre

            <input
              type="color"
              value={couleur}
              onChange={(event) =>
                setCouleur(event.target.value)
              }
              style={{
                width: "34px",
                height: "30px",
                padding: "2px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                background: "#ffffff",
                cursor: "pointer",
              }}
            />
          </label>
        </div>

        <div
          style={{
            width: "1px",
            height: "34px",
            background: "#e5e7eb",
          }}
        />

        {/* Épaisseur */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "14px",
          }}
        >
          Épaisseur

          <input
            type="range"
            min="1"
            max="20"
            value={epaisseur}
            onChange={(event) =>
              setEpaisseur(Number(event.target.value))
            }
          />

          <strong
            style={{
              minWidth: "40px",
            }}
          >
            {epaisseur}px
          </strong>
        </label>

        {/* Fond */}
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "7px",
            fontSize: "14px",
          }}
        >
          Fond

          <select
            value={fond}
            onChange={(event) => setFond(event.target.value)}
            style={styleSelect}
          >
            <option value="blanc">Blanc</option>
            <option value="petits">Petits carreaux</option>
            <option value="grands">Grands carreaux</option>
            <option value="millimetre">Millimétré</option>
            <option value="repere">Repère</option>
          </select>
        </label>

        <div
          style={{
            flex: "1 1 auto",
          }}
        />

        {/* Actions */}
        <div style={styleGroupe}>
          <button
            type="button"
            onClick={effacerTout}
            style={{
              ...styleBoutonBase,
              background: "#fef2f2",
              border: "1px solid #fecaca",
            }}
          >
            🗑 Effacer
          </button>

          <button
            type="button"
            onClick={telechargerImage}
            style={{
              ...styleBoutonBase,
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              fontWeight: "600",
            }}
          >
            📥 PNG
          </button>
        </div>
      </div>
    </div>
  );
}