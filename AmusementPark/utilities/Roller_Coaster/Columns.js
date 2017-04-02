/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Columns
\*****************************************************************************/
/*
 * Clase Columns
 * -----------
 *
 * Genera las columnas para la montaña rusa, con ajuste de radio y espaciado.
 *
 * N, M : filas y columnas de la malla de vértices.
 * radius: radio de las columnas
 * delta : espaciado entre columnas
 *
 */

Roller_Coaster_NS.Columns = function (N,M, radius, delta) {
  this.radius = radius;
  this.delta = delta; // Este valor es en unidades de mundo
  // Para calcular el espaciado en "índices de la curva"
  // calcular la distancia entre 2 puntos contiguos de la curva y hacer
  // delta_i = delta/d;
  // Eso igual es una aproximación basada en que los puntos de control
  // estén más o menos todos a la misma distancia.
  // En principio probamos de manera simple con enteros
  this.delta_i = Math.round(delta); // Este valor es en índices de la curva

  this.column = new Cilinder(N,M, radius, 1);

  
  this.column.setColor(.05, .5, .05);
  this.column.setSpecular(2);
   this.column.initTexture("Textures/Metal/plate2-diffuse.jpg", "Textures/Metal/plate2-normal.jpg");
//  this.column.initTexture("Textures/Metal/plate-diffuse.jpg", "Textures/Metal/plate-normal.jpg");  
  this.column.setColorFactor(.7);

};

Roller_Coaster_NS.Columns.prototype.draw = function (m) {
  var N = Roller_Coaster_NS.curve.fun.length/3;
  var p = [];
  var high;
  var m1 = mat4.create();
  for (var i = 0; i < N; i += this.delta_i) {
    // Salteo un par de columnas
    if (14*this.delta_i <= i  && i <= 16*this.delta_i) {
      continue;
    };
    // Obtengo el punto de la curva
    for (var j = 0; j < 3; j++) {
      p[j] = Roller_Coaster_NS.curve.fun[3*i+j];
    };
    // La altura de la columna es la componente 'y' del punto
    high = p[1];
    // m1 = T(p) * T(0,-h/2,0) * RotX(pi/2) * E(0,0,h)
    mat4.identity(m1);
    mat4.translate(m1, p);
    mat4.translate(m1, [0, -high/2, 0]);
    mat4.rotate(m1, Math.PI/2, [1,0,0]);
    mat4.scale(m1, [1,1,high]);
    mat4.multiply(m, m1, m1);
    this.column.setTextureCoordFactor([1, high]);
    // Dibujo
    this.column.draw(m1);
  };
};

