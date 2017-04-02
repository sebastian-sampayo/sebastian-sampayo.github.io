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
// Es hija de Object3D con lo cual hereda todo lo básico
// Se sobreescribe
// Se crea el objeto en base a una malla de NxM.
// Uso:
//   var cil = Cilinder(N,M,r, h);
//   cil.setColor(r,g,b);
//   cil.draw(m);

function Cilinder (N,M, radius, high) {
  Object3D.call(this, N, M);
  this.radius = radius;
  this.high = high;
}

inheritPrototype(Cilinder, Object3D);

// ******* Crea el cilindro con tapas ******** //
Cilinder.prototype.initBuffers = function() {

  var high = this.high;
  var radius = this.radius;
  this.position_buffer = [];
  this.normal_buffer = [];
  this.texture_coord_buffer = [];
  var x, y, z;

  // Modo Extrusión
  var profile = [];
  var normal = [0,0,1];
  var curve = [];

  // Genero el perfil (circunsferencia)
  for (var j = 0.0; j < this.cols; j++) {
     // Para cada vértice definimos su posición
     // como coordenada (x, y, z)
     x = radius*Math.cos(2*Math.PI/(this.cols-1)*j);
     y = radius*Math.sin(2*Math.PI/(this.cols-1)*j);
     z = 0;
     profile.push(x);
     profile.push(y);
     profile.push(z);
  };

  // Genero la curva de barrido
  for (var j = 0; j < this.rows; j++) {
    x = 0;
    y = 0;
    z = -high/2 + j*high/(this.rows-1);
    curve.push(x);
    curve.push(y);
    curve.push(z);
  };

  // Extrusión
  this.position_buffer = extrude(profile, normal, curve);

  // Ahora para que tenga tapas, utilizo la primera y la
  // última fila de la grilla
  // Tapa de abajo:
  // for (var j = 0.0; j < this.cols; j++) {
  //   x = 0;
  //   y = 0;
  //   z = -high/2;
  //   this.position_buffer.push(x);
  //   this.position_buffer.push(y);
  //   this.position_buffer.push(z);
  // };
  // for (var i = 0.0; i < this.rows-2; i++) { 
  //    // Discretizo 2pi en M-1 puntos, para que "cierre" 
  //    // el cilindro. Sigue siendo una grilla de M columnas,
  //    // pero la primera y la última se posicionan en el mismo
  //    // lugar.
  //    for (var j = 0.0; j < this.cols; j++) {
  //       // Para cada vértice definimos su posición
  //       // como coordenada (x, y, z)
  //       x = radius*Math.cos(2*Math.PI/(this.cols-1)*j);
  //       y = radius*Math.sin(2*Math.PI/(this.cols-1)*j);
  //       z = -high/2 + i*high/(this.rows-3);
  //       this.position_buffer.push(x);
  //       this.position_buffer.push(y);
  //       this.position_buffer.push(z);
  //    };
  // };
  // // Tapa de arriba:
  // for (var j = 0.0; j < this.cols; j++) {
  //   x = 0;
  //   y = 0;
  //   z = high/2;
  //   this.position_buffer.push(x);
  //   this.position_buffer.push(y);
  //   this.position_buffer.push(z);
  // };

  this.normal_buffer = this.position_buffer.slice();
}
