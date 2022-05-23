
const bundle = (c_g, c_b, c_p, b_g, b_bl, b_p, macImg) => {
    let mainView;
    let init;

     import('./section-purple/js/c-purple.js').then(r=> {

         const movingCircleEl1 = document.querySelector('#moving-circle-1');
         const movingPhoto1 = document.querySelector('#photo-1');
         const slider1 = document.querySelector('.div-photos-slider1');

         const movingCircleEl2 = document.querySelector('#moving-circle-2');
         const movingPhoto2 = document.querySelector('#photo-2');
         const slider2 = document.querySelector('.div-photos-slider2');

         const rubiks= document.querySelectorAll('.rubik-photo');

         r.PurpleView().init(movingCircleEl1,movingPhoto1,slider1,movingCircleEl2,
             movingPhoto2,slider2,rubiks);
     });

  

}
//bundle()
   


