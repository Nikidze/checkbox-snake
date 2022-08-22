const snake = [];
let apples = [];
const fields = [];

const size = 10;
const speed = 1000;

const DIR_TOP = 0;
const DIR_RIGHT = 1;
const DIR_BOTTOM = 2;
const DIR_LEFT = 3;

let direction = DIR_BOTTOM;

const fieldId = (i, j) => 'f_' + i + "_" + j;

const setFieldChecked = (i, j, color = "blue") => {
    fields[i][j].checked = true;
    fields[i][j].style.accentColor = color;
};

const random = (max) => Math.floor(Math.random() * max);

const uncheckAllFields = () => {
    fields.forEach(string => {
        string.forEach(field => {
            field.checked = false;
        })
    })
}

const createField = (i, j) => {
    const field = document.createElement('input');
    field.type = 'checkbox';
    field.name = fieldId(i, j);
    return field;
}

const initField = () => {
    const playField = document.getElementById('app');
    for (let i = 0; i < size; ++i) {
        const string = document.createElement('div');
        for (let j = 0; j < size; ++j) {
            const field = createField(i, j);
            string.appendChild(field);
        }
        fields.push(Array.from(string.children));
        playField.appendChild(string);
    }
    console.log(fields);
}

const initSnake = () => {
    snake.push(
        [0, 0],
        [0, 1]
    );
}

const moveHead = () => {
    const index = snake.length - 1;
    const snakeEl = snake[index];
    switch (direction) {
        case DIR_TOP:
            snake[index] = [snakeEl[0] - 1, snakeEl[1]];
            break;
        case DIR_RIGHT:
            snake[index] = [snakeEl[0], snakeEl[1] + 1];
            break;
        case DIR_BOTTOM:
            snake[index] = [snakeEl[0] + 1, snakeEl[1]];
            break;
        case DIR_LEFT:
            snake[index] = [snakeEl[0], snakeEl[1] - 1];
            break;
    }
    if (snake[index][0] == size) {
        snake[index][0] = 0;
    }
    if (snake[index][1] == size) {
        snake[index][1] = 0;
    }
    if (snake[index][0] == -1) {
        snake[index][0] = size - 1;
    }
    if (snake[index][1] == -1) {
        snake[index][1] = size - 1;
    }
}

const moveSnake = () => {
    const lastIndex = snake.length - 1;
    snake.forEach((snakeEl, index) => {
        if (index == lastIndex) {
            moveHead();
        } else {
            snake[index] = snake[index + 1];
        }
        setFieldChecked(...snakeEl);
    })
}

const spawnApple = () => {
    if (random(10) > 5) {
        const apple = [random(size), random(size)];
        if (!snake.includes(apple) && !apples.includes(apple)) {
            apples.push(apple);
        }
    }
}

const manipApples = () => {
    let snakeHead = snake[snake.length - 1];
    switch (direction) {
        case DIR_TOP:
            snakeHead = [snakeHead[0] - 1, snakeHead[1]];
            break;
        case DIR_RIGHT:
            snakeHead = [snakeHead[0], snakeHead[1] + 1];
            break;
        case DIR_BOTTOM:
            snakeHead = [snakeHead[0] + 1, snakeHead[1]];
            break;
        case DIR_LEFT:
            snakeHead = [snakeHead[0], snakeHead[1] - 1];
            break;
    }
    spawnApple();
    apples = apples.filter((apple) => {
        if (apple[0] == snakeHead[0] && apple[1] == snakeHead[1]) {
            snake.push(snakeHead);
            return false;
        }
        setFieldChecked(...apple, "red");
        return true;
    })
}

const gameLoop = () => {
    uncheckAllFields();
    manipApples();
    moveSnake();
}

const runGameLoop = () => setInterval(gameLoop, speed);

window.onload = () => {
    console.log("init game");
    initField();
    initSnake();
    runGameLoop();

    document.addEventListener('keydown', function (event) {
        if (event.code == 'ArrowLeft') {
            direction = DIR_LEFT;
        }
        if (event.code == 'ArrowUp') {
            direction = DIR_TOP;
        }
        if (event.code == 'ArrowDown') {
            direction = DIR_BOTTOM;
        }
        if (event.code == 'ArrowRight') {
            direction = DIR_RIGHT;
        }
    });
};