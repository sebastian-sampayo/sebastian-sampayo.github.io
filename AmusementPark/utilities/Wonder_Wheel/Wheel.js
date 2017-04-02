/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Wheel
\*****************************************************************************/
/*
 * Clase Wheel
 * -----------
 *
 *
 */

Wonder_Wheel_NS.Wheel = function (N, M) {
  this.depth = Wonder_Wheel_NS.depth;
  this.radius = Wonder_Wheel_NS.radius;
  this.spin = 0;

  this.cabin = new Wonder_Wheel_NS.Cabin(N, M);
  this.arm = new Wonder_Wheel_NS.Arm(N, M);
  
  this.arm.setSpecular(2);
  this.arm.initTexture("Textures/Metal/galvanized_diffuse.jpg", "Textures/Metal/galvanized_normal.jpg", sky_dome);
//  this.arm.initTexture("Textures/Metal/iron1.jpg", "Textures/Circles_Normal.jpg", sky_dome);  
//  this.arm.initTexture("Textures/Metal/qbert-diffuse.jpg", "Textures/Metal/qbert-normal.jpg", sky_dome);
  this.arm.setReflectionFactor(0.1);
  this.arm.setColor(.8, .8, .8);
  this.arm.setColorFactor(.5);
  
  this.cabin.setSpecular(2);
  this.cabin.initTexture("Textures/Metal/plate2-diffuse.jpg");
  this.cabin.setColorFactor(0.5);
};

Wonder_Wheel_NS.Wheel.prototype.draw = function (m) {
  var m1 = mat4.create();
  var alpha = 0;
  var sat = .3;
  var nsat = 1-sat;

  for (var i = 0; i < Wonder_Wheel_NS.N_arms; i++) {
    alpha = i * 2*Math.PI/Wonder_Wheel_NS.N_arms;
    // Brazo i
    if (i % 2 == 1) {
      this.arm.draw_t2 = true;
    } else {
      this.arm.draw_t2 = false;
    };
    mat4.identity(m1);
    mat4.rotate(m1, alpha + this.spin, [0, 0, 1]);
    mat4.multiply(m, m1, m1);
    this.arm.draw(m1);

    // Cabina i (solo en los caños t2 -caño exterior)
    if (this.arm.draw_t2 == true) {
      mat4.identity(m1);
      mat4.rotate(m1, alpha + this.spin, [0, 0, 1]);
      mat4.translate(m1, [this.radius, 0, 0]);
      mat4.rotate(m1, -alpha - this.spin, [0, 0, 1]);
      mat4.rotate(m1, Math.PI/2, [0, 1, 0]);
      //mat4.scale(m1, [.1, .1, .1]);
      mat4.multiply(m, m1, m1);
      this.cabin.setColor(sat + nsat*Math.cos(alpha*2),
                          sat + nsat*Math.sin(alpha*3), 
                          sat + nsat*Math.cos(alpha*5));
      this.cabin.draw(m1);
    };
  };

};

