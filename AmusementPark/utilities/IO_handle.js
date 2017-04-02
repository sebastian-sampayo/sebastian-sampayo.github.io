/*****************************************************************************\
  Facultad de Ingeniería de la Universidad de Buenos Aires
  Sistemas Gráficos
  Trabajo Práctico 1
  2° Cuatrimestre de 2015
 
  Sampayo, Sebastián Lucas
  Padrón: 93793
  e-mail: sebisampayo@gmail.com
 
  Módulo con funciones de manejo de entradas y salidas
\*****************************************************************************/
/*
 * Esto se podría estructurar mejor en forma de módulo con variables internas,
 * en vez de que sea todo global.
 */

    // Estas pueden ir adentro de mouse también para que no sean globales.
    var isMouseDown = false;
    // var isMouseWheelDown = false; // esto no me sirve porq no puedo saber cuando es FALSE
    var lastMouseX = 0;
    var lastMouseY = 0;
    // El atributo mouse.zoom se va incrementando 
    // con cada "scroll-up" y decrementando con cada "scroll-down".
  	var mouse = {x: 0, y: 0, zoom: 0, 
                 yaw: 0, pitch: 0, delta_yaw: 0, delta_pitch: 0,
                 factorAngular: 1};

    var ctrl_keys = { LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40 ,
                      W: 87, A: 65, S: 83, D: 68, C: 67,
                      F5: 116, F12: 123};

    var currentlyPressedKeys = {};
    var handleKey_counter = 0;

    // *************************************************** //
    // Esto es para detectar el movimiento del mouse
    document.addEventListener('mousemove', function(e){ 
      mouse.x = e.clientX || e.pageX; 
      mouse.y = e.clientY || e.pageY 
    }, false);
	
    $(document).mousedown(function(event){		
        isMouseDown = true;        
    });

    $(document).mouseup(function(event){
		    isMouseDown = false;		
    });

    // Esto es para detectar la rueda del mouse
    // using on
    $(document).ready(function() {
      // $(document).on('mousewheel', function(event) {
      // using the event helper
      // Al poner "canvas" solo se aplica dentro de la aplicación WebGL
      $("canvas").mousewheel(function(event) {
            //console.log(event.deltaX, event.deltaY, event.deltaFactor);
            if (event.deltaY == 1) {
              mouse.zoom++;
            } else if (event.deltaY == -1) {
              mouse.zoom--;
            };
            // Este "return false" es clave! 
            // Es para inhabilitar el "scroll" de la página
            return false; 
      });
      // deltaX : detecta movimiento lateral de la rueda:
      //          -1 : izquierda => deltaFactor = 16
      //          +1 : derecha
      // deltaY : detecta movimiento vertical de la rueda:
      //          +1 : para arriba => deltaFactor 48
      //          -1 : para abajo
    });

    // *************************************************** //
    // Teclas
    // ---- Manejo de entradas -----
    document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    function handleKeyDown(event) {
          currentlyPressedKeys[event.keyCode] = true;
//          console.log(event.keyCode);
          if (event.keyCode != ctrl_keys.F5 &&
              event.keyCode != ctrl_keys.F12) {
            return false;
          } else {
            return true;
          };
    };
    function handleKeyUp(event) {
          currentlyPressedKeys[event.keyCode] = false;
          if (event.keyCode != ctrl_keys.F5 &&
              event.keyCode != ctrl_keys.F12) {
            return false;
          } else {
            return true;
          };
    }

    function handleKeys() {
        // ---- Mouse ----
     // Roto según el movimiento del mouse en dirección horizontal
        mouse.factorAngular = 2*Math.PI/2000;
        if (isMouseDown) {
          // yaw
          mouse.delta_yaw = (mouse.x - lastMouseX) * mouse.factorAngular;
          lastMouseX = mouse.x;
          mouse.yaw = mouse.yaw + mouse.delta_yaw ;
          // pitch
          mouse.delta_pitch = (mouse.y - lastMouseY) * mouse.factorAngular;
          lastMouseY = mouse.y;
          mouse.pitch = mouse.pitch + mouse.delta_pitch ;
        } else {
          mouse.delta_yaw = 0;
          mouse.delta_pitch = 0;
          lastMouseX = mouse.x;
          lastMouseY = mouse.y;          
        };
        // ---- Teclas ----
        // Orientación con las flechas
        if (currentlyPressedKeys[ctrl_keys.LEFT]) {
            // Left arrow
            mouse.yaw -= 10*mouse.factorAngular;
        }
        if (currentlyPressedKeys[ctrl_keys.RIGHT]) {
            // Right arrow
            mouse.yaw += 10*mouse.factorAngular;
        }
        if (currentlyPressedKeys[ctrl_keys.UP]) {
            // UP arrow
            mouse.pitch -= 10*mouse.factorAngular;
        }
        if (currentlyPressedKeys[ctrl_keys.DOWN]) {
            // DOWN arrow
            mouse.pitch += 10*mouse.factorAngular;
        }
        // Movimiento con WASD
        if (currentlyPressedKeys[ctrl_keys.W] ) {
            // W - Move forward
            player.x += player.normal[0];
            player.z += player.normal[2];
        }
        if (currentlyPressedKeys[ctrl_keys.S] ) {
            // S - Move backwards
            player.x -= player.normal[0];
            player.z -= player.normal[2];
        }
        if (currentlyPressedKeys[ctrl_keys.A]) {
            // A - Move player left
            // Obtengo la dirección a la izquierda
            var left = [];
            vec3.cross(player.up, player.normal, left);
            player.x += left[0];
            player.z += left[2];
        }
        if (currentlyPressedKeys[ctrl_keys.D]) {
            // D - Move player rigth
            // Obtengo la dirección a la derecha
            var right = [];
            vec3.cross(player.normal, player.up, right);
            player.x += right[0];
            player.z += right[2];
        }

        // Cambio de camara con C
        if (currentlyPressedKeys[ctrl_keys.C]) {
            // C cursor key
            // Anti-rebote
            handleKey_counter++;
            if (handleKey_counter < 3) {
              return;
            };
            handleKey_counter = 0;
            camera.mode++;
            if (camera.mode > 2) {
              camera.mode = 0;
            };
            mouse.zoom = 0;   
            mouse.yaw = 0; // ángulo de rotación según mouse
            mouse.pitch = 0;                     
        }
    }
    // ------------------------------ //
    // *************************************************** //    
