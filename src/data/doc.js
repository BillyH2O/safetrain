export const modelParametersDoc = [
    {
      title: "Temperature",
      description:
        "Ce paramètre contrôle la randomisation des résultats générés. Sa plage de valeurs va généralement de 0 à 1. Une température basse (proche de 0) rend les réponses plus déterministes et cohérentes, tandis qu’une température élevée (proche de 1) augmente la diversité et la créativité des réponses en introduisant davantage de hasard.",
    },
    {
      title: "topP",
      description:
        "Ce paramètre ajuste la probabilité cumulative pour limiter le choix des mots générés. La plage de valeurs typique est de 0 à 1. Avec une valeur proche de 1, presque tous les mots sont considérés, tandis qu'une valeur basse restreint le choix aux mots les plus probables.",
    },
    {
      title: "topK",
      description:
        "Ce paramètre fixe un nombre maximum de choix parmi les mots les plus probables. La plage de valeurs peut aller de 1 à 100 ou plus. Une valeur basse limite les options aux mots les plus probables, tandis qu'une valeur élevée permet plus de diversité.",
    },
    {
      title: "maxSteps",
      description:
        "Ce paramètre détermine le nombre maximum d'étapes ou de tokens générés par l'algorithme. La plage de valeurs peut varier selon l'implémentation, mais elle est souvent comprise entre 50 et 1000. Une valeur plus élevée permet de générer des textes plus longs.",
    },
    {
      title: "stopSequences",
      description:
        "Ce paramètre indique les séquences spécifiques où la génération doit s’arrêter. Par exemple, si « max » est défini comme séquence d'arrêt, l'algorithme interrompra la génération dès qu’il rencontrera cette séquence.",
    },
    {
      title: "Prompt",
      description:
        "Il s'agit du texte d'entrée ou de départ que l'utilisateur fournit pour lancer la génération. Le modèle s'appuie sur ce prompt pour produire la suite du contenu.",
    },
  ];
  