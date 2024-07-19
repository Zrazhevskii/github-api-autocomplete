const input = document.querySelector('.form__input');
const box = document.querySelector('.box');
const menu = document.querySelector('.list');
const listChild = menu.children;
let fragment = document.createDocumentFragment();
let repos;

input.addEventListener(
    'input',
    debounce(function (evt) {
        // console.log(evt.target.value);
        getRequest(evt.target.value, 5);
    }, 400)
);

async function getRequest(value, limit) {
    try {
        if (value.trim() === '') return deletElem();

        deletElem();
        const data = await fetch(
            `https://api.github.com/search/repositories?q=${value}&per_page=${limit}`
        );
        const result = await data.json();
        repos = result.items;
        return createElem(repos);
    } catch {
        (err) => console.log(err);
    }
}

function debounce(fn, timer) {
    let result;

    function wrapper(...arguments) {
        clearTimeout(result);
        result = setTimeout(() => {
            fn.apply(this, arguments);
        }, timer);
    }
    return wrapper;
}

function createElem(repos) {
    repos.forEach((item) => {
        let list = document.createElement('li');
        list.classList.add('list__item');
        list.textContent = item.name;
        fragment.appendChild(list);
    });
    menu.appendChild(fragment);
}

function deletElem() {
    Array.from(listChild).forEach((item) => {
        item.remove();
    });
}

menu.addEventListener('click', (evt) => {
    const name = evt.target.textContent;
    const elem = repos.find((item) => item.name === name);
    createBox(elem);
});

function createBox(elem) {
    const itemBox = document.createElement('div');
    itemBox.classList.add('box__item');

    itemBox.append(createItemInfo(elem));

    const btn = document.createElement('button');
    btn.classList.add('box__btn');
    itemBox.append(btn);

    btn.addEventListener('click', () => {
        itemBox.remove();
    });

    box.append(itemBox);

    input.value = '';
    deletElem();
}

function createItemInfo({ name, owner, stargazers_count }) {
    const itemInfo = document.createElement('div');
    itemInfo.classList.add('box__info');

    const nameInfo = document.createElement('div');
    nameInfo.textContent = 'Name: ' + name;

    const ownerInfo = document.createElement('div');
    ownerInfo.textContent = 'Owner: ' + owner.login;

    const starsInfo = document.createElement('div');
    starsInfo.textContent = 'Stars: ' + stargazers_count;

    itemInfo.append(nameInfo);
    itemInfo.append(ownerInfo);
    itemInfo.append(starsInfo);
    return itemInfo;
}
