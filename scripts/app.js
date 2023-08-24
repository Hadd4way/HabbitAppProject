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
    event.preventDefault();                     // Отмена дефолтного действия Submit(отправка данных и перезагрузка страницы )
    const data = new FormData(event.target);    // Создание некого хранилища data при помощи FormDataAPI
    console.log(data.get('comment'));           // event.target вовзращает то, что мы использовали
                                                // получаем значение input при помощи formDataAPI метода get('name'), чтобы использовать get
                                                // мы должны прописать в нужном теге name = "пример имени"
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
        <button class="habbit__delete">
            <img src="/images/delete.svg" alt="Удалить день">
        </button>
        `;
        element.querySelector('.habbit__delete').addEventListener('click',()=>{
            element = '';
            activeHabbit.days.splice(activeHabbit.days[index],1)
            rerender(activeHabbit.id)
        })
        page.content.habbitList.appendChild(element);
    } 
    page.content.main.querySelector('.habbit__add__day').innerText = `День ${activeHabbit.days.length + 1}`;
}




function rerender(activeHabbitId){
    const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId)
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