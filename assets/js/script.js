document.addEventListener('DOMContentLoaded', () => {
    
    // --- CONFIGURAÇÃO DO GITHUB ---
    const GITHUB_USER = 'lou-godoi';

    // --- FUNÇÃO DE TRADUÇÃO REUTILIZÁVEL ---
    function aplicarIdioma(idioma) {
        // 1. Traduz Textos Normais (usa innerHTML para preservar tags como <br>)
        const textElements = document.querySelectorAll('[data-pt]');
        textElements.forEach(el => {
            if (el.classList.contains('filter-btn')) {
            el.innerHTML = idioma === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-pt');
            el.style.opacity = 1; // Garante que ele fique visível
            return;
        }
            el.style.opacity = 0;
            setTimeout(() => {
                const text = idioma === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-pt');
                el.innerHTML = text;
                el.style.opacity = 1;
            }, 300);
        });

        // 2. Traduz os Placeholders
        const inputElements = document.querySelectorAll('[data-pt-placeholder]');
        inputElements.forEach(input => {
            const placeholderText = idioma === 'en' 
                ? input.getAttribute('data-en-placeholder') 
                : input.getAttribute('data-pt-placeholder');
            input.setAttribute('placeholder', placeholderText);
        });

        // 3. Troca o arquivo do Currículo
    const btnCv = document.getElementById('btn-cv');
    if (btnCv) {
        const novoLink = idioma === 'en' ? btnCv.getAttribute('data-en-href') : btnCv.getAttribute('data-pt-href');
        const novoNome = idioma === 'en' ? "Lorena_Godoi_CV-en.pdf" : "Lorena_Godoi_CV-pt.pdf";
        
        btnCv.setAttribute('href', novoLink);
        btnCv.setAttribute('download', novoNome);
    }
    }

    // --- 0. RECUPERAR IDIOMA SALVO ---
    let currentLang = 'pt';
    const idiomaSalvo = localStorage.getItem('idioma_reino');
    if (idiomaSalvo) {
        currentLang = idiomaSalvo;
        aplicarIdioma(currentLang);
        
        const btnLang = document.getElementById('btn-lang');
        if (btnLang) {
            btnLang.innerText = currentLang === 'pt' ? 'EN' : 'PT';
        }
    }

    // --- 1. Menu Mobile (Toggle) ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if(navLinks.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }

    // --- 2. Troca de Idioma ---
    const btnLang = document.getElementById('btn-lang');
    if(btnLang) {
        btnLang.addEventListener('click', () => {
            currentLang = currentLang === 'pt' ? 'en' : 'pt';
            btnLang.innerText = currentLang === 'pt' ? 'EN' : 'PT';

            // Salva na memória do navegador
            localStorage.setItem('idioma_reino', currentLang);
            aplicarIdioma(currentLang);
        });
    }

    // --- 3. Fechar menu mobile ao clicar em um link ---
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
            if (menuToggle) {
                const icon = menuToggle.querySelector('i');
                if(icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });

    // --- 4. BUSCAR DADOS DO GITHUB ---
    async function getAboutGithub() {
        const container = document.getElementById('project-grid');
        if (!container) return;

        try {
            const response = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated`);
            const repos = await response.json();
            
            container.innerHTML = ''; // Limpa o carregamento
            const reposLimitados = repos.slice(0, 6); 

            reposLimitados.forEach(repo => {
                if (repo.fork) return;

                const category = repo.language ? repo.language : 'all';
                const card = document.createElement('div');
                card.className = 'project-card';
                card.setAttribute('data-category', category);

                card.innerHTML = `
                    <div class="project-info">
                        <h3 class="repo-name">${repo.name.replace(/-/g, ' ').replace(/_/g, ' ').toUpperCase()}</h3>
                        <p>${repo.description || 'Nenhum pergaminho descritivo encontrado.'}</p>
                        <div class="tags">
                            <span>${repo.language || 'Code'}</span>
                        </div>
                        <div class="project-links">
                            <a href="${repo.html_url}" target="_blank">
                                <i class="fas fa-code"></i> <span data-pt="Relatório" data-en="Report">Relatório</span>
                            </a>
                        </div>
                    </div>
                `;
                container.appendChild(card);
            });
            
            initFilters(); 

        } catch (error) {
            container.innerHTML = '<p>Erro ao convocar repositórios.</p>';
        }
    }

    // --- 5. Filtro de Projetos ---
    function initFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const projectCards = document.querySelectorAll('.project-card');

        filterButtons.forEach(button => {
            button.replaceWith(button.cloneNode(true));
        });

        const newButtons = document.querySelectorAll('.filter-btn');
        newButtons.forEach(button => {
            button.addEventListener('click', () => {
                newButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                const filterValue = button.getAttribute('data-filter');

                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || filterValue === category) {
                        card.style.display = 'block';
                        card.style.animation = 'fadeIn 0.5s ease forwards';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- 6. Validação e Envio do Formulário ---
    const formulario = document.getElementById('contactForm');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(formulario) {
        formulario.addEventListener('submit', function(event) {
            event.preventDefault(); 

            document.querySelectorAll('.erro-msg').forEach(span => span.innerHTML = '');
            document.querySelectorAll('input, textarea').forEach(el => el.classList.remove('invalid'));

            let isValid = true;

            const name = document.querySelector('#name');
            if (name.value.trim().length < 3) {
                document.querySelector('#erro-name').innerHTML = currentLang === 'pt' ? 'O nome deve ter no mínimo 3 caracteres.' : 'Name must be at least 3 characters.';
                name.classList.add('invalid');
                if (isValid) name.focus();
                isValid = false;
            }

            const email = document.querySelector('#email');
            if (!email.value.trim().match(emailRegex)) {
                document.querySelector('#erro-email').innerHTML = currentLang === 'pt' ? 'Digite um e-mail válido.' : 'Enter a valid email.';
                email.classList.add('invalid');
                if (isValid) email.focus();
                isValid = false;
            }

            const subject = document.querySelector('#subject');
            if (subject.value.trim().length < 5) {
                document.querySelector('#erro-subject').innerHTML = currentLang === 'pt' ? 'O assunto deve ter no mínimo 5 caracteres.' : 'Subject must be at least 5 characters.';
                subject.classList.add('invalid');
                if (isValid) subject.focus();
                isValid = false;
            }

            const message = document.querySelector('#message');
            if (message.value.trim().length === 0) {
                document.querySelector('#erro-message').innerHTML = currentLang === 'pt' ? 'A mensagem não pode ser vazia.' : 'Message cannot be empty.';
                message.classList.add('invalid');
                if (isValid) message.focus();
                isValid = false;
            }

            if (isValid) {
                const btn = formulario.querySelector('button[type="submit"]');
                const spanElement = btn.querySelector('span');
                
                btn.disabled = true;
                if (spanElement) {
                    spanElement.innerText = currentLang === 'pt' ? 'Enviando...' : 'Sending...';
                }

                const formData = new FormData(formulario);
                navigator.sendBeacon(formulario.action, formData); 
                
                setTimeout(() => {
                    window.location.href = "https://lou-godoi.github.io/Portfolio/success.html";
                }, 800);
            }
        });
    }
    
    getAboutGithub();
});

// Animação dinâmica
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
`;
document.head.appendChild(style);