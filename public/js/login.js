const loginUser = async (input) => {
    input.preventDefault();
    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value.trim();

    if (username&&password) {
        const fetchCall = await fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({username, password}),
            headers: {'Content-Type': 'application/json'}
        });
        if (fetchCall.ok) {
            document.location.replace('/');
        }
        else {
            alert(fetchCall.statusText);
        }
    }
};

const signUpUser = async (input) => {
    input.preventDefault();
    const username = document.querySelector('#newUsername').value.trim();
    const email = document.querySelector('#newEmail').value.trim();
    const password = document.querySelector('#newPassword').value.trim();
    
    if (username&&email&&password) {
        console.log(JSON.stringify({username, email, password}));
        const call = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({username, email, password}),
            headers: {'Content-Type': 'application/json'}
        });
        if(call.ok) {
            document.location.replace('/');
        }
        else {
            alert(call.statusText);
        }
    }
};

document.querySelector('#login-user').addEventListener('submit', loginUser);
document.querySelector('#signup-user').addEventListener('submit', signUpUser);