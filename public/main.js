async function getByUUIDOrIDOrAll(type) {
    const uuid = document.getElementById('getPeopleBy').value;
    const winID = document.getElementById('getWinnersBy').value;
    const useID = document.getElementById('getUsersBy').value;
    let url = '';
    switch (type) {
        case 'People':
            url = `/api/V0.1/query/${uuid ? uuid : 'all'}`;
            break;
        case 'Winners':
            url = `/api/V0.1/winner/${winID ? winID : 'all'}`;
            break;
        case 'Users':
            url = `/api/V0.1/user/${useID ? useID : 'all'}`;
            break;
        default:
            break;
    }
    await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(async (res) => addResponseToNode(await res.text()));
}

async function createByType() {
    const type = document.getElementById('type').value;
    let url = '';
    switch (type) {
        case 'People':
            url = `/api/V0.1/query/create`;
            break;
        case 'Winners':
            url = `/api/V0.1/winner/create`;
            break;
        case 'Users':
            url = `/api/V0.1/user/create`;
            break;
        default:
            break;
    }
    await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(async (res) => addResponseToNode(await res.text()));
}

async function patchPersonData() {
    const uuid = document.getElementById('patchUUID').value;
    const name = document.getElementById('patchName').value;
    const role = document.getElementById('patchRole').value;
    const gender = document.getElementById('patchGender').value;
    const picture = document.getElementById('patchPicture').value;
    const email = document.getElementById('patchEmail').value;
    await fetch(`/api/V0.1/query/${uuid}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: name,
            role: role,
            gender: gender,
            picture: picture,
            email: email,
        }),
    }).then(async (res) => addResponseToNode(await res.text()));
}

async function deleteFromDB() {
    const id = document.getElementById('deleteID').value;
    const sk = document.querySelector('[property="env:UUID"]').content;
    await fetch(`/api/V0.1/query/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            dbKey: sk,
        }),
    }).then(async (res) => addResponseToNode(await res.text()));
}

function addResponseToNode(response) {
    let el;
    try {
        response = JSON.parse(response)
        el = document.getElementById('errors');
        el.innerHTML = "";
        el = document.getElementById('results');
        el.innerHTML = "";
    } catch (error) {
        response = `Error: ${error.toString()}, When JSON.parse of  : ${response}`;
        el = document.getElementById('results');
        el.innerHTML = "";
        el = document.getElementById('errors');
        el.innerHTML = "";
    }
    const linebreak = document.createElement('br');
    el.appendChild(linebreak);
    if (typeof (response) == "string") {
        el.appendChild(document.createTextNode(response));
    } else if (response[0] === undefined) {
        el.appendChild(document.createElement('ul'));
        const node = document.createElement('li');
        node.innerHTML = `Respone from the server: ${JSON.stringify(response)}`;
        el.appendChild(node);
        el.appendChild(document.createElement('/ul'));
    } else {
        el.appendChild(document.createElement('ul'));
        for (let i = 0; i < response.length; i++) {
            const node = document.createElement('li');
            node.innerHTML = JSON.stringify(response[i]);
            el.appendChild(node);
        }
        el.appendChild(document.createElement('/ul'));
    }
}