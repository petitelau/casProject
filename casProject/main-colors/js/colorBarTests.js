import { listController, selectionController } from './nav-model.js';
import { ColorBar, DetailView, MasterView, noColor } from './ColorBar.js';


test("main-nav", assert => {

console.log('main-nav')
     // prepare the environment

     const rootEl = document.getElementById('colorTest')     
     const section_green = document.createElement('DIV');
     section_green.setAttribute('id', 'c_green')
     section_green.classList.add('close-section');
 
     const section_blue = document.createElement('DIV');
     section_blue.setAttribute('id', 'c_blue')
     section_blue.classList.add('close-section');
 
     const section_purple = document.createElement('DIV');
     section_purple.setAttribute('id', 'c_purple')
     section_purple.classList.add('close-section');

     const bookmark_green = document.createElement('DIV');
     bookmark_green.style.right ='12.8rem';
     bookmark_green.classList.add('bookmark');
     bookmark_green.setAttribute('ID', 'b_green');
 
     const bookmark_blue = document.createElement('DIV');
     bookmark_blue.style.right ='6.4rem';
     bookmark_blue.classList.add('bookmark');
     bookmark_blue.setAttribute('id', 'b_blue');
 
     const bookmark_purple = document.createElement('DIV');
     bookmark_purple.style.right ='0rem';
     bookmark_purple.classList.add('bookmark');
     bookmark_purple.setAttribute('id', 'b_purple');

    rootEl.appendChild(bookmark_green);
    rootEl.appendChild(bookmark_blue);
    rootEl.appendChild(bookmark_purple);
    rootEl.appendChild(section_blue);
    rootEl.appendChild(section_green);
    rootEl.appendChild(section_purple);


    // init master-detail
    const navItems = ['green','blue','purple'];
    const lController = listController(ColorBar,navItems);
    const sController = selectionController(noColor);

    MasterView(lController,sController);
    DetailView(sController);

    lController.addItems();

    sController.setSectionSelected(ColorBar('blue'));

    assert.equals('close-section', section_green.className, 'c-green on click blue');
    assert.equals('open-section', section_blue.className, 'c-blue on click blue');
    assert.equals('close-section', section_purple.className, 'c-purple on click blue');

    sController.setSectionSelected(ColorBar('green'));

    assert.equals('open-section', section_green.className);
    assert.equals('close-section', section_blue.className);
    assert.equals('close-section', section_purple.className, 'c-purple on click green');

    sController.setSectionSelected(ColorBar('purple'));

    assert.equals('close-section', section_green.className);
    assert.equals('close-section', section_blue.className);
    assert.equals('open-section', section_purple.className);

});