const snake = [];
let apples = [];
const fields = [];
let score = 0;

let size = 10;
let speed = 400;

let scoreView;

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

const getSnakeHead = () => {
    return snake[snake.length - 1];
}

const createField = (i, j) => {
    const field = document.createElement('input');
    field.type = 'checkbox';
    field.name = fieldId(i, j);
    return field;
}

const initField = () => {
    const playField = document.getElementById('game');
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
    const snakeEl = getSnakeHead();
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
    if (random(50) > 45) {
        const apple = [random(size), random(size)];
        if (!snake.includes(apple) && !apples.includes(apple)) {
            apples.push(apple);
        }
    }
}

const updateScore = () => {
    score++;
    scoreView.innerText = score;
}

const manipApples = () => {
    let snakeHead = getSnakeHead();
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
            updateScore();
            return false;
        }
        setFieldChecked(...apple, "red");
        return true;
    })
}

const lost = () => {
    alert("Your score: " + score);
    location.reload();
}

const checkDeath = () => {
    const head = getSnakeHead();
    const headIndex = snake.length - 1
    snake.some((element, index) => {
        if (index != headIndex) {
            if (element[0] == head[0] && element[1] == head[1]) {
                lost();
                return true;
            }
        }
        return false;
    })
}

const gameLoop = () => {
    uncheckAllFields();
    manipApples();
    moveSnake();
    checkDeath();
}

const runGameLoop = () => setInterval(gameLoop, 1000 / speed);

const getSettings = () => {
    size = Number(document.getElementById('size').value);
    speed = Number(document.getElementById('speed').value);
}

const run = () => {
    getSettings();
    scoreView = document.getElementById('score');
    initField();
    initSnake();
    runGameLoop();

    document.addEventListener('keydown', function (event) {
        if (event.code == 'ArrowLeft' && direction != DIR_RIGHT) {
            direction = DIR_LEFT;
        }
        if (event.code == 'ArrowUp' && direction != DIR_BOTTOM) {
            direction = DIR_TOP;
        }
        if (event.code == 'ArrowDown' && direction != DIR_TOP) {
            direction = DIR_BOTTOM;
        }
        if (event.code == 'ArrowRight' && direction != DIR_LEFT) {
            direction = DIR_RIGHT;
        }
    });
}

window.onload = () => {
    document.getElementById('run').onclick = run
};