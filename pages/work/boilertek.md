Boilertek
=========

Le script que j'ai réalisé en CoffeeScript permet de générer un projet à partir d'un template prédéfini.

On peut en plus ajouter des bibliothèques directement depuis un dépot github existant.

Installation
------------

Pour l'utiliser, il vous suffit de télécharger le dépôt sur [github](https://github.com/jeremt/boilertek). Ensuite, il faut installer les dependances :
```
npm install
```

Exemple
-------

Je veux faire un projet en C avec une bibliotèque de liste chainée. Je vais donc utilisé le template C déjà défini, et aller chercher la bibliotèque de liste de mon dépot github.
```shell
./bin/tek -o my_project -l jeremt/list -t c
```

- `-o` : le dossier résultant
- `-l` : les bibliothèques à installer
- `-t` : le nom du template à utiliser

Voilà, ensuite on génère un dossier avec le contenu du template.

![Boilertek](img/boilertek.png)