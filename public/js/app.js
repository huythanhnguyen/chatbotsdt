/**
 * Main Application for Phone Analysis App
 * Entry point and initialization
 */

/**
 * Initialize the application when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', async function() {
    debug('Initializing application...');
    
    try {
        // Hiển thị màn hình loading
        showLoading();
        
        // Đợi một chút để đảm bảo DOM đã sẵn sàng
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Khởi tạo xác thực trước tiên
        const authResult = await initializeAuth();
        
        // Khởi tạo UI trước chat
        await initializeUI();
        
        // Hiển thị container phù hợp dựa vào kết quả xác thực
        showAppropriateContainer(authResult.authenticated);
        
        // Khởi tạo Chat sau khi UI đã hiển thị
        await initializeChat();
        
        // Ẩn màn hình loading
        hideLoading();
        
        debug('Application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
        showErrorMessage('Không thể khởi tạo ứng dụng. Vui lòng tải lại trang: ' + error.message);
        hideLoading();
    }
});

/**
 * Hiển thị màn hình loading
 */
function showLoading() {
    const loadingContainer = document.getElementById('loading-container');
    if (loadingContainer) {
        loadingContainer.style.display = 'flex';
    }
}

/**
 * Ẩn màn hình loading
 */
function hideLoading() {
    const loadingContainer = document.getElementById('loading-container');
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
}

/**
 * Hiển thị container thích hợp dựa trên trạng thái xác thực
 * @param {boolean} isAuthenticated - Trạng thái xác thực của người dùng
 */
function showAppropriateContainer(isAuthenticated) {
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    
    if (authContainer && appContainer) {
        if (isAuthenticated) {
            // Nếu đã đăng nhập: hiển thị ứng dụng, ẩn form đăng nhập
            authContainer.style.display = 'none';
            appContainer.style.display = 'block';
            
            // Cập nhật thông tin người dùng
            updateUserInfo();
        } else {
            // Nếu chưa đăng nhập: hiển thị form đăng nhập, ẩn ứng dụng
            authContainer.style.display = 'flex';
            appContainer.style.display = 'none';
        }
    }
}

/**
 * Cập nhật thông tin người dùng trong giao diện
 */
function updateUserInfo() {
    const currentUser = Auth.getCurrentUser();
    
    if (currentUser) {
        const userNameElement = document.getElementById('user-name');
        const accountNameElement = document.getElementById('account-name');
        const accountEmailElement = document.getElementById('account-email');
        const accountCreatedElement = document.getElementById('account-created');
        
        if (userNameElement) {
            userNameElement.textContent = `Xin chào, ${currentUser.name}`;
        }
        
        if (accountNameElement) {
            accountNameElement.textContent = currentUser.name;
        }
        
        if (accountEmailElement) {
            accountEmailElement.textContent = currentUser.email;
        }
        
        if (accountCreatedElement && currentUser.createdAt) {
            const createdDate = new Date(currentUser.createdAt);
            accountCreatedElement.textContent = createdDate.toLocaleDateString('vi-VN');
        }
    }
}

/**
 * Initialize authentication
 */
async function initializeAuth() {
    debug('Initializing Auth service...');
    
    try {
        // Initialize auth service
        const authResult = await Auth.init();
        debug('Auth initialization result:', authResult);
        
        return authResult;
    } catch (error) {
        console.error('Auth initialization failed:', error);
        throw error;
    }
}

/**
 * Initialize UI components
 */
async function initializeUI() {
    debug('Initializing UI service...');
    
    try {
        // Initialize UI service
        UI.init();
        
        debug('UI initialized successfully');
    } catch (error) {
        console.error('UI initialization failed:', error);
        throw error;
    }
}

/**
 * Initialize chat functionality
 */
function initializeChat() {
    debug('Initializing Chat service...');
    
    try {
        // Initialize chat service
        Chat.init();
        
        debug('Chat initialized successfully');
    } catch (error) {
        console.error('Chat initialization failed:', error);
        throw error;
    }
}
/**
 * Hiển thị màn hình loading
 */
function showLoading() {
    const loadingContainer = document.getElementById('loading-container');
    if (loadingContainer) {
        loadingContainer.style.display = 'flex';
    }
}

/**
 * Ẩn màn hình loading
 */
