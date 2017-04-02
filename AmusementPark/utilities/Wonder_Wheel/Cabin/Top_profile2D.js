/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Wonder_Wheel.Top_profile2D
\*****************************************************************************/

// Se puede mejorar para agregar puntos y mejorar las normales
Wonder_Wheel_NS.Cabin_NS.Top_profile2D = function() {
  Profile2D.call(this, 3);
  // Esto es para poder dibujarlo solo
  //this.gl_draw_mode = gl.TRIANGLE_FAN;
  // Inicializo los buffers:
  this.init();
}

inheritPrototype(Wonder_Wheel_NS.Cabin_NS.Top_profile2D, Profile2D);

Wonder_Wheel_NS.Cabin_NS.Top_profile2D.prototype.initBuffers = function() {

  this.position_buffer = [];
  this.normal_buffer = [];
//  this.texture_coord_buffer = [];

  this.position_buffer = [
    0, 0, 0,
    15/32, -.2, 0, 
    .5, -.4, 0
  ];

  var aux = [1, 9.375/2, 0];
  vec3.normalize(aux);
  this.normal_buffer = [
    aux[0], aux[1], aux[0],
    aux[0], aux[1], aux[0],
    aux[0], aux[1], aux[0]
  ];

  this.ref_up = [0, 1, 0];
  this.ref_normal = [0, 0, 1];

};
