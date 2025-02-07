let prompt = document.querySelector("#prompt")
let chatcontainer = document.querySelector(".chat-container")
let imgbtn = document.querySelector("#img")
let img = document.querySelector("#img img")
let imginput = document.querySelector("#img input")
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAnSUB7fB6PazLNhC7CQRThnqhvtnIH4fk"

let user = {
    message: null,
    file: {
        mime_type: null,
        data: null,
    }
}

const createChatBox = (html, classes) => {
    let div = document.createElement("div")
    div.innerHTML = html
    div.classList.add(classes)
    return div
}

const generateResponse = async (AIchatBox) => {
    let text = AIchatBox.querySelector(".aichatarea")
    let RequestOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "contents": [{
                "parts": [{ "text": user.data }, (user.file.data ? [{ "inline_data": user.file }] : [])]
            }]
        })
    }
    try {

        let response = await fetch(API_URL, RequestOption)
        let data = await response.json()
        // console.log(data);
        let APIResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim()
        text.innerHTML = APIResponse

    } catch (error) {
        console.log(err)
    }
    finally {
        chatcontainer.scrollTo({ top: chatcontainer.scrollHeight, behavior: "smooth" })
        img.src = `img.svg`
        img.classList.remove("chooseimg")
    }
}

const hanldeChatResponse = (message) => {
    user.data = message
    let html = ` <img src="userimg.png" width="70" alt="" id="userimg">
            <div class="userchatarea">
               ${message}
               ${user.file.data ? `<img src="data:${user.file.mime_type};base64,
               ${user.file.data}" class="choose" alt="Not Found"/>` : ""}
            </div>`

    prompt.value = ""
    let userChatBox = createChatBox(html, "userchatbox") // userchatbox is a class
    chatcontainer.appendChild(userChatBox)
    chatcontainer.scrollTo({ top: chatcontainer.scrollHeight, behavior: "smooth" })
    setTimeout(() => {
        let html = ` <img src="chatbotimg.png" alt="" id="aiimg" width="70">
            <div class="aichatarea">
              <img src="loading.gif" alt="" class="load" width="50px">
            </div>`

        let AIchatBox = createChatBox(html, "aichatbox")
        chatcontainer.appendChild(AIchatBox)
        generateResponse(AIchatBox)
    }, 600)
}

imginput.addEventListener("change", () => {
    const file = imginput.files[0]
    if (!file)
        return
    let reader = new FileReader()
    reader.onload = (e) => {
        let base64encode = e.target.result.split(",")[1]
        user.file = {
            mime_type: file.type,
            data: base64encode,
        }
        img.src = `data:${user.file.mime_type};base64,${user.file.data}`;
        img.classList.add("chooseimg")
    }
    reader.readAsDataURL(file)
})

prompt.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        hanldeChatResponse(prompt.value)
    }

})

imgbtn.addEventListener('click', () => {
    imgbtn.querySelector("input").click()
})