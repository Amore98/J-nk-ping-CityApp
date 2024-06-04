const logout = async () => {
    response = await fetch(
        'http://localhost:8080/api/logout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
        }
    ).then(res => res.json())

    showLogoutButton()
}