// Seletores
const about = document.querySelector('#about');
const swiperWrapper = document.querySelector('.swiper-wrapper');

// Seletor do Formulário
const formulario = document.querySelector('#formulario');

// Regex de validação do e-mail
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

// Função para buscar os dados do Perfil do GitHub
async function getAboutGithub() {
    try {
        const resposta = await fetch('https://api.github.com/users/lou-godoi');
        if (!resposta.ok) throw new Error('Falha ao buscar perfil');
        const perfil = await resposta.json();

        if (about) {
            about.innerHTML = `
                <div class="about-container"> 
                    <figure class="about-image">
                        <img src="${perfil.avatar_url}" alt="Foto do perfil - ${perfil.name}">
                    </figure>

                    <article class="about-content">
                        <h2>Sobre mim</h2>
                        <p>
                            Desenvolvedora em transição de carreira, participando do bootcamp da Generation Brasil. 
                            Focada em tecnologias backend como Node.js, TypeScript e NestJS.
                        </p>

                        <div class="about-buttons-data">
                            <div class="buttons-container">
                                <a href="${perfil.html_url}" target="_blank" class="botao">Ver GitHub</a>
                                <a href="#" target="_blank" class="botao-outline">Currículo</a>
                            </div>

                            <div class="data-container">
                                <div class="data-item">
                                    <span class="data-number">${perfil.followers}</span>
                                    <span class="data-label">Seguidores</span>
                                </div>
                                <div class="data-item">
                                    <span class="data-number">${perfil.public_repos}</span>
                                    <span class="data-label">Repositórios</span>
                                </div>
                            </div>
                        </div>
                    </article>
                </div>
            `;
        }
    } catch (error) {
        console.error('Erro ao buscar dados do GitHub:', error);
    }
}

// Função para buscar os repositórios
async function getProjectsGithub() {
    try {
        const resposta = await fetch('https://api.github.com/users/lou-godoi/repos?sort=updated&per_page=6');
        if (!resposta.ok) throw new Error(`Erro na API: ${resposta.status}`);
        
        const repositorios = await resposta.json();
        let htmlSlides = '';

        const linguagens = {
            'JavaScript': 'javascript',
            'TypeScript': 'typescript',
            'Python': 'python',
            'Java': 'java',
            'HTML': 'html',
            'CSS': 'css',
            'GitHub': 'github',
        };

        repositorios.forEach(repositorio => {
            const linguagem = repositorio.language || 'GitHub';
            const logo = linguagens[linguagem] ?? 'github';
            const urlLogo = `./assets/icons/languages/${logo}.svg`;

            const nomeFormatado = repositorio.name.replace(/[-_]/g, ' ').toUpperCase();
    
            const truncar = (texto, limite) => texto && texto.length > limite
                ? texto.substring(0, limite) + '...'
                : (texto || 'Projeto desenvolvido no GitHub');

            const descricao = truncar(repositorio.description, 80);

            const tags = repositorio.topics?.length > 0
                ? repositorio.topics.slice(0, 3).map(topic => `<span class="tag">${topic}</span>`).join('')
                : `<span class="tag">${linguagem}</span>`;

            const botaoDeploy = repositorio.homepage
                ? `<a href="${repositorio.homepage}" target="_blank" class="botao-outline botao-sm">Deploy</a>`
                : '';

            htmlSlides += `
                <div class="swiper-slide">
                    <article class="project-card">
                        <div class="project-image">
                            <img src="${urlLogo}" alt="${linguagem}" onerror="this.src='./assets/icons/languages/github.svg';">
                        </div>
                        <div class="project-content">
                            <h3>${nomeFormatado}</h3>
                            <p>${descricao}</p>
                            <div class="project-tags">${tags}</div>
                            <div class="project-buttons">
                                <a href="${repositorio.html_url}" target="_blank" class="botao botao-sm">GitHub</a>
                                ${botaoDeploy}
                            </div>
                        </div>
                    </article>
                </div>
            `;
        });

        if (swiperWrapper) {
            swiperWrapper.innerHTML = htmlSlides;
            iniciarSwiper();
        }

    } catch (error) {
        console.error('Erro ao buscar repositórios:', error);
    }
}

// Inicialização do Swiper
function iniciarSwiper() {
    new Swiper('.projects-swiper', {
        slidesPerView: 3,
        spaceBetween: 24,
        loop: true,
        observer: true,
        observeParents: true,
        breakpoints: {
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        autoplay: { delay: 5000 },
        grabCursor: true,
    });
}

// Função de Validação do Formulário
formulario.addEventListener('submit', function(event) {
    event.preventDefault();

    // Limpa erros anteriores
    document.querySelectorAll('form span').forEach(span => span.innerHTML = '');

    let isValid = true;

    // Validação Nome
    const nome = document.querySelector('#nome');
    const erroNome = document.querySelector('#erro-nome');
    if (nome.value.trim() === "") {
        if (erroNome) erroNome.innerHTML = 'O campo Nome não pode estar em branco.';
        if (isValid) nome.focus();
        isValid = false;
    } else if (nome.value.trim().length < 3) {
        if (erroNome) erroNome.innerHTML = 'O Nome deve ter no mínimo 3 caracteres.';
        if (isValid) nome.focus();
        isValid = false;
    }

    // Validação E-mail
    const email = document.querySelector('#email');
    const erroEmail = document.querySelector('#erro-email');
    if (!email.value.trim().match(emailRegex)) {
        if (erroEmail) erroEmail.innerHTML = 'Digite um e-mail válido.';
        if (isValid) email.focus();
        isValid = false;
    }

    // Validação Assunto
    const assunto = document.querySelector('#assunto');
    const erroAssunto = document.querySelector('#erro-assunto');
    if (assunto) {
        if (assunto.value.trim() === "") {
            if (erroAssunto) erroAssunto.innerHTML = 'O campo Assunto não pode estar em branco.';
            if (isValid) assunto.focus();
            isValid = false;
        } else if (assunto.value.trim().length < 5) {
            if (erroAssunto) erroAssunto.innerHTML = 'O Assunto deve ter no mínimo 5 caracteres.';
            if (isValid) assunto.focus();
            isValid = false;
        }
    }

    // Validação Mensagem
    const mensagem = document.querySelector('#mensagem');
    const erroMensagem = document.querySelector('#erro-mensagem');
    if (mensagem.value.trim() === "") {
        if (erroMensagem) erroMensagem.innerHTML = 'A mensagem não pode ser vazia.';
        if (isValid) mensagem.focus();
        isValid = false;
    }

    // ENVIO FINAL
    if (isValid) {
        const submitButton = formulario.querySelector('button[type="submit"]');
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        
        // Agora sim ele envia para o FormSubmit!
        formulario.submit();
    }
});

// Inicia chamadas
getAboutGithub();
getProjectsGithub();