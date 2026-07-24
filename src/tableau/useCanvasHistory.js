import { useCallback, useRef, useState } from "react";

const LIMITE_HISTORIQUE = 50;

export default function useCanvasHistory(canvasRef) {
  const historiqueRef = useRef([]);
  const indexHistoriqueRef = useRef(-1);

  const [peutAnnuler, setPeutAnnuler] = useState(false);
  const [peutRetablir, setPeutRetablir] = useState(false);

  const mettreAJourBoutons = useCallback(() => {
    const index = indexHistoriqueRef.current;
    const historique = historiqueRef.current;

    setPeutAnnuler(index > 0);
    setPeutRetablir(
      index >= 0 && index < historique.length - 1
    );
  }, []);

  const obtenirEtatCanvas = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return null;
    }

    return canvas.toDataURL("image/png");
  }, [canvasRef]);

  const chargerEtat = useCallback(
    (imageSource) => {
      return new Promise((resolve, reject) => {
        const canvas = canvasRef.current;

        if (!canvas || !imageSource) {
          resolve(false);
          return;
        }

        const contexte = canvas.getContext("2d");

        if (!contexte) {
          resolve(false);
          return;
        }

        const image = new Image();

        image.onload = () => {
          contexte.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
          );

          contexte.drawImage(
            image,
            0,
            0,
            image.width,
            image.height,
            0,
            0,
            canvas.width,
            canvas.height
          );

          resolve(true);
        };

        image.onerror = () => {
          reject(
            new Error(
              "Impossible de charger l’état du tableau."
            )
          );
        };

        image.src = imageSource;
      });
    },
    [canvasRef]
  );

  const initialiserHistorique = useCallback(() => {
    const etatInitial = obtenirEtatCanvas();

    if (!etatInitial) {
      return;
    }

    historiqueRef.current = [etatInitial];
    indexHistoriqueRef.current = 0;

    mettreAJourBoutons();
  }, [mettreAJourBoutons, obtenirEtatCanvas]);

  const enregistrerEtat = useCallback(() => {
    const nouvelEtat = obtenirEtatCanvas();

    if (!nouvelEtat) {
      return;
    }

    const indexActuel =
      indexHistoriqueRef.current;

    const historiqueJusquaIndex =
      historiqueRef.current.slice(
        0,
        indexActuel + 1
      );

    historiqueJusquaIndex.push(nouvelEtat);

    if (
      historiqueJusquaIndex.length >
      LIMITE_HISTORIQUE
    ) {
      historiqueJusquaIndex.shift();
    }

    historiqueRef.current =
      historiqueJusquaIndex;

    indexHistoriqueRef.current =
      historiqueJusquaIndex.length - 1;

    mettreAJourBoutons();
  }, [mettreAJourBoutons, obtenirEtatCanvas]);

  const remplacerEtatActuel = useCallback(() => {
    const nouvelEtat = obtenirEtatCanvas();
    const index = indexHistoriqueRef.current;

    if (!nouvelEtat || index < 0) {
      return;
    }

    historiqueRef.current[index] = nouvelEtat;

    mettreAJourBoutons();
  }, [mettreAJourBoutons, obtenirEtatCanvas]);

  const annuler = useCallback(async () => {
    if (indexHistoriqueRef.current <= 0) {
      return false;
    }

    indexHistoriqueRef.current -= 1;

    const etat =
      historiqueRef.current[
        indexHistoriqueRef.current
      ];

    try {
      await chargerEtat(etat);
      mettreAJourBoutons();
      return true;
    } catch (erreur) {
      console.error(erreur);
      return false;
    }
  }, [chargerEtat, mettreAJourBoutons]);

  const retablir = useCallback(async () => {
    const dernierIndex =
      historiqueRef.current.length - 1;

    if (
      indexHistoriqueRef.current >= dernierIndex
    ) {
      return false;
    }

    indexHistoriqueRef.current += 1;

    const etat =
      historiqueRef.current[
        indexHistoriqueRef.current
      ];

    try {
      await chargerEtat(etat);
      mettreAJourBoutons();
      return true;
    } catch (erreur) {
      console.error(erreur);
      return false;
    }
  }, [chargerEtat, mettreAJourBoutons]);

  const reinitialiserHistorique =
    useCallback(() => {
      historiqueRef.current = [];
      indexHistoriqueRef.current = -1;

      setPeutAnnuler(false);
      setPeutRetablir(false);
    }, []);

  return {
    peutAnnuler,
    peutRetablir,
    initialiserHistorique,
    enregistrerEtat,
    remplacerEtatActuel,
    chargerEtat,
    annuler,
    retablir,
    reinitialiserHistorique,
  };
}