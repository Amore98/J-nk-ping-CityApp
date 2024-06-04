
const edit_store = async (store_id) => {

    let dataFields = document.getElementById(store_id)
    const name = dataFields.querySelector("#name").value
    const description = dataFields.querySelector("#description").value
    const image_url = dataFields.querySelector("#image_url").value
    console.log(store_id, name, description, image_url)

    try {
        response = await fetch(
            `http://localhost:8080/api/stores/edit/${store_id}`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "name": name,
                    "description": description,
                    "image_url": image_url
                })
            }
        ).then(res => res.json())
        console.log(response)
    } catch (err) {
        console.log(err)
    }
}