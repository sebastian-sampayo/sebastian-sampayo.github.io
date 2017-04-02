/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Top
\*****************************************************************************/
/*
 * Clase Top
 * -----------
 *
 * Sección superior de las sillas voladoras: disco + cono + tensores + sillas
 *
 */

Swing_Carousel_NS.Top = function (N, M) {
  // Ángulo de inclinación del brazo
  this.theta = Math.PI/8;
  // Cantidad de sillas
  this.N_arms = 8;

  this.top = new Cilinder(N, M, 8, 1.25);
  this.cone = new Swing_Carousel_NS.Cone(N);
  this.arm = new Swing_Carousel_NS.Arm(N, M);

  this.cone.setColor(.5, .5, .8);
//  this.top.setColor(1, 233/256, .5); 
  this.top.setColor(.9, .9, .9);
  this.top.initTexture("Textures/Metal/galvanized_diffuse.jpg", "Textures/Metal/galvanized_normal.jpg", sky_dome);
//  this.top.initTexture("Textures/Metal/galvanized_diffuse.jpg", undefined, sky_dome);
  this.top.setColorFactor(0.3);
  this.top.setReflectionFactor(0.01);
//  this.top.setSpecular(1);
};

Swing_Carousel_NS.Top.prototype.setColor = function(r, g, b) {
  this.top.setColor(r, g, b);
  this.cone.setColor(r, g, b);  
};

Swing_Carousel_NS.Top.prototype.draw = function (m) {
  var m1 = mat4.create();

  // Semi-cono
  mat4.identity(m1);
  mat4.multiply(m, m1, m1);
  this.cone.draw(m1);

  // Top
  mat4.identity(m1);
  mat4.translate(m1, [0, 1.875, 0]);
  mat4.rotate(m1, Math.PI/2, [1, 0, 0]);
  mat4.multiply(m, m1, m1);
  this.top.draw(m1);

  // Brazo
  var alpha = 0;
  var sat = .3;
  var nsat = 1-sat;
  for (var i = 0; i < this.N_arms; i++) {
    alpha = i * 2 * Math.PI / this.N_arms;
    mat4.identity(m1);
    mat4.rotate(m1, alpha, [0, 1, 0]);
    mat4.translate(m1, [6.5, 1.25, 0]);
    mat4.rotate(m1, this.theta, [0, 0, 1]);
    mat4.multiply(m, m1, m1);
    this.arm.setColor(sat + nsat*Math.cos(alpha*2),
                      sat + nsat*Math.sin(alpha*3), 
                      sat + nsat*Math.cos(alpha*5));
    this.arm.draw(m1);
  };

};

