
var musicas = [];
var draggingIndex = null;

var audioPlayer = document.getElementById('audioPlayer');
var progressoDiv = document.getElementById('progresso');
var progressoFillDiv = document.querySelector('.progresso-fill');
var tempoAtualSpan = document.getElementById('tempoAtual');
var tempoTotalSpan = document.getElementById('tempoTotal');
var faixaAtualDiv = document.getElementById('faixaAtual');

var playPauseButton = document.getElementById('playPause');
playPauseButton.addEventListener('click', function () {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseButton.innerHTML = '<i class="bi bi-pause"></i>'; // Ícone de pausa do Bootstrap
  } else {
    audioPlayer.pause();
    playPauseButton.innerHTML = '<i class="bi bi-play"></i>'; // Ícone de play do Bootstrap
  }
});


var prevButton = document.getElementById('prev');
prevButton.addEventListener('click', function () {
  var currentIndex = musicas.findIndex(function (musica) {
    return musica.isPlaying;
  });

  if (currentIndex > 0) {
    tocarMusica(musicas[currentIndex - 1]);
  }
});

var nextButton = document.getElementById('next');
nextButton.addEventListener('click', function () {
  var currentIndex = musicas.findIndex(function (musica) {
    return musica.isPlaying;
  });

  if (currentIndex < musicas.length - 1) {
    tocarMusica(musicas[currentIndex + 1]);
  }
});

var randomButton = document.getElementById('random');
randomButton.addEventListener('click', function () {
  var currentIndex = musicas.findIndex(function (musica) {
    return musica.isPlaying;
  });

  var randomIndex = getRandomIndex(currentIndex);
  tocarMusica(musicas[randomIndex]);
});

var repeatButton = document.getElementById('repeat');
repeatButton.addEventListener('click', function () {
  audioPlayer.loop = !audioPlayer.loop;
  repeatButton.classList.toggle('active', audioPlayer.loop);
});

progressoDiv.addEventListener('click', function (event) {
  var percent = event.offsetX / progressoDiv.clientWidth;
  var currentTime = percent * audioPlayer.duration;
  audioPlayer.currentTime = currentTime;
});

function adicionarMusica(musica) {
  musicas.push(musica);
  exibirListaMusicas();
}

function exibirListaMusicas() {
  var listaMusicas = document.getElementById('listaMusicas');
  listaMusicas.innerHTML = '';

  musicas.forEach(function (musica, index) {
    var li = document.createElement('li');
    li.textContent = musica.nome;

    var ctrListDiv = document.createElement('div');
    ctrListDiv.setAttribute('id', 'ctr-list');

    var renomearButton = document.createElement('button');
    renomearButton.innerHTML = '<i class="bi bi-pencil-fill"></i>';
    renomearButton.addEventListener('click', function () {
      var novoNome = prompt('Digite o novo nome da faixa:', musica.nome);
      if (novoNome) {
        musica.nome = novoNome;
        exibirListaMusicas();
      }
    });
    ctrListDiv.appendChild(renomearButton);

    var playButton = document.createElement('button');
    playButton.innerHTML = '<i class="bi bi-play"></i>';
    playButton.addEventListener('click', function () {
      tocarMusica(musica);
    });
    ctrListDiv.appendChild(playButton);

    var moveUpButton = document.createElement('button');
    moveUpButton.textContent = '↑';
    moveUpButton.addEventListener('click', function () {
      moverFaixa(index, index - 1);
    });
    ctrListDiv.appendChild(moveUpButton);

    var moveDownButton = document.createElement('button');
    moveDownButton.textContent = '↓';
    moveDownButton.addEventListener('click', function () {
      moverFaixa(index, index + 1);
    });
    ctrListDiv.appendChild(moveDownButton);

    var removeButton = document.createElement('button');
    removeButton.innerHTML = '<i class="bi bi-trash3"></i> ';
    removeButton.addEventListener('click', function () {
      removerMusica(index);
    });
    ctrListDiv.appendChild(removeButton);

    li.appendChild(ctrListDiv);

    li.draggable = true;
    li.addEventListener('dragstart', function (event) {
      draggingIndex = index;
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/html', this.innerHTML);
    });
    li.addEventListener('dragover', function (event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
    });
    li.addEventListener('dragenter', function (event) {
      event.preventDefault();
      this.classList.add('dragover');
    });
    li.addEventListener('dragleave', function () {
      this.classList.remove('dragover');
    });
    li.addEventListener('drop', function (event) {
      var dropIndex = index;
      if (draggingIndex < dropIndex) {
        dropIndex--;
      }
      if (draggingIndex !== dropIndex) {
        moverFaixa(draggingIndex, dropIndex);
      }
      this.classList.remove('dragover');
    });
    listaMusicas.appendChild(li);
  });
}


function moverFaixa(fromIndex, toIndex) {
  var musica = musicas[fromIndex];
  musicas.splice(fromIndex, 1);
  musicas.splice(toIndex, 0, musica);
  exibirListaMusicas();
}

function removerMusica(index) {
  musicas.splice(index, 1);
  exibirListaMusicas();
}

function tocarMusica(musica) {
  musicas.forEach(function (musica) {
    musica.isPlaying = false;
  });

  musica.isPlaying = true;
  audioPlayer.src = musica.arquivo;
  audioPlayer.play();
  playPauseButton.innerHTML = '<i class="bi bi-pause"></i>';
  faixaAtualDiv.textContent = 'Tocando: ' + musica.nome;
}

function formatarTempo(segundos) {
  var minutos = Math.floor(segundos / 60);
  segundos = Math.floor(segundos % 60);
  return minutos.toString().padStart(2, '0') + ':' + segundos.toString().padStart(2, '0');
}

function atualizarTempo() {
  tempoAtualSpan.textContent = formatarTempo(audioPlayer.currentTime);
  tempoTotalSpan.textContent = formatarTempo(audioPlayer.duration);

  var percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressoFillDiv.style.width = percent + '%';
}

function getRandomIndex(excludeIndex) {
  var index;
  do {
    index = Math.floor(Math.random() * musicas.length);
  } while (index === excludeIndex);
  return index;
}

audioPlayer.addEventListener('play', function () {
  setInterval(atualizarTempo, 1000);
});

audioPlayer.addEventListener('ended', function () {
  var currentIndex = musicas.findIndex(function (musica) {
    return musica.isPlaying;
  });

  if (currentIndex < musicas.length - 1) {
    tocarMusica(musicas[currentIndex + 1]);
  } else {
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    playPauseButton.textContent = 'Play';
    faixaAtualDiv.textContent = '';
  }
});

var fileUpload = document.getElementById('fileUpload');
fileUpload.addEventListener('change', function () {
  var files = Array.from(fileUpload.files);
  files.forEach(function (file) {
    var musica = {
      nome: file.name,
      arquivo: URL.createObjectURL(file),
      isPlaying: false
    };
    adicionarMusica(musica);
  });
  fileUpload.value = '';
});
