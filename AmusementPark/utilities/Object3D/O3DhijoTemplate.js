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
// Es hija de Object3D con lo cual hereda todo lo básico
// Se crea el objeto en base a una malla de NxM.
// Uso:
//   var cil = Cilinder(N,M,r, h);
//   cil.setColor(r,g,b);
//   cil.draw(m);

function ID (N,M, otrasVariables) {
  Object3D.call(this, N, M);
  this.otrasVariables = 1;
  // Inicializo los buffers
  this.init();
}

inheritPrototype(ID, Object3D);

// ******* Crea el ID ******** //
ID.prototype.initBuffers = function() {

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
  for (var j = 0; j < this.rows-2; j++) {
    x = 0;
    y = 0;
    z = -high/2 + j*high/(this.rows-3);
    curve.push(x);
    curve.push(y);
    curve.push(z);
  };

  // Extrusión
  var body = extrude(profile, normal, curve);

  var down_cover = [];
  var up_cover = [];

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
  };

  this.position_buffer = down_cover.concat(body, up_cover);

  this.normal_buffer = this.position_buffer.slice();
}
