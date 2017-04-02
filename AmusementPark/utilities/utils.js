/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Funciones utilitarias
\*****************************************************************************/
/*
 * Utilidades varias:
 * ------------------
 * - Convertir de grados a radianes
 * - Calcular la tangente de una curva en cada punto
 * - Generar superficie de revolución
 * - Generar superficie de extrusión/barrido
 * - Manejo de vectores (norma, detector de cambio de signo, filtrado, etc)
 * - Manejo de matrices (crear a partir de filas, crear a partir de columnas)
 * - Generar curvas Bezier y Bspline simples, compuestas (de tramos sucesivos) y periódicas
 *
 */


// Variables globales
// Para funciones de curvas cúbicas
var Base0,Base1,Base2,Base3;
var Base0der,Base1der,Base2der,Base3der;
var Base0der2,Base1der2,Base2der2,Base3der2;

// ************************************************************************* //

function degToRad(degrees) {
    return degrees * Math.PI / 180;
}
// ************************************************************************* //

// Calcula el vector tangente en cada punto de una curva de 3 dimensiones
// f es la curva de entrada, en forma de array estilo position_buffer:
// f = [x1,y1,z1, x2,y2,z2, ...]
// La salida es un array del mismo estilo pero con los vectores tangentes en cada punto.
// La entrada "unitary" es un booleano, en caso de ser true, devuelve todos vectores
// unitarios.
function tangent_function(f, unitary) {
  var N = f.length;
  var curr = [];
  var next = [];
  var aux = [];
  var df = [];
  var aux_mod = 1;
  var prev_aux = [];
  var prev_aux_mod = 1;

  for (var i = 0; i < N-3; i+=3) {
    curr = [f[i], f[i+1], f[i+2]];
    next = [f[i+3], f[i+4], f[i+5]];
    vec3.subtract(next, curr, aux);
    if (unitary == true) {
      aux_mod = aux.norm();
    } else {
      aux_mod = 1;
    }
    if (aux_mod == 0) {
      aux = prev_aux.slice();
      aux_mod = prev_aux_mod;
    }
    df.push(aux[0]/aux_mod);
    df.push(aux[1]/aux_mod);
    df.push(aux[2]/aux_mod);
    prev_aux = aux.slice();
    prev_aux_mod = aux_mod;
  }
  // Al último le pongo el mismo que el anteúltimo
  df.push(aux[0]/aux_mod);
  df.push(aux[1]/aux_mod);
  df.push(aux[2]/aux_mod);
    
  return df;
}

// ************************************************************************** //
// Función Revolución para crear superficie de Revolución
// Recibe :
// -El perfil de extrusión (objeto tipo Profile2D)
// -La cantidad de "láminas", o "filas" de la malla de revolución
// -El ángulo de barrido "theta", entre 0 y 2pi.
// -Opcionalmente una función de escalado
// Devuelve:
// - output.position: position_buffer[]
// - output.normal: normal_buffer[]
function revolutionize(_profile, M, theta, scale) {
  // ---- Variables -----
  var output = new Object();
  output.position = [];
  output.normal = [];
  var alpha = theta/(M-1);
  // Esto es para clonar el objeto (sin crear el método "clonar" en la clase)
  var profile = jQuery.extend(true, {}, _profile);

  // Validación de argumentos
  if (scale === undefined) {
    scale = [];
    for (var i=0; i<M*3; i++) {
      scale[i] = 1;
    };
  };

  // Revoluciono
  for (var i = 0; i < M; i++) {
    // Escalo
    profile.scale([scale[3*i], scale[3*i+1], scale[3*i+2]]);

    // Agrego al buffer de salida
    for (var j = 0; j<profile.length*3; j++) {
      output.position.push(profile.position_buffer[j]);
      output.normal.push(profile.normal_buffer[j]);
    };
    
    // Roto
    profile.rotate(alpha, profile.ref_up);    
  };
  
  return output;
}; // revolutionize()


