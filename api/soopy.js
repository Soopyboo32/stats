let url = "https://api.soopy.dev/";
async function updateUseLocal() {
    try {
        let data = await fetch("http://127.0.0.1:8000/");
        data = await data.json();
        if (data.success) {
            url = "http://127.0.0.1:8000/";
            console.log("Locally hosted api detected, using local address instead!")
        }
    } catch (e) { }
}
updateUseLocal();

export async function getSoopyApi(endpoint) {
    let data = await fetch(url + endpoint);
    data = await data.json();

    return data;
}