# osea-web

Interface d’administration et client du projet Osea. Elle est construite avec React, Vite, TypeScript et Tailwind CSS et communiquera uniquement avec le serveur central Osea.

## Démarrage

```sh
bun install
bun run dev
```

Créer un build de production avec `bun run build`.

## État

L’inventaire actuel est un écran de démonstration avec des machines et des métriques fictives. La recherche, les filtres, le thème clair/sombre et les commandes de démarrage/arrêt servent à explorer l’interface ; aucune donnée ni action n’est envoyée à un serveur ou à un hyperviseur.

Les métriques et actions de Sprout ne sont pas branchées ici : son serveur pilote Proxmox directement, alors que l’interface Osea doit passer par le serveur central. L’API centrale ne fournit pas encore de routes pour les métriques CPU/RAM/disque ou les actions de démarrage/arrêt. La connexion réelle attend que ces routes et leurs types soient définis dans le contrat partagé.
