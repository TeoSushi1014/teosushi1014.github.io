type="text/javascript">
    document.getElementById('previousPage').addEventListener('click', function() {
        // Điều hướng đến trang trước đó
        window.history.back();
    });

    document.getElementById('nextPage').addEventListener('click', function() {
        // Điều hướng đến trang tiếp theo (thay 'next-page.html' bằng URL của trang tiếp theo)
        window.location.href = 'next-page.html';
    });
