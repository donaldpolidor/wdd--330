import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

function displayOrderDetails() {
    // Retrieve order information from localStorage
    const lastOrder = localStorage.getItem('lastOrder');
    
    if (lastOrder) {
        try {
            const orderData = JSON.parse(lastOrder);
            
            // Show details
            document.getElementById('order-id').textContent = orderData.orderId || 'N/A';
            document.getElementById('order-date').textContent = orderData.date || new Date().toLocaleDateString();
            document.getElementById('order-total').textContent = orderData.total ? `$${orderData.total}` : '$0.00';
            
            // Clear localStorage
            localStorage.removeItem('lastOrder');
            
        } catch (error) {
            console.error('Error parsing order data:', error);
            showFallbackData();
        }
    } else {
        showFallbackData();
    }
}

function showFallbackData() {
    // Fallback data if no information is found
    document.getElementById('order-id').textContent = 'ORD-' + Date.now();
    document.getElementById('order-date').textContent = new Date().toLocaleDateString();
    document.getElementById('order-total').textContent = '$0.00';
}

document.addEventListener("DOMContentLoaded", function() {
    displayOrderDetails();
});