//importe express, la variable products et la méthode success
import express from "express";

import {products} from "../db/mock-product.mjs";

import {success, getUniqueId} from "./helper.mjs"

//Initialise un objet router
const productsRouter = express();

//Crée la route pour acceder a la fonction
productsRouter.get("/", (req, res) => {
    //fonction qui s'éxecute si l'utilisateur accede a l'url de cette API
    const message = "La liste des produits a bien été récupérée.";
    return res.json(success(message, products));
});

//Prends un parametre dans l'url
productsRouter.get("/:id", (req, res) => {
    const id = req.params.id;
    
    //fonction qui s'éxecute si l'utilisateur accede a l'url de cette API
    const message = "La liste des produits a bien été récupérée.";
    return res.json(success(message, products.find(product => product.id == id)));
});

productsRouter.post("/", (req,res) =>{
    const id = getUniqueId(products);
    
    //prends les éléments http et les ajoute dans l'objet created product
    const createdProduct = {...req.body, ...{id: id, created: new Date()}};
    products.push(createdProduct);

    const message = `Le produit ${createdProduct.name} a bien été créé`;
    return res.json(success(message, products));
});
export {productsRouter};