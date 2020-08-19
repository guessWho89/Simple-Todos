const newItem = document.querySelector('.newItem');
const addItemBtn = document.querySelector('.addItem');
const delBtn = document.querySelectorAll('.delItem');
const list = document.querySelector('.list');
const listsPanel = document.querySelector('.listsPanel');
const newListBtn = document.querySelector('.newList');
let allLists = [];
let checkedItems = [];
let selectedList;
let selectedListItems = [];
let currentList;
let currentListItems = [];
let listToRmvFrom = [];


const setData = (name, val) => localStorage.setItem(name, JSON.stringify(val));
const getData = (name) => JSON.parse(localStorage.getItem(name));
const rmvData = (name) => localStorage.removeItem(name);


window.onload = () => {
    // get all lists 
    let collection = {};
    if (getData('allLists') !== null) {
        allLists = getData('allLists');
        allLists.forEach(list => {
            renderLists();
            let noSpaceList = list.replace(/\s/g, '');
            document.querySelector('.listHolder').classList.add(noSpaceList + 'Holder', 'selected');
            document.querySelector('.listHolder .list').id = noSpaceList;
            document.querySelector('.listHolder h3').innerText = list;
            collection[noSpaceList] = [getData(noSpaceList)];
            collection[noSpaceList][0].forEach(item => {
                renderItems(item);
            });
        });
    }
    getChecked();
    selectList();
};

newListBtn.onclick = () => {
    promptBox('Name your new list:', true, 'New list name');
    const promptModal = document.getElementById('promptBox');
    promptModal.classList.add('addingNewList');
}


addItemBtn.onclick = () => {
    if (newItem.value !== '' && getData('allLists') !== null && getData('allLists')[0] !== undefined) {
        selectedList = document.querySelector('.selected').children[1].id;
        selectedListItems = getData(selectedList);
        selectedListItems.push(newItem.value);
        setData(selectedList, selectedListItems);
        setData('selected', selectedList);
        renderItems(newItem.value);
        newItem.value = '';
    } else {
        newListBtn.click();
    }
};

newItem.onkeyup = (e) => {
    if (e.keyCode === 13) {
        e.preventDefault();
        addItemBtn.click();
    }
};

document.onclick = (e) => {
    let clicked = e.target;
    let parent = e.target.parentNode;
    let thisText = parent.children[0].innerText;
    // delete item
    if (clicked.classList.contains('delItem')) {
        currentList = parent.parentNode.id;
        currentListItems = getData(currentList); 
        listToRmvFrom = arrRmv(currentListItems, thisText);
        parent.classList.add('itemToDel');
        promptBox('Are you sure?');
        document.querySelector('#promptOk').classList.add('itemDelOk');
        document.querySelector('#promptCancel').classList.add('itemDelCancel');
    }
    if (clicked.classList.contains('itemDelOk')) {
        setData(currentList, listToRmvFrom);
        document.querySelector('.itemToDel').remove();
    }
    if (clicked.classList.contains('itemDelCancel')) {
        document.querySelector('.item').classList.remove('itemToDel');
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
        document.querySelector('.listHolder h3').innerText = promptInput.value;
        document.querySelector('.listHolder .list').id = classOrId;
        allLists.push(promptInput.value);
        setData('allLists', allLists);
        setData(classOrId, []);
        selectList();
    }
    // delete list 
    if (clicked.classList.contains('delList')) {
        let listName = parent.children[0].innerText;
        allLists = getData('allLists');
        allLists = arrRmv(allLists, listName);
        parent.parentNode.classList.add('listToDel');
        promptBox('Are you sure?');
        document.querySelector('#promptOk').classList.add('listDelOk');
        document.querySelector('#promptCancel').classList.add('listDelCancel');
    }
    if (clicked.classList.contains('listDelOk')) {
        let delList= document.querySelector('.listToDel ol').id;
        setData('allLists', allLists);
        rmvData(delList);
        document.querySelector('.listToDel').remove();
    }
    if (clicked.classList.contains('listDelCancel')) {
        document.querySelector('.listHolder').classList.remove('listToDel');
    }
    // select list 
    if (clicked.classList.contains('listTitle')) {
        let lists = document.querySelectorAll('.listHolder');
        lists.forEach(list => {
            list.classList.remove('selected');
        });
        parent.classList.add('selected');
        selectedList = document.querySelector('.selected').children[1].id
        setData('selected', selectedList);
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
    currentList = parent.parentNode.id;
    currentListItems = getData(currentList);
    let i = currentListItems.indexOf(thisText);
    parent.classList.add('edit');
    promptBox('Edit your item..', true);
    const promptInput = document.querySelector('#promptInput');
    promptInput.value = thisText;
}

const editItem = () => {
    const edit = document.querySelector('.edit');
    let old = edit.children[0].innerText;
    let num = currentListItems.indexOf(old);
    currentListItems[num] = promptInput.value;
    let edited = checkLinks(promptInput.value);
    edit.children[0].innerHTML = edited;
    setData(currentList, currentListItems);
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
        <button class="editItem">&#9998;</button>
        <button class="delItem">&times;</button>
    `;
    const newList = document.querySelector('.selected .list');
    newList.appendChild(li);
    addEventsDragAndDrop(li);
}

const renderLists = () => {
    const listHolder = document.createElement('div');
    listHolder.classList.add('listHolder');
    listHolder.innerHTML = `
        <div class="listTitle">
            <h3></h3>
            <button class="delList">&times;</button>
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


const selectList = () => {
    let lists = document.querySelectorAll('.listHolder');
    if (lists[0] !== undefined) {
        lists.forEach(list => {
            list.classList.remove('selected');
        });
        lists[0].classList.add('selected');
    }
}