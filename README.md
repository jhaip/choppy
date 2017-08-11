# Choppy - 3D Model Keying Tool

*Made by Jacob Haip during the Formlabs 2017 Hackathon*

A tool to split and add mating keys to 3D models.  Written in JavaScript with the help of [Three.js](https://threejs.org/), [ThreeCSG.js](https://github.com/chandlerprall/ThreeCSG), and [CSG.js](http://evanw.github.io/csg.js/)

* Print bigger than your 3D printer volume
* Work around 3D printed support marks on parts of your model

![](https://github.com/jhaip/choppy/blob/master/choppy_banner.png)

# Installation

Runs in your browser with no dependencies.  Run a local server with `python -m SimpleHTTPServer` and access the app at `localhost:8000/choppy/app/`

# Limitations

* import only as .STL
* export only as .OBJ
* Cut or keying could take minutes for any non-simple model. Your browser will probably complain or crash because of this. Pure JS is slow for CSG actions.

