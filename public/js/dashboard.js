const createPage = async (event) => {
    event.preventDefault();
    document.location.replace('/create');
};

const viewPost = async (event) => {
    const postId = event.target.getAttribute('data-postId');
    console.log(postId);
    document.location.replace(`/api/posts/${postId}`);
};

const deletePost = async (event) => {
    event.preventDefault();
    if (event.target.hasAttribute('data-postId')){
        const postId = event.target.getAttribute('data-postId');
        const postData = await fetch(`/api/posts/${postId}`, {
            method: 'DELETE'
    });
        if (postData.ok) {
            document.location.replace('/dashboard');
        }
        else {
            alert('Unable to delete!');
        }
    }
};

const addComment = async (event) => {
    event.preventDefault();
    const id = event.target.getAttribute('data-postId')
    const text = document.querySelector('#newComment').value.trim();
    if (text) {
        const call = await fetch(`/api/posts/${id}`, {
            method: 'PUT',
            body: JSON.stringify({text}),
            headers: {'Content-Type': 'application/json'}
        });
        if (call.ok) {
            document.location.replace(`/api/posts/${id}`);
        }
        else {
            alert(call.statusText);
        }
    }
};

if(document.querySelector('#newComment')){
    document.querySelector('#addCommentBtn').addEventListener('click', addComment);
}

if (document.querySelector('#deleteButton')){
    document.querySelector('#deleteButton').addEventListener('click', deletePost);
};

if (!document.querySelector('#soloPost')) {
    document.querySelectorAll('.post').forEach((post) => {
        post.addEventListener('click', viewPost);
    });
}


if (document.querySelector('#createPost')) {
    document.querySelector('#createPost').addEventListener('click', createPage);
};
