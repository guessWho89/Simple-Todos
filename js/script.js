const newItem = document.querySelector('.newItem');
const addBtn = document.querySelector('.addItem');
const delBtn = document.querySelectorAll('.delItem');
const list = document.querySelector('.list');
let allItems = [];
let checkedItems = [];

const render = () => {
    const li = document.createElement('li');
    li.classList.add('item', 'draggable');
    li.setAttribute('draggable', 'true');
    li.innerHTML = `
        <span class="itemText"></span>
        <button class="btn editItem">&#9998;</button>
        <button class="btn delItem">&#128465;</button>
    `;
    list.appendChild(li);
    addEventsDragAndDrop(li);
}

window.onload = () => {
    // get all items
    if (localStorage.getItem('allItems') !== null) {
        allItems = JSON.parse(localStorage.getItem('allItems'));
        allItems.forEach(item => {
            render();
            document.querySelector('li:last-child .itemText').innerText = item;
        });
    }
    // get checked items
    if (localStorage.getItem('checkedItems') !== null) {
        checkedItems = JSON.parse(localStorage.getItem('checkedItems'));
        let lis = document.querySelectorAll('li');
        lis.forEach(li => {
            let item = li.children[0].innerText;
            if (checkedItems.includes(item)) {
                li.classList.add('checked');
            }
        });
    }
};

addBtn.onclick = () => {
    if (newItem.value !== '') {
        render();
        document.querySelector('li:last-child .itemText').innerText = newItem.value;
        allItems.push(newItem.value);
        localStorage.setItem('allItems', JSON.stringify(allItems));
        newItem.value = '';
    }
};

document.onclick = (e) => {
    let clicked = e.target;
    let parent = e.target.parentNode;
    let thisText = parent.children[0].innerText;
    let i = allItems.indexOf(thisText);
    // delete item
    if (clicked.classList.contains('delItem')) {
        allItems.splice(i, 1);
        localStorage.setItem('allItems', JSON.stringify(allItems));
        parent.remove();
    }
    // edit item
    if (clicked.classList.contains('editItem')) {
        parent.classList.add('edit');
        promptBox('Edit your item..', true);
        const promptInput = document.querySelector('#promptInput');
        promptInput.value = thisText;
    }
    if (clicked.id === 'promptOk') {
        const edit = document.querySelector('.edit');
        let old = edit.children[0].innerText;
        let num = allItems.indexOf(old);
        edit.children[0].innerText = promptVal;
        allItems[num] = promptVal;
        localStorage.setItem('allItems', JSON.stringify(allItems));
        edit.classList.remove('edit');
    }
    // check item
    if (clicked.classList.contains('itemText')) {
        let text = clicked.innerText;
        if (parent.classList.contains('checked')) {
            parent.classList.remove('checked');
            let i = checkedItems.indexOf(text);
            checkedItems.splice(i, 1);
            localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
        } else {
            parent.classList.add('checked');
            checkedItems.push(text);
            localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
        }
    }
};