// ************************************************************************** //
// Función Extruir para crear superficie de barrido
// Recibe :
// el perfil de extrusión (objeto tipo Profile2D),
  //  que incluye el vector de posición y el vector de normales y las referencias:
  //  profile.position_buffer = [...]
  //  profile.normal_buffer = [...]
  //  profile.ref_normal = [x,y,z]
  //  profile.ref_up = [x,y,z]
  
// una función curva sobre la cual se barre el perfil, (array estilo position_buffer, largo N)
  // TODO:
  // La curva es un objeto con K atributos: funcion, derivada1a, derivada2a, ... , derivadaKa.
    // Con la versión 2, la derivada2a no hace falta, solo el primer valor para tomarlo como inicial.
// una función escala que se aplica en cada punto de la curva de barrido (array estilo position_buffer, largo N)
// una función torsión que representa el ángulo de torsión en cada punto de la curva de barrido. (largo N/3) (en radianes).
// Puede prescindir de escala y torsión, en cuyo caso se asume la identidad.

  // Se alinea la terna XYZ de referencia con la base TNB de cada punto de la curva
  // => Se mapea:
  //    X => T ; Y => N ; Z => B
  // Esto significa que  X corresponde a la NORMAL del perfil, e Y el vector UP.
  // Primero multiplico al punto por la matriz cambio de base según la TERNA DE REFERENCIA (transpuesta)
  // Después multiplico por la matriz de cambio de base según TNB
  
  // TODO: Que el objeto "curva" tenga la función, la tangente y la binormal directamente
  // y solo en caso de que no esté definido, utilizar el algoritmo que hay acá.

