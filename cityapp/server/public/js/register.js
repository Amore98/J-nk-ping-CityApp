
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
        return "Email is not valid!";
    }
    return "";
}

const register = async () => {
    email = document.getElementById("email").value
    username = document.getElementById("username").value
    password = document.getElementById("password").value
    confirm_password = document.getElementById("confirm_password").value
    console.log(password, email, username)

    if (confirm_password === password) {
        console.log("test")
        response = await fetch(
            'http://localhost:8080/api/register', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "email": email,
                    "username": username,
                    "password": password
                })
            }
        ).then(res => res.json())

        showLogoutButton()
    } else {
        // Password does not match
    }
}