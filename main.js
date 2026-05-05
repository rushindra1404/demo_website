// Initialize EmailJS
emailjs.init("zlD1uHWY7_Uq6-P7F");

function openServiceModal(cardElement) {
    const titleElement = cardElement.querySelector('h3');
    const descElement = cardElement.querySelector('p');
    
    if (!titleElement) return;
    
    const title = titleElement.innerText;
    const desc = descElement ? descElement.innerText : '';
    // Video filename is exactly the service title, e.g., "Orthodontic Braces.mp4"
    const videoName = title.trim();
    const videoPath = `videos/${videoName}.mp4`;
    
    const modal = document.getElementById('service-modal');
    const modalContent = document.getElementById('service-modal-content');
    const videoElement = document.getElementById('service-modal-video');
    const titleTarget = document.getElementById('service-modal-title');
    const descTarget = document.getElementById('service-modal-desc');
    
    // Set content
    if(titleTarget) titleTarget.innerText = title;
    if(descTarget) descTarget.innerText = desc;
    
    // Set video
    videoElement.src = videoPath;
    videoElement.load();
    videoElement.play().catch(e => console.log('Autoplay blocked or video missing', e));
    
    // Open modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Small delay to allow display:flex to apply before opacity transition
    setTimeout(() => {
        modal.classList.remove('pointer-events-none', 'opacity-0');
        modalContent.classList.remove('scale-90');
        modalContent.classList.add('scale-100');
    }, 10);
}

function closeServiceModal() {
    const modal = document.getElementById('service-modal');
    const modalContent = document.getElementById('service-modal-content');
    const videoElement = document.getElementById('service-modal-video');
    
    modal.classList.add('opacity-0', 'pointer-events-none');
    modalContent.classList.remove('scale-100');
    modalContent.classList.add('scale-90');
    
    setTimeout(() => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        videoElement.pause();
        videoElement.src = ''; // clear source
    }, 300);
}

// Close on Escape
document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') {
        const modal = document.getElementById('service-modal');
        if(modal && !modal.classList.contains('hidden')) {
            closeServiceModal();
        }
    }
});

// AOS Init
AOS.init({ duration: 600, once: true, offset: 50, easing: 'ease-out' });

// Loader
window.addEventListener('load', () => {
    const loader = document.getElementById('page-loader');
    loader.style.opacity = '0';
    loader.style.visibility = 'hidden';
});



// Dark Mode
function toggleDarkMode() { document.documentElement.classList.toggle('dark'); }

// Button Ripple
document.querySelectorAll('.glow-btn').forEach(btn => {
    btn.addEventListener('click', function (e) {
        let ripple = document.createElement('span'); ripple.classList.add('ripple');
        let rect = btn.getBoundingClientRect();
        ripple.style.left = `${e.clientX - rect.left}px`; ripple.style.top = `${e.clientY - rect.top}px`;
        ripple.style.width = ripple.style.height = `${Math.max(rect.width, rect.height)}px`;
        btn.appendChild(ripple); setTimeout(() => ripple.remove(), 600);
    });
});

// Magnetic Buttons
document.querySelectorAll('.glow-btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.05)`;
    });
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px) scale(1)';
    });
});

// Scroll Progress Bar
window.addEventListener('scroll', () => {
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        const scrollPx = document.documentElement.scrollTop;
        const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = `${(scrollPx / winHeightPx) * 100}%`;
        scrollProgress.style.width = scrolled;
    }
});

// Slider & Demo Logic
const slider = document.getElementById('smile-slider');
const overlay = document.getElementById('slider-overlay');
const img = document.getElementById('slider-img');
const thumb = document.getElementById('slider-thumb');

if (slider) {
    slider.addEventListener('input', (e) => {
        overlay.style.width = e.target.value + '%';
        thumb.style.left = e.target.value + '%';
        img.style.transform = `translateX(-${e.target.value}%)`;
        img.style.width = (100 / (e.target.value / 100)) + '%';
    });
}

