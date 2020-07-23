const newItem = document.querySelector('.newItem');
const addBtn = document.querySelector('.addItem');
const delBtn = document.querySelectorAll('.delItem');
const list = document.querySelector('.list');
const listsPanel = document.querySelector('.listsPanel');
const newListBtn = document.querySelector('.newList');
let allLists = [];
let allItems = [];
let checkedItems = [];
const setData = (name, val) => localStorage.setItem(name, JSON.stringify(val));
const getData = (name) => JSON.parse(localStorage.getItem(name));

window.onload = () => {
    // get all lists 
    if (getData('allLists') !== null) {
        allLists = getData('allLists');
        allLists.forEach(list => {
            renderLists();
            document.querySelector('.listHolder:first-child').classList.add(list + 'Holder');
            document.querySelector('.listHolder:first-child .list').id = list;
            document.querySelector('.listHolder:first-child h3').innerText = list;
        });
    }
    // get all items
    if (getData('allItems') !== null) {
        allItems = getData('allItems');
        allItems.forEach(item => {
            renderItems(item);
        });
    }
    getChecked();
    selectedList();
};

newListBtn.onclick = () => {
    promptBox('Name your new list:', true, 'New list name');
    const promptModal = document.getElementById('promptBox');
    promptModal.classList.add('addingNewList');
}

addBtn.onclick = () => {
    if (newItem.value !== '') {
        renderItems(newItem.value);
        allItems.push(newItem.value);
        setData('allItems', allItems);
        newItem.value = '';
    }
};

newItem.onkeyup = (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        addBtn.click();
    }
};

document.onclick = (e) => {
    let clicked = e.target;
    let parent = e.target.parentNode;
    let thisText = parent.children[0].innerText;
    let i = allItems.indexOf(thisText);
    // delete item
    if (clicked.classList.contains('delItem')) {
        allItems = getData('allItems');
        allItems.splice(i, 1);
        setData('allItems', allItems);
        parent.remove();
    }
    // edit item
    if (clicked.classList.contains('editItem')) {
        editPrep(e);
    }
    if (clicked.id === 'promptOk' && document.getElementsByClassName('edit')[0] !== undefined) {
        editItem();
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
        let classOrId = promptInput.value.replace(/\s/g, '');
        renderLists();
        document.querySelector('.listHolder').classList.add(classOrId + 'Holder');
        document.querySelector('.listHolder h3').innerText = classOrId;
        document.querySelector('.listHolder .list').id = classOrId;
        allLists.push(classOrId);
        setData('allLists', allLists);
        selectedList();
    }
    // delete list 
    if (clicked.classList.contains('delList')) {
        let listName = parent.children[0].innerText;
        listName = listName.replace(/\s/g, '');
        listHolderName = listName + 'Holder';
        document.querySelector('.' + listHolderName).remove();
        allLists = getData('allLists');
        allLists = arrRmv(allLists, listName);
        setData('allLists', allLists);
    }
    // select list 
    if (clicked.classList.contains('listTitle')) {
        let lists = document.querySelectorAll('.listHolder');
        lists.forEach(list => {
            list.classList.remove('selected');
        });
        parent.classList.add('selected');
    }
};

document.ondblclick = (e) => {
    let clicked = e.target;
    if (clicked.classList.contains('itemText')) {
        editPrep(e);
    }
    if (clicked.id === 'promptOk') {
        editItem();
    }
}

const editPrep = (e) => {
    let parent = e.target.parentNode;
    let thisText = parent.children[0].innerText;
    let i = allItems.indexOf(thisText);
    parent.classList.add('edit');
    promptBox('Edit your item..', true);
    const promptInput = document.querySelector('#promptInput');
    promptInput.value = thisText;
    allItems = getData('allItems');
}

const editItem = () => {
    const edit = document.querySelector('.edit');
    let old = edit.children[0].innerText;
    let num = allItems.indexOf(old);
    allItems[num] = promptInput.value;
    let edited = checkLinks(promptInput.value);
    edit.children[0].innerHTML = edited;
    setData('allItems', allItems);
    edit.classList.remove('edit');  
}

const renderItems = (val) => {
    const li = document.createElement('li');
    val = checkLinks(val);
    li.classList.add('item');
    li.setAttribute('draggable', 'true');
    li.innerHTML = `
        <span class="itemText">`+val+`</span>
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
        <div class="listTitle">
            <h3></h3>
            <button class="delList"></button>
        </div>
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
    if(item.match(regex)) {
        item = `<a href="` + item + `" target="_blank">` + item + `</a>`;
    }
    return item;
}

const arrRmv = (arr, val) => { 
    return arr.filter( (i) => { 
        return i !== val; 
    });
}


const selectedList = () => {
    let lists = document.querySelectorAll('.listHolder');
    lists.forEach(list => {
        list.classList.remove('selected');
    });
    lists[0].classList.add('selected');
}