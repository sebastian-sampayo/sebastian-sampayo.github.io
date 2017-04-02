/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Circle
\*****************************************************************************/


function Circle (M, radius) {
  Profile2D.call(this, M);
  this.radius = radius;
  // Esto es para poder dibujarlo solo
  this.gl_draw_mode = gl.TRIANGLE_FAN;
  // Inicializo los buffers:
  this.init();
}

inheritPrototype(Circle, Profile2D);

Circle.prototype.initBuffers = function() {

  var radius = this.radius;
  this.position_buffer = [];
  this.normal_buffer = [];
  this.tangent_buffer = [];
  var x, y, z;

  // Genero el perfil (circunsferencia)
  for (var j = 0; j < this.cols; j++) {
     // Para cada vértice definimos su posición
     // como coordenada (x, y, z)
     x = radius*Math.cos(2*Math.PI/(this.cols-1)*j);
     y = radius*Math.sin(2*Math.PI/(this.cols-1)*j);
     z = 0;
     this.position_buffer.pushVec3([x, y, z]);
     this.normal_buffer.pushVec3([x, y, z]);
     this.tangent_buffer.pushVec3([-y, x, z])
  };
};