function loadDemo(e) {
    e.stopPropagation();
    const beforeImg = document.getElementById('demo-before');
    const afterImg = document.getElementById('slider-img');

    beforeImg.style.opacity = '0';
    afterImg.style.opacity = '0';

    setTimeout(() => {
        const demoSrc = 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';

        beforeImg.src = demoSrc;
        beforeImg.classList.remove('filter', 'contrast-75', 'sepia-[.3]');

        afterImg.src = demoSrc;
        afterImg.classList.add('filter', 'brightness-125', 'contrast-125');

        beforeImg.onload = () => { beforeImg.style.opacity = '1'; };
        afterImg.onload = () => { afterImg.style.opacity = '1'; };
    }, 300);
}

// Count Up
const countElements = document.querySelectorAll('.count-up');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseFloat(entry.target.getAttribute('data-target'));
            const isDecimal = entry.target.getAttribute('data-decimal') === 'true';
            let current = 0, increment = target / (1500 / 16);
            const update = () => {
                current += increment;
                if (current < target) {
                    entry.target.innerText = isDecimal ? current.toFixed(1) : Math.ceil(current);
                    requestAnimationFrame(update);
                } else entry.target.innerText = isDecimal ? target.toFixed(1) : target;
            };
            update(); observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
countElements.forEach(el => observer.observe(el));

// Premium Smart Wizard Logic
let currentWizardStep = 1;
let bookingData = {
    name: "",
    phone: "",
    email: "",
    service: "",
    date: "",
    time: ""
};

function updateWizardUI(step) {
    // Update Line
    const progress = ((step - 1) / 4) * 100;
    document.getElementById('wizard-progress-line').style.width = `${progress}%`;

    // Update Icons & Labels
    document.querySelectorAll('.wizard-step-icon').forEach((icon, index) => {
        const s = index + 1;
        const label = document.getElementById(`label-${s}`);

        if (s < step) {
            // Completed
            icon.className = 'wizard-step-icon relative z-10 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold transition-all duration-300';
            icon.innerHTML = '<i class="fas fa-check"></i>';
            if (label) label.className = 'text-slate-500 font-bold transition-colors duration-300';
        } else if (s === step) {
            // Active
            icon.className = 'wizard-step-icon active relative z-10 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-[0_0_15px_rgba(14,165,233,0.5)] transition-all duration-300 scale-110';
            icon.innerHTML = s;
            if (label) label.className = 'text-primary font-bold transition-colors duration-300 scale-105';
        } else {
            // Pending
            icon.className = 'wizard-step-icon relative z-10 w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 flex items-center justify-center font-bold transition-all duration-300';
            icon.innerHTML = s === 5 ? '<i class="fas fa-check"></i>' : s;
            if (label) label.className = 'text-slate-400 transition-colors duration-300';
        }
    });

    // Slide Panels
    document.querySelectorAll('.wizard-step').forEach((panel, index) => {
        const s = index + 1;
        if (s === step) {
            panel.classList.remove('opacity-0', 'pointer-events-none');
            panel.classList.add('opacity-100');
            panel.style.transform = 'translateX(0)';
            panel.style.zIndex = '10';
        } else if (s < step) {
            panel.classList.remove('opacity-100');
            panel.classList.add('opacity-0', 'pointer-events-none');
            panel.style.transform = 'translateX(-2rem)';
            panel.style.zIndex = '0';
        } else {
            panel.classList.remove('opacity-100');
            panel.classList.add('opacity-0', 'pointer-events-none');
            panel.style.transform = 'translateX(2rem)';
            panel.style.zIndex = '0';
        }
    });
    currentWizardStep = step;
}

function nextWizardStep(step) { updateWizardUI(step); }
function prevWizardStep(step) { updateWizardUI(step); }

function selectWizardTreatment(el) {
    document.querySelectorAll('.treatment-card').forEach(c => {
        c.classList.remove('border-primary', 'bg-white', 'dark:bg-slate-800', 'shadow-md');
        c.classList.add('border-transparent');
    });
    el.classList.remove('border-transparent');
    el.classList.add('border-primary', 'bg-white', 'dark:bg-slate-800', 'shadow-md');
    
    // Save selected service
    const titleEl = el.querySelector('h4');
    if (titleEl) bookingData.service = titleEl.innerText.trim();
    
    setTimeout(() => nextWizardStep(2), 400);
}

