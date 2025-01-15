import { products } from "../db/mock-product.mjs";
const success = (message, data) => {
    return {
        message: message,
        data: data
    };
};
const getUniqueId = () =>{
    //retourne un tableau que avec les id des produits
    const productIDs = products.map(product => product.id);

    //retourne la plus haute valeur de productsID
    const maxId = productIDs.reduce((a,b) => Math.max(a,b));
    return maxId;
}

const getProduct = (productID) =>{
    //retourne le produit dont on cherche l'id
    return products.find(a => a.id == productID);
}

const removeProduct = (productID) => {
    //retourne un tableau que avec les id des produits
    const productsID =products.map(product => product.id);

    //efface le produit dont l'index est egal aux produit qui a comme id le parametre
    products.splice(productsID.indexOf(productID), 1);
}
export {success, getUniqueId, getProduct, removeProduct};