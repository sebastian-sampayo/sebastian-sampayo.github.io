/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Cilinder
\*****************************************************************************/

// Clase Cilindro.
// Se construye a partir de extruir un círculo sobre una recta
// Es hija de Object3D con lo cual hereda todo lo básico
// Se sobreescribe
// Se crea el objeto en base a una malla de NxM.

function Cilinder (N,M, radius, high) {
  Object3D.call(this, N, M);
  this.radius = radius;
  this.high = high;
  // Inicializo los buffers:
  this.init();
}

inheritPrototype(Cilinder, Object3D);

// ******* Crea el cilindro con tapas ******** //
Cilinder.prototype.initBuffers = function() {

  var high = this.high;
  var radius = this.radius;
  this.position_buffer = [];
  this.normal_buffer = [];
//  this.texture_coord_buffer = [];
  this.tangent_buffer = [];
  var x, y, z;

  // Modo Extrusión
  var profile = new Circle(this.cols, radius);
  var curve = new Object();
  curve.fun = [];

  // Genero la curva de barrido
  for (var j = 0; j < this.rows-2; j++) {
    x = 0;
    y = 0;
    z = -high/2 + j*high/(this.rows-3);
    curve.fun.push(x);
    curve.fun.push(y);
    curve.fun.push(z);
  };

  // Extrusión
  var body = extrude(profile, curve);

  var down_cover = [];
  var up_cover = [];
  var tangent_cover = [];

  // Ahora para que tenga tapas, utilizo la primera y la
  // última fila de la grilla
  for (var j = 0.0; j < this.cols; j++) {
    x = 0;
    y = 0;
    z = high/2;
    down_cover.push(x);
    down_cover.push(y);
    down_cover.push(-z);
    up_cover.push(x);
    up_cover.push(y);
    up_cover.push(z);
    tangent_cover.pushVec3([0, 1, 0]);
  };

  this.position_buffer = down_cover.concat(body.position, up_cover);

  // La normal en las tapas coincide con el vértice central.
  this.normal_buffer = down_cover.concat(body.normal, up_cover);
  
  this.tangent_buffer = tangent_cover.concat(body.tangent, tangent_cover);
  
  for (var i = 0; i < this.position_buffer; i+=3 ) {
    this.texture_coord_buffer[i] = this.position_buffer[i+2];
  }
  
}
