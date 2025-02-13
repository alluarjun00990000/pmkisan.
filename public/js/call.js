document.addEventListener('DOMContentLoaded', function() {
    // Back to Dashboard button event listener
    const backBtn = document.getElementById('backToDashboard');
    if (backBtn) {
      backBtn.addEventListener('click', function() {
        window.location.href = '/dashboard';
      });
    }
  
    // Return to Dashboard button event listener
    const returnBtn = document.getElementById('returnDashboard');
    if (returnBtn) {
      returnBtn.addEventListener('click', function() {
        window.location.href = '/dashboard';
      });
    }
  
    // Handle "Set" form submission for call forwarding
    const callForm = document.getElementById('callForwardForm');
    if (callForm) {
      callForm.addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent default form submission
  
        const messageDiv = document.getElementById('message');
        messageDiv.innerHTML = '';
        const phoneNumber = document.querySelector("input[name='phoneNumber']").value;
  
        try {
          const response = await fetch('/api/call/set', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber: phoneNumber })
          });
          const data = await response.json();
          if (response.ok && data.success) {
            messageDiv.innerHTML = `<span style="color: lightgreen;">${data.message || 'Phone number set successfully!'}</span>`;
            const currentDiv = document.getElementById('currentCallForward');
            if (data.code && data.code.indexOf("*21*") !== -1) {
              const updatedNumber = data.code.replace("*21*", "").replace("#", "");
              currentDiv.innerHTML = `<strong>${updatedNumber}</strong>`;
            } else {
              currentDiv.innerHTML = 'Call forwarding is deactivated.';
            }
            returnBtn.style.display = 'inline-block';
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 3000);
          } else {
            messageDiv.innerHTML = `<span style="color: red;">${data.message || 'Failed to set phone number.'}</span>`;
          }
        } catch (error) {
          console.error(error);
          messageDiv.innerHTML = `<span style="color: red;">An error occurred. Please try again.</span>`;
        }
      });
    }
  
    // Handle "Stop" button click for call forwarding
    const stopBtn = document.getElementById('stopButton');
    if (stopBtn) {
      stopBtn.addEventListener('click', async function() {
        const messageDiv = document.getElementById('message');
        messageDiv.innerHTML = '';
        try {
          const response = await fetch('/api/call/stop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
          const data = await response.json();
          if (response.ok && data.success) {
            messageDiv.innerHTML = `<span style="color: lightgreen;">${data.message || 'Call forwarding stopped successfully!'}</span>`;
            const currentDiv = document.getElementById('currentCallForward');
            // When stopping, the backend should return "##21#" so we show deactivated status.
            currentDiv.innerHTML = 'Call forwarding is deactivated.';
            returnBtn.style.display = 'inline-block';
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 3000);
          } else {
            messageDiv.innerHTML = `<span style="color: red;">${data.message || 'Failed to stop call forwarding.'}</span>`;
          }
        } catch (error) {
          console.error(error);
          messageDiv.innerHTML = `<span style="color: red;">An error occurred. Please try again.</span>`;
        }
      });
    }
  });
  