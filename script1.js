

function copyCode(button) {
    const preElement = button.parentElement;
    const code = preElement.textContent.trim();
    const codeWithoutButton = code.replace(/Copy/, "").trim();

    navigator.clipboard.writeText(codeWithoutButton).then(() => {
        button.textContent = "Copied";
        button.classList.add("copied");

        setTimeout(() => {
            button.textContent = "Copy";
            button.classList.remove("copied");
        }, 2000);
    }).catch(err => {
        console.error("Failed to copy: ", err);
    });
}


 // Smooth scroll behavior for sidebar links
 document.querySelectorAll('.sidebar a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default link behavior
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Copy Code Button Functionality
function copyCode(button) {
    const codeBlock = button.nextElementSibling.innerText;
    navigator.clipboard.writeText(codeBlock).then(() => {
        button.textContent = 'Copied!';
        setTimeout(() => (button.textContent = 'Copy'), 2000);
    });
}