function hideLoading() {
    const loadingContainer = document.getElementById('loading-container');
    if (loadingContainer) {
        loadingContainer.style.display = 'none';
    }
}
/**
 * Hiển thị container thích hợp dựa trên trạng thái xác thực
 * @param {boolean} isAuthenticated - Trạng thái xác thực của người dùng
 */
function showAppropriateContainer(isAuthenticated) {
    const authContainer = document.getElementById('auth-container');
    const appContainer = document.getElementById('app-container');
    
    if (authContainer && appContainer) {
        if (isAuthenticated) {
            // Nếu đã đăng nhập: hiển thị ứng dụng, ẩn form đăng nhập
            authContainer.style.display = 'none';
            appContainer.style.display = 'block';
            
            // Cập nhật thông tin người dùng
            updateUserInfo();
        } else {
            // Nếu chưa đăng nhập: hiển thị form đăng nhập, ẩn ứng dụng
            authContainer.style.display = 'flex';
            appContainer.style.display = 'none';
        }
    }
}
/**
 * Show error message to the user
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
    // Create error element if it doesn't exist
    let errorElement = document.getElementById('app-error');
    
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.id = 'app-error';
        errorElement.style.position = 'fixed';
        errorElement.style.top = '10px';
        errorElement.style.left = '50%';
        errorElement.style.transform = 'translateX(-50%)';
        errorElement.style.backgroundColor = 'var(--danger-color)';
        errorElement.style.color = 'white';
        errorElement.style.padding = '10px 20px';
        errorElement.style.borderRadius = 'var(--radius-md)';
        errorElement.style.boxShadow = 'var(--shadow-md)';
        errorElement.style.zIndex = '9999';
        errorElement.style.maxWidth = '80%';
        errorElement.style.textAlign = 'center';
        
        document.body.appendChild(errorElement);
    }
    
    // Update error message
    errorElement.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('span');
    closeButton.innerHTML = '&times;';
    closeButton.style.marginLeft = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontWeight = 'bold';
    closeButton.addEventListener('click', function() {
        errorElement.remove();
    });
    
    errorElement.appendChild(closeButton);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (errorElement.parentNode) {
            errorElement.remove();
        }
    }, 10000);
}

/**
 * Handle window resize event
 * Adjusts UI based on screen size
 */
window.addEventListener('resize', function() {
    // Close info panel on mobile when resizing to desktop
    if (window.innerWidth > 992) {
        UI.closeInfoPanel();
    }
});

// Lắng nghe sự kiện thay đổi trạng thái đăng nhập
document.addEventListener('authStateChanged', function() {
    const isLoggedIn = Auth.isAuthenticated();
    debug('Auth state changed event:', isLoggedIn ? 'Logged in' : 'Logged out');
    
    // Cập nhật UI dựa trên trạng thái đăng nhập
    showAppropriateContainer(isLoggedIn);
    
    // Nếu đăng nhập thành công, tải lịch sử phân tích
    if (isLoggedIn && UI && typeof UI.loadAnalysisHistory === 'function') {
        UI.loadAnalysisHistory();
    }
});
/**
 * Xử lý sự kiện click cho tab thông tin
 * Thêm vào script.js hoặc app.js
 */
