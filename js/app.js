let DB;
// Selectores de la interfaz
const form = document.querySelector('form'),
      nombreMascota = document.querySelector('#mascota'),
      nombreCliente = document.querySelector('#cliente'),
      telefono = document.querySelector('#telefono'),
      fecha = document.querySelector('#fecha'),
      hora = document.querySelector('#hora'),
      sintomas = document.querySelector('#sintomas'),
      citas = document.querySelector('#citas'),
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

            mostrarCitas();
        }

        // Este metodo solo corre una vez y es ideal para crear el schema de la BD. Sí la BD esta creada no la crea otra vez
        crearDB.onupgradeneeded = function (e){
            // console.log('Solo una vez');
            // el evento es la misma base de datos
            let db = e.target.result;
            // console.log(db);
            // Definir el ObjectStore, 2 parametros, 1º nombre de BD y 2º opciones
            // KeyPath es el indice de la base de datos
            let objectStore = db.createObjectStore('citas', { keyPath: 'key', autoIncrement: true} );
            // Crear los indices y campos de la base de datos:1º Nombre; 2º keypath; 3º opciones
            objectStore.createIndex('mascota', 'mascota', { unique: false });
            objectStore.createIndex('cliente', 'cliente', { unique: false });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('fecha', 'fecha', { unique: false });
            objectStore.createIndex('hora', 'hora', { unique: false });
            objectStore.createIndex('sintomas', 'sintomasa', { unique: false });
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
            };
            // console.log(nuevaCita);
            // En Indexed se utilizan las transacciones para escribir datos
            let transaction = DB.transaction(['citas'], 'readwrite');
            let objectStore = transaction.objectStore('citas');
            let peticion = objectStore.add(nuevaCita);
            // console.log(peticion);
            peticion.onsuccess = () => {
                form.reset();
            }
            transaction.oncomplete = () => {
                console.log('Cita Agregada !!');
                mostrarCitas();
            }
            transaction.onerror = () => {
                console.log('HUbo un error');
            }
        }

        function mostrarCitas() {
            // Limpiar citas anteriores
            while( citas.firstChild ) {
                citas.removeChild(citas.firstChild);
            }

            // creamos Object Store
            let objectStore = DB.transaction('citas').objectStore('citas');
            // Esto retorna una peticion asincrona
            objectStore.openCursor().onsuccess = function(e) {
                // cursor se va a ubicar en el registro indicado
                let cursor = e.target.result;
                // console.log(cursor);
                if (cursor) {
                    let citaHTML = document.createElement('li');
                    citaHTML.setAttribute('data-cita-id', cursor.value.key);
                    citaHTML.classList.add('list-group-item');
                    citaHTML.innerHTML = `
                    <p class="font-weight-bold">Mascota: <span class ="font-weight-normal">${cursor.value.mascota}</span></p>
                    <p class="font-weight-bold">Cliente: <span class ="font-weight-normal">${cursor.value.cliente}</span></p>
                    <p class="font-weight-bold">Telefono: <span class ="font-weight-normal">${cursor.value.telefono}</span></p>
                    <p class="font-weight-bold">Fecha: <span class ="font-weight-normal">${cursor.value.fecha}</span></p>
                    <p class="font-weight-bold">Hora: <span class ="font-weight-normal">${cursor.value.hora}</span></p>
                    <p class="font-weight-bold">Sintomas: <span class ="font-weight-normal">${cursor.value.sintomas}</span></p>
                    `;
                    // Append en el padre
                    citas.appendChild(citaHTML);
                    // Consultar los proximos registros
                    cursor.continue();
                } else {
                    if (!citas.firstChild) {
                        // Cuando no hay Registros.
                        headingAdministra.textContent = 'Agrega citas para comenzar';
                        let listado = document.createElement('p');
                        listado.classList.add('text-center');
                        listado.textContent ='No hay Registros';
                        citas.appendChild(listado);
                    } else {
                        headingAdministra.textContent = 'Administra tus citas'
                    }
                }
            }
        }
    })   