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
    },
    popUp:{
        cover: document.getElementById('add-habbit-popup'),
        iconField: document.querySelector('.popup__form input[name="icon"]'),
        form: document.querySelector('popup__form'),
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
    const data = validateAndGetFormData(event.target,['comment'])
    if(!data){
        return;
    }
    habbits = habbits.map(singleHabbit =>{
        if(singleHabbit.id === globalActiveHabbitId){
            return {
                ...singleHabbit,
                days: singleHabbit.days.concat({comment:data.comment}),
            }
            
        }
        return singleHabbit;
    })
    resetFormData(event.target, ['comment'])
    rerender(globalActiveHabbitId);
    saveData();
}

function resetFormData(form,fields){
    for(let field of fields){
        form[field].value = ''
    }
}

function validateAndGetFormData(form, fields){
    let res = {};
    const data = new FormData(form);
    for(let field of fields){
        const fieldValue = data.get(field);
        form[field].classList.remove('error');
        if(!fieldValue){
            form[field].classList.add('error');
        }
        res[field] = fieldValue;
    }
    let isValid = true;
    for(let field of fields){
        if(!res[field]){
            isValid = false;
        }
    }
    if(!isValid){
        return
    }
    return res;
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
function togglePopUp(){
    if(page.popUp.cover.classList.contains('cover_hidden')){
        page.popUp.cover.classList.remove('cover_hidden');
    }
    else{
        page.popUp.cover.classList.add('cover_hidden');
    }
}

function setIcon(context,icon){
    page.popUp.iconField.value = icon;
    const activeIcon = page.popUp.cover.querySelector('.icon_active');
    if(activeIcon){
        activeIcon.classList.remove('icon_active');
    }
    context.classList.add('icon_active');   
}

function addHabit(event){
    event.preventDefault();
    let data = validateAndGetFormData(event.target,["icon","target","name"]);
    if(!data){
        return
    }
    const maxId = habbits.reduce((acc,habbit)=> acc > habbit.id ? acc : habbit.id,0) + 1;
    habbits.push({
        id: maxId,
        icon: data.icon,
        name: data.name,
        target: data.target,
        days: [],
    })
    saveData();
    togglePopUp();
    rerender(maxId);
    resetFormData(event.target,["icon","target","name"]);
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
    document.location.replace(document.location.pathname + '#' + `${globalActiveHabbitId}`);
    rerenderMenu(activeHabbit);
    rerenderHeader(activeHabbit)
    rerenderContent(activeHabbit);
}

        // init // 

(() => {
    loadData();
    const urlId = Number(document.location.hash.replace('#',''));
    const urlHabbit = habbits.find(habbit => habbit.id === urlId);
    if(urlHabbit){
        rerender(urlHabbit.id);
    }
    else{
        rerender(habbits[0].id);
    }
})()