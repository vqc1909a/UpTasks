import Swal from 'sweetalert2';
import axios from 'axios';    

const buttoneliminar = document.querySelector('.eliminar-proyecto');

if(buttoneliminar){
     buttoneliminar.addEventListener('click', (e) => {
          eliminarProyecto(e.target.dataset.url);
     })
}

const eliminarProyecto = (url) => {
          Swal.fire({
               title: 'Estás seguro?',
               text: "No puedes revertir esta acción!",
               icon: 'warning',
               showCancelButton: true,
               confirmButtonColor: '#3085d6',
               cancelButtonColor: '#d33',
               confirmButtonText: 'Sí, borrar esto!',
               cancelButtonText: "No, cancelar"
          }).then((result) => {
               if (result.isConfirmed) {
                    axios.delete(`${location.origin}/proyectos/${url}`)
                    .then(({data}) => {
                         console.log(data)
                          Swal.fire(
                               'Deleted!',
                               data,
                               'success'
                          )
                          setTimeout(() => {
                               window.location.href = "/"
                          }, 2000) 
                    })
                    .catch((err) => {
                         const {data} = err.response;
                         console.log(data)
                         Swal.fire({
                              icon: 'error',
                              title: 'Oops...',
                              text: 'Ocurrió un error!',
                         })
                    });  
               }
          })
}