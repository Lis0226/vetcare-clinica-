// Variables Globales
let currentTestimonialIndex = 0;
const testimonialGroups = 3;

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    initializeCarousel();
    setupSmoothScroll();
    setupFormValidation();
    setupModalEvents();
});

// Configuración del Carrusel de Testimonios
function initializeCarousel() {
    const carousel = document.getElementById('testimonialCarousel');
    if (!carousel) return;

    const prevButton = document.querySelector('.testimonial-prev');
    const nextButton = document.querySelector('.testimonial-next');

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            navigateTestimonials(-1);
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            navigateTestimonials(1);
        });
    }

    // Navegación con teclado
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            navigateTestimonials(-1);
        } else if (e.key === 'ArrowRight') {
            navigateTestimonials(1);
        }
    });
}

// Navegación entre testimonios
function navigateTestimonials(direction) {
    const items = document.querySelectorAll('.carousel-item');
    if (items.length === 0) return;

    currentTestimonialIndex += direction;

    if (currentTestimonialIndex < 0) {
        currentTestimonialIndex = items.length - 1;
    } else if (currentTestimonialIndex >= items.length) {
        currentTestimonialIndex = 0;
    }

    // Remover clase active de todos los items
    items.forEach(item => item.classList.remove('active'));
    
    // Agregar clase active al item actual
    items[currentTestimonialIndex].classList.add('active');
}

// Scroll suave entre secciones
function setupSmoothScroll() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Ajuste para el navbar fijo
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Función auxiliar para scroll a sección específica
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Configuración de validación del formulario
function setupFormValidation() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const emailInput = document.getElementById('email');
    
    if (emailInput) {
        emailInput.addEventListener('blur', validateEmail);
    }
}

// Validación de email
function validateEmail() {
    const emailInput = document.getElementById('email');
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        showValidationError(emailInput, 'Por favor, ingresa un email válido.');
        return false;
    } else {
        clearValidationError(emailInput);
        return true;
    }
}

// Mostrar error de validación
function showValidationError(input, message) {
    clearValidationError(input);
    
    input.classList.add('is-invalid');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback d-block';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
}

// Limpiar error de validación
function clearValidationError(input) {
    input.classList.remove('is-invalid');
    
    const existingError = input.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
}

// Manejo del envío del formulario
function handleSubmit(event) {
    event.preventDefault();
    
    // Validar formulario
    if (!validateForm()) {
        return;
    }
    
    // Mostrar estado de carga
    const submitButton = event.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Enviando...';
    submitButton.disabled = true;
    
    // Simular envío (en un caso real, aquí iría una llamada AJAX)
    setTimeout(() => {
        sendEmail();
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// Validación completa del formulario
function validateForm() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    
    let isValid = true;
    
    // Validar nombre
    if (!nombre) {
        showValidationError(document.getElementById('nombre'), 'El nombre es obligatorio.');
        isValid = false;
    } else {
        clearValidationError(document.getElementById('nombre'));
    }
    
    // Validar email
    if (!email) {
        showValidationError(document.getElementById('email'), 'El email es obligatorio.');
        isValid = false;
    } else if (!validateEmail()) {
        isValid = false;
    }
    
    // Validar mensaje
    if (!mensaje) {
        showValidationError(document.getElementById('mensaje'), 'El mensaje es obligatorio.');
        isValid = false;
    } else {
        clearValidationError(document.getElementById('mensaje'));
    }
    
    return isValid;
}

// Envío de email
function sendEmail() {
    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    
    // Crear enlace mailto
    const subject = `Consulta de ${nombre}`;
    const body = `Nombre: ${nombre}%0AEmail: ${email}%0A%0AMensaje:%0A${mensaje}`;
    
    const mailtoLink = `mailto:info@vetcare.com?subject=${encodeURIComponent(subject)}&body=${body}`;
    
    // Abrir cliente de correo
    window.location.href = mailtoLink;
    
    // Mostrar modal de confirmación después de un breve delay
    setTimeout(() => {
        showConfirmationModal();
    }, 1000);
}

// Configuración de eventos del modal
function setupModalEvents() {
    const modal = document.getElementById('confirmationModal');
    if (!modal) return;
    
    // Detectar cuando el usuario intenta volver del cliente de correo
    window.addEventListener('focus', function() {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (!modalInstance) return;
        
        // Pequeño delay para asegurar que el modal se muestre correctamente
        setTimeout(() => {
            if (!modal.classList.contains('show')) {
                showConfirmationModal();
            }
        }, 500);
    });
}

// Mostrar modal de confirmación
function showConfirmationModal() {
    const modalElement = document.getElementById('confirmationModal');
    if (!modalElement) return;
    
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
    
    // Limpiar formulario después de mostrar el modal
    setTimeout(() => {
        document.getElementById('contactForm').reset();
    }, 300);
}

// Abrir WhatsApp
function openWhatsApp() {
    const phoneNumber = '18095550123'; // Número dominicano
    const message = 'Hola, me gustaría obtener más información sobre sus servicios veterinarios.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
}

// Efectos de hover mejorados para cards
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
});

// Detección de características del navegador
function checkBrowserCompatibility() {
    const features = {
        'ES6': typeof Symbol !== 'undefined',
        'CSS Variables': window.CSS && CSS.supports('color', 'var(--test)'),
        'Flexbox': window.CSS && CSS.supports('display', 'flex'),
        'Grid': window.CSS && CSS.supports('display', 'grid')
    };
    
    // Log para debugging (puede ser removido en producción)
    console.log('Compatibilidad del navegador:', features);
}

// Llamar verificación de compatibilidad
checkBrowserCompatibility();

// Manejo de errores global
window.addEventListener('error', function(e) {
    console.error('Error capturado:', e.error);
});

// Optimización de performance - Lazy Loading para imágenes
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });
});

// Animación de entrada para elementos
function animateOnScroll() {
    const elements = document.querySelectorAll('.card, .section-title');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    elements.forEach(element => {
        observer.observe(element);
    });
}

// Iniciar animaciones al cargar
window.addEventListener('load', animateOnScroll);