let DB;
// Selectores de la interfaz

const form = document.querySelector('form'),
      nombreMascota = document.querySelector('#mascota'),
      nombreCliente = document.querySelector('#cliente'),
      telefono = document.querySelector('#telefono'),
      fecha = document.querySelector('#fecha'),
      hora = document.querySelector('#hora'),
      sintomas = document.querySelector('#sintomas'),
      headingAdministra = document.querySelector('#administra');


// Esperar al DOM
    document.addEventListener('DOMContentLoaded', () => {
        // Crear la base de datos
        let crearDB = window.indexedDB.open('citas', 1);
        // Si hay uin error enviarlo a la consola
        crearDB.onerror = function(){
            console.log('Hubo un error');
        }
        // Si todo esta bien entonces muestra en consola y asignar base de datos
        crearDB.onsuccess = function(){
            // console.log('todo listo');

            // Asignar a la base de datos
            DB = crearDB.result;
            // console.log(DB);
        }

        // Este metodo solo corre una vez y es ideal para crear el schema de la BD. Sí la BD esta creada no la crea otra vez
        crearDB.onupgradeneeded = function (e){
            // console.log('Solo una vez');
            // console.log(e);

            // el evento es la misma base de datos
            let db = e.target.result;
            // console.log(db);
            // Definir el ObjectStore, 2 parametros, 1º nombre de BD y 2º opciones
            // KeyPath es el indice de la base de datos
            let objectStore = db.createObjectStore('citas', { keyPath: 'key', autoincrement: true})
            // Crear los indices y campos de la base de datos:1º Nombre; 2º keypath; 3º opciones
            objectStore.createIndex('mascota', 'mascota', { unique: false })
            objectStore.createIndex('cliente', 'cliente', { unique: false })
            objectStore.createIndex('telefono', 'telefono', { unique: false })
            objectStore.createIndex('fecha', 'fecha', { unique: false })
            objectStore.createIndex('hora', 'hora', { unique: false })
            objectStore.createIndex('sintomas', 'sintomasa', { unique: false })
            // console.log(objectStore.mascota);
            // console.log('Base de datos lista con sus campos');
        }
        // Listener al submit del formulario(todo)
        form.addEventListener('submit', agregarDatos);

        function agregarDatos (e) {
            e.preventDefault();
            // console.log('presionado');
            const nuevaCita = {
                mascota: nombreMascota.value,
                cliente: nombreCliente.value,
                telefono: telefono.value,
                fecha: fecha.value,
                hora: hora.value,
                sintomas: sintomas.value
            }
            console.log(nuevaCita);
            
        }
    })
    