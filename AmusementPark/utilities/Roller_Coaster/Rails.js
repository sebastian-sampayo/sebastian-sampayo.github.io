/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Rails
\*****************************************************************************/
/*
 * Clase Rails
 * -----------
 *
 * Genera los 3 rieles y las uniones
 * La entrada M es la cantidad de putos de discretización del perfil circular.
 *
 */

Roller_Coaster_NS.Rails = function (M) {
  var radius_left = .05;
  var radius_right = .05;
  var radius_center = .025
  var pos_left = [-.25,0,0];
  var pos_right = [.25,0,0];
  var pos_center = [0, -.08, 0];

  this.rail_left = new Roller_Coaster_NS.Rail(M, radius_left, pos_left);
  this.rail_right = new Roller_Coaster_NS.Rail(M, radius_right, pos_right);
  this.rail_center = new Roller_Coaster_NS.Rail(M, radius_center, pos_center);

  // this.union = new Roller_Coaster_NS.Union();

  this.rail_left.setColor(.8, .4, .4);
  this.rail_right.setColor(.8, .4, .4);
  this.rail_center.setColor(.7, .7, .7);
  
  this.rail_left.setSpecular(2);
  this.rail_right.setSpecular(2);
  this.rail_center.setSpecular(2);  
};

Roller_Coaster_NS.Rails.prototype.draw = function (m) {
  this.rail_left.draw(m);
  this.rail_right.draw(m);
  this.rail_center.draw(m);
};

// ******************************************************* //
// Construye 1 riel, con perfil de radio radius y corrido a la posición pos
// Hijo de Object 3D
Roller_Coaster_NS.Rail = function (M, radius, pos) {
  var N = Roller_Coaster_NS.curve.fun.length/3;
  Object3D.call(this, N, M);
  this.radius = radius;
  this.pos = pos.slice();
  // Inicializo los buffers:
  this.init();
};

inheritPrototype(Roller_Coaster_NS.Rail, Object3D);

Roller_Coaster_NS.Rail.prototype.initBuffers = function () {

  this.position_buffer = [];
  this.normal_buffer = [];
//  this.texture_coord_buffer = [];

  var profile = new Circle(this.cols, this.radius);
  profile.normal_buffer = profile.position_buffer.slice();
  profile.translate(this.pos);

  var body = extrude(profile, Roller_Coaster_NS.curve);

  this.position_buffer = body.position.slice();
  this.normal_buffer = body.normal.slice();
};
// ******************************************************* //