function extrude(profile, curve_, scale, torsion) {
  // ---- Variables -----
  // Esto es para que devuelva el position_buffer y el normal_buffer:
  var output = new Object();
  output.position = [];
  output.normal = [];
  output.tangent = [];
  var curve = curve_.fun.slice();
  var N = curve.length;

  // Sistema de referencia del perfil
  var triplet = new Object();
  triplet.x = profile.ref_normal.slice();
  triplet.y = profile.ref_up.slice();
  triplet.z = [];
  vec3.cross(triplet.x, triplet.y, triplet.z);

  // Validación de argumentos opcionales
  if (profile.normal_buffer === undefined) {
    profile.normal_buffer = profile.position.slice();
  };

  if (curve_.df1 === undefined) {
    var df = tangent_function(curve, true);
  } else {
    var df = curve_.df1.slice();
  };

  if (curve_.df2 === undefined) {
    var df2 = tangent_function(df, true); // me da la normal a la curva (según el radio de curvatura)
  } else {
    var df2 = curve_.df2.slice();
  };

  if (scale === undefined) {
    scale = [];
    for (var i=0; i<N; i++) {
      scale[i] = 1;
    };
  };

  if (torsion === undefined) {
    torsion = [];
    for (var i=0; i<N/3; i++) {
      torsion[i] = 0;
    };
  };

  // Matriz de cambio de base de la terna de referencia del perfil a la base canónica
  var Cpe = mat4.createFromRowsVec3(triplet.x, triplet.y, triplet.z);
  // ----------------------------- //
  
  // ---- Recorro la curva de barrido ----
  // Inicializo el valor anterior de la binormal
  //var prev_binormal = [0,0,0];
  var binormal_ini = [-df2[0], -df2[1], -df2[2]];
  var prev_binormal = binormal_ini.slice();
  var binormal_0 = [];
  //var prev_binormal = triplet.y.slice();
  //prev_binormal = [0,1,-.50];
  //var prev_df_i = [0,0,0];
  for (var i=0; i<N ; i+=3) {
    // Obtengo la tangente:
    var df_i = [df[i], df[i+1], df[i+2]];
    // Obtengo la binormal:
    // Versión 1: Derivada2a. Se retuerce bastante, dada la naturaleza de la 2a derivada.
    // var binormal = [-df2[i], -df2[i+1], -df2[i+2]];
    // Versión 2: Algoritmo. Mucho más suave.
    // En vez de tomar la segunda derivada, me fijo en el valor anterior
    var normal_aux = [];
    var binormal = [];
    vec3.cross(df_i, prev_binormal, normal_aux);
    vec3.normalize(normal_aux);
    vec3.cross(normal_aux, df_i, binormal);
    vec3.normalize(binormal);
    // Me guardo el valor obtenido de la binormal en la primera iteración, para usarlo después
    if (i == 0) {
      binormal_0 = binormal.slice();
    };
    // Cerca del final utilizo la derivada2a para que en caso
    // de curva cerrada, haya continuidad
    if (i > N*.99) {
      var binormal = [-df2[i], -df2[i+1], -df2[i+2]];
      // Suavizo la transición
      vec3.smooth(binormal, prev_binormal, 0.31);
    };
    // La última la hago igual a la primera, para que en caso
    // de curva cerrada, haya continuidad.
    if (i == N-3) {
      binormal = binormal_0.slice();
    };

    // En caso de que la segunda derivada de 0 tomo el valor anterior
    // Hacer método vec3 isZero, isNaN
    if ((binormal[0] == 0 || isNaN(binormal[0])) &&
        (binormal[1] == 0 || isNaN(binormal[1])) &&
        (binormal[2] == 0 || isNaN(binormal[2])) ) {
      if (i > 0) {
        binormal = prev_binormal.slice();
      } else {
        // Esto es solo en la primera iteración i= 0, cuando no tenemos valor anterior
        //  Tomo cualquier vector ortogonal.
        // Se puede modificar para que se le pase a la entrada una binormal inicial
        // Esto se puede poner antes de empezar el ciclo, para el prev_binormal
        var aux = [1+df_i[0], df_i[1], df_i[2]];
        vec3.cross(aux, df_i, binormal);
      }
    };

    // Rutina para que no haya cambio de signo en la segunda derivada:
    // (Solo es necesario al corresponder la binormal con la 2a derivada)
    if (i > N*.99) {
      if (changed_sign(binormal, prev_binormal)) {
        vec3.scale(binormal, -1);
      };
    };

    // Actualizo el valor previo
    prev_binormal = binormal.slice();

    // normal <= tangente x binormal
    var normal = [];
    vec3.cross(df_i, binormal, normal);
    // m <= Cambio de base(tangente, binormal, normal)
    // de canónica a terna de la curva
    var Cef = mat4.createFromColsVec3(df_i, binormal, normal);

    // Para cada punto del perfil a extruir transformo
    //  1) Escalo según función de Escalado, (m = Me)
    //  2) Roto según función de Torsión (m = Mr*Me)
    //  3) Cambio de base de la terna de referencia a la terna de la curva 
    //      (m = Cef*Cpe*Mr*Me)
    //  4) Translado al punto de la curva (Mt = m_trans => m = Mt*Cef*Cpe*Mr*Me)
    // A las normales de los vértices le aplico lo mismo excepto 4):
    //  1) - 2) - 3) => m = Cef*Cpe*Mr*Me
    // TODO: Operar con los métodos para transformar un Profile2D (en vez de recorrer punto por punto)
    for (var j=0; j<profile.length*3; j+=3) {
      var p = [profile.position_buffer[j], 
               profile.position_buffer[j+1], 
               profile.position_buffer[j+2]];
               
      var p_normal = [profile.normal_buffer[j], 
                             profile.normal_buffer[j+1], 
                             profile.normal_buffer[j+2]];

      var p_tangent = [profile.tangent_buffer[j],
                       profile.tangent_buffer[j+1],
                       profile.tangent_buffer[j+2]];
                                              
      var m = mat4.create();
      var m_trans = mat4.create();

      mat4.identity(m_trans);
      mat4.identity(m);
      // Translado al punto de la curva f(i)
      mat4.translate(m_trans, [curve[i], curve[i+1], curve[i+2]]);
      // Roto según función de Torsión
      mat4.rotate(m, torsion[i/3], triplet.x);
      // Escalo según función de escalado
      mat4.scale(m, [scale[i], scale[i+1], scale[i+2]]);

      // Cambio de base
      mat4.multiply(Cpe, m, m);
      mat4.multiply(Cef, m, m);
        // Almaceno el vector normal a la superficie antes de transladar
        // (para el normal_buffer):
        mat4.multiplyVec3(m, p_normal, p_normal);
        mat4.multiplyVec3(m, p_tangent, p_tangent);
      // Translado al punto de la curva
      mat4.multiply(m_trans, m, m);
      mat4.multiplyVec3(m, p, p);

      output.position.pushVec3(p);
      output.normal.pushVec3(p_normal);      
      output.tangent.pushVec3(p_tangent);
    };
  };
  return output;
}; // extrude()
// ************************************************************************** //

