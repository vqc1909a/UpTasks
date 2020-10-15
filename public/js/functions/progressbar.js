
const progressbar = document.querySelector('.progress-bar');
const calcularProgressbar = () => {
     const total = document.querySelectorAll('li i.fa-check-circle').length; 
     if(total){
          const completos = document.querySelectorAll('li i.fa-check-circle.text-success').length;
          progressbar.setAttribute('style', `width: ${Math.round(completos/total*100)}%`);
          progressbar.textContent = `${Math.round(completos/total*100)}%`;
     }
}
calcularProgressbar();   
export default calcularProgressbar;
