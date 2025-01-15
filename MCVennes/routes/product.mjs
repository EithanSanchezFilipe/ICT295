//importe express, la variable products et la méthode success
import express from "express";

import {
  products,
  getProduct,
  getUniqueId,
  removeProduct,
  updateProduct,
} from "../db/mock-product.mjs";

import { success } from "./helper.mjs";

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
  return res.json(
    success(
      message,
      products.find((product) => product.id == id)
    )
  );
});

productsRouter.post("/", (req, res) => {
  const id = getUniqueId();

  //prends les éléments http et les ajoute dans l'objet created product
  const createdProduct = { ...req.body, ...{ id: id, created: new Date() } };
  products.push(createdProduct);

  const message = `Le produit ${createdProduct.name} a bien été créé`;
  return res.json(success(message, products));
});

productsRouter.delete("/:id", (req, res) => {
  const productID = req.params.id;

  //cherche le produit dont l'id est egal au parametre
  let deletedProduct = getProduct(productID);
  removeProduct(productID);

  const message = `Le produit ${deletedProduct.name} a bien été supprimé`;
  res.json(success(message, deletedProduct));
});

productsRouter.put("/:id", (req, res) => {
  const productID = req.params.id;
  const product = getProduct(productID);

  //créé un objet avec le même id que l'on veut modifier, avec les informations qu'on veut changer et avec la même date de création
  const updatedProduct = {
    id: productID,
    ...req.body,
    created: product.created,
  };
  updateProduct(productID, updatedProduct);

  const message = `Le produit ${updatedProduct.name} dont l'id vaut ${productID} a été mis à jour avec succès !`;
  res.json(success(message, updatedProduct));
});
export { productsRouter };
