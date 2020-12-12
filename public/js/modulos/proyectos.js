import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar) {
    btnEliminar.addEventListener('click', (e) => {
        const urlProyecto = e.target.dataset.proyectoUrl;
        // console.log(urlProyecto);
        // return;

        Swal.fire({
            title: 'Deseas Borrar este Proyecto?',
            text: "Un Proyecto Eliminado no se puede Recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Borrar!',
            cancelButtonText: 'No, Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                //Enviar peticion a Axios
                const url = `${location.origin}/proyectos/${urlProyecto}`;

                axios.delete(url, { params: { urlProyecto } })
                    .then(function(respuesta) {
                        // console.log(respuesta);

                        Swal.fire(
                            'Proyecto Eliminado',
                            respuesta.data,
                            'success'
                        );

                        //redireccionar al inicio
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 1500);
                    })
                    .catch(() => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se puede eliminar el Proyecto'
                        })
                    })


            }
        })
    })
}

export default btnEliminar;