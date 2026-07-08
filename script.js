let selectedSites = [];

async function loadSites() {
    try {
        const res = await fetch('http://localhost:3000/sites');
        const sites = await res.json();

        renderCategory('services', sites.filter(s => s.category === 'services'));
        renderCategory('marketplace', sites.filter(s => s.category === 'marketplace'));
        renderCategory('store', sites.filter(s => s.category === 'store'));
    } catch (e) {
        console.error(e);
    }
}

function renderCategory(containerId, sites) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = sites.map(site => `
        <div class="icon" 
             data-name="${site.name}" 
             data-url="${site.url}">
            <img src="${site.icon}" alt="${site.name}">
        </div>
    `).join('');

    container.querySelectorAll('.icon').forEach(icon => {
        icon.addEventListener('mouseenter', () => {
            showPreview(icon.dataset.name);
        });
        icon.addEventListener('mouseleave', hidePreview);

        icon.addEventListener('click', () => {
            addToSelected(icon.dataset.name, icon.dataset.url);
        });
    });
}

const previewEl = document.getElementById('preview');

function showPreview(name) {
    previewEl.textContent = name;
    previewEl.style.opacity = '1';
}

function hidePreview() {
    previewEl.style.opacity = '0';
}

function addToSelected(name, url) {
    if (selectedSites.find(s => s.name === name)) return;
    selectedSites.push({name, url});

    const list = document.getElementById('selected-list');
    const li = document.createElement('li');
    li.textContent = name;
    li.onclick = () => window.open(url, '_blank');
    list.appendChild(li);
}

function clearSelected() {
    selectedSites = [];
    document.getElementById('selected-list').innerHTML = '';
}

document.addEventListener('DOMContentLoaded', loadSites);