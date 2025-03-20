/**
 * Xử lý hiển thị phân tích số điện thoại trong tin nhắn chat
 */

// Hàm tạo phân tích từ dữ liệu API
function createAnalysisElement(analysisData) {
    // Tạo phần tử từ template
    const template = document.getElementById('analysis-template');
    if (!template) {
        console.error('Template phân tích không tìm thấy');
        return null;
    }
    
    const analysisElement = template.content.cloneNode(true);
    const container = analysisElement.querySelector('.analysis-container');
    
    // Điền số điện thoại
    container.querySelector('.phone-number').textContent = formatPhoneNumber(analysisData.phoneNumber);

    
    // Thiết lập sự kiện cho nút toggle
    const toggleBtn = container.querySelector('.toggle-analysis-btn');
    const detailsSection = container.querySelector('.analysis-details');
    
    toggleBtn.addEventListener('click', function() {
        const isExpanded = this.getAttribute('data-expanded') === 'true';
        this.setAttribute('data-expanded', !isExpanded);
        
        if (!isExpanded) {
            detailsSection.classList.add('active');
            // Render các chi tiết nếu đây là lần đầu mở rộng
            if (!detailsSection.getAttribute('data-rendered')) {
                renderStars(container, analysisData.starSequence);
                renderCombinations(container, analysisData.keyCombinations);
                renderWarnings(container, analysisData.dangerousCombinations);
                detailsSection.setAttribute('data-rendered', 'true');
            }
        } else {
            detailsSection.classList.remove('active');
        }
    });
    
    // Thiết lập sự kiện cho các tab
    const tabButtons = container.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Đổi tab active
            container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Hiển thị nội dung tab tương ứng
            const tabId = this.getAttribute('data-tab');
            container.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            container.querySelector('#' + tabId).classList.add('active');
        });
    });
    
    return container;
}

// Hiển thị các sao
function renderStars(container, stars) {
    if (!stars || !stars.length) return;
    
    const starList = container.querySelector('.star-list');
    if (!starList) return;
    
    // Sắp xếp sao theo năng lượng (cao nhất trước)
    const sortedStars = [...stars].sort((a, b) => b.energyLevel - a.energyLevel);
    
    // Hiển thị tối đa 8 sao
    const displayStars = sortedStars.slice(0, 8);
    
    // Tạo phần tử cho mỗi sao
    displayStars.forEach(star => {
        const starItem = document.createElement('div');
        starItem.className = `star-item ${star.nature === 'Cát' ? 'cat' : star.nature === 'Hung' ? 'hung' : ''}`;
        
        // Tên sao
        const nameEl = document.createElement('div');
        nameEl.className = 'star-name';
        nameEl.textContent = star.name;
        
        // Cặp số
        const pairEl = document.createElement('div');
        pairEl.className = 'star-pair';
        pairEl.textContent = star.originalPair;
        
        // Mức năng lượng
        const energyEl = document.createElement('div');
        energyEl.className = 'star-energy';
        
        const indicatorEl = document.createElement('div');
        indicatorEl.className = 'energy-indicator';
        
        // Tạo 4 chấm hiển thị mức năng lượng
        for (let i = 1; i <= 4; i++) {
            const dot = document.createElement('div');
            dot.className = `energy-dot ${star.nature === 'Cát' ? 'cat' : star.nature === 'Hung' ? 'hung' : ''}`;
            if (i <= star.energyLevel) {
                dot.classList.add('active');
            }
            indicatorEl.appendChild(dot);
        }
        
        energyEl.appendChild(indicatorEl);
        
        // Thêm vào star item
        starItem.appendChild(nameEl);
        starItem.appendChild(pairEl);
        starItem.appendChild(energyEl);
        
        // Thêm vào danh sách
        starList.appendChild(starItem);
    });
}

// Hiển thị các tổ hợp
function renderCombinations(container, combinations) {
    if (!combinations || !combinations.length) {
        // Hiển thị thông báo nếu không có tổ hợp
        const comboList = container.querySelector('.combo-list');
        if (comboList) {
            comboList.innerHTML = '<div class="empty-message">Không có tổ hợp đặc biệt</div>';
        }
        return;
    }
    
    const comboList = container.querySelector('.combo-list');
    if (!comboList) return;
    
    combinations.forEach(combo => {
        const comboItem = document.createElement('div');
        comboItem.className = 'combo-item';
        
        const valueEl = document.createElement('div');
        valueEl.className = 'combo-value';
        valueEl.textContent = combo.value;
        
        const descEl = document.createElement('div');
        descEl.className = 'combo-desc';
        descEl.textContent = combo.description;
        
        comboItem.appendChild(valueEl);
        comboItem.appendChild(descEl);
        
        comboList.appendChild(comboItem);
    });
}

