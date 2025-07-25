  let currentPanel = null;
        let currentTab = 'basic';

        // Navigation item click handler
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', function() {
                const panelType = this.getAttribute('data-panel');
                openPanel(panelType, this);
            });
        });

        function openPanel(panelType, navItem) {
            const expandedPanel = document.getElementById('expandedPanel');
            const panelTitle = document.getElementById('panelTitle');
            
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked nav item
            navItem.classList.add('active');
            
            // Update panel title
            panelTitle.textContent = panelType.charAt(0).toUpperCase() + panelType.slice(1);
            
            // Hide all tab panels
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.style.display = 'none';
                panel.classList.remove('active');
            });
            
            // Show the appropriate panel content
            const activePanel = document.getElementById(`${panelType}-${currentTab}`);
            if (activePanel) {
                activePanel.style.display = 'block';
                activePanel.classList.add('active');
            }
            
            // Open the panel
            expandedPanel.classList.add('open');
            currentPanel = panelType;
            
            // Reset tab navigation
            resetTabNavigation();
        }

        function closePanel() {
            const expandedPanel = document.getElementById('expandedPanel');
            expandedPanel.classList.remove('open');
            
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            currentPanel = null;
        }

        function switchTab(tabType) {
            if (!currentPanel) return;
            
            // Update tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            event.target.classList.add('active');
            
            // Hide all tab panels
            document.querySelectorAll('.tab-panel').forEach(panel => {
                panel.style.display = 'none';
                panel.classList.remove('active');
            });
            
            // Show the selected tab panel
            const targetPanel = document.getElementById(`${currentPanel}-${tabType}`);
            if (targetPanel) {
                targetPanel.style.display = 'block';
                targetPanel.classList.add('active');
            }
            
            currentTab = tabType;
        }

        function resetTabNavigation() {
            // Reset to basic tab
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector('.tab-btn').classList.add('active');
            currentTab = 'basic';
        }

        // Close panel when clicking outside
        document.addEventListener('click', function(event) {
            const expandedPanel = document.getElementById('expandedPanel');
            const sidenav = document.querySelector('.sidenav');
            
            if (currentPanel && 
                !expandedPanel.contains(event.target) && 
                !sidenav.contains(event.target)) {
                closePanel();
            }
        });

        // Prevent panel from closing when clicking inside it
        document.getElementById('expandedPanel').addEventListener('click', function(event) {
            event.stopPropagation();
        });

// Linear vs. Interval Function 

const discountMethodSelect = document.getElementById('discountMethod');
const linearOptions = document.getElementById('linearOptions');
const intervalOptions = document.querySelector('#intervalOptions');

function updateDiscountOptionsUI(method) {
    if (method === 'linear') {
        linearOptions.style.display = 'block';
        intervalOptions.style.display = 'none';
    } else if (method === 'intervals') {
        linearOptions.style.display = 'none';
        intervalOptions.style.display = 'block';
    }
}

// Initial state
updateDiscountOptionsUI(discountMethodSelect.value);

// Listen for changes
discountMethodSelect.addEventListener('change', (e) => {
    updateDiscountOptionsUI(e.target.value);
});


const addNewInterval = document.querySelector('#addNewInterval');

addNewInterval.addEventListener('click', (e) => {
  e.preventDefault();

  const newIntervalDiv = document.createElement('div');
  newIntervalDiv.classList.add('form-group', 'interval');

  newIntervalDiv.innerHTML = `
    <div class="exitbutton">X</div>
    <label class="form-label">Discount Starts At</label>
    <input type="number" class="form-input" value="5">
    <label class="form-label">Discount Percentage (%)</label>
    <input type="number" class="form-input" value="5">
  `;

  intervalOptions.insertBefore(newIntervalDiv, addNewInterval);
});

// ✅ Use event delegation to handle all future ".exitbutton" clicks
intervalOptions.addEventListener('click', (e) => {
  if (e.target.classList.contains('exitbutton')) {
    const interval = e.target.closest('.interval');
    if (interval) interval.remove();
  }
});


