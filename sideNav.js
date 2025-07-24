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