const newItem = document.querySelector('.newItem');
const addBtn = document.querySelector('.addItem');
const delBtn = document.querySelectorAll('.delItem');
const list = document.querySelector('.list');
let allItems = [];

window.onload = () => {
    allItems = JSON.parse(localStorage.getItem('list-1'));
    console.log(allItems);
    for (let i = 0; i < allItems.length; i++) {
        const item = document.createElement('li');
        item.setAttribute('class', 'item');
        list.appendChild(item);
        item.innerHTML = `
            <span class="itemText"></span>
            <button class="btn delItem">Del</button>
        `;
        document.querySelector('li:last-child .itemText').innerText = allItems[i];
    }
};

addBtn.addEventListener('click', () => {
    if (newItem.value !== '') {
        const item = document.createElement('li');
        item.setAttribute('class', 'item');
        list.appendChild(item);
        item.innerHTML = `
            <span class="itemText"></span>
            <button class="btn delItem">Del</button>
        `;
        document.querySelector('li:last-child .itemText').innerText = newItem.value;
        allItems.push(newItem.value);
        localStorage.setItem('list-1', JSON.stringify(allItems));
        newItem.value = '';
    }
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delItem')) {
        e.target.parentNode.remove();
    }
});

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('itemText')) {
        e.target.parentNode.classList.add('checked');
    }
});


