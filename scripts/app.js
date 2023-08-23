'use strict'

const HABBIT_KEY = 'HABBIT_KEY';

let habbits = [];

const page ={
    menu: document.querySelector('.menu__list'),
    header: {
        h1: document.querySelector('h1'),
        progressPercent: document.querySelector('.progress__percent'),
        progressCoverBar: document.querySelector('.progress__bar__cover')
    },
    content: {
        habbit: document.querySelector('.habbit'),
        habbitList: document.querySelector('.habbit__list'),
        habbitDay: document.querySelector('.habbit__day'),
        habbitComment: document.querySelector('.habbit__comment'),
        habbitDeleteButton: document.querySelector('.habbit__delete'),
        main: document.querySelector('main')
    }
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

function addDay(activeHabbit){
    
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
    let addElement = document.createElement('div');
    addElement.classList.add('habbit');
    addElement.innerHTML = `
    <div class="habbit__day">День ${Number(activeHabbit.days.length)+1}</div>
    <form class="habbit__form" action = "#">
        <input type="text" class="input__icon" placeholder="Комментарий">
        <img src="/images/comment.svg" alt="commentIcon" class="input_icon">
        <button class="habbit__form__button" type='button'>Готово</button>
    </form>
    `
    addElement.querySelector('.habbit__form__button').addEventListener('click', () =>{
        activeHabbit.days.push({comment: addElement.querySelector('.input__icon').value})
        rerender(activeHabbit.id);
    })
    page.content.main.appendChild(addElement);
}

function rerenderHeader(activeHabbit){
    if(!activeHabbit){
        return;
    }
    page.header.h1.innerText = `${activeHabbit.name}`;
    const newPercent = activeHabbit.days.length / activeHabbit.target > 1 ? 
    100 : activeHabbit.days.length / activeHabbit.target * 100;
    page.header.progressPercent.innerText = `${newPercent.toFixed(0)}%`;
    page.header.progressCoverBar.style = `width: ${newPercent}%`;
}

function rerenderContent(activeHabbit){
    if(!activeHabbit){
        return;
    }
    page.content.habbitList.innerHTML = ''
    for(const habbitTrack in activeHabbit.days){
        let newDay = document.createElement('div');
        newDay.classList.add('habbit');
        newDay.innerHTML = `
        <div class="habbit__day">День ${Number(habbitTrack) + 1}</div>
        <div class="habbit__comment">${activeHabbit.days[habbitTrack].comment}</div>
        <button class="habbit__delete">
            <img src="/images/delete.svg" alt="Удалить день">
        </button>
        `;
        newDay.querySelector('.habbit__delete').addEventListener('click',()=>{
            newDay.innerHTML = '';
            newDay.outerHTML = '';
            activeHabbit.days.splice(activeHabbit,1)
            rerenderHeader(activeHabbit)
        })
        page.content.habbitList.appendChild(newDay);
    }
}
function rerender(activeHabbitId){
    const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId)
    rerenderMenu(activeHabbit);
    rerenderHeader(activeHabbit)
    rerenderContent(activeHabbit);
}

        // init // 

(() => {
    loadData();
    rerender(habbits[0].id);
})()