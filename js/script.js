// 蓝牙教程网站交互脚本

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initNavigation();
    initScrollSpy();
    initBackToTop();
    initSmoothScroll();
    initMobileMenu();
});

// 导航功能
function initNavigation() {
    // 为所有导航链接添加点击事件
    const navLinks = document.querySelectorAll('.tree-nav a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 移除所有active类
            navLinks.forEach(l => l.classList.remove('active'));
            // 添加active类到当前链接
            this.classList.add('active');
        });
    });
}

// 滚动监听 - 高亮当前章节
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.tree-nav a');
    
    function onScroll() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // 节流处理
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                onScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// 回到顶部按钮
function initBackToTop() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }
    
    // 初始检查
    toggleBackToTop();
    
    // 滚动时检查
    window.addEventListener('scroll', toggleBackToTop);
}

// 平滑滚动
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const targetPosition = targetElement.offsetTop - 80;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 移动端菜单
function initMobileMenu() {
    // 创建移动端菜单按钮
    if (window.innerWidth <= 768) {
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.className = 'mobile-menu-btn';
        mobileMenuBtn.innerHTML = '☰';
        mobileMenuBtn.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 1000;
            background: linear-gradient(135deg, #0082FC 0%, #0066CC 100%);
            color: white;
            border: none;
            border-radius: 8px;
            width: 50px;
            height: 50px;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,130,252,0.4);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(mobileMenuBtn);
        
        // 点击切换菜单
        mobileMenuBtn.addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            sidebar.classList.toggle('open');
        });
        
        // 点击内容区域关闭菜单
        document.querySelector('.main').addEventListener('click', function() {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    }
}

// 滚动到顶部函数
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// 卡片悬停效果增强
function enhanceCardHover() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// FAQ折叠功能
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const header = item.querySelector('h4');
        if (header) {
            header.style.cursor = 'pointer';
            header.addEventListener('click', function() {
                // 切换展开/折叠
                const content = item.querySelectorAll('ul, p');
                content.forEach(c => {
                    if (c.style.display === 'none') {
                        c.style.display = 'block';
                    } else {
                        c.style.display = 'none';
                    }
                });
            });
        }
    });
}

// 表格行高亮
function enhanceTable() {
    const tables = document.querySelectorAll('.table tbody tr');
    tables.forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)';
            this.style.boxShadow = '0 4px 12px rgba(0,130,252,0.15)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });
}

// 初始化所有增强功能
enhanceCardHover();
initFaqAccordion();
enhanceTable();

// 打印功能
function printPage() {
    window.print();
}

// 键盘快捷键
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + P 打印
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        printPage();
    }
    
    // Esc 关闭移动端菜单
    if (e.key === 'Escape') {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
        }
    }
});

// 性能优化：懒加载图片（如果有）
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

initLazyLoading();

// 添加搜索功能（可选）
function addSearchFunctionality() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = '搜索内容...';
    searchInput.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        padding: 12px 20px;
        border: 2px solid #0082FC;
        border-radius: 25px;
        font-size: 14px;
        width: 250px;
        outline: none;
        box-shadow: 0 4px 12px rgba(0,130,252,0.3);
        transition: all 0.3s ease;
    `;
    
    searchInput.addEventListener('focus', function() {
        this.style.boxShadow = '0 8px 24px rgba(0,130,252,0.4)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.style.boxShadow = '0 4px 12px rgba(0,130,252,0.3)';
    });
    
    document.body.appendChild(searchInput);
    
    // 搜索功能实现
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                section.style.display = 'block';
            } else {
                section.style.display = searchTerm === '' ? 'block' : 'none';
            }
        });
    });
}

// 取消注释以启用搜索功能
// addSearchFunctionality();

// 添加主题切换功能（可选）
function addThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.innerHTML = '🌓';
    themeToggle.style.cssText = `
        position: fixed;
        top: 20px;
        right: 80px;
        z-index: 1000;
        background: linear-gradient(135deg, #0082FC 0%, #0066CC 100%);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        font-size: 24px;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,130,252,0.4);
        transition: all 0.3s ease;
    `;
    
    let isDark = false;
    
    themeToggle.addEventListener('click', function() {
        isDark = !isDark;
        
        if (isDark) {
            document.documentElement.style.setProperty('--bg', '#0D1117');
            document.documentElement.style.setProperty('--text', '#c9d1d9');
            document.documentElement.style.setProperty('--text-light', '#8b949e');
            document.documentElement.style.setProperty('--bg-gray', '#161b22');
            document.documentElement.style.setProperty('--border', '#30363d');
            document.documentElement.style.setProperty('--code-bg', '#161b22');
        } else {
            document.documentElement.style.setProperty('--bg', '#ffffff');
            document.documentElement.style.setProperty('--text', '#24292f');
            document.documentElement.style.setProperty('--text-light', '#57606a');
            document.documentElement.style.setProperty('--bg-gray', '#f8f9fa');
            document.documentElement.style.setProperty('--border', '#d0d7de');
            document.documentElement.style.setProperty('--code-bg', '#f6f8fa');
        }
    });
    
    document.body.appendChild(themeToggle);
}

// 取消注释以启用主题切换
// addThemeToggle();

// Tab 切换功能
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有 active
            this.parentElement.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            // 添加 active 到当前
            this.classList.add('active');

            // 隐藏所有 tab 内容
            const tabContainer = this.closest('.tab-container');
            tabContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });

            // 显示对应的 tab 内容
            const tabId = this.getAttribute('data-tab');
            tabContainer.querySelector(`#${tabId}`).classList.add('active');
        });
    });
});

console.log('蓝牙教程网站已加载完成！');