// Función para extender el método Array.prototype.push() a vectores de 3 dim:
// Acepta a la entrada tanto el formato : [1, 2, 3] como {x:1, y:2, z:3}
// Ejemplo: 
//  var arr = [];
//  var arr3 = [1,2,3];
//  var obj3 = {x:1, y:2, z:3};
//  arr.pushVec3(arr3);
//  arr.pushVec3(obj3);
Array.prototype.pushVec3 = function(a) {
  if (a[0] != undefined) {
    this.push(a[0]);
    this.push(a[1]);
    this.push(a[2]);    
  } else if (a.x != undefined) {
    this.push(a.x);
    this.push(a.y);
    this.push(a.z);
  } else {
    return -1;
  };
};

// Ídem para 2 dimensiones (u,v)
Array.prototype.pushVec2 = function(a) {
  if (a[0] != undefined) {
    this.push(a[0]);
    this.push(a[1]);
  } else if (a.u != undefined) {
    this.push(a.u);
    this.push(a.v);
  } else {
    return -1;
  };
};
// ************************************************************************** //

// Función para devolver el módulo (la norma cuadrática) de un vector:
Array.prototype.norm = function() {
  var aux = 0;
  // Producto escalar consigo mismo
  for (var i = 0; i < this.length; i++) {
    aux += this[i]*this[i];
  };
  return Math.sqrt(aux);
};
// ************************************************************************** //

// Función para filtrar de forma suave un vector de 3 dimensiones
// v = alpha*f + (1-alpha)*v
vec3.smooth = function(v, f, alpha) {
  vec3.scale(f, alpha);
  vec3.scale(v, 1-alpha);
  vec3.add(v,f);
};
// ************************************************************************** //

// Función para construir matriz de 4x4 a partir de vectores fila de 3 dimensiones.
// Devuelve por valor una matriz de 4x4 -mat4- con la siguiente forma:
// [ r1 , 0 ;
//   r2 , 0 ;
//   r3 , 0 ;
//   0,0,0,1 ]
mat4.createFromRowsVec3 = function(r1, r2, r3) {
  var m = mat4.create();
  mat4.identity(m);
  // X:
  m[0] = r1[0];
  m[4] = r1[1];
  m[8] = r1[2];

  // Y:
  m[1] = r2[0];
  m[5] = r2[1];
  m[9] = r2[2];

  // Z:
  m[2] = r3[0];
  m[6] = r3[1];
  m[10] = r3[2];
  return m;
};
// ************************************************************************** //

// Función para construir matriz de 4x4 a partir de vectores columna de 3 dimensiones.
// Devuelve por valor una matriz de 4x4 -mat4- con la siguiente forma:
// [ c1 , c2 , c3 , 0 ;
//   0  , 0  , 0  , 1 ]
mat4.createFromColsVec3 = function(c1, c2, c3) {
  var m = mat4.create();
  mat4.identity(m);
  // Tangente
  m[0] = c1[0];
  m[1] = c1[1];
  m[2] = c1[2];
  // Binormal
  m[4] = c2[0];
  m[5] = c2[1];
  m[6] = c2[2];
  // Normal
  m[8] =  c3[0];
  m[9] =  c3[1];
  m[10] = c3[2];
  return m;
};
// ************************************************************************** //

