/* JavaScript para el reproductor de video
 * Creado por Enrique Corona Ricaño
 * Mayo 2021 -
 * Entregable de la tarea de Streaming en la web del 3er semestre de Maestria
 * UNIR  - México / Maestría en Dirección e Ingenieria de Sitios Web
 */

/*
* apartado de variables a utilizar para el reproductor de video
* variable de videos, el arreglo de videos, los selectores de JS
* */
var Variables ={

    //variable para saber cual es el video activo de la lista de reproduccion
    video_activo : 0,

    //arreglo de los videos para la lista de reproduccion
    videos : [
        {poster : 'imgs/posters/starwars.jpg',titulo : 'Starwars Floppys',descripcion:'Starwars Floppys- 00:00:52',src_video_mp4 : 'video/starwars.mp4',src_video_ogg: 'videos/starwars.ogg',subs :{esp : 'video/subs/starwars_esp.vtt',eng : 'video/subs/starwars_eng.vtt'}},
        {poster : 'imgs/posters/siesta_a.jpg',titulo : 'Una siesta gatuna (parte A)',descripcion:'Una siesta gatuna (parte A) - 00:00:30',src_video_mp4 : 'video/siesta_a.mp4',src_video_ogg: 'videos/siesta_a.ogg',subs :{esp : 'video/subs/siesta_a_esp.vtt',eng : 'video/subs/siesta_a_eng.vtt'}},
        {poster : 'imgs/posters/siesta_b.jpg',titulo : 'Una siesta gatuna (parte A)',descripcion:'Una siesta gatuna (parte B) - 00:00:30',src_video_mp4 : 'video/siesta_b.mp4',src_video_ogg: 'videos/siesta_b.ogg',subs :{esp : 'video/subs/siesta_b_esp.vtt',eng : 'video/subs/siesta_b_eng.vtt'}},
        {poster : 'imgs/posters/desarrollador_sistemas.jpg',titulo : 'Desarrollador de sistemas pruebas',descripcion:'Desarrollador de sistemas - 00:00:14',src_video_mp4 : 'video/desarrollo_sistemas.mp4',src_video_ogg : 'video/desarrollo_sistemas.ogg',subs :{esp : 'video/subs/desarrollo_sistemas_esp.vtt',eng : 'video/subs/desarrollo_sistemas_eng.vtt'}},
    ],

    //selector del reproductor de video - Etiqueta VIDEO HTML
    reproductor_video : document.getElementById('reproductor_video'),
    canva_fotografia : document.getElementById('canva_fotografia'),
    contexto_canva : false, contexto_canva_w : false, contexto_canva_h : false,
    reglon_fotografias : document.getElementById('reglon_fotografias'),
    //selector del contenedor de la lista de reproduccion
    id_lista_reproduccion : document.getElementById('panel_lista_reproduccion'),

    //selector de los botones del video (play, pause, volumen, activar/desactivar audio, adelantar segundos del video
    boton_atras : document.getElementById('boton_atras'),
    boton_reproducir : document.getElementById('boton_reproducir'),
    boton_pausar : document.getElementById('boton_pausar'),
    boton_adelantar : document.getElementById('boton_adelantar'),
    boton_fotografia : document.getElementById('boton_fotografia'),
    boton_velocidad : document.getElementById('boton_velocidad'),
    boton_tamanio : document.getElementById('boton_tamanio'),
    boton_subtitulo : document.getElementById('boton_subtitulos'),
    boton_silencio : document.getElementById('boton_silecio'),
    boton_volumen : document.getElementById('boton_volumen'),

    //barras
    barra_volumen : document.getElementById('barra_volumen'),
    barra_progreso : document.getElementById('progreso_video'),
};

