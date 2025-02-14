let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const music = document.getElementById('background-music');
const navigation = document.querySelector('.navigation');
const prevButton = document.getElementById('prev-slide');
const nextButton = document.getElementById('next-slide');

function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
        if (i === index) {
            slide.style.opacity = 1;
            slide.style.transform = 'translateY(0)';
        } else {
            slide.style.opacity = 0;
            slide.style.transform = 'translateY(20px)';
        }
    });
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
    resetArrowTimer();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
    resetArrowTimer();
}

function openEnvelope() {
    const envelope = document.querySelector('.envelope');
    envelope.classList.add('open');
}

window.onload = function() {
    music.play();
    startArrowTimer();
};

function updateTimeCounter() {
    const startDate = new Date(2023, 0, 8);
    const now = new Date();
    const diff = now - startDate;

    const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
    const months = Math.floor((diff % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById('time-counter').innerText = 
        `${years} lata, ${months} miesiące, ${days} dni, ${hours} godzin, ${minutes} minut, ${seconds} sekund`;
}

setInterval(updateTimeCounter, 1000);

let arrowTimer;
function startArrowTimer() {
    arrowTimer = setTimeout(() => {
        navigation.classList.add('visible');
    }, 3000);
}

function resetArrowTimer() {
    navigation.classList.remove('visible');
    clearTimeout(arrowTimer);
    startArrowTimer();
}

prevButton.addEventListener('click', prevSlide);
nextButton.addEventListener('click', nextSlide);

showSlide(currentSlide);

document.querySelectorAll('.agent').forEach(agent => {
    agent.addEventListener('mouseenter', () => {
        agent.querySelector('img').style.transform = 'scale(1.1) rotate(5deg)';
    });
    agent.addEventListener('mouseleave', () => {
        agent.querySelector('img').style.transform = 'scale(1) rotate(0)';
    });
});

const holandiaImages = document.querySelectorAll('.holandia-image');
let currentHolandiaImage = 0;

function showHolandiaImage(index) {
    holandiaImages.forEach((img, i) => {
        img.style.display = i === index ? 'block' : 'none';
    });
}

function nextHolandiaImage() {
    currentHolandiaImage = (currentHolandiaImage + 1) % holandiaImages.length;
    showHolandiaImage(currentHolandiaImage);
}

function prevHolandiaImage() {
    currentHolandiaImage = (currentHolandiaImage - 1 + holandiaImages.length) % holandiaImages.length;
    showHolandiaImage(currentHolandiaImage);
}

document.getElementById('next-slide').addEventListener('click', () => {
    if (currentSlide === 5) { // Slajd 6 to Holandia dump
        nextHolandiaImage();
    }
});

document.getElementById('prev-slide').addEventListener('click', () => {
    if (currentSlide === 5) { // Slajd 6 to Holandia dump
        prevHolandiaImage();
    }
});

const canvas = document.getElementById('labiryntCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const player = { x: 1, y: 1, coins: 0 };
const exit = { x: 30, y: 30, active: false };
let coins = [];

const maze = Array(32).fill().map(() => Array(32).fill(1));

// Tworzenie labiryntu algorytmem DFS
function generateMaze() {
    const stack = [{ x: 1, y: 1 }];
    maze[1][1] = 0;
    const directions = [
        { x: 0, y: -2 }, { x: 0, y: 2 }, { x: -2, y: 0 }, { x: 2, y: 0 }
    ];

    while (stack.length > 0) {
        const current = stack[stack.length - 1];
        const shuffledDirs = directions.sort(() => Math.random() - 0.5);
        let moved = false;
        
        for (const dir of shuffledDirs) {
            const nx = current.x + dir.x;
            const ny = current.y + dir.y;
            if (nx > 0 && nx < 31 && ny > 0 && ny < 31 && maze[ny][nx] === 1) {
                maze[ny][nx] = 0;
                maze[current.y + dir.y / 2][current.x + dir.x / 2] = 0;
                stack.push({ x: nx, y: ny });
                moved = true;
                break;
            }
        }
        if (!moved) stack.pop();
    }

    // Zapewnienie, że wyjście nie jest zablokowane
    maze[30][30] = 0;
    maze[29][30] = 0;
    maze[30][29] = 0;
}

generateMaze();
maze[1][1] = 0;

// Generowanie losowych monet na dostępnych ścieżkach
function placeCoins() {
    coins = [];
    let placed = 0;
    while (placed < 5) {
        let x = Math.floor(Math.random() * 30) + 1;
        let y = Math.floor(Math.random() * 30) + 1;
        if (maze[y][x] === 0 && !(x === 1 && y === 1) && !(x === 30 && y === 30)) {
            coins.push({ x, y, collected: false });
            placed++;
        }
    }
}

placeCoins();

function drawMaze() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < 32; y++) {
        for (let x = 0; x < 32; x++) {
            if (maze[y][x] === 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
            }
        }
    }
    coins.forEach(coin => {
        if (!coin.collected) {
            ctx.fillStyle = 'gold';
            ctx.beginPath();
            ctx.arc(coin.x * gridSize + 10, coin.y * gridSize + 10, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    });
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x * gridSize, player.y * gridSize, gridSize, gridSize);
    if (exit.active) {
        ctx.fillStyle = 'green';
        ctx.fillRect(exit.x * gridSize, exit.y * gridSize, gridSize, gridSize);
    }
}

function checkCollision(x, y) {
    return maze[y] && maze[y][x] === 1;
}

document.addEventListener('keydown', (e) => {
    let newX = player.x;
    let newY = player.y;
    if (e.key === 'ArrowUp') newY--;
    if (e.key === 'ArrowDown') newY++;
    if (e.key === 'ArrowLeft') newX--;
    if (e.key === 'ArrowRight') newX++;
    if (!checkCollision(newX, newY)) {
        player.x = newX;
        player.y = newY;
    }
    coins.forEach(coin => {
        if (!coin.collected && coin.x === player.x && coin.y === player.y) {
            coin.collected = true;
            player.coins++;
        }
    });
    if (player.coins === 5) {
        exit.active = true;
    }
    if (exit.active && player.x === exit.x && player.y === exit.y) {
        document.getElementById('message').innerHTML = `
            <div style="text-align: center; font-size: 24px; font-weight: bold; background: white; padding: 20px; border: 3px solid black;">
                <h2>GRATULACJE DUPO!</h2>
                <p>Oto Twoje nagrody:</p>
                <ul>
                    <li>Słucham się Asi cały dzień</li>
                    <li>Asia wybiera grę (3 użycia)</li>
                    <li>Kupuję Ci jedzonko</li>
                </ul>
            </div>`;
    }
    drawMaze();
});

drawMaze();