// Función para detectar cambio de signo entre 2 vectores:
// Para resolver este problema, miramos solo el signo de la componente dominante
// del vector 'a', es decir, aquella componente mayor en módulo, y si su signo
// es distinto al signo de la misma componente en 'b', devuelve TRUE.
function changed_sign(a, b) {
  if (
    (a.norm() == 0) ||
    (b.norm() == 0)    
    ) { 
    return false;
  };

  // Busco la coordenada dominante (k = Máximo_i{a[i]})
  var k;
  if ((Math.abs(a[0]) > Math.abs(a[1])) && (Math.abs(a[0]) > Math.abs(a[2]))) {
    k = 0;
  };
  if ((Math.abs(a[1]) > Math.abs(a[0])) && (Math.abs(a[1]) > Math.abs(a[2]))) {
    k = 1;
  };
  if ((Math.abs(a[2]) > Math.abs(a[1])) && (Math.abs(a[2]) > Math.abs(a[0]))) {
    k = 2;
  };
  //console.log("k = "+k);
  // Si la coordenada máxima cambio de signo, devolver true:
  if ( Math.sign(a[k]) != Math.sign(b[k]) ) {
    return true;
  } else {
    return false;
  };
}


// ************************************************************************* //
// ************************************************************************* //
// Funciones para evaluar Curvas cúbicas de Bezier y de B-Spline

// Configura tipo de curva (variables globales BaseX, BaseXder)
// Opciones:
//    - bezier3
//    - bspline3
function setBases(cuales){

	// Definimos las Bases de Berstein, dependen de u
	if (cuales=="bezier3"){
	
		 Base0=function(u) { return (1-u)*(1-u)*(1-u);}  // 1*(1-u) - u*(1-u) = 1-2u+u2  ,  (1-2u+u2) - u +2u2- u3 ,  1 - 3u +3u2 -u3
		 Base1=function(u) { return 3*(1-u)*(1-u)*u; }
		 Base2=function(u) { return 3*(1-u)*u*u;}
		 Base3=function(u) { return u*u*u; }

		 // bases derivadas
		 Base0der=function(u) { return -3*u*u+6*u-3;} //-3u2 +6u -3
		 Base1der=function(u) { return 9*u*u-12*u+3; }  // 9u2 -12u +3
		 Base2der=function(u) { return -9*u*u+6*u;}		 // -9u2 +6u
		 Base3der=function(u) { return 3*u*u; }			// 3u2
	
	} else if (cuales=="bspline3"){	
		
		 Base0=function(u) { return (1-3*u+3*u*u-u*u*u)*1/6;}  // (1 -3u +3u2 -u3)/6
		 Base1=function(u) { return (4-6*u*u+3*u*u*u)*1/6; }  // (4  -6u2 +3u3)/6
		 Base2=function(u) { return (1+3*u+3*u*u-3*u*u*u)*1/6} // (1 -3u +3u2 -3u3)/6
		 Base3=function(u) { return (u*u*u)*1/6; }  //    u3/6

		 Base0der=function(u) { return (-3 +6*u -3*u*u)/6 }  // (-3 +6u -3u2)/6
		 Base1der=function(u) { return (-12*u+9*u*u)/6 }   // (-12u +9u2)  /6
		 Base2der=function(u) { return (3+6*u-9*u*u)/6;}	// (-3 +6u -9u2)/6
		 Base3der=function(u) { return (3*u*u)*1/6; }			// 3u2 /6

     Base0der2=function(u) { return (1 -u) } // (1 -u)
     Base1der2=function(u) { return (-2 +3*u) } // (-2 +3u)
     Base2der2=function(u) { return (1 -3*u) } // (1 -3u)
     Base3der2=function(u) { return (u) } // u
	}
}