var VideoFunciones = {

    /* Funcion del reproductor que inicializa todos los componentes en
     * la carga inicial del sitio, carga los eventos de varios componentes
     * del HTML, como los botones del control de reproductor
     */
    start : function(){
        Variables.barra_volumen.value = Variables.volumen_activo;
        VideoFunciones.cargar_lista_reproduccion();
        VideoFunciones.eventos_js();
    },

    /* Carga el HTML de la lista de reproducción
     * Se auxilia de una arreglo de variables que contiene todos los datos de los videos
     * Dicha variable esta en Variables -> videos
     */
    cargar_lista_reproduccion : function(){
        var videos_html_lista = '';
        Variables.videos.forEach(function(video, index){
            videos_html_lista += VideoFunciones.obtener_html_video_lista_reproduccion(index,video);
        });
        Variables.id_lista_reproduccion.innerHTML = videos_html_lista;
        VideoFunciones.procesar_video(0);
    },

    /* Funcion que devuelve el HTML que va destinado a la lista de reproducción
     * necesita como paramentro el indice del arreglo como el objeto del video
     * Estos datos llegan de la funcion de VideoFunciones.cargar_lista_reproduccion()
     */
    obtener_html_video_lista_reproduccion : function(index,video){
        var html = '<a href="#" id="video_lista_'+index+'" onclick="VideoFunciones.procesar_video('+index+')" class="link_video">' +
            '            <table>' +
            '                <tr>' +
            '                    <td>' +
            '                        <img class="img_lista_reproduccion" src="'+video.poster+'" alt="'+video.titulo+'">' +
            '                    </td>' +
            '                    <td>'+video.descripcion+'</td>' +
            '                </tr>' +
            '            </table>' +
            '        </a><hr>';
        return html;
    },

    /**
     * Función que inicializa la reproducción del video activo
     * Cambia el icono y la leyenda del reproducir y habilita los botones
     * de capturar fotografia, velocidad del video, tamaño del video
     * y subtitulos del video
     */
    reproducir : function(){
        Variables.reproductor_video.play();
        Variables.boton_reproducir.style.display = 'none';
        Variables.boton_pausar.style.display = 'inline';
        Variables.boton_fotografia.removeAttribute('disabled');
        Variables.boton_velocidad.removeAttribute('disabled');
        Variables.boton_tamanio.removeAttribute('disabled');
        Variables.boton_subtitulo.removeAttribute('disabled');
        bucle=setInterval(VideoFunciones.barra_progreso, 1000);
    },

    /**
     * Función que pone en pausa el video actual
     * Cambia el icono y leyenda del reproducir
     */
    pausar : function(){
        Variables.reproductor_video.pause();
        Variables.boton_reproducir.style.display = 'inline';
        Variables.boton_pausar.style.display = 'none';
        window.clearInterval(bucle);
    },

    /**
     * Función que nos ayuda a desactiva el audio del video
     * actual y pone la barra de sonido a CERO
     */
    silenciar : function(){
        Variables.reproductor_video.muted = true;
        Variables.boton_silencio.style.display = 'inline';
        Variables.boton_volumen.style.display = 'none';
        Variables.barra_volumen.value = 0;
    },

    /**
     * Función que nos ayuda a volver a activar el audio del video
     * actual y pone la barra de sonido en MAXIMO
     */
    activar_sonido : function(){
        Variables.reproductor_video.muted = false;
        Variables.boton_silencio.style.display = 'none';
        Variables.boton_volumen.style.display = 'inline';
        Variables.barra_volumen.value = Variables.reproductor_video.volume * 100;
        if(Variables.barra_volumen.value == 0){
            Variables.barra_volumen.value = 100;
            Variables.reproductor_video.volume = 1;
        }
    },

    /**
     * Función que nos ayuda a actualizar la barra de progreso conforme
     * se va reproducciendo el video activo; se realiza con un ciclo en el navegador
     * que termina en el momento que termino de reproducir el video
     */
    barra_progreso : function(){
        if(!Variables.reproductor_video.ended){
            var total=parseInt(Variables.reproductor_video.currentTime*100/Variables.reproductor_video.duration);
            Variables.barra_progreso.value = total;
        }else{
            Variables.barra_progreso.value = 0;
            window.clearInterval(bucle);
        }
    },

    /**
     * Funcion que nos ayuda a cargar un nuevo video en el reproductor
     * que fue seleccionado de la lista de reproducción, esta funcion es
     * mandada a llamar desde el link de la lista de reproducción
     */
    procesar_video : function(elemento){
        var video_cargar = Variables.videos[elemento];
        Variables.reproductor_video.poster = video_cargar.poster;
        var html_source = '<track kind="subtitles" src="'+video_cargar.subs.esp+'" srclang="esp" label="Español">';
        html_source += '<track kind="subtitles" src="'+video_cargar.subs.eng+'" srclang="eng" label="Ingles">';
        Variables.reproductor_video.innerHTML = html_source;
        Variables.reproductor_video.src = video_cargar.src_video_mp4;
        var links_video = document.getElementsByClassName('link_video');
        for(var i = 0; i < links_video.length; i++){
            links_video[i].classList.remove('active');
        }
        var video_lista = document.getElementById('video_lista_'+elemento);
        video_lista.classList.add('active');
        Variables.barra_progreso.value = 0;
        Variables.barra_volumen.value = 100;
        Variables.boton_reproducir.style.display = 'inline';
        Variables.boton_pausar.style.display = 'none';
    },

    /**
     * Funcion que nos ayuda a tomar una captura en imagen del video que esta en reproducción
     * se activa al momento de que se le da click al boton de fotografia,
     * toma los datos del video en cuestion, tanto sus propiedades como el tiempo actual reproducido
     * la imagen se procesa con un CANVAS en un DATA:IMAGE BASE64 con toda la cadena de información de la imagen
     * ademas de que generamos un link de descarga de la imagen procesada por el CANVAS
     * ya formado el HTML lo concatenamos al contenedor de las fotografias
     */
    capturar_foto_video : function(){
        Variables.contexto_canva.fillRect(0,0,Variables.contexto_canva_w,Variables.contexto_canva_h);
        Variables.contexto_canva.drawImage(Variables.reproductor_video,0,0,Variables.contexto_canva_w,Variables.contexto_canva_h);
        //Variables.canva_fotografia.style.display = 'inline';
        var imgURL = Variables.canva_fotografia.toDataURL();
        var nueva_captura = '<td class="centrado">' +
            '                <img src="'+imgURL+'" class="foto_captura_video"><br>' +
            '                <a href="'+imgURL+'" download="mi_captura_video.png" class="boton_controles boton_guardar_imagen">' +
            '                    <img class="img_boton" src="imgs/iconos/guardar.png" alt="Guardar imagen">' +
            '                </a><br> Guardar imagen' +
            '            </td>';
        Variables.reglon_fotografias.innerHTML += nueva_captura;
    },

    /**
     * Funcion que nos ayuda a cargar los eventos necesarios del sitio, como
     * dar click's en los botones, o cuando haya un cambio en las opciones de
     * la velocidad, el tamaño del video y subtitulos
     */
    eventos_js : function(){
        //evento para retroceder 5 segundos
        Variables.boton_atras.addEventListener('click',function(){
            var posicion_tiempo = Variables.reproductor_video.currentTime;
            if(posicion_tiempo -5 < 0){
                posicion_tiempo = 0;
            }else{
                posicion_tiempo = posicion_tiempo - 5;
            }
            Variables.reproductor_video.currentTime = posicion_tiempo;
        }),

        //evento para adelantar 5
        Variables.boton_adelantar.addEventListener('click',function(){
            var posicion_tiempo = Variables.reproductor_video.currentTime;
            if(posicion_tiempo + 5 < Variables.reproductor_video.duration){
                posicion_tiempo = posicion_tiempo + 5;
                Variables.reproductor_video.currentTime = posicion_tiempo;
            }
        }),

        //evento para subir o bajar volumen
        Variables.barra_volumen.addEventListener('change',function(){
            Variables.reproductor_video.volume = parseFloat(Variables.barra_volumen.value * 0.01);
            if(Variables.barra_volumen.value == 0){
                VideoFunciones.silenciar();
            }else{
                VideoFunciones.activar_sonido();
            }
        },false);

        //evento para subir bajar velocidad de reproduccion del video
        Variables.boton_velocidad.addEventListener('change',function(){
            var velocidad = Variables.boton_velocidad.value;
            Variables.reproductor_video.playbackRate = velocidad;
        },false);

        //evento para navegar entre la barra de desplazamiento de la linea de tiempo del video
        Variables.barra_progreso.addEventListener('change',function(){
            var desplazamiento_porciento = Variables.barra_progreso.value;
            var tiempo_desplazamiento = parseFloat((Variables.reproductor_video.duration * desplazamiento_porciento) / 100);
            Variables.reproductor_video.currentTime = tiempo_desplazamiento;
        },false);

        //evento para cambiar tamaño del video
        Variables.boton_tamanio.addEventListener('change',function(){
            var tamanio = parseInt(Variables.boton_tamanio.value);
            var largo = '';var ancho = '';
            switch (tamanio) {
                case 1: //720
                    largo = '720px'; ancho = '480px';break;
                case 2: //480;
                    largo = '480px'; ancho = '320px';break;
                case 3: //360
                    largo = '360px'; ancho = '260px';break;
                case 4: //240
                    largo = '240px'; ancho = '160px';break;
                case 5: //144
                    largo = '144px'; ancho = '80px';break;
            }
            Variables.reproductor_video.style.width = largo;
            Variables.reproductor_video.style.height = ancho;
        },false);

        //evento para los subtitulos
        Variables.boton_subtitulo.addEventListener('change',function(){
            var subtitulo_seleccionado = Variables.boton_subtitulo.value;
            for(var i = 0; i < Variables.reproductor_video.textTracks.length; i++){
                Variables.reproductor_video.textTracks[i].mode = 'disabled';
                if(subtitulo_seleccionado != '' && subtitulo_seleccionado == Variables.reproductor_video.textTracks[i].language){
                    Variables.reproductor_video.textTracks[i].mode = 'showing'
                }
            }
        },false);

        //evento para cuando termino el video, regresamos el boton de reproducir y quitar el de pausa
        Variables.reproductor_video.onended =  function(){
            Variables.boton_reproducir.style.display = 'inline';
            Variables.boton_pausar.style.display = 'none';
        };

        //evento auxiliar para la captura de la fotografia del canva
        Variables.reproductor_video.addEventListener('loadedmetadata',function(){
            var radio_video = Variables.reproductor_video.videoWidth / Variables.reproductor_video.videoHeight;
            var width = Variables.reproductor_video.videoWidth - 100;
            var heigth = parseInt(width / radio_video,10);
            Variables.canva_fotografia.width = width;
            Variables.canva_fotografia.heigth = heigth;
            Variables.contexto_canva_w = width;
            Variables.contexto_canva_h = heigth;
            console.log(width+'-----'+heigth);
            Variables.contexto_canva = Variables.canva_fotografia.getContext('2d');
        },false);
    },

};

/**
 * Mandamos a llamar la funcion de inicio que nos ayuda a procesar
 * todas las funciones principales del reproductor
 */
VideoFunciones.start();