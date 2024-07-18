const input = document.querySelector('.form__input');
const box = document.querySelector('.box');
const menu = document.querySelector('.list');
const listChild = menu.children;
let repos;

input.addEventListener(
    'keyup',
    debounce(function () {
        getRequest(input.value);
    }, 400)
);

async function getRequest(value) {
    try {
        if (value.trim() === '') return deletElem();

        deletElem();
        const data = await fetch(
            `https://api.github.com/search/repositories?q=${value}`
        );
        const result = await data.json();
        repos = result.items.slice(0, 5);
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
        menu.appendChild(list);
    });
}

function deletElem() {
    Array.from(listChild).forEach((item) => {
        item.remove();
    });
}

menu.addEventListener('click', (evt) => {
    const name = evt.target.textContent;
    const elem = repos.find((item) => item.name === name);
    fillBox(elem);
});

function fillBox(elem) {
    const { name, owner, stargazers_count } = elem;

    const itemBox = document.createElement('div');
    itemBox.classList.add('box__item');
    itemBox.insertAdjacentHTML(
        'beforeend',
        `<div class="box__info">
            <div class="box__name">Name: ${name}</div>
            <div class="box__owner">Owner: ${owner.login}</div>
            <div class="box__stars">Stars: ${stargazers_count}</div>
        </div>`
    );

    const btn = document.createElement('button');
    btn.classList.add('box__btn');
    itemBox.appendChild(btn);

    btn.addEventListener('click', () => {
        itemBox.remove();
    });
    box.appendChild(itemBox);
    input.value = '';
    deletElem();
}
