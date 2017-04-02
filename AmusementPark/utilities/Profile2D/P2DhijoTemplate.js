/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase ID
\*****************************************************************************/

// Clase ID.
// Es hija de Profile2D con lo cual hereda todo lo básico
// Se crea el objeto en base a una malla de 1xM.

function ID (M, otrasVariables) {
  Profile2D.call(this, M);
  this.otrasVariables = 1;
  // Inicializo los buffers:
  this.init();
};

inheritPrototype(ID, Profile2D);

// ******* Crea el ID ******** //
ID.prototype.initBuffers = function() {

  this.position_buffer = [];
  this.normal_buffer = [];
  this.texture_coord_buffer = [];

};
