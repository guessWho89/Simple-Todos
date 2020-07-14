const newItem = document.querySelector('.newItem');
const addBtn = document.querySelector('.addItem');
const delBtn = document.querySelectorAll('.delItem');
const list = document.querySelector('.list');
let allItems = [];


window.onload = () => {
    if (localStorage.getItem('list-1') !== null) {
        allItems = JSON.parse(localStorage.getItem('list-1'));
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
        localStorage.setItem('list-1', JSON.stringify(allItems));
        newItem.value = '';
    }
};

document.onclick = (e) => {
    const clicked = e.target;
    const parent = e.target.parentNode;
    // delete item
    if (clicked.classList.contains('delItem')) {
        let deleted = parent.children[0].innerText;
        let i = allItems.indexOf(deleted);
        allItems.splice(i, 1);
        localStorage.setItem('list-1', JSON.stringify(allItems));
        parent.remove();
    }
    // check item
    if (clicked.classList.contains('itemText')) {
        parent.classList.contains('checked') ?
            parent.classList.remove('checked') :
            parent.classList.add('checked');
    }
};