// Evalua la curva en 'u'. C(u)
// La entrada "puntosDeControl" debe ser un objeto array de puntos xyz:
//	var puntosDeControl=[ [100,450,0] , [500,450,0] , [500,100,0] , [700,100,0] ];	
// La salida es un objeto 'punto', compuesta de 3 atributos: p.x, p.y y p.z.
var CurvaCubica=function (u,puntosDeControl){

  var p0=puntosDeControl[0];
  var p1=puntosDeControl[1];
  var p2=puntosDeControl[2];
  var p3=puntosDeControl[3];

  var punto=new Object();

  punto.x=Base0(u)*p0[0]+Base1(u)*p1[0]+Base2(u)*p2[0]+Base3(u)*p3[0];
  punto.y=Base0(u)*p0[1]+Base1(u)*p1[1]+Base2(u)*p2[1]+Base3(u)*p3[1];
  punto.z=Base0(u)*p0[2]+Base1(u)*p1[2]+Base2(u)*p2[2]+Base3(u)*p3[2];

  return punto;
}

// Evalua la derivada de la curva en 'u'. C'(u)
// Mismo formato que "CurvaCubica()"
var CurvaCubicaDerivadaPrimera=function (u,puntosDeControl){

  var p0=puntosDeControl[0];
  var p1=puntosDeControl[1];
  var p2=puntosDeControl[2];
  var p3=puntosDeControl[3];

  var punto=new Object();

  punto.x=Base0der(u)*p0[0]+Base1der(u)*p1[0]+Base2der(u)*p2[0]+Base3der(u)*p3[0];
  punto.y=Base0der(u)*p0[1]+Base1der(u)*p1[1]+Base2der(u)*p2[1]+Base3der(u)*p3[1];
  punto.z=Base0der(u)*p0[2]+Base1der(u)*p1[2]+Base2der(u)*p2[2]+Base3der(u)*p3[2];
  
  return punto;
}

// Evalua la derivada segunda de la curva en 'u'. C''(u)
// Mismo formato que "CurvaCubica()"
var CurvaCubicaDerivadaSegunda=function (u,puntosDeControl){

  var p0=puntosDeControl[0];
  var p1=puntosDeControl[1];
  var p2=puntosDeControl[2];
  var p3=puntosDeControl[3];

  var punto=new Object();

  punto.x=Base0der2(u)*p0[0]+Base1der2(u)*p1[0]+Base2der2(u)*p2[0]+Base3der2(u)*p3[0];
  punto.y=Base0der2(u)*p0[1]+Base1der2(u)*p1[1]+Base2der2(u)*p2[1]+Base3der2(u)*p3[1];
  punto.z=Base0der2(u)*p0[2]+Base1der2(u)*p1[2]+Base2der2(u)*p2[2]+Base3der2(u)*p3[2];
  
  return punto;
}

