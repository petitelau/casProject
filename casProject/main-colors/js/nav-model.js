import { Observable, ObservableListNav } from "../../utils/Observables.js";
export {listController, selectionController}

const listController = (model,navItems) =>{

  const listModel = ObservableListNav([]);

  const addItems = _ =>
      navItems.forEach(item=> listModel.add(model(item)));

  return {
      onModelAdd : listModel.onAdd,
      navItems,
      addItems
  }
} 


const selectionController = (noSelection) => {   // model is my color tab : widht, height top, 

    const sectionOpen = Observable(noSelection);

    const sectionClose = Observable(false);
    const isOpen = Observable(false)
  
    const closeColor = () => {
      sectionClose.setValue(true);
      isOpen.setValue(false)
    }
 
    return {
      closeColor,
      setSectionSelected : sectionOpen.setValue,
      onOpenColorSection : sectionOpen.onChange,
      onCloseColorSection: sectionClose.onChange,
      onSectionOpen : isOpen.onChange,
      setOpen: isOpen.setValue
    }
  }

  
  
  