const newItem = document.querySelector('.newItem');
const addBtn = document.querySelector('.addItem');
const delBtn = document.querySelectorAll('.delItem');
const list = document.querySelector('.list');
const listsPanel = document.querySelector('.listsPanel');
let allLists = [];
let allItems = [];
let checkedItems = [];
const setData = (name, val) => localStorage.setItem(name, JSON.stringify(val));
const getData = (name) => JSON.parse(localStorage.getItem(name));

const newListBtn = document.querySelector('.newList');
newListBtn.onclick = () => {
    promptBox('Name your new list:', true, 'New list name');
    const promptModal = document.getElementById('promptBox');
    promptModal.classList.add('addingNewList');
}

addBtn.onclick = () => {
    if (newItem.value !== '') {
        renderItems();
        checkLinks(newItem.value);
        setData('allItems', allItems);
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
        setData('allItems', allItems);
        parent.remove();
    }
    // edit item
    if (clicked.classList.contains('editItem')) {
        parent.classList.add('edit');
        promptBox('Edit your item..', true);
        const promptInput = document.querySelector('#promptInput');
        promptInput.value = thisText;
    }
    if (clicked.id === 'promptOk' && document.getElementsByClassName('edit')[0] !== undefined) {
        const edit = document.querySelector('.edit');
        let old = edit.children[0].innerText;
        let num = allItems.indexOf(old);
        checkLinks(promptInput.value) ?
            edit.children[0].innerHTML = `<a href="` + promptInput.value + `" target="_blank">` + promptInput.value + `</a>` :
            edit.children[0].innerText = promptInput.value;
        allItems[num] = promptInput.value;
        setData('allItems', allItems);
        edit.classList.remove('edit');
    }
    // check item
    if (clicked.classList.contains('done')) {
        let text = parent.parentNode.children[0].innerText;
        if (!clicked.checked) {
            parent.parentNode.classList.remove('checked');
            let i = checkedItems.indexOf(text);
            checkedItems.splice(i, 1);
            setData('checkedItems', checkedItems);
        } else {
            parent.parentNode.classList.add('checked')
            checkedItems.push(text);
            setData('checkedItems', checkedItems);
        }
    }
    // add new list
    if (clicked.id === 'promptOk' && document.getElementsByClassName('addingNewList')[0] !== undefined) {
        const promptInput = document.querySelector('#promptInput');
        const listHolder = document.createElement('div');
        let classOrId = promptInput.value.replace(/\s/g, '');
        listHolder.classList.add('listHolder', classOrId + 'Holder');
        const ol = `
            <h3>` + promptInput.value + `</h3>
            <ol class="list" id="` + classOrId + `">
            </ol>
        `;
        listHolder.innerHTML = ol;
        listsPanel.insertBefore(listHolder, listsPanel.firstChild);
        allLists.push(classOrId);
        setData('allLists', allLists);
    }
};

document.ondblclick = (e) => {
    let clicked = e.target;
    let parent = e.target.parentNode;
    let thisText = parent.children[0].innerText;
    let i = allItems.indexOf(thisText);
    // edit item
    if (clicked.classList.contains('itemText')) {
        parent.classList.add('edit');
        promptBox('Edit your item..', true);
        const promptInput = document.querySelector('#promptInput');
        promptInput.value = thisText;
    }
    if (clicked.id === 'promptOk') {
        const edit = document.querySelector('.edit');
        let old = edit.children[0].innerText;
        let num = allItems.indexOf(old);
        edit.children[0].innerText = promptInput.value;
        allItems[num] = promptInput.value;
        localStorage.setItem('allItems', JSON.stringify(allItems));
        edit.classList.remove('edit');
    }
}

newItem.onkeyup = (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        addBtn.click();
    }
};

const renderItems = () => {
    const li = document.createElement('li');
    li.classList.add('item');
    li.setAttribute('draggable', 'true');
    li.innerHTML = `
        <span class="itemText"></span>
        <label class="doneLabel">
            <input type="checkbox" name="done" class="done">
            <span class="checkBox"></span>
        </label>
        <button class="editItem"></button>
        <button class="delItem"></button>
    `;
    const newList = document.querySelector('.list');
    newList.appendChild(li);
    addEventsDragAndDrop(li);
}

const renderLists = () => {
    const listHolder = document.createElement('div');
    listHolder.classList.add('listHolder');
    listHolder.innerHTML = `
        <h3></h3>
        <ol class="list">
        </ol>
    `;
    listsPanel.insertBefore(listHolder, listsPanel.firstChild);
}

const getChecked = () => {
    if (getData('checkedItems') !== null) {
        checkedItems = getData('checkedItems');
        let lis = document.querySelectorAll('li');
        lis.forEach(li => {
            let item = li.children[0].innerText;
            if (checkedItems.includes(item)) {
                li.classList.add('checked');
                li.children[1].children[0].checked = true;
            }
        });
    }
}

const checkLinks = (item) => {
    const expression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    const regex = new RegExp(expression);
    let lastItemText = document.querySelector('li:last-child .itemText');
    if (item.match(regex)) {
        lastItemText.innerHTML = `<a href="` + item + `" target="_blank">` + item + `</a>`;
    }else {
        lastItemText.innerText = item;
    }
    allItems.push(item);
    newItem.value = '';
}

window.onload = () => {
    // get all lists 
    if (getData('allLists') !== null) {
        allLists = getData('allLists');
        allLists.forEach(list => {
            renderLists();
            document.querySelector('.listHolder:first-child').classList.add(list + 'Holder');
            document.querySelector('.listHolder:first-child .list').id = list;
            document.querySelector('.listHolder:first-child h3').innerText = list;
            console.log(list);
        });
    }
    // get all items
    if (getData('allItems') !== null) {
        allItems = getData('allItems');
        allItems.forEach(item => {
            renderItems();
            checkLinks(item);
        });
    }
    getChecked();
};

