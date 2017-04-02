
// Esta función es necesaria para vincular clase con subclase
function inheritPrototype(childObject, parentObject) {
	// basicamente, el objeto hijo copia a su prototype todas las propiedades del prototipo del padre, pero conserva su propio constructor
	
    var copyOfParent = Object.create(parentObject.prototype); // devuelve un objetos con las propiedades del pasado por parámetro
    copyOfParent.constructor = childObject; 				  // en el paso anterior, se copio parentObject.prototype.contructor ---> a ---> copyOfParent
    														  // pero nosotros queremos heredar todas las propiedades, excepto el constructor del padre
    														  // por eso lo reemplazamos por el constructor Original del obejto del hijo

    childObject.prototype = copyOfParent;   // finalmente este es el nuevo prototype del hijo

}