// Hiển thị cảnh báo
function renderWarnings(container, warnings) {
    if (!warnings || !warnings.length) {
        // Hiển thị thông báo nếu không có cảnh báo
        const warningList = container.querySelector('.warning-list');
        if (warningList) {
            warningList.innerHTML = '<div class="empty-message">Không có cảnh báo</div>';
        }
        return;
    }
    
    const warningList = container.querySelector('.warning-list');
    if (!warningList) return;
    
    warnings.forEach(warning => {
        const warningItem = document.createElement('div');
        warningItem.className = 'warning-item';
        
        const comboEl = document.createElement('div');
        comboEl.className = 'warning-combo';
        comboEl.textContent = warning.combination;
        
        const descEl = document.createElement('div');
        descEl.className = 'warning-desc';
        descEl.textContent = warning.description;
        
        warningItem.appendChild(comboEl);
        warningItem.appendChild(descEl);
        
        warningList.appendChild(warningItem);
    });
}

// Định dạng số điện thoại
function formatPhoneNumber(phoneNumber) {
    if (!phoneNumber) return '';
    
    const cleaned = String(phoneNumber).replace(/\D/g, '');
    
    if (cleaned.length === 10) {
        return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
    } else if (cleaned.length === 11) {
        return cleaned.replace(/(\d{5})(\d{3})(\d{3})/, '$1 $2 $3');
    }
    
    return cleaned;
}


// Thêm phần tử phân tích vào tin nhắn bot
function addAnalysisToMessage(messageElement, analysisData) {
    if (!messageElement || !analysisData) return;
    
    // Tìm phần tử phân tích hiện có (nếu có) và xóa
    const existingAnalysis = messageElement.querySelector('.analysis-container');
    if (existingAnalysis) {
        existingAnalysis.remove();
    }
    
    // Tạo phần tử phân tích mới
    const analysisElement = createAnalysisElement(analysisData);
    if (!analysisElement) return;
    
    // Thêm sau message-content
    const messageContent = messageElement.querySelector('.message-content');
    if (messageContent) {
        messageContent.insertAdjacentElement('afterend', analysisElement);
    } else {
        messageElement.appendChild(analysisElement);
    }
}

// Cập nhật hàm addBotMessage hiện có để hỗ trợ hiển thị phân tích
function updateAddBotMessage() {
    // Lưu tham chiếu đến hàm gốc
    const originalAddBotMessage = window.UI ? window.UI.addBotMessage : null;
    
    if (!originalAddBotMessage) {
        console.error('Không tìm thấy hàm addBotMessage để cập nhật');
        return;
    }
    
    // Ghi đè hàm
    window.UI.addBotMessage = function(text, analysisData = null) {
        // Gọi hàm gốc để thêm tin nhắn
        const messageId = originalAddBotMessage.call(this, text);
        
        // Nếu có dữ liệu phân tích, thêm vào tin nhắn
        if (analysisData) {
            const messageElement = document.getElementById(messageId);
            if (messageElement) {
                addAnalysisToMessage(messageElement, analysisData);
            }
        }
        
        return messageId;
    };
}

// Thêm mẫu phân tích vào document
function addAnalysisTemplate() {
    // Kiểm tra nếu template đã tồn tại
    if (document.getElementById('analysis-template')) {
        return;
    }
    
    // Tạo template
    const template = document.createElement('template');
    template.id = 'analysis-template';
    template.innerHTML = `
        <div class="analysis-container">
            <div class="analysis-header">
                <h3>Phân tích số: <span class="phone-number"></span></h3>
                <button class="toggle-analysis-btn" data-expanded="false">
                    <i class="fas fa-chevron-down"></i>
                </button>
            </div>
            
            
            <!-- Phần chi tiết (ẩn mặc định) -->
            <div class="analysis-details">
                <!-- Tab Navigation -->
                <div class="analysis-tabs">
                    <button class="tab-btn active" data-tab="stars-tab">Các sao</button>
                    <button class="tab-btn" data-tab="combos-tab">Tổ hợp</button>
                    <button class="tab-btn" data-tab="warning-tab">Cảnh báo</button>
                </div>
                
                <!-- Tab Content -->
                <div class="tab-content">
                    <!-- Tab Các sao -->
                    <div id="stars-tab" class="tab-pane active">
                        <div class="star-list"></div>
                    </div>
                    
                    <!-- Tab Tổ hợp -->
                    <div id="combos-tab" class="tab-pane">
                        <div class="combo-list"></div>
                    </div>
                    
                    <!-- Tab Cảnh báo -->
                    <div id="warning-tab" class="tab-pane">
                        <div class="warning-list"></div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(template);
}

// Khởi tạo
document.addEventListener('DOMContentLoaded', function() {
    // Thêm template phân tích
    addAnalysisTemplate();
    
    // Cập nhật hàm addBotMessage
    updateAddBotMessage();
    
    console.log('Khởi tạo phân tích số điện thoại hoàn tất');
});