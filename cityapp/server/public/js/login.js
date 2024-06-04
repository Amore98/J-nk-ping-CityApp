
async function login() {
    email = document.getElementById("email").value
    password = document.getElementById("password").value

    response = await fetch(
        'http://localhost:8080/api/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "email": email,
                "password": password
            })
        }
    ).then(res => res.json())

    console.log(response)
    showLogoutButton()
}