document.addEventListener('DOMContentLoaded', function() {
    // Đảm bảo tab thông tin hoạt động đúng
    function setupInfoTabs() {
        const tabs = document.querySelectorAll('.info-tab-button');
        if (tabs.length === 0) return;
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Bỏ active tất cả tab
                tabs.forEach(t => t.classList.remove('active'));
                
                // Thêm active cho tab hiện tại
                this.classList.add('active');
                
                // Lấy tên tab
                const tabName = this.getAttribute('data-tab');
                if (!tabName) return;
                
                // Bỏ active tất cả nội dung
                const contents = document.querySelectorAll('.info-tab-content');
                contents.forEach(c => c.classList.remove('active'));
                
                // Thêm active cho nội dung tương ứng
                const targetContent = document.getElementById(`${tabName}-tab`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                
                // Cuộn tab đang chọn vào giữa view nếu cần
                const tabContainer = document.querySelector('.info-tabs');
                if (tabContainer) {
                    const tabRect = this.getBoundingClientRect();
                    const containerRect = tabContainer.getBoundingClientRect();
                    
                    // Tính toán vị trí cuộn để đưa tab vào giữa
                    if (tabRect.left < containerRect.left || tabRect.right > containerRect.right) {
                        const scrollLeft = this.offsetLeft - (tabContainer.clientWidth / 2) + (this.clientWidth / 2);
                        tabContainer.scrollTo({
                            left: scrollLeft,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
    
    // Gọi hàm thiết lập
    setupInfoTabs();
    
    // Đăng ký lại nếu DOM thay đổi (ví dụ khi chuyển view)
    const observer = new MutationObserver(function(mutations) {
        let shouldResetup = false;
        
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && 
                (mutation.target.classList.contains('info-tabs') || 
                 mutation.target.id === 'info-panel')) {
                shouldResetup = true;
            }
        });
        
        if (shouldResetup) {
            setupInfoTabs();
        }
    });
    
    const infoPanel = document.getElementById('info-panel');
    if (infoPanel) {
        observer.observe(infoPanel, { childList: true, subtree: true });
    }
});
// Khắc phục toàn diện cho khung chat
document.addEventListener('DOMContentLoaded', function() {
    console.log('Installing comprehensive chat fix');
    
    setTimeout(function() {
        try {
            // Tham chiếu đến các phần tử cần thiết
            const userInput = document.getElementById('user-input');
            const sendButton = document.getElementById('send-button');
            const chatMessages = document.getElementById('chat-messages');
            
            if (userInput && sendButton && chatMessages) {
                console.log('Chat elements found, applying fix');
                
                // Xóa tất cả sự kiện hiện có
                const newInput = userInput.cloneNode(true);
                userInput.parentNode.replaceChild(newInput, userInput);
                
                const newButton = sendButton.cloneNode(true);
                sendButton.parentNode.replaceChild(newButton, sendButton);
                
                // Hàm trực tiếp xử lý tin nhắn
                function processMessage() {
                    const text = newInput.value.trim();
                    if (!text) return;
                    
                    console.log('Processing message:', text);
                    
                    // Hiển thị tin nhắn người dùng
                    const template = document.getElementById('user-message-template');
                    if (template) {
                        const messageElement = template.content.cloneNode(true);
                        const messageDiv = messageElement.querySelector('.message');
                        messageDiv.id = `msg_user_${Date.now()}`;
                        messageDiv.querySelector('.message-content').textContent = text;
                        chatMessages.appendChild(messageElement);
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                    }
                    
                    // Xóa nội dung input
                    newInput.value = '';
                    
                    // Hiển thị indicator đang nhập
                    const typingIndicator = document.getElementById('typing-indicator');
                    if (typingIndicator) {
                        typingIndicator.classList.remove('hidden');
                    }
                    
                    // Định rõ thành phần Chat.processUserInput
                    try {
                        if (window.Chat && typeof window.Chat.processUserInput === 'function') {
                            window.Chat.processUserInput(text);
                        } else {
                            console.error('Chat.processUserInput is not a function');
                            
                            // Fallback nếu không tìm thấy Chat.processUserInput
                            setTimeout(() => {
                                const botTemplate = document.getElementById('bot-message-template');
                                if (botTemplate) {
                                    const botElement = botTemplate.content.cloneNode(true);
                                    const botDiv = botElement.querySelector('.message');
                                    botDiv.id = `msg_bot_${Date.now()}`;
                                    botDiv.querySelector('.message-content').textContent = 
                                        `Đã nhận tin nhắn của bạn: "${text}". Tuy nhiên, hệ thống xử lý không phản hồi.`;
                                    chatMessages.appendChild(botElement);
                                    chatMessages.scrollTop = chatMessages.scrollHeight;
                                }
                                
                                if (typingIndicator) {
                                    typingIndicator.classList.add('hidden');
                                }
                            }, 1000);
                        }
                    } catch (error) {
                        console.error('Error calling processUserInput:', error);
                    }
                }
                
                // Thiết lập sự kiện mới
                newInput.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        processMessage();
                    }
                });
                
                newButton.addEventListener('click', processMessage);
                
                // Tập trung vào input
                newInput.focus();
                
                console.log('Chat fix applied successfully');
            } else {
                console.error('Could not find all required chat elements');
            }
        } catch (error) {
            console.error('Error applying chat fix:', error);
        }
    }, 1000); // Đợi 1 giây để đảm bảo các script khác đã chạy xong
});
