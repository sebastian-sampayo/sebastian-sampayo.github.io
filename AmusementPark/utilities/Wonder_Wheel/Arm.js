/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Arm
\*****************************************************************************/
/*
 * Clase Arm
 * -----------
 *
 *  Cada brazo se compone de tramos de tubos. Al repetirlos y rotarlos se
 * construye toda la rueda. (Ver Wheel.js)
 *
 */

Wonder_Wheel_NS.Arm = function (N, M) {
  this.radius = Wonder_Wheel_NS.radius;
  this.radius_i = Wonder_Wheel_NS.radius_i;
  this.depth = Wonder_Wheel_NS.depth;
  this.high = Wonder_Wheel_NS.high;
  var alpha = 2*Math.PI/Wonder_Wheel_NS.N_arms;
  this.a1 = 2*this.radius_i* Math.sin(alpha/2);
  this.a2 = 2*this.radius* Math.sin(alpha/2);
  this.p = Wonder_Wheel_NS.thickness;
  this.draw_ts = true; // Esto es para controlar si dibuja t2 o no

  var Mt = 6;
  this.t1 = new Cilinder(N, Mt, this.p/2, this.radius);
  this.t2 = new Cilinder(N, Mt, this.p/2, this.depth);
  this.ai = new Cilinder(N, Mt, this.p/2, this.a1);
  this.ae = new Cilinder(N, Mt, this.p/2, this.a2);
};

Wonder_Wheel_NS.Arm.prototype.setSpecular = function(shininess, r, g, b) {
  this.t1.setSpecular(shininess, r, g, b);
  this.t2.setSpecular(shininess, r, g, b);
  this.ai.setSpecular(shininess, r, g, b);
  this.ae.setSpecular(shininess, r, g, b);      
};

Wonder_Wheel_NS.Arm.prototype.setColor = function(r, g, b) {
  this.t1.setColor(r, g, b);
  this.t2.setColor(r, g, b);
  this.ai.setColor(r, g, b);
  this.ae.setColor(r, g, b);      
};

Wonder_Wheel_NS.Arm.prototype.setColorFactor = function(colorFactor) {
  this.t1.setColorFactor(colorFactor);
  this.t2.setColorFactor(colorFactor);
  this.ai.setColorFactor(colorFactor);
  this.ae.setColorFactor(colorFactor);      
};

Wonder_Wheel_NS.Arm.prototype.initTexture = function(texture_file, normal_map_file, reflection_map_file) {
  this.t1.initTexture(texture_file, normal_map_file, reflection_map_file);
  this.t2.initTexture(texture_file, normal_map_file, reflection_map_file);
  this.ai.initTexture(texture_file, normal_map_file, reflection_map_file);
  this.ae.initTexture(texture_file, normal_map_file, reflection_map_file);
};      

Wonder_Wheel_NS.Arm.prototype.setReflectionFactor = function(reflectionFactor) {
  this.t1.setReflectionFactor(reflectionFactor);
  this.t2.setReflectionFactor(reflectionFactor);
  this.ai.setReflectionFactor(reflectionFactor);
  this.ae.setReflectionFactor(reflectionFactor);          
};

Wonder_Wheel_NS.Arm.prototype.draw = function (m) {
  var m1 = mat4.create();

  // t1 - c1
  mat4.identity(m1);
  mat4.translate(m1, [this.radius/2, 0, this.depth/2]);
  mat4.rotate(m1, Math.PI/2, [0, 1, 0]);
  mat4.multiply(m, m1, m1);
  this.t1.draw(m1);

  // t1 - c1
  mat4.identity(m1);
  mat4.translate(m1, [this.radius/2, 0, -this.depth/2]);
  mat4.rotate(m1, Math.PI/2, [0, 1, 0]);
  mat4.multiply(m, m1, m1);
  this.t1.draw(m1);

  // t2 
  if (this.draw_t2) {
    mat4.identity(m1);
    mat4.translate(m1, [this.radius, 0, 0]);
    mat4.multiply(m, m1, m1);
    this.t2.draw(m1);
  };

  var alpha_err = 1.1*Math.PI/16;
  // ai - c1 
  mat4.identity(m1);
  mat4.translate(m1, [this.radius_i, this.a1/2, this.depth/2]);
  mat4.rotate(m1, alpha_err, [0, 0, 1]);
  mat4.rotate(m1, Math.PI/2, [1, 0, 0]);
  mat4.multiply(m, m1, m1);
  this.ai.draw(m1);

  // ai - c2 
  mat4.identity(m1);
  mat4.translate(m1, [this.radius_i, this.a1/2, -this.depth/2]);
  mat4.rotate(m1, alpha_err, [0, 0, 1]);
  mat4.rotate(m1, Math.PI/2, [1, 0, 0]);
  mat4.multiply(m, m1, m1);
  this.ai.draw(m1);

  // ae - c1 
  mat4.identity(m1);
  mat4.translate(m1, [this.radius*.95, this.a2/2, this.depth/2]);
  mat4.rotate(m1, alpha_err, [0, 0, 1]);
  mat4.rotate(m1, Math.PI/2, [1, 0, 0]);
  mat4.multiply(m, m1, m1);
  this.ae.draw(m1);

  // ae - c2 
  mat4.identity(m1);
  mat4.translate(m1, [this.radius*.95, this.a2/2, -this.depth/2]);
  mat4.rotate(m1, alpha_err, [0, 0, 1]);
  mat4.rotate(m1, Math.PI/2, [1, 0, 0]);
  mat4.multiply(m, m1, m1);
  this.ae.draw(m1);
};

