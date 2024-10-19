// Selecionando o canvas e definindo o contexto 2D
let canvas = document.getElementById('jogoCanvas');
let ctx = canvas.getContext('2d');

// Definindo as variáveis do jogo
let larguraBarra = 10;
let alturaBarra = 70;
let velocidadeJogador = 5;

// Velociade máxima da bola
let velocidadeMaxima = 5;

// Posições iniciais das barras
let jogador1Y = (canvas.height - alturaBarra) / 2; // Jogador 1 (teclas W e S)
let jogador2Y = (canvas.height - alturaBarra) / 2; // Jogador 2 (setas)

// Posição inicial da bola e sua velocidade
let bolaX = canvas.width / 2;
let bolaY = canvas.height / 2;
let bolaVelocidadeX = 2;
let bolaVelocidadeY = 2;
let bolaTamanho = 8;

// Pontuações
let pontuacaoJogador1 = 0;
let pontuacaoJogador2 = 0;

// Função para desenhar o fundo do jogo
function desenharFundo() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Função para desenhar as barras
function desenharBarra(x, y) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(x, y, larguraBarra, alturaBarra);
}

// Função para desenhar a bola
function desenharBola() {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(bolaX, bolaY, bolaTamanho, 0, Math.PI * 2);
    ctx.fill();
}

// Função para desenhar a pontuação
function desenharPontuacao() {
    ctx.fillStyle = '#fff';
    ctx.font = '32px Arial';
    ctx.fillText('Jogador 1: ' + pontuacaoJogador1, 50, 50);
    ctx.fillText('Jogador 2: ' + pontuacaoJogador2, canvas.width - 200, 50);
}

// Função para atualizar a posição do Jogador 1 (W e S)
function atualizarJogador1() {
    if (wPressionado && jogador1Y > 0) {
        jogador1Y -= velocidadeJogador;
    }
    if (sPressionado && jogador1Y < canvas.height - alturaBarra) {
        jogador1Y += velocidadeJogador;
    }
}

// Função para atualizar a posição do Jogador 2 (Setas)
function atualizarJogador2() {
    if (cimaPressionado && jogador2Y > 0) {
        jogador2Y -= velocidadeJogador;
    }
    if (baixoPressionado && jogador2Y < canvas.height - alturaBarra) {
        jogador2Y += velocidadeJogador;
    }
}

// Função para atualizar a bola
function atualizarBola() {
    bolaX += bolaVelocidadeX;
    bolaY += bolaVelocidadeY;

    // Colisão com a parede superior e inferior
    if (bolaY <= 0 || bolaY >= canvas.height) {
        bolaVelocidadeY = -bolaVelocidadeY;
    }

    // Colisão com o Jogador 1
    if (bolaX <= larguraBarra && bolaY >= jogador1Y && bolaY <= jogador1Y + alturaBarra) {
        let deltaY = bolaY - (jogador1Y + alturaBarra / 2);
        bolaVelocidadeY = deltaY * 0.35;
        bolaVelocidadeX = -bolaVelocidadeX;

        bolaVelocidadeX = Math.min(bolaVelocidadeX * 1.05, velocidadeMaxima);
        bolaVelocidadeY = Math.min(Math.abs(bolaVelocidadeY * 1.05), velocidadeMaxima) * Math.sign(bolaVelocidadeY);

        flashScreen();
    }

    // Colisão com o Jogador 2
    if (bolaX >= canvas.width - larguraBarra && bolaY >= jogador2Y && bolaY <= jogador2Y + alturaBarra) {
        let deltaY = bolaY - (jogador2Y + alturaBarra / 2);
        bolaVelocidadeY = deltaY * 0.35;
        bolaVelocidadeX = -bolaVelocidadeX;

        bolaVelocidadeX = Math.min(bolaVelocidadeX * 1.05, velocidadeMaxima);
        bolaVelocidadeY = Math.min(Math.abs(bolaVelocidadeY * 1.05), velocidadeMaxima) * Math.sign(bolaVelocidadeY);

        flashScreen();
    }

    // Resetar a bola se sair da tela
    if (bolaX < 0) {
        pontuacaoJogador2++; // Jogador 2 marca ponto
        resetarBola();
    } else if (bolaX > canvas.width) {
        pontuacaoJogador1++; // Jogador 1 marca ponto
        resetarBola();
    }
}

// Função para dar feedback visual (flash)
function flashScreen() {
    canvas.style.backgroundColor = '#444';
    setTimeout(() => {
        canvas.style.backgroundColor = '#000';
    }, 50);
}

// Função para resetar a posição da bola
function resetarBola() {
    bolaX = canvas.width / 2;
    bolaY = canvas.height / 2;
    bolaVelocidadeX = 2 * (Math.random() > 0.5 ? 1 : -1);
    bolaVelocidadeY = 2 * (Math.random() > 0.5 ? 1 : -1);
}

// Função para desenhar o jogo
function desenhar() {
    desenharFundo();
    desenharBarra(0, jogador1Y); // Barra do Jogador 1
    desenharBarra(canvas.width - larguraBarra, jogador2Y); // Barra do Jogador 2
    desenharBola();
    desenharPontuacao();
}

// Função principal de atualização do jogo
function atualizarJogo() {
    atualizarJogador1();
    atualizarJogador2();
    atualizarBola();
    desenhar();
}

// Controles do jogador
let wPressionado = false;
let sPressionado = false;
let cimaPressionado = false;
let baixoPressionado = false;

// Controles para o Jogador 1 (W e S)
window.addEventListener('keydown', function (evento) {
    if (evento.key === 'w') {
        wPressionado = true;
    }
    if (evento.key === 's') {
        sPressionado = true;
    }
});

// Controles para o Jogador 2 (Setas)
window.addEventListener('keydown', function (evento) {
    if (evento.key === 'ArrowUp') {
        cimaPressionado = true;
    }
    if (evento.key === 'ArrowDown') {
        baixoPressionado = true;
    }
});

// Liberar teclas quando soltar
window.addEventListener('keyup', function (evento) {
    if (evento.key === 'w') {
        wPressionado = false;
    }
    if (evento.key === 's') {
        sPressionado = false;
    }
    if (evento.key === 'ArrowUp') {
        cimaPressionado = false;
    }
    if (evento.key === 'ArrowDown') {
        baixoPressionado = false;
    }
});

// Iniciar o loop do jogo
setInterval(atualizarJogo, 1000 / 60);
