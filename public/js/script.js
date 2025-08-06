
 (() => {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add('was-validated');
      }, false);
    });
  })();



   // Generate QR code pointing to student profile
  const qr = new QRious({
    element: document.getElementById('qr'),
    value: "https://your-domain.com/admin/students/<%= student._id %>",  // Replace domain if needed
    size: 80
  });
