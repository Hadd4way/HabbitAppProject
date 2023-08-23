'use strict'

const HABBIT_KEY = 'HABBIT_KEY';

let habbits = [];

const page ={
    menu: document.querySelector('.menu__list')
}

        // util // 

function loadData() {
    const habbitsString  =  localStorage.getItem(HABBIT_KEY);
    const habbitsArray = JSON.parse(habbitsString);
    if(Array.isArray(habbitsArray)){
        habbits = habbitsArray;
    }
}

function saveData(){
    localStorage.setItem(HABBIT_KEY,JSON.stringify(habbits));
}
        // render //

function rerenderMenu(activeHabbit){
    if(!activeHabbit){
        return;
    }
    for (const habbit of habbits){
        const existed = document.querySelector(`[menu__item__id = "${habbit.id}"]`);
        if(!existed){
            // Создание //
            const element = document.createElement('button');
            element.classList.add('menu__item');
            element.setAttribute('menu__item__id', habbit.id)
            element.innerHTML = `<img src="/images/${habbit.icon}.svg" alt="${habbit.name}">`;
            if(habbit.id === activeHabbit.id){
                element.classList.add('menu__item_active');
            }
            element.addEventListener('click',() => rerender(habbit.id));
            page.menu.appendChild(element);
            continue;
        }
        if(habbit.id === activeHabbit.id){
            existed.classList.add('menu__item_active');
        }
        else{
            existed.classList.remove('menu__item_active')
        }
    }
}

function rerender(activeHabbitId){
    const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId)
    rerenderMenu(activeHabbit);
}

        // init // 

(() => {
    loadData();
    rerender(habbits[0].id);
})()