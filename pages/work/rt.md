RayTracer
=========

Le raytracer est le plus gros projet d'igraph de la première année d'Epitech.

![Raytracer](img/rt.jpg)

Le raytracing (ou lancé de rayon) est une technique de rendu d'image de synthèse. Le principe consiste à calculer la lumière en faisant partir les rayons de l'oeil vers les objets. Ensuite on peut appliquer des effets tels que la transparence, la reflection, ou encore le bump maping aux différents objets de la scène.

Le but du projet est de réaliser en C un moteur de raytracing pour générer des scènes en 3d à partir d'un fichier de configuration.

Exemple
-------

```
image {
  properties: 1024, 640;
  nb_reflections: 21;
  nb_refractions: 10;
  name: Rt - Scene 1;
  ambient_light: 0.2;
  ambient_color: white;
}

camera {
  distance: 500;
  translation: -500, 0, 300;
}

mesh {
  type: plane;
  color: red;
  translation: -100, -100, 0;
  dimensions: 100;
  material: perlin_noise "0";
  material: bump_mapping "1";
}

light {
  translation: -150, -100, 400;
}

light {
  translation: -180, -300, 0;
}
```

Ce fichier génère un simple plan avec une texture de type "bruit de perlin" et un bump mapping :

![Exemple](img/rt_example.png)

Conclusion
----------

En plus d'apprendre les techniques élementaires de générations d'images de synthèse 3d (manipulation de vecteurs, bump mapping, reflection...), ce projet m'a permit :

- de travailler sur l'optimisation d'algorithmes en C
- de faire du C modulaire avec les bibliotèque de listes chainées ou de vecteurs génériques par exemple