// Entradas:
// puntosDeControl: Arreglo de N puntos de control.
// M: Si es mayor a 1, es la cantidad de muestras equidistantes que se toman de la curva
//    Si 0 <= M <= 1, devuelve el punto de la curva correspondiente a C(t=M).
// Salida: Si M > 1, es un arreglo de M puntos muestreados sobre la curva.
//         Si 0 < M < 1, es un punto.
// fun: es un puntero a función, se puede usar tanto con la función de Bspline 
//      como con su derivada.
function CurvaBSpline3_wrapper (M, puntosDeControl, fun) {
  setBases("bspline3");
  var N = puntosDeControl.length;
  var k = 3; // Grado de la curva, por ahora siempre cúbica
  var salida = [];
  if (M > 1) {
    // N-k ciclos
    for (var i = 0; i < N-k; i++) {
      aux_ctrl_pts = [puntosDeControl[i],
                      puntosDeControl[i+1],
                      puntosDeControl[i+2],
                      puntosDeControl[i+3]];
      // Debido a la aproximación no se alcanzan M puntos exactamente
      // En total, se tienen (N-k)*j_steps ciclos, es decir, puntos generados
      // Para que esto de exactamente M, j_steps debe ser no-entero, lo cual es
      // imposible. Por lo tanto, redondeo para abajo, y en el último tramo
      // modifico j_steps para que en total de exactamente M.
      var j_steps = Math.floor(M/(N-k));
      if (i == N-k-1) {
        // Con esto hago que en el último tramo se genere 
        // la cantidad necesaria de puntos para que haya M.
        j_steps = M - salida.length/3 - 1;
      };
      // j_steps ciclos
      for (var j = 0; j < j_steps; j++) {
        // Con este paso, u = [0 --> (j_steps-1)/j_steps]
        // es decir, no llega a 1. Esto es deseable, ya que
        // el u=1 del tramo 'i', coincide con el u=0 del tramo 'i+1'.
        // De esta foma, no se superponen puntos.
        var step = 1/(j_steps - 0);
        var u = j*step;
        // fun: Puntero a función
        var p = fun(u, aux_ctrl_pts);
        salida.pushVec3(p);
      };
    };
    // Agrego el último punto para u=1
    var p = fun(1, aux_ctrl_pts);
    salida.pushVec3(p);
  } else if (0 <= M <= 1) {
    // TODO
  };
  return salida;
};

// Wrapper para la función BSpline cúbica
function CurvaBSpline3 (M, puntosDeControl) {
  return CurvaBSpline3_wrapper(M, puntosDeControl, CurvaCubica);
};

// Wrapper para la función BSpline cúbica derivada primera
function CurvaBSpline3Derivada1 (M, puntosDeControl) {
  var aux = CurvaBSpline3_wrapper(M, puntosDeControl, CurvaCubicaDerivadaPrimera);
  var out = [];
  // Normalizo:
  for (var i = 0; i < 3*M; i += 3) {
    aux_i = [aux[i], aux[i+1], aux[i+2]];
    vec3.normalize(aux_i);
    out.pushVec3(aux_i);
  };
  return out;
};

// Wrapper para la función BSpline cúbica derivada segunda
function CurvaBSpline3Derivada2 (M, puntosDeControl) {
  var aux = CurvaBSpline3_wrapper(M, puntosDeControl, CurvaCubicaDerivadaSegunda);
  var out = [];
  // Normalizo:
  for (var i = 0; i < 3*M; i += 3) {
    aux_i = [aux[i], aux[i+1], aux[i+2]];
    vec3.normalize(aux_i);
    out.pushVec3(aux_i);
  };
  return out;
};

// Curva B-Spline cúbica periódica.
// Repite los primeros 3 puntos al final
//   (Automáticamente repite los primeros k puntos de control al final
//    para que sea periódica)
function CurvaBSpline3Periodica (M, puntosDeControl) {
  aux = puntosDeControl.slice();
  aux.push(puntosDeControl[0]);
  aux.push(puntosDeControl[1]);
  aux.push(puntosDeControl[2]);

  var salida = CurvaBSpline3(M, aux);
  return salida;
};

// Curva B-Spline cúbica periódica. Derivada primera
// Repite los primeros 4 puntos al final
function CurvaBSpline3Derivada1Periodica (M, puntosDeControl) {
  aux = puntosDeControl.slice();
  aux.push(puntosDeControl[0]);
  aux.push(puntosDeControl[1]);
  aux.push(puntosDeControl[2]);
  
  var salida = CurvaBSpline3Derivada1(M, aux);
  return salida;
};

// Curva B-Spline cúbica periódica. Derivada segunda
// Repite los primeros 4 puntos al final
function CurvaBSpline3Derivada2Periodica (M, puntosDeControl) {
  aux = puntosDeControl.slice();
  aux.push(puntosDeControl[0]);
  aux.push(puntosDeControl[1]);
  aux.push(puntosDeControl[2]);
  var salida = CurvaBSpline3Derivada2(M, aux);
  return salida;
};
