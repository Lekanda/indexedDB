let IDBOpenDBRequest;
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
            console.log('todo listo');

            // Asignar a la base de datos
            DB = crearDB.result;
            console.log(DB);
            
        }
    })
