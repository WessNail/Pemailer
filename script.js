$(document).ready(function() {
    // Load saved data when the page loads
    loadSavedData();

    // Function to send emails
    function sendEmails() {
        var email = $('#emailInput').val();
        var subjects = $('#subjectInput').val().split(',').map(s => s.trim());
        var body = $('#bodyInput').val();
    
        $.ajax({
            url: 'http://localhost:3000/send-email',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ to: email, subjects: subjects, body: body }),
            success: function(response) {
                console.log('Emails sent successfully');
                // Save the email content with current date
                var currentDate = new Date().toISOString().split('T')[0];
                saveEmailContent(currentDate, body);
                updateDateList();
            },
            error: function(xhr, status, error) {
                console.error('Error sending emails:', error);
            }
        });
    }

    // Function to save email content
    function saveEmailContent(date, content) {
        var savedEmails = JSON.parse(localStorage.getItem('savedEmails') || '{}');
        savedEmails[date] = content;
        localStorage.setItem('savedEmails', JSON.stringify(savedEmails));
    }

    // Function to update the date list
    function updateDateList() {
        $('#dateList').empty();
        var savedEmails = JSON.parse(localStorage.getItem('savedEmails') || '{}');
        Object.keys(savedEmails).sort().reverse().forEach(function(date) {
            $('#dateList').append(`<li data-date="${date}">${date}</li>`);
        });
    }

    // Function to load saved data
    function loadSavedData() {
        $('#emailInput').val(localStorage.getItem('savedEmail') || '');
        $('#subjectInput').val(localStorage.getItem('savedSubjects') || '');
        updateDateList();
    }

    // Send button click event
    $('#sendBtn').click(sendEmails);

    // New button click event
    $('#newBtn').click(function() {
        $('#bodyInput').val('');
    });

    // Date list item click event
    $(document).on('click', '#dateList li', function() {
        var date = $(this).data('date');
        var savedEmails = JSON.parse(localStorage.getItem('savedEmails') || '{}');
        $('#bodyInput').val(savedEmails[date] || '');
    });

    // Initialize date list
    updateDateList();

    // Auto-resize subject input
    $('#subjectInput').on('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Save data on input change
    $('#emailInput, #subjectInput').on('input', function() {
        localStorage.setItem('savedEmail', $('#emailInput').val());
        localStorage.setItem('savedSubjects', $('#subjectInput').val());
    });
});