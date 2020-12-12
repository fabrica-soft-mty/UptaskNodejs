import Swal from 'sweetalert2';
import axios from 'axios';
import { actulizarAvance } from '../funciones/avance';
const tareas = document.querySelector('.listado-pendientes');

if (tareas) {
    tareas.addEventListener('click', (e) => {
        if (e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;
            //Request hacia tareas/:id
            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url, { idTarea })
                .then(function(respuesta) {
                    // console.log(respuesta);
                    if (respuesta.status === 200) {
                        icono.classList.toggle('completo');
                        actulizarAvance();
                    }
                });
        }

        if (e.target.classList.contains('fa-trash')) {
            const tareaHtml = e.target.parentElement.parentElement,
                idTarea = tareaHtml.dataset.tarea;

            Swal.fire({
                title: 'Deseas Borrar esta Tarea?',
                text: "Una Tarea Eliminada no se puede Recuperar",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Borrar!',
                cancelButtonText: 'No, Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {
                    //Enviar el delete por axios
                    const url = `${location.origin}/tareas/${idTarea}`;
                    axios.delete(url, { params: { idTarea } })
                        .then(function(respuesta) {
                            // console.log(respuesta)
                            if (respuesta.status === 200) {
                                //Eliminar el nodo de la tarea
                                tareaHtml.parentElement.removeChild(tareaHtml);
                                //Aerlta
                                Swal.fire(
                                    'Tarea Eliminada',
                                    respuesta.data,
                                    'success'
                                )
                                actulizarAvance();
                            }
                        });
                }
            });

        }
    });
}

export default tareas;