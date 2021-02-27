import axios from 'axios';
import Swal from 'sweetalert2';
import calcularProgressbar from '../functions/progressbar';
const tareas = document.querySelector('.listado-tareas');

if(tareas){
     tareas.addEventListener('click', (e) => {
          if(e.target.classList.contains("fa-check-circle")){
               const id = e.target.parentElement.parentElement.dataset.id;
               const icono = e.target;
               actualizarEstado(id, icono);
          }else if(e.target.classList.contains("fa-times")){
               const id = e.target.parentElement.parentElement.dataset.id
               const li = e.target.parentElement.parentElement;
               eliminarTarea(id, li);

          }    
     })   
}

const actualizarEstado = (id, icono) => {
        axios.patch(`${location.origin}/tareas/${id}`).then(({data}) => {
              console.log(data);
              if(icono.classList.contains("text-success")){
                  icono.classList.remove("text-success");
                  icono.classList.add("text-danger");
               }else{
                    icono.classList.remove("text-danger");
                    icono.classList.add("text-success");
               };
               calcularProgressbar();
          }).catch(err => {    
               const {data} = err.response
               console.log(data);
          })
}

const eliminarTarea = (id, li) => {
     Swal.fire({
          title: 'Estás seguro?',
          text: "No puedes revertir esta acción!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, eliminar!',
          cancelButtonText: "No, cancelar"
     }).then((result) => {
          if (result.isConfirmed) {
                axios.delete(`${location.origin}/tareas/${id}`).then(({data})=>{
                    console.log(data);
                    li.parentElement.removeChild(li);
                     Swal.fire(
                          'Eliminado!',
                           data,
                          'success'
                     )
                    calcularProgressbar();
               }).catch(err => {
                    const {data} = err.response
                    console.log(data);
                    Swal.fire({
                         icon: 'error',
                         title: 'Oops...',
                         text: "Ocurrió un error",
                    })
               });
              
          }
     })
}