const success = (message, data) => {
    return {
        message: message,
        data: data
    };
};
const getUniqueId = (products) =>{
    //retourne un tableau que avec les id des produits
    const productIDs = products.map(product => product.id);

    //retourne la plus haute valeur de productsID
    const maxId = productIDs.reduce((a,b) => Math.max(a,b));
    return maxId;
}
export {success, getUniqueId};