document.addEventListener('DOMContentLoaded', () => {
    const gameContainer = document.getElementById('game-container');
    const player = document.getElementById('player');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');
    const scoreDisplay = document.getElementById('score');
    const recordDisplay = document.getElementById('record');
    const captureSound = document.getElementById('capture-sound');
    const gameOverMusic = document.getElementById('game-over-music');
    const gameOverMessage = document.getElementById('game-over-message');
    let score = 0;
    let record = parseInt(localStorage.getItem('record'), 10) || 0;
    let gameInterval;
    let pieceInterval;
    recordDisplay.textContent = `Recorde: ${record}`;

    function startGame() {
        document.querySelectorAll('.pecas').forEach(piece => piece.remove());
        score = 0;
        scoreDisplay.textContent = `Pontuação: ${score}`;
        startButton.style.display = 'none';
        restartButton.style.display = 'none';
        gameOverMessage.style.display = 'none';
        player.style.left = '50%';
        gameInterval = setInterval(updateGame, 20);
        pieceInterval = setInterval(createPiece, 1000);
    }
    
    function endGame() {
        clearInterval(gameInterval);
        clearInterval(pieceInterval);
        startButton.style.display = 'none';
        restartButton.style.display = 'block';
        gameOverMessage.textContent = 'FIM DE JOGO!';
        gameOverMessage.style.display = 'block';
        gameOverMusic.play();
        captureSound.currentTime = 0;
        
        if (score > record) {
            record = score;
            localStorage.setItem('record', record);
            recordDisplay.textContent = `Recorde: ${record}`;
        }
    }
    
    function updateGame() {
        document.querySelectorAll('.pecas').forEach(piece => {
            let pieceTop = parseInt(piece.style.top, 10);
            pieceTop += 5;
            if (pieceTop > gameContainer.clientHeight) {
                if (piece.querySelector('img').classList.contains('blue-piece')) {
                    endGame();
                    return;
                }
                piece.remove();
            } else {
                piece.style.top = `${pieceTop}px`;
                if (checkCollision(player, piece)) {
                    if (piece.querySelector('img').classList.contains('blue-piece')) {
                        score++;
                        scoreDisplay.textContent = `Pontuação: ${score}`;
                        captureSound.play();
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

        piece.style.left = `${Math.random() * (gameContainer.clientWidth - 30)}px`;
        piece.style.top = '0px';
        gameContainer.appendChild(piece);
    }

    function checkCollision(player, piece) {
        const playerRect = player.getBoundingClientRect();
        const pieceRect = piece.getBoundingClientRect();
        return !(playerRect.right < pieceRect.left || 
                 playerRect.left > pieceRect.right || 
                 playerRect.bottom < pieceRect.top || 
                 playerRect.top > pieceRect.bottom);
    }
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);

    document.addEventListener('mousemove', (event) => {
        const gameRect = gameContainer.getBoundingClientRect();
        let playerLeft = event.clientX - gameRect.left - player.clientWidth / 2;
        if (playerLeft < 0) playerLeft = 0;
        if (playerLeft > gameRect.width - player.clientWidth) playerLeft = gameRect.width - player.clientWidth;
        player.style.left = `${playerLeft}px`;
    });

    document.addEventListener('touchmove', (event) => {
        const gameRect = gameContainer.getBoundingClientRect();
        let playerLeft = event.touches[0].clientX - gameRect.left - player.clientWidth / 2;
        if (playerLeft < 0) playerLeft = 0;
        if (playerLeft > gameRect.width - player.clientWidth) playerLeft = gameRect.width - player.clientWidth;
        player.style.left = `${playerLeft}px`;
    });
});