function saveDateAndContinue() {
    const dateInput = document.getElementById('appointment-date');
    if (!dateInput.value) {
        dateInput.classList.add('border-red-500', 'ring-red-500');
        setTimeout(() => dateInput.classList.remove('border-red-500', 'ring-red-500'), 1500);
        return;
    }
    bookingData.date = dateInput.value;
    nextWizardStep(3);
}

function selectWizardTime(el) {
    document.querySelectorAll('.time-slot').forEach(c => {
        c.classList.remove('bg-primary', 'text-white', 'border-primary', 'shadow-md');
        c.classList.add('border-slate-200', 'dark:border-slate-700', 'text-surface-dark', 'dark:text-surface-light');
    });
    el.classList.remove('border-slate-200', 'dark:border-slate-700', 'text-surface-dark', 'dark:text-surface-light');
    el.classList.add('bg-primary', 'text-white', 'border-primary', 'shadow-md');
    
    // Save selected time
    bookingData.time = el.innerText.replace('Popular', '').trim();
    
    setTimeout(() => nextWizardStep(4), 400);
}

async function submitBooking() {
    const nameInput = document.getElementById('booking-name');
    const phoneInput = document.getElementById('booking-phone');
    const emailInput = document.getElementById('booking-email');
    
    let hasError = false;
    
    if (!nameInput.value.trim()) {
        nameInput.classList.add('border-red-500', 'ring-red-500');
        hasError = true;
    }
    if (!phoneInput.value.trim()) {
        phoneInput.classList.add('border-red-500', 'ring-red-500');
        hasError = true;
    }
    if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
        emailInput.classList.add('border-red-500', 'ring-red-500');
        hasError = true;
    }
    
    setTimeout(() => {
        nameInput.classList.remove('border-red-500', 'ring-red-500');
        phoneInput.classList.remove('border-red-500', 'ring-red-500');
        emailInput.classList.remove('border-red-500', 'ring-red-500');
    }, 1500);
    
    if (hasError) return;
    
    bookingData.name = nameInput.value.trim();
    bookingData.phone = phoneInput.value.trim();
    bookingData.email = emailInput.value.trim();
    
    const submitBtn = document.getElementById('submit-booking-btn');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...';
    submitBtn.disabled = true;
    submitBtn.classList.add('opacity-70', 'cursor-not-allowed');
    
    try {
        const formURL = "https://docs.google.com/forms/d/e/1FAIpQLSecdxxd3mNUJVOqkJ4rX2hHRmM1V7BAq9At4l5uN3XSiJ_-Qw/formResponse";
        
        // Format Date to DD/MM/YYYY
        let formattedDate = bookingData.date;
        if (formattedDate && formattedDate.includes('-')) {
            const parts = formattedDate.split('-'); // from YYYY-MM-DD
            if (parts.length === 3) {
                formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
        }
        
        console.log("Submitting booking data:", { ...bookingData, formattedDate });
        
        const params = new URLSearchParams();
        params.append("entry.2005620554", bookingData.name);
        params.append("entry.1166974658", bookingData.phone);
        params.append("entry.1045781291", bookingData.service || "Not specified");
        params.append("entry.1065046570", formattedDate || "Not specified");
        params.append("entry.839337160", bookingData.time || "Not specified");
        
        console.log("Sending POST request to Google Forms...");
        
        await fetch(formURL, {
            method: "POST",
            mode: "no-cors",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: params
        });
        
        console.log("Successfully submitted!");
        
        try {
            console.log("Sending email notification via EmailJS...");
            await emailjs.send("service_m6yw80z", "template_7qcadwf", {
                name: bookingData.name,
                phone: bookingData.phone,
                email: bookingData.email,
                service: bookingData.service,
                date: bookingData.date,
                time: bookingData.time
            });
            console.log("Email notification sent successfully.");
        } catch (emailError) {
            console.error("EmailJS Error:", emailError);
            // We intentionally swallow the error so the user still sees the success screen
        }
        
        // Show success UI
        document.getElementById('success-name').innerText = bookingData.name;
        document.getElementById('success-service').innerText = bookingData.service || "Consultation";
        document.getElementById('success-date').innerText = bookingData.date;
        document.getElementById('success-time').innerText = bookingData.time;
        
        // Set WhatsApp link
        const waBtn = document.getElementById('success-wa-btn');
        if (waBtn) {
            const message = encodeURIComponent(`Hi, I booked an appointment for ${bookingData.service || 'consultation'} on ${bookingData.date} at ${bookingData.time}. Name: ${bookingData.name}`);
            waBtn.onclick = () => window.open(`https://wa.me/919493596930?text=${message}`, '_blank');
        }
        
        nextWizardStep(5);
        triggerConfetti();
        
    } catch (error) {
        console.error("Booking Error:", error);
        alert("There was an error submitting your booking. Please try again or call us directly.");
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-70', 'cursor-not-allowed');
    }
}

function triggerConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#0EA5E9', '#38BDF8', '#22D3EE', '#ffffff'];
    for (let i = 0; i < 50; i++) {
        let conf = document.createElement('div');
        conf.style.position = 'absolute';
        conf.style.width = Math.random() * 10 + 5 + 'px';
        conf.style.height = Math.random() * 10 + 5 + 'px';
        conf.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        conf.style.left = '50%';
        conf.style.top = '50%';
        conf.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
        conf.style.zIndex = '0';

        let angle = Math.random() * Math.PI * 2;
        let velocity = 100 + Math.random() * 200;
        let tx = Math.cos(angle) * velocity;
        let ty = Math.sin(angle) * velocity - 100;

        conf.animate([
            { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(1) rotate(${Math.random() * 360}deg)`, opacity: 0.8, offset: 0.8 },
            { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty + 50}px)) scale(0.5) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], { duration: 1500 + Math.random() * 1000, easing: 'cubic-bezier(.25,.8,.25,1)' });

        container.appendChild(conf);
        setTimeout(() => conf.remove(), 2500);
    }
}

// AI Assistant Logic
function toggleChat() {
    const chat = document.getElementById('ai-chat');
    const icon1 = document.getElementById('orb-icon-1');
    const icon2 = document.getElementById('orb-icon-2');
    const notif = document.getElementById('chat-notif');
    const tooltip = document.getElementById('chat-tooltip');

    if (chat.classList.contains('hidden')) {
        // Open
        chat.classList.remove('hidden');
        setTimeout(() => {
            chat.classList.remove('opacity-0', 'translate-y-4');
            chat.classList.add('scale-100');
        }, 10);
        icon1.classList.add('opacity-0', 'scale-0');
        icon2.classList.remove('opacity-0', 'scale-0');
        if (notif) notif.style.display = 'none';
        if (tooltip) tooltip.style.display = 'none';
    } else {
        // Close
        chat.classList.add('opacity-0', 'translate-y-4');
        chat.classList.remove('scale-100');
        setTimeout(() => chat.classList.add('hidden'), 300);
        icon1.classList.remove('opacity-0', 'scale-0');
        icon2.classList.add('opacity-0', 'scale-0');
    }
}

// Auto-show tooltip after 5 seconds
setTimeout(() => {
    const tooltip = document.getElementById('chat-tooltip');
    const chat = document.getElementById('ai-chat');
    if (tooltip && chat.classList.contains('hidden')) {
        tooltip.classList.remove('opacity-0', 'translate-x-4');
        setTimeout(() => {
            if (tooltip) tooltip.classList.add('opacity-0', 'translate-x-4');
        }, 5000);
    }
}, 5000);

function addMessage(text, isUser = false) {
    const messages = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = isUser ? 'flex gap-2 justify-end animate-[fade-in_0.3s_ease-out]' : 'flex gap-2 animate-[fade-in_0.3s_ease-out]';

    if (isUser) {
        msgDiv.innerHTML = `
            <div class="bg-primary text-white p-3 rounded-2xl rounded-tr-sm text-body shadow-sm max-w-[85%]">
                ${text}
            </div>
        `;
    } else {
        msgDiv.innerHTML = `
            <div class="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0 flex items-center justify-center text-white text-[12px] mt-1 shadow-[0_2px_10px_rgba(14,165,233,0.3)] border border-white dark:border-slate-800">
                <i class="fas fa-tooth drop-shadow-sm"></i>
            </div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-sm text-body text-surface-dark dark:text-surface-light shadow-sm border border-slate-100 dark:border-slate-700 max-w-[85%]">
                ${text}
            </div>
        `;
    }
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
}

function handleQuickAction(action) {
    addMessage(action, true);
    setTimeout(() => {
        if (action === 'Book Appointment') {
            addMessage('Great! You can scroll up to our Smart Booking System or click <a href="#appointment" class="text-primary font-bold underline" onclick="toggleChat()">here</a> to start.');
        } else if (action === 'Teeth Whitening') {
            addMessage('Teeth whitening is one of our most popular treatments! It is painless, fast, and results are visible immediately. Want to book a consultation?');
        } else if (action === 'Location') {
            addMessage('We are located in the heart of the city. You can find our full address and Google Maps directions in the contact section below.');
        }
    }, 800);
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, true);
    input.value = '';

    // Show typing indicator
    const messages = document.getElementById('chat-messages');
    const typingDiv = document.createElement('div');
    typingDiv.id = 'typing-indicator';
    typingDiv.className = 'flex gap-2 animate-[fade-in_0.3s_ease-out]';
    typingDiv.innerHTML = `
        <div class="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0 flex items-center justify-center text-white text-[12px] mt-1 shadow-[0_2px_10px_rgba(14,165,233,0.3)] border border-white dark:border-slate-800">
            <i class="fas fa-tooth drop-shadow-sm"></i>
        </div>
        <div class="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-sm text-body text-surface-dark dark:text-surface-light shadow-sm border border-slate-100 dark:border-slate-700 max-w-[85%] flex items-center gap-1">
            <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
            <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
            <div class="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
        </div>
    `;
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;

    // Fetch from backend
    const apiUrl = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:') 
        ? 'http://localhost:3000/api/chat' 
        : '/api/chat';

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: text })
    })
    .then(res => {
        if (!res.ok && res.status !== 500) {
            throw new Error(`Server returned status: ${res.status}`);
        }
        return res.text();
    })
    .then(text => {
        try {
            return JSON.parse(text);
        } catch (e) {
            throw new Error('Invalid JSON response from server. Make sure the backend API is running.');
        }
    })
    .then(data => {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();

        // Display bot reply
        addMessage(data.reply);

        // Fallback Logic
        if (data.confidence < 0.5) {
            const waMsg = encodeURIComponent('Hi, I have a question: ' + text);
            addMessage(`
            <a href="https://wa.me/919493596930?text=${waMsg}" target="_blank" class="inline-flex items-center mt-2 px-4 py-2 bg-[#25D366]/10 text-[#25D366] font-bold rounded-lg hover:bg-[#25D366] hover:text-white transition-colors border border-[#25D366]/30"><i class="fab fa-whatsapp mr-2 text-lg"></i> Chat on WhatsApp</a>`);
        }
    })
    .catch(error => {
        console.error('Chat API Error:', error);
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.remove();
        
        const waMsg = encodeURIComponent('Hi, I have a question: ' + text);
        let errorMsg = "Our assistant is temporarily unavailable.";
        
        if (error.message === 'Failed to fetch') {
            errorMsg = "Unable to connect to the assistant backend. If you are running locally, please ensure the Node.js server is running (`npm start`).";
        }
        
        addMessage(`${errorMsg} Please reach out to us directly — we're happy to help!<br><br>
        <a href="https://wa.me/919493596930?text=${waMsg}" target="_blank" class="inline-flex items-center mt-2 px-4 py-2 bg-[#25D366]/10 text-[#25D366] font-bold rounded-lg hover:bg-[#25D366] hover:text-white transition-colors border border-[#25D366]/30"><i class="fab fa-whatsapp mr-2 text-lg"></i> Chat on WhatsApp</a>`);
    });
}

function clearChat() {
    const messages = document.getElementById('chat-messages');
    messages.innerHTML = `
        <div class="flex gap-2">
            <div class="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-accent flex-shrink-0 flex items-center justify-center text-white text-[12px] mt-1 shadow-[0_2px_10px_rgba(14,165,233,0.3)] border border-white dark:border-slate-800">
                <i class="fas fa-tooth drop-shadow-sm"></i>
            </div>
            <div class="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-sm text-body text-surface-dark dark:text-surface-light shadow-sm border border-slate-100 dark:border-slate-700 animate-[fade-in_0.3s_ease-out]">
                Hi 👋 I’m your Smile Assistant.<br><br>I can help you choose treatments, answer questions, or book an appointment.
            </div>
        </div>
        <div class="flex flex-wrap gap-2 pl-8 animate-[fade-in_0.5s_ease-out_0.5s_both]">
            <button onclick="handleQuickAction('Book Appointment')" class="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-all duration-200 border border-primary/20">Book Appointment</button>
            <button onclick="handleQuickAction('Teeth Whitening')" class="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-all duration-200 border border-primary/20">Teeth Whitening Info</button>
            <button onclick="handleQuickAction('Location')" class="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-all duration-200 border border-primary/20">Clinic Location</button>
        </div>
    `;
}

// Horizontal Journey Scroll Logic
const journeyTrack = document.getElementById('journey-track');
const journeyCards = document.querySelectorAll('.journey-card');
const progressLine = document.getElementById('journey-progress');
const mobileDots = document.getElementById('mobile-dots')?.children;

if (journeyTrack && journeyCards.length > 0) {
    const updateActiveCard = () => {
        let trackCenter;
        let isMobile = window.innerWidth < 768;

        if (isMobile) {
            trackCenter = journeyTrack.getBoundingClientRect().top + journeyTrack.clientHeight / 2;
        } else {
            trackCenter = journeyTrack.getBoundingClientRect().left + journeyTrack.clientWidth / 2;
        }

        let closestCard = journeyCards[0];
        let minDistance = Infinity;

        journeyCards.forEach((card) => {
            let cardCenter;
            if (isMobile) {
                cardCenter = card.getBoundingClientRect().top + card.clientHeight / 2;
            } else {
                cardCenter = card.getBoundingClientRect().left + card.clientWidth / 2;
            }
            const distance = Math.abs(trackCenter - cardCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestCard = card;
            }
        });

        journeyCards.forEach((card, index) => {
            if (card === closestCard) {
                card.classList.add('active', 'scale-105', 'opacity-100', '!border-primary', 'shadow-[0_0_30px_rgba(56,189,248,0.2)]');
                card.classList.remove('scale-90', 'opacity-60', 'border-transparent');

                if (progressLine) {
                    const progressPercentage = (index / (journeyCards.length - 1)) * 100;
                    progressLine.style.width = `${progressPercentage}%`;
                }

                if (mobileDots) {
                    Array.from(mobileDots).forEach((dot, i) => {
                        if (i === index) {
                            dot.classList.add('bg-primary', 'w-6');
                            dot.classList.remove('bg-slate-300', 'dark:bg-slate-700', 'w-2');
                        } else {
                            dot.classList.remove('bg-primary', 'w-6');
                            dot.classList.add('bg-slate-300', 'dark:bg-slate-700', 'w-2');
                        }
                    });
                }
            } else {
                card.classList.remove('active', 'scale-105', 'opacity-100', '!border-primary', 'shadow-[0_0_30px_rgba(56,189,248,0.2)]');
                card.classList.add('scale-90', 'opacity-60', 'border-transparent');
            }
        });
    };

    journeyTrack.addEventListener('scroll', () => { requestAnimationFrame(updateActiveCard); });
    window.addEventListener('resize', updateActiveCard);

    journeyCards.forEach(card => {
        card.addEventListener('click', () => {
            card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'center' });
        });
    });

    setTimeout(updateActiveCard, 100);
}

// Live Status Checking
function updateLiveStatus() {
    const statusEl = document.getElementById('live-status');
    if (!statusEl) return;

    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeNum = hours + minutes / 60;

    const isOpen = day !== 0 && timeNum >= 10 && timeNum < 20.5; // Mon-Sat, 10:00 AM to 8:30 PM

    const dot = statusEl.querySelector('span.w-2');
    const text = statusEl.querySelector('.status-text');

    if (isOpen) {
        statusEl.className = 'px-3 py-1.5 rounded-full border flex items-center gap-2 text-xs font-bold transition-colors bg-green-50 border-green-200 text-green-600 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400';
        dot.className = 'w-2 h-2 rounded-full bg-green-500 animate-pulse';
        text.innerText = 'Open Now';
    } else {
        statusEl.className = 'px-3 py-1.5 rounded-full border flex items-center gap-2 text-xs font-bold transition-colors bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400';
        dot.className = 'w-2 h-2 rounded-full bg-red-500';
        text.innerText = 'Closed';
    }
}
updateLiveStatus();
setInterval(updateLiveStatus, 60000); // Check every minute
