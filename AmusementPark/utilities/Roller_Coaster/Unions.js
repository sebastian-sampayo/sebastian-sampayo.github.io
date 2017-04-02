/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Clase Unions
\*****************************************************************************/
/*
 * Clase Unions
 * -----------
 *
 * Construye las uniones entre los rieles de la montaña rusa, del mismo
 * modo que las columnas, pero además orientando según el punto de la curva.
 *
 */

Roller_Coaster_NS.Unions = function (width, high, depth, delta) {
  this.high = high;
  this.depth = depth;
  this.width = width;
  this.delta = delta; // Este valor es en unidades de mundo
  // Para calcular el espaciado en "índices de la curva"
  // calcular la distancia entre 2 puntos contiguos de la curva y hacer
  // delta_i = delta/d;
  // Eso igual es una aproximación basada en que los puntos de control
  // estén más o menos todos a la misma distancia.
  // En principio probamos de manera simple con enteros
  this.delta_i = Math.round(delta); // Este valor es en índices de la curva

  this.union = new Roller_Coaster_NS.Union(width, high, depth);

  this.union.setColor(.5, .5, .5);
  
  // para la orientación de las uniones
  this.binormal_0 = [0,1,0];
  this.prev_binormal = this.binormal_0;
};

Roller_Coaster_NS.Unions.prototype.draw = function (m) {
  var N = Roller_Coaster_NS.curve.fun.length/3;
  var p = [];
//  var high;
  var m1 = mat4.create();
  for (var i = 0; i < N; i += this.delta_i) {
    // Obtengo el punto de la curva
    for (var j = 0; j < 3; j++) {
      p[j] = Roller_Coaster_NS.curve.fun[3*i+j];
    };
    
    var m_trans = mat4.create();
    mat4.identity(m_trans);
    mat4.translate(m_trans, p);

    // Orientación del carro
    // Sistema de referencia del carro
    var triplet = new Object();
    triplet.x = this.union.ref_normal.slice();
    triplet.y = this.union.ref_up.slice();
    triplet.z = [];
    vec3.cross(triplet.x, triplet.y, triplet.z);
    // Matriz de cambio de base de la terna de referencia del carro a la base canónica
    var Cpe = mat4.createFromRowsVec3(triplet.x, triplet.y, triplet.z);
    // Sistema de referencia de la curva
    // Tangente:
    var df_i = [ Roller_Coaster_NS.curve.df1[3*i],
                 Roller_Coaster_NS.curve.df1[3*i+1], 
                 Roller_Coaster_NS.curve.df1[3*i+2] ];

    // Binormal:
    // Versión 2:
    var normal_aux = [];
    var binormal = [];
    vec3.cross(df_i, this.prev_binormal, normal_aux);
    vec3.normalize(normal_aux);
    vec3.cross(normal_aux, df_i, binormal);
    vec3.normalize(binormal);
     // En caso de que la segunda derivada de 0 tomo el valor anterior
     if ((binormal[0] == 0 || isNaN(binormal[0])) &&
         (binormal[1] == 0 || isNaN(binormal[1])) &&
         (binormal[2] == 0 || isNaN(binormal[2])) ) {
         binormal = this.prev_binormal.slice();
     };

      // Actualizo el valor previo
      this.prev_binormal = binormal.slice();
    // Normal <= tangente x binormal
    var normal = [];
    vec3.cross(df_i, binormal, normal);
    // m <= Cambio de base(df, df2, binormal)
    // de canónica a terna de la curva
    var Cef = mat4.createFromColsVec3(df_i, binormal, normal);

    mat4.identity(m1);
    mat4.multiply(Cpe, m1, m1);
    mat4.multiply(Cef, m1, m1);
    mat4.multiply(m_trans, m1, m1);
    mat4.multiply(m, m1, m1);
    this.union.draw(m1);
  };
  
};

// ******************************************************* //
// Construye una unidad de Union
// Hijo de Object 3D
// Pruebo directamente escribiendo uno por uno los vértices.
Roller_Coaster_NS.Union = function (width, high, depth) {
  Object3D.call(this, 4, 6);
  this.high = high;
  this.depth = depth;
  this.width = width;
  this.ref_up = [1, 0, 0];
  this.ref_normal = [0, 0, 1];
  // Inicializo los buffers:
  this.init();
};

inheritPrototype(Roller_Coaster_NS.Union, Object3D);

Roller_Coaster_NS.Union.prototype.initBuffers = function () {

  this.position_buffer = [];
  this.normal_buffer = [];
//  this.texture_coord_buffer = [];

  this.position_buffer = [
    0, 0, this.depth/2,
    0, 0, this.depth/2,
    0, 0, this.depth/2,
    0, 0, this.depth/2,
    0, 0, this.depth/2,
    0, 0, this.depth/2,
    
    0, -this.high, this.depth/2,
    this.width/2, 0, 0,
    0, -this.high/2, this.depth/2,
    0, -this.high/2, this.depth/2,
    -this.width/2, 0, 0,
    0, -this.high, this.depth/2,
    
    0, -this.high, -this.depth/2,
    this.width/2, 0, 0,
    0, -this.high/2, -this.depth/2,
    0, -this.high/2, -this.depth/2,
    -this.width/2, 0, 0,
    0, -this.high, -this.depth/2,
    
    0, 0, -this.depth/2,
    0, 0, -this.depth/2,
    0, 0, -this.depth/2,
    0, 0, -this.depth/2,
    0, 0, -this.depth/2,
    0, 0, -this.depth/2
  ];
  
  this.normal_buffer = [
    0, 0, 1,    
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    
    0, 0, 1,    
    0, 0, 1,
    0, 0, 1,
    0, 1, 0,
    0, 0, 1,
    0, 0, 1,
    
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 1, 0,
    0, 0, -1,
    0, 0, -1,

    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1    
  ];
};
// ******************************************************* //
