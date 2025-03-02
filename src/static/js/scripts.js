document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const messages = document.getElementById('messages');
    const modeButtons = document.querySelectorAll('.mode-btn');
    const toggleButton = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;
    const loaderContainer = document.getElementById('loader-container');
    
    // Track if the last message was about a legal question
    let isLegalQuestionMode = false;

    modeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const mode = button.getAttribute('data-mode');
            if (mode === 'legal question') {
                isLegalQuestionMode = true;
            }
            sendMessage(mode);
        });
    });

    sendBtn.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            sendMessage(message);
            userInput.value = '';
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendBtn.click();
        }
    });

    function sendMessage(message) {
        // Disable input while processing
        userInput.disabled = true;
        sendBtn.disabled = true;
        
        const userMessage = document.createElement('div');
        userMessage.classList.add('message', 'user-message');
        if (body.classList.contains('dark-mode')) {
            userMessage.classList.add('dark-mode');
        }
        userMessage.textContent = message;
        messages.appendChild(userMessage);
        
        // Show loading indicator if we're in legal question mode
        if (isLegalQuestionMode) {
            loaderContainer.style.display = 'block';
            messages.scrollTop = messages.scrollHeight;
        }

        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        })
        .then(response => response.json())
        .then(data => {
            // Hide loading indicator
            loaderContainer.style.display = 'none';
            
            const botMessage = document.createElement('div');
            botMessage.classList.add('message', 'bot-message');
            if (body.classList.contains('dark-mode')) {
                botMessage.classList.add('dark-mode');
            }
            // Allow HTML in responses (for download links)
            botMessage.innerHTML = data.response;
            messages.appendChild(botMessage);
            messages.scrollTop = messages.scrollHeight;
            
            // Update legal question mode status
            if (message.toLowerCase().includes('legal question')) {
                isLegalQuestionMode = true;
            } else if (data.response.includes('Please select a mode')) {
                isLegalQuestionMode = false;
            }
            
            // Re-enable input
            userInput.disabled = false;
            sendBtn.disabled = false;
            userInput.focus();
        })
        .catch(error => {
            console.error('Error:', error);
            // Hide loading indicator and re-enable input on error
            loaderContainer.style.display = 'none';
            userInput.disabled = false;
            sendBtn.disabled = false;
            
            // Show error message
            const errorMessage = document.createElement('div');
            errorMessage.classList.add('message', 'bot-message', 'error');
            errorMessage.textContent = "Sorry, there was an error processing your request. Please try again.";
            messages.appendChild(errorMessage);
            messages.scrollTop = messages.scrollHeight;
        });
    }

    toggleButton.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        document.querySelector('header').classList.toggle('dark-mode');
        document.querySelector('h1').classList.toggle('dark-mode');
        document.querySelector('.tagline').classList.toggle('dark-mode');
        document.querySelector('.user-info span').classList.toggle('dark-mode');
        document.querySelector('.chat-container').classList.toggle('dark-mode');
        document.querySelector('.messages').classList.toggle('dark-mode');
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.toggle('dark-mode'));
        document.querySelectorAll('.message').forEach(msg => msg.classList.toggle('dark-mode'));
        
        // Toggle the theme button itself
        toggleButton.classList.toggle('dark-mode');
        
        // Update icon and label
        const themeLabel = document.querySelector('.theme-label');
        
        if (body.classList.contains('dark-mode')) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
            
            if (themeLabel) {
                themeLabel.textContent = 'Dark';
            }
            
            // Save preference
            localStorage.setItem('theme', 'dark');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
            
            if (themeLabel) {
                themeLabel.textContent = 'Light';
            }
            
            // Save preference
            localStorage.setItem('theme', 'light');
        }

        // Also update loader if it's visible
        if (body.classList.contains('dark-mode')) {
            loaderContainer.classList.add('dark-mode');
        } else {
            loaderContainer.classList.remove('dark-mode');
        }
    });
    
    // Check for saved theme preference and apply it on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        toggleButton.click();
    }
});