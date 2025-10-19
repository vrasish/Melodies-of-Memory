// Data management for Results & Data page
let researchData = JSON.parse(localStorage.getItem('melodiesData')) || [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    initializeDataPage();
    updateDataDisplay();
    updateSummaryStats();
});

function initializeDataPage() {
    // Set up form submission
    const form = document.getElementById('dataForm');
    form.addEventListener('submit', handleFormSubmit);

    // Set up range sliders
    setupRangeSliders();

    // Set up filters
    const filterEra = document.getElementById('filterEra');
    filterEra.addEventListener('change', filterData);

    // Set up export button
    const exportBtn = document.getElementById('exportData');
    exportBtn.addEventListener('click', exportData);

    // Set up clear data button
    const clearBtn = document.getElementById('clearData');
    clearBtn.addEventListener('click', clearAllData);
}

function setupRangeSliders() {
    const sliders = ['emotionalState', 'energyLevel', 'focusLevel'];
    
    sliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(sliderId.replace('Level', 'Value').replace('State', 'Value'));
        
        slider.addEventListener('input', function() {
            valueDisplay.textContent = this.value;
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const dataEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        musicEra: formData.get('musicEra'),
        songTitle: formData.get('songTitle'),
        duration: parseInt(formData.get('duration')),
        heartRateBefore: parseInt(formData.get('heartRateBefore')),
        heartRateAfter: parseInt(formData.get('heartRateAfter')),
        bloodPressureBefore: formData.get('bloodPressureBefore'),
        bloodPressureAfter: formData.get('bloodPressureAfter'),
        emotionalState: parseInt(formData.get('emotionalState')),
        energyLevel: parseInt(formData.get('energyLevel')),
        focusLevel: parseInt(formData.get('focusLevel')),
        notes: formData.get('notes')
    };

    // Add to data array
    researchData.push(dataEntry);
    
    // Save to localStorage
    localStorage.setItem('melodiesData', JSON.stringify(researchData));
    
    // Update display
    updateDataDisplay();
    updateSummaryStats();
    
    // Reset form
    e.target.reset();
    resetRangeSliders();
    
    // Show success message
    showNotification('Data recorded successfully!', 'success');
}

function resetRangeSliders() {
    const sliders = ['emotionalState', 'energyLevel', 'focusLevel'];
    sliders.forEach(sliderId => {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(sliderId.replace('Level', 'Value').replace('State', 'Value'));
        slider.value = 5;
        valueDisplay.textContent = '5';
    });
}

function updateDataDisplay() {
    const tbody = document.getElementById('dataTableBody');
    const filterEra = document.getElementById('filterEra').value;
    
    let filteredData = researchData;
    if (filterEra) {
        filteredData = researchData.filter(entry => entry.musicEra === filterEra);
    }
    
    tbody.innerHTML = '';
    
    if (filteredData.length === 0) {
        tbody.innerHTML = '<tr><td colspan="12" class="no-data">No data recorded yet</td></tr>';
        return;
    }
    
    filteredData.reverse().forEach(entry => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.timestamp}</td>
            <td>${entry.musicEra}</td>
            <td>${entry.songTitle}</td>
            <td>${entry.duration} min</td>
            <td>${entry.heartRateBefore} BPM</td>
            <td>${entry.heartRateAfter} BPM</td>
            <td>${entry.bloodPressureBefore}</td>
            <td>${entry.bloodPressureAfter}</td>
            <td>${entry.emotionalState}/10</td>
            <td>${entry.energyLevel}/10</td>
            <td>${entry.focusLevel}/10</td>
            <td>${entry.notes || '--'}</td>
        `;
        tbody.appendChild(row);
    });
}

function filterData() {
    updateDataDisplay();
}

function updateSummaryStats() {
    if (researchData.length === 0) {
        document.getElementById('totalRecords').textContent = '0';
        document.getElementById('avgHeartRate').textContent = '--';
        document.getElementById('popularEra').textContent = '--';
        document.getElementById('avgEmotion').textContent = '--';
        return;
    }
    
    // Total records
    document.getElementById('totalRecords').textContent = researchData.length;
    
    // Average heart rate (before and after)
    const avgHRBefore = Math.round(researchData.reduce((sum, entry) => sum + entry.heartRateBefore, 0) / researchData.length);
    const avgHRAfter = Math.round(researchData.reduce((sum, entry) => sum + entry.heartRateAfter, 0) / researchData.length);
    document.getElementById('avgHeartRate').textContent = `${avgHRBefore} → ${avgHRAfter} BPM`;
    
    // Most popular era
    const eraCounts = {};
    researchData.forEach(entry => {
        eraCounts[entry.musicEra] = (eraCounts[entry.musicEra] || 0) + 1;
    });
    const popularEra = Object.keys(eraCounts).reduce((a, b) => eraCounts[a] > eraCounts[b] ? a : b);
    document.getElementById('popularEra').textContent = popularEra;
    
    // Average emotional state
    const avgEmotion = (researchData.reduce((sum, entry) => sum + entry.emotionalState, 0) / researchData.length).toFixed(1);
    document.getElementById('avgEmotion').textContent = avgEmotion + '/10';
}

function exportData() {
    if (researchData.length === 0) {
        showNotification('No data to export', 'warning');
        return;
    }
    
    // Convert to CSV
    const headers = ['Timestamp', 'Music Era', 'Song Title', 'Duration (min)', 
                    'Heart Rate Before (BPM)', 'Heart Rate After (BPM)', 
                    'Blood Pressure Before', 'Blood Pressure After',
                    'Emotional State', 'Energy Level', 'Focus Level', 'Notes'];
    
    const csvContent = [
        headers.join(','),
        ...researchData.map(entry => [
            entry.timestamp,
            entry.musicEra,
            `"${entry.songTitle}"`,
            entry.duration,
            entry.heartRateBefore,
            entry.heartRateAfter,
            entry.bloodPressureBefore,
            entry.bloodPressureAfter,
            entry.emotionalState,
            entry.energyLevel,
            entry.focusLevel,
            `"${entry.notes || ''}"`
        ].join(','))
    ].join('\n');
    
    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `melodies-research-data-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully!', 'success');
}

function clearAllData() {
    if (researchData.length === 0) {
        showNotification('No data to clear', 'warning');
        return;
    }
    
    // Confirm before clearing
    if (confirm('Are you sure you want to clear ALL research data? This action cannot be undone.')) {
        // Clear the data array
        researchData = [];
        
        // Clear localStorage
        localStorage.removeItem('melodiesData');
        
        // Update display
        updateDataDisplay();
        updateSummaryStats();
        
        // Show success message
        showNotification('All data cleared successfully!', 'success');
    }
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}
