const newItem = document.querySelector('.newItem');
const addBtn = document.querySelector('.addItem');
const delBtn = document.querySelectorAll('.delItem');
const list = document.querySelector('.list');
let allItems = [];
let checkedItems = [];

window.onload = () => {
    // get all items
    if (localStorage.getItem('allItems') !== null) {
        allItems = JSON.parse(localStorage.getItem('allItems'));
        allItems.forEach(item => {
            const li = document.createElement('li');
            li.setAttribute('class', 'item');
            list.appendChild(li);
            li.innerHTML = `
                <span class="itemText"></span>
                <button class="btn delItem">Del</button>
            `;
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
        const item = document.createElement('li');
        item.setAttribute('class', 'item');
        list.appendChild(item);
        item.innerHTML = `
            <span class="itemText"></span>
            <button class="btn delItem">Del</button>
        `;
        document.querySelector('li:last-child .itemText').innerText = newItem.value;
        allItems.push(newItem.value);
        localStorage.setItem('allItems', JSON.stringify(allItems));
        newItem.value = '';
    }
};

document.onclick = (e) => {
    let clicked = e.target;
    let parent = e.target.parentNode;
    // delete item
    if (clicked.classList.contains('delItem')) {
        let deleted = parent.children[0].innerText;
        let i = allItems.indexOf(deleted);
        allItems.splice(i, 1);
        localStorage.setItem('allItems', JSON.stringify(allItems));
        parent.remove();
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

