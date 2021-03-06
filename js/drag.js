function dragStart(e) {
    this.style.opacity = '0.4';
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
};

function dragEnter(e) {
    this.classList.add('over');
}

function dragLeave(e) {
    e.stopPropagation();
    this.classList.remove('over');
}

function dragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function dragDrop(e) {
    if (dragSrcEl != this) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer.getData('text/html');
        reorderSave();
    }
    return false;
}

function dragEnd(e) {
    let lis = document.querySelectorAll('li');
    lis.forEach(li => {
        let item = li.children[0].innerText;
        li.children[1].children[0].checked = false;
        li.classList.remove('over', 'checked');
        if (checkedItems.includes(item)) {
            li.classList.add('checked');
            li.children[1].children[0].checked = true;
        }
    });
    this.style.opacity = '1';
}

function addEventsDragAndDrop(el) {
    el.addEventListener('dragstart', dragStart, false);
    el.addEventListener('dragenter', dragEnter, false);
    el.addEventListener('dragover', dragOver, false);
    el.addEventListener('dragleave', dragLeave, false);
    el.addEventListener('drop', dragDrop, false);
    el.addEventListener('dragend', dragEnd, false);
}

// let lis = document.querySelectorAll('.items');
// lis.forEach(li => {
//     addEventsDragAndDrop(li);
// });

function reorderSave() {
    let lis = document.querySelectorAll('li');
    let reorderedItems = [];
    lis.forEach(li => {
        let item = li.children[0].innerText;
        reorderedItems.push(item);
    });
    allItems = reorderedItems;
    localStorage.setItem('allItems', JSON.stringify(allItems));
    getChecked();
}


function touchHandler(event) {
    var touch = event.changedTouches[0];
    var simulatedEvent = document.createEvent("MouseEvent");
        simulatedEvent.initMouseEvent({
        touchstart: "mousedown",
        touchmove: "mousemove",
        touchend: "mouseup"
    }[event.type], true, true, window, 1,
        touch.screenX, touch.screenY,
        touch.clientX, touch.clientY, false,
        false, false, false, 0, null);
    touch.target.dispatchEvent(simulatedEvent);
    event.preventDefault();
}

function init() {
    document.addEventListener("touchstart", touchHandler, true);
    document.addEventListener("touchmove", touchHandler, true);
    document.addEventListener("touchend", touchHandler, true);
    document.addEventListener("touchcancel", touchHandler, true);
}