import { MainColorsView, MainColorsController } from "./colors.js";

test("main-style", assert => {

    const collect = [];
    
    // prepare the environment
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
    bookmark_green.setAttribute('id', 'b_green');

    const bookmark_blue = document.createElement('DIV');
    bookmark_blue.style.right ='6.4rem';
    bookmark_blue.classList.add('bookmark');
    bookmark_blue.setAttribute('id', 'b_blue');

    const bookmark_purple = document.createElement('DIV');
    bookmark_purple.style.right ='0rem';
    bookmark_purple.classList.add('bookmark');
    bookmark_purple.setAttribute('id', 'b_purple');

    let bookmarks = [{id: 'b_green'},{id:'b_blue'},{id:'b_purple'}];
    const width = 6.4

    const mainController = MainColorsController();
    const mainView = MainColorsView(mainController);
    mainView.initColorSections(section_green, section_blue, section_purple,
              bookmark_green, bookmark_blue, bookmark_purple, bookmarks)

    const mainPhotoContainer = document.createElement('DIV');
    const child1 = document.createElement('DIV');
    const child10= document.createElement('DIV');
    const child11= document.createElement('DIV');
    const child12 = document.createElement('DIV');
    child1.appendChild(child10);
    child1.appendChild(child11);
    child1.appendChild(child12);
    mainPhotoContainer.appendChild(child1);


    const credits_box = document.createElement('DIV');
    const credit_canvas = document.createElement('DIV');
    const home = document.createElement('DIV');
    const cas = document.createElement('DIV');
    mainView.initHtmlEl(mainPhotoContainer,credits_box, credit_canvas,home,cas);


    // open blue section
    mainController.openColor('blue');

    assert.equals('close-section', section_green.className, 'c-green on click blue');
    assert.equals('open-section', section_blue.className, 'c-blue on click blue');
    assert.equals('close-section', section_purple.className, 'c-purple on click blue');

    assert.equals(bookmark_blue.style.right, '12.8rem', 'b-blue on click blue');
    assert.equals(bookmark_green.style.right, '6.4rem','b-green on click blue');
    assert.equals(bookmark_purple.style.right, '0rem','b-purple on click blue');

     // open purple section
    mainController.openColor('purple');

     assert.equals('close-section', section_green.className);
     assert.equals('close-section', section_blue.className);
     assert.equals('open-section', section_purple.className);
 
     assert.equals(bookmark_green.style.right, '6.4rem');
     assert.equals(bookmark_blue.style.right, '0rem');
     assert.equals(bookmark_purple.style.right, '12.8rem');

    // open green section
    mainController.openColor('green');

    assert.equals('open-section', section_green.className);
    assert.equals('close-section', section_blue.className);
    assert.equals('close-section', section_purple.className, 'c-purple on click green');

    assert.equals(bookmark_green.style.right, '12.8rem');
    assert.equals(bookmark_blue.style.right, '6.4rem');
    assert.equals(bookmark_purple.style.right, '0rem');
   
    
    assert.equals(mainController.getSectionColorRightSize(1) , "0rem");
    assert.equals(mainController.getSectionColorRightSize(2) , width+"rem");
    assert.equals(mainController.getSectionColorRightSize(3) , width*2+"rem");

}) ;
