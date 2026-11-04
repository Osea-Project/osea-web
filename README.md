# osea-web

Interface d’administration et client du projet Osea. Elle est construite avec React, Vite, TypeScript et Tailwind CSS et communiquera uniquement avec le serveur central Osea.

## Démarrage

```sh
bun install
bun run dev
```

Créer un build de production avec `bun run build`.

## État

L’inventaire actuel est un écran de démonstration avec des machines fictives. Les filtres et le démarrage simulé servent à explorer l’interface ; aucune donnée ni action n’est envoyée à un serveur ou à un hyperviseur. Le serveur central ne fournit pas encore d’API à l’interface. La connexion réelle sera ajoutée quand ses routes seront définies.
