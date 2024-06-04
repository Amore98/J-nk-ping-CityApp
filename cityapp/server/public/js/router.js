const routes = {
    "/": {
        template: '/pages/home.html',
        title: `Home`,
    },
    "/home": {
        template: '/pages/home.html',
        title: `Home Page`,
    },
    "/stores": {
        template: '/pages/stores.html',
        title: `Stores page`,
    },
    "/login": {
        template: '/pages/login.html',
        title: `Login page`,
    },
    "/register": {
        template: '/pages/register.html',
        title: `Register page`,
    },
    "/contact": {
        template: '/pages/contact.html',
        title: `contact page`,
    },
  

};

const showLogoutButton = async () => {
    response = await fetch(
        'http://localhost:8080/api/isAuthenticated', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
    }).then(res => res.json())
    console.log(response)

    let button = document.getElementById("logout")
    if (response.success) {
        if (button == null) {
            console.log("adding")
            let navbar = document.getElementById('main-nav')

            let button = document.createElement('button');
            button.textContent = 'Logout';
            button.id = "logout"
            button.classList.add("logout-button")
            button.onclick = logout

            navbar.appendChild(button)
        }
    } else {
        console.log("removing")
        if (button != null) {
            button.parentNode.removeChild(button)
        }
    }
}

let storesData = [];

const route = (event) => {
    console.log(event)
	event = event || window.event;
	event.preventDefault();
	window.history.pushState({}, "", event.target.href);
	urlLocationHandler();
};

function convertGeoToPixels(latitude, longitude, mapDimensions, geoBounds) {
    const latPercent = (latitude - geoBounds.minLat) / (geoBounds.maxLat - geoBounds.minLat);
    const longPercent = (longitude - geoBounds.minLong) / (geoBounds.maxLong - geoBounds.minLong);

    const xOffset = 0; 
    const yOffset = 0;

    const x = (longPercent * mapDimensions.width) + xOffset;
    const y = ((1 - latPercent) * mapDimensions.height) + yOffset; 

    return { x, y };
}

function onPinpointClick(storeName) {
    // Filter for the clicked store based on the storeId
    const clickedStore = storesData.find(store => store.name === storeName);
    
    if (!clickedStore) {
        console.error('Store not found:', storeName);
        return;
    }
    console.log(storesData)
    const fullUrl = clickedStore.url && !clickedStore.url.startsWith('http://') && !clickedStore.url.startsWith('https://') ? `https://${clickedStore.url}` : clickedStore.url;
    const storeHtml = 
    `<div class="store">
        <div class="store-detail-container">
            <img src="${clickedStore.image_url}" class="store-img">
            <div class="store-detail">
                <h1 class="store-name">${clickedStore.name  == undefined ? '' : clickedStore.name}</h2>
                <h3 class="store-district">${clickedStore.district == undefined ? '' : clickedStore.district}</h2>
                <h4 class="store-address">${clickedStore.address == undefined ? '' : clickedStore.address }</h4>
                
                <a class="store-url" href="${fullUrl}" target="_blank">Go to Website</a>
            </div>
        </div>
    </div>`;
    

    document.getElementById("stores-list").innerHTML = storeHtml;
    document.querySelectorAll('.pinpoint').forEach(pin => {
        pin.style.filter = ''
        pin.style.zIndex = 0
        pin.style.transform = 'scale(1)'
    }); 
    document.getElementById(`store-${storeName}`).style.filter = 'hue-rotate(155deg)';
    document.getElementById(`store-${storeName}`).style.zIndex = 10;
    document.getElementById(`store-${storeName}`).style.transform = 'scale(1.2)';
}

const urlLocationHandler = async () => {
    let location = window.location.pathname; 
    if (location.length === 0) {
        location = "/";
    }
    console.log(location);
    const route = routes[location] || routes["/"]; 
    console.log(route);
    let html = await fetch('http://localhost:8080' + route.template).then((response) => response.text());

    if (location === "/stores") {
        storesData = await fetch('http://localhost:8080/api/stores').then((response) => response.json());

        const mapDimensions = { width: 1300, height: 494 }; 

        const geoBounds = {
            minLat: 57.777000, 
            maxLat: 57.786000, 
            minLong: 14.151000,
            maxLong: 14.194000,  
        };

        const pinpointsHtml = storesData.filter(store => store.coordinate).map(store => {
            const { x, y } = convertGeoToPixels(store.coordinate.latitude, store.coordinate.longitude, mapDimensions, geoBounds);
            return `<img src="img/pinPoint.png" onclick="onPinpointClick('${store.name}')" class="pinpoint" style="position: absolute; top: ${y}px; left: ${x}px;" id="store-${store.name}" alt="${store.name}">`;
        }).join('');


        response = await fetch(
            'http://localhost:8080/api/isAdmin', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
        }).then(res => res.json())


        if (response.success == true) {
            var storesHtml = storesData.map(store => {
                return `
                <div id=${store._id}>
                    <input id="name" placeholder=${store.name}></input>
                    <input id="description" placeholder=${store.description}></input>
                    <input id="image_url" placeholder=${store.image_url}><input/>
                    <button onclick=edit_store("${store._id}")>Edit<button/>
                </div>`
            }).join('');
        } else {
            var storesHtml = storesData.map(store => {
                const fullUrl = store.url && !store.url.startsWith('http://') && !store.url.startsWith('https://') ? `https://${store.url}` : store.url;
                return `
                <div class="store">
                    <div class="store-detail-container">
                        <img src="${store.image_url}" class="store-img-list">
                        <div class="store-detail">
                            <h1 class="store-name">${store.name  == undefined ? '' : store.name}</h2>
                            <h3 class="store-district">${store.district == undefined ? '' : store.district}</h2>
                            <h4 class="store-address">${store.address == undefined ? '' : store.address }</h4>
                            <a class="store-url" href="${fullUrl}" target="_blank">Go to Website</a>
                        </div>
                    </div>
                </div>
                `}).join('');
        }

        html = html.replace('<div id="stores-list"></div>', `<div id="stores-list", class="double-column">${storesHtml}</div>`);
        document.getElementById("main-page").innerHTML = html;

        setTimeout(() => {
            const mapContainer = document.getElementById("map-container");
            if (mapContainer) {
                mapContainer.innerHTML += pinpointsHtml;
            }
        }, 0);
    } else {
        document.getElementById("main-page").innerHTML = html;
    }
    document.title = route.title;
};


window.onpopstate = urlLocationHandler;

window.route = route;

urlLocationHandler();