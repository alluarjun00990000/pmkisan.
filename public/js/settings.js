document.addEventListener('DOMContentLoaded', function() {
    const updatePhoneForm = document.getElementById('updatePhoneForm');
    if (updatePhoneForm) {
      updatePhoneForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent default form submission
  
        const phoneNumber = document.getElementById('phoneNumber').value;
        const statusMessage = document.getElementById('statusMessage');
  
        try {
          // Send AJAX request to the server
          const response = await fetch('/api/admin/update-number', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phoneNumber })
          });
  
          const result = await response.json();
  
          if (response.ok) {
            // Display success message and redirect
            statusMessage.textContent = result.message || 'Phone number updated successfully!';
            statusMessage.style.color = 'lightgreen';
  
            // Redirect to the dashboard after a short delay
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 2000); // 2-second delay
          } else {
            // Display error message
            statusMessage.textContent = result.message || 'Failed to update phone number.';
            statusMessage.style.color = 'salmon';
          }
        } catch (error) {
          // Handle network errors
          statusMessage.textContent = 'An error occurred. Please try again.';
          statusMessage.style.color = 'salmon';
        }
      });
    }
  });
  