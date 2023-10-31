const createPost = async () => {
    const title = document.querySelector('#newTitle').value.trim();
    const contents = document.querySelector('#newPost').value.trim();

    const response = await fetch('/create', {
        method: 'POST',
        body: JSON.stringify({title, contents}),
        headers: {'Content-Type': 'application/json'}
    });
    if (response.ok) {
        document.location.replace('/dashboard');
    }
    else {
        alert(response.statusText);
    }
};

document.querySelector('#submitPost').addEventListener('click', createPost);