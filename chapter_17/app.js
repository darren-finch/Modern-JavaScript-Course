const channelSelector = document.querySelectorAll('.channel-selector');
const roomHistory = document.querySelectorAll('.room-history')
const messageToSent = document.querySelector('.message-to-sent');
const newName = document.querySelector('.new-name');
const btnSend = document.querySelector('.btn-send');
const btnUpdateName = document.querySelector('.btn-update-name');
const roomHistoryGeneral = document.querySelector('.room-history-general');
const roomHistoryGamming = document.querySelector('.room-history-gamming');
const roomHistoryMusic = document.querySelector('.room-history-music');
const roomHistoryNinjas = document.querySelector('.room-history-ninjas');
const chatRoomList = document.querySelector('.chatroom-list');

const now = new Date();

let userName = 'Anon';
let currentChannel = 'General';

channelSelector.forEach(button => {
    button.addEventListener('click', e => {
        e.preventDefault();
        currentChannel = button.getAttribute('button-id');
        roomHistory.forEach(room => {
            room.getAttribute('room-id') == currentChannel ?
                room.classList.remove("hide") : room.classList.add("hide");
        })
    });
});

const sendMessage = (message, id, room) => {
    let time = message.timeStamp.toDate();
    let html = `
    <li class="list-group-item" data-id="${id}">
    <div><strong>${message.userName}</strong>: ${message.message}</div>
    <div class="timestamp">${time}</div>
    </li>
    `
    switch(currentChannel){
        case "General":
            roomHistoryGeneral.innerHTML += html;
            console.log('Data added to: ' + currentChannel);
            break;

        case 'Gamming':
            roomHistoryGamming.innerHTML += html;
            console.log('Data added to: ' + currentChannel);
            break;
    
        case 'Music':
            roomHistoryMusic.innerHTML += html;
            console.log('Data added to: ' + currentChannel);
            break;
    
        case 'Ninjas':
            roomHistoryNinjas.innerHTML += html;
            console.log('Data added to: ' + currentChannel);
    }
    
}
const deleteMessage = (id) => {
    const messages = document.querySelectorAll('li');
    messages.forEach(message => {
        if(message.getAttribute('data-id') === id){
            message.remove();
        }
    });
};

// need to review all channels
roomHistory.forEach(room => {
    let temporaryRoom = currentChannel;
    db.collection(room.getAttribute('room-id')).onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
            const doc = change.doc;
            console.log(doc);
            if(change.type ==='added'){
                currentChannel = room.getAttribute('room-id');
                sendMessage(doc.data(), doc.id);
            } else if (change.type === 'removed'){
                deleteMessage(doc.id);
            }
        });
    });
    currentChannel = temporaryRoom;
});


btnSend.addEventListener('click', e => {
    e.preventDefault();
    const message = {
        userName: userName, 
        message: messageToSent.value,
        timeStamp: firebase.firestore.Timestamp.fromDate(now)
    };

    db.collection(currentChannel).add(message).then(() => {
        console.log('message added')
        console.log(currentChannel);
    }).catch(err => {
        console.log(err)
    });

});

btnUpdateName.addEventListener('click', e => {
    e.preventDefault();
    userName = newName.value;
    newName.value="";
});