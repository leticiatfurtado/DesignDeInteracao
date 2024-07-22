document.addEventListener('DOMContentLoaded', () => {
    const elements = {
        gameContainer: document.getElementById('game-container'),
        player: document.getElementById('player'),
        startButton: document.getElementById('start-button'),
        restartButton: document.getElementById('restart-button'),
        scoreDisplay: document.getElementById('score'),
        recordDisplay: document.getElementById('record'),
        captureSound: document.getElementById('capture-sound'),
        gameOverMusic: document.getElementById('game-over-music'),
        gameOverMessage: document.getElementById('game-over-message'),
    };

    let score = 0;
    let record = parseInt(localStorage.getItem('record'), 10) || 0;
    let gameInterval;
    let pieceInterval;

    elements.recordDisplay.textContent = `Recorde: ${record}`;

    function startGame() {
        document.querySelectorAll('.pecas').forEach(piece => piece.remove());
        score = 0;
        elements.scoreDisplay.textContent = `Pontuação: ${score}`;
        elements.startButton.style.display = 'none';
        elements.restartButton.style.display = 'none';
        elements.gameOverMessage.style.display = 'none';
        elements.player.style.left = '50%';
        gameInterval = setInterval(updateGame, 20);
        pieceInterval = setInterval(createPiece, 1000);
    }

    function endGame() {
        clearInterval(gameInterval);
        clearInterval(pieceInterval);
        elements.startButton.style.display = 'none';
        elements.restartButton.style.display = 'block';
        elements.gameOverMessage.textContent = 'FIM DE JOGO!';
        elements.gameOverMessage.style.display = 'block';
        elements.gameOverMusic.play();
        elements.captureSound.currentTime = 0;

        if (score > record) {
            record = score;
            localStorage.setItem('record', record);
            elements.recordDisplay.textContent = `Recorde: ${record}`;
        }
    }

    function updateGame() {
        document.querySelectorAll('.pecas').forEach(piece => {
            let pieceTop = parseInt(piece.style.top, 10);
            pieceTop += 5;
            if (pieceTop > elements.gameContainer.clientHeight) {
                if (piece.querySelector('img').classList.contains('blue-piece')) {
                    endGame();
                    return;
                }
                piece.remove();
            } else {
                piece.style.top = `${pieceTop}px`;

                if (checkCollision(elements.player, piece)) {
                    if (piece.querySelector('img').classList.contains('blue-piece')) {
                        score++;
                        elements.scoreDisplay.textContent = `Pontuação: ${score}`;
                        elements.captureSound.play();
                    } else {
                        endGame();
                    }
                    piece.remove();
                }
            }
        });
    }

    function createPiece() {
        const piece = document.createElement('div');
        piece.classList.add('pecas');
        const isRedPiece = Math.random() < 0.1;
        const pieceImage = document.createElement('img');
        pieceImage.src = isRedPiece ? 'img/cascaBanana.fw.png' : 'img/ovo.fw.png';
        pieceImage.classList.add(isRedPiece ? 'red-piece' : 'blue-piece');
        piece.appendChild(pieceImage);
        piece.style.left = `${Math.random() * (elements.gameContainer.clientWidth - 30)}px`;
        piece.style.top = '0px';
        elements.gameContainer.appendChild(piece);
    }

    function checkCollision(player, piece) {
        const playerRect = player.getBoundingClientRect();
        const pieceRect = piece.getBoundingClientRect();
        return !(playerRect.right < pieceRect.left ||
                 playerRect.left > pieceRect.right ||
                 playerRect.bottom < pieceRect.top ||
                 playerRect.top > pieceRect.bottom);
    }

    elements.startButton.addEventListener('click', startGame);
    elements.restartButton.addEventListener('click', startGame);

    function movePlayer(event) {
        const gameRect = elements.gameContainer.getBoundingClientRect();
        let playerLeft = (event.clientX || event.touches[0].clientX) - gameRect.left - elements.player.clientWidth / 2;

        if (playerLeft < 0) playerLeft = 0;
        if (playerLeft > gameRect.width - elements.player.clientWidth) playerLeft = gameRect.width - elements.player.clientWidth;

        elements.player.style.left = `${playerLeft}px`;
    }

    document.addEventListener('mousemove', movePlayer);
    document.addEventListener('touchmove', movePlayer);
});