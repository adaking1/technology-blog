const createPage = async (event) => {
    event.preventDefault();
    document.location.replace('/create');
};



document.querySelector('#createPost').addEventListener('click', createPage);