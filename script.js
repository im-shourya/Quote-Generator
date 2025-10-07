document.addEventListener('DOMContentLoaded', () => {

    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const newQuoteBtn = document.getElementById('new-quote-btn');
    const copyBtn = document.getElementById('copy-btn');
    const quoteContentEl = document.getElementById('quote-content');
    const quoteAuthorEl = document.getElementById('quote-author');
    const historyContainerEl = document.getElementById('history-container');
    const historyPlaceholder = document.getElementById('history-placeholder');
    const body = document.body;

    
    let currentQuote = { content: '', author: '' };
    let quoteHistory = [];
    const API_URL = 'https://dummyjson.com/quotes/random';

   
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            themeToggleBtn.textContent = '☀️';
        } else {
            body.classList.remove('dark-mode');
            themeToggleBtn.textContent = '🌙';
        }
    };

    const toggleTheme = () => {
        const newTheme = body.classList.contains('dark-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    };


    const fetchQuote = async () => {
    newQuoteBtn.disabled = true;
    newQuoteBtn.textContent = 'Loading...';
    
    
    quoteContentEl.classList.remove('show');
    quoteAuthorEl.textContent = '';

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        
        currentQuote = { content: data.quote, author: data.author };

        quoteAuthorEl.textContent = data.author;
        
        
        setTimeout(() => {
            quoteContentEl.innerHTML = `"${data.quote}"`;
            quoteContentEl.classList.add('show');
        }, 500); 

        
        if (!quoteHistory.some(q => q.content === currentQuote.content)) {
            quoteHistory.unshift(currentQuote);
            if (quoteHistory.length > 5) quoteHistory.pop();
            updateHistory();
            saveHistoryToLocalStorage();
        }

    } catch (error) {
        quoteAuthorEl.textContent = ''; 
        quoteContentEl.innerHTML = '<span class="placeholder">Failed to fetch a quote. Please try again.</span>';
        quoteContentEl.classList.add('show');
        console.error("Error fetching quote:", error);
    } finally {
    
        setTimeout(() => {
            newQuoteBtn.disabled = false;
            newQuoteBtn.textContent = 'New Quote';
        }, 800);
    }
}; 

    const copyQuote = () => {
        if (!currentQuote.content) return;
        const quoteText = `"${currentQuote.content}" — ${currentQuote.author}`;
        navigator.clipboard.writeText(quoteText).then(() => {
            alert('Quote copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };


    const updateHistory = () => {
        if (quoteHistory.length > 0) {
            historyPlaceholder.style.display = 'none';
        } else {
            historyPlaceholder.style.display = 'block';
            return;
        }
        
        historyContainerEl.innerHTML = ''; 
        quoteHistory.forEach(quote => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <blockquote>"${quote.content}"</blockquote>
                <p>— ${quote.author}</p>
            `;
            historyContainerEl.appendChild(historyItem);
        });
    };
    
    
    const saveHistoryToLocalStorage = () => {
        localStorage.setItem('quoteHistory', JSON.stringify(quoteHistory));
    };

    const loadHistoryFromLocalStorage = () => {
        const savedHistory = localStorage.getItem('quoteHistory');
        if (savedHistory) {
            quoteHistory = JSON.parse(savedHistory);
            updateHistory();
        }
    };

    
    const init = () => {
        
        themeToggleBtn.addEventListener('click', toggleTheme);
        newQuoteBtn.addEventListener('click', fetchQuote);
        copyBtn.addEventListener('click', copyQuote);
        
        const savedTheme = localStorage.getItem('theme') || 'light';
        applyTheme(savedTheme);
        
        loadHistoryFromLocalStorage();

        quoteContentEl.classList.add('show');
    };

    init();
});