let addBtn = document.querySelector('.add-btn');
let removeBtn = document.querySelector('.remove-btn');
let textAreacont = document.querySelector('.textArea-cont');
let modalCont = document.querySelector('.modal-cont');
let allPriorityColors = document.querySelectorAll('.priority-color');
let mainContainer = document.querySelector('.main-container');
let toolboxColors = document.querySelectorAll('.color');
let addTaskFlag = false;
let removeTaskFlag = false;
let lockClass = 'fa-lock';
let unlockClass = 'fa-lock-open';
let colors = ["lightpink", "lightgreen", "lightblue", "black"];
let modalPriorityColor = colors[colors.length - 1];
let ticketsArr = [];


if(localStorage.getItem('tickets')) {
    ticketsArr = JSON.parse(localStorage.getItem('tickets'));
    ticketsArr.forEach(function(ticket) {
        createTicket(ticket.ticketColor, ticket.ticketTask, ticket.ticketID);
    })
}

for(let i = 0; i < toolboxColors.length; i++) {
    toolboxColors[i].addEventListener('click', function() {
        let selectedToolBoxColor = toolboxColors[i].classList[0];
        let filteredTickets = ticketsArr.filter(function(ticket) {
            return selectedToolBoxColor === ticket.ticketColor
        })
        let allTickets = document.querySelectorAll('.ticket-cont');
        for(let i = 0; i< allTickets.length; i++) {
            allTickets[i].remove();
        }

        filteredTickets.forEach(function(filteredTicket) {
            createTicket(filteredTicket.ticketColor, filteredTicket.ticketTask, filteredTicket.ticketID);
        })
    })

    toolboxColors[i].addEventListener('dblclick', function() {
        let allTickets = document.querySelectorAll('.ticket-cont');
        for(let i = 0; i< allTickets.length; i++) {
            allTickets[i].remove();
        }

        ticketsArr.forEach(function(ticketsObj) {
            createTicket(ticketsObj.ticketColor, ticketsObj.ticketTask, ticketsObj.ticketID);
        })
    })
}

/** add button functionality */
addBtn.addEventListener('click', function() {
    addTaskFlag = !addTaskFlag;
    if(addTaskFlag === true) {
        // flex
        modalCont.style.display = 'flex';
    } else {
        // none
        modalCont.style.display = 'none';
    }
});

/** remove button functionality */
removeBtn.addEventListener('click', function() {
    removeTaskFlag = !removeTaskFlag;
    if(removeTaskFlag === true) {
        // flex
        alert("Remove button activated");
        removeBtn.style.color = 'red';
    } else {
        // none
        removeBtn.style.color = 'white';
    }
});

/** code to manage active class in modal box */
allPriorityColors.forEach(function(colorElem) {
    colorElem.addEventListener('click', function() {
        allPriorityColors.forEach(function(priorityColorElem) {
            priorityColorElem.classList.remove('active');
        })
        colorElem.classList.add('active');
        modalPriorityColor = colorElem.classList[0];
    })
})

modalCont.addEventListener('keydown', function(e) {
    let key = e.key;
    if(key === 'Enter') {
        createTicket(modalPriorityColor, textAreacont.value);
        modalCont.style.display = 'none';
        textAreacont.value = '';
    }
})

function createTicket(ticketColor, ticketTask, ticketID) {
    let id = ticketID  || shortid();
    let ticketCont = document.createElement('div');
    ticketCont.setAttribute('class', 'ticket-cont');
    ticketCont.innerHTML = `
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">${id}</div>
        <div class="task-area">${ticketTask}</div>
        <div class="ticket-lock">
            <i class="fa-solid fa-lock"></i>
        </div>
    `
    mainContainer.appendChild(ticketCont);
    handleLock(ticketCont, id);
    handleRemove(ticketCont, id);
    if(!ticketID) {
        ticketsArr.push({ticketColor, ticketTask, ticketID: id});
        localStorage.setItem('tickets', JSON.stringify(ticketsArr));
    }
    // {ticketColor: ticketColor, ticketTask: ticketTask, ticketID: id}
    console.log(ticketsArr);
}

function handleLock(ticket, id) {
    let ticketLockElem = ticket.querySelector('.ticket-lock');
    let ticketLockIcon = ticketLockElem.children[0];
    let ticketTaskArea = ticket.querySelector('.task-area');

    ticketLockIcon.addEventListener('click', function() {
        let ticketIdx = getTicketIdx(id);
        if(ticketLockIcon.classList.contains(lockClass)) {
            ticketLockIcon.classList.add(unlockClass);
            ticketLockIcon.classList.remove(lockClass);
            ticketTaskArea.setAttribute('contenteditable', true);
            alert("You can write more text in ticket number :"+id)
            alert("After writting, click on the lock icon to save the changes")
        } else {
            ticketLockIcon.classList.add(lockClass);
            ticketLockIcon.classList.remove(unlockClass);
            ticketTaskArea.setAttribute('contenteditable', false);
        }
        ticketsArr[ticketIdx].ticketTask = ticketTaskArea.innerText;
        localStorage.setItem('tickets', JSON.stringify(ticketsArr));
    })
}


function handleRemove(ticket, id) {
    ticket.addEventListener('click', function() {
        if(!removeTaskFlag) return;
        if(confirm("Are you sure you want to delete the ticket number : "+id)){
            ticket.remove();
            let idx = getTicketIdx(id);
            let deletedElm = ticketsArr.splice(idx, 1);
            localStorage.setItem('tickets', JSON.stringify(ticketsArr));
            console.log(deletedElm);
        }       
    })
}

function getTicketIdx(id) {
    let ticketID = ticketsArr.findIndex(function(ticketObj) {
        return ticketObj.ticketID === id
    });
    return ticketID;
}

