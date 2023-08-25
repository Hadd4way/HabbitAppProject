'use strict'

//TODO:
// deleteDay function
// popup window


const HABBIT_KEY = 'HABBIT_KEY';

let habbits = [];
let globalActiveHabbitId;
const page ={
    menu: document.querySelector('.menu__list'),
    header: {
        h1: document.querySelector('h1'),
        progressPercent: document.querySelector('.progress__percent'),
        progressCoverBar: document.querySelector('.progress__bar__cover')
    },
    content: {
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

function addDays(event){
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    const comment = data.get('comment');
    form['comment'].classList.remove('error')
    if(!comment){
        form['comment'].classList.add('error')
        return;
    }
    habbits = habbits.map(singleHabbit =>{
        if(singleHabbit.id === globalActiveHabbitId){
            return {
                ...singleHabbit,
                days: singleHabbit.days.concat({comment}),
            }
            
        }
        return singleHabbit;
    })
    form['comment'].value = '';
    rerender(globalActiveHabbitId);
    saveData();
}

function deleteDay(index){
    habbits.map(habbit => {
        if(habbit.id === globalActiveHabbitId){
            habbit.days.splice(index,1);
            return{
                ...habbit,
                days: habbit.days,
            }
        }
        return habbit;
    })
    rerender(globalActiveHabbitId);
    saveData();
}

        // render //

function rerenderMenu(activeHabbit){
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

function rerenderHeader(activeHabbit){
    page.header.h1.innerText = `${activeHabbit.name}`;
    const newPercent = activeHabbit.days.length / activeHabbit.target > 1 ? 
    100 : activeHabbit.days.length / activeHabbit.target * 100;
    page.header.progressPercent.innerText = `${newPercent.toFixed(0)}%`;
    page.header.progressCoverBar.style = `width: ${newPercent}%`;
}

function rerenderContent(activeHabbit){
    page.content.habbitList.innerHTML = '';
    for(const index in activeHabbit.days){
        let element = document.createElement('div');
        element.classList.add('habbit');
        element.innerHTML = `
        <div class="habbit__day">День ${Number(index) + 1}</div>
        <div class="habbit__comment">${activeHabbit.days[index].comment}</div>
        <button class="habbit__delete" onclick="deleteDay(${index})">
            <img src="/images/delete.svg" alt="Удалить день">
        </button>
        `;
        
        page.content.habbitList.appendChild(element);

    } 
    page.content.main.querySelector('.habbit__add__day').innerText = `День ${activeHabbit.days.length + 1}`;
}




function rerender(activeHabbitId){
    const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId)
    globalActiveHabbitId = activeHabbitId;
    if(!activeHabbit){
        return;
    }
    rerenderMenu(activeHabbit);
    rerenderHeader(activeHabbit)
    rerenderContent(activeHabbit);
}

        // init // 

(() => {
    loadData();
    rerender(habbits[0].id);
})()