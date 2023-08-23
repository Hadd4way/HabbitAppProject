'use strict'

const HABBIT_KEY = 'HABBIT_KEY';

let habbits = [];

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
(() => {
    loadData();
})()