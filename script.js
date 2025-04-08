function convertToBangkokTime(dateString) {
    if (!dateString || dateString === "No schedule available") {
        return "N/A";
    }
    return dateString.replace(/(\d{2})(\d{2})(\d{2})/, "$1/$2/20$3");
}

function showModal(message) {
    document.getElementById("modalMessage").innerHTML = message;
    document.getElementById("myModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("myModal").style.display = "none";
    document.getElementById('roomNumber').value = '';

    let container = document.querySelector('.container');
    container.classList.remove("shrink");
    container.classList.add("expand");
}

function submitRoom() {
    let roomNumber = document.getElementById('roomNumber').value.trim().toUpperCase();
    let pattern = /^[ABC]\d{3}$/;
    let resultElement = document.getElementById('result');
    let submitBtn = document.getElementById('submitBtn');
    let loadingGif = document.getElementById('loadingGif');
    let container = document.querySelector('.container');

    if (pattern.test(roomNumber)) {
        resultElement.innerText = "Searching...";
        resultElement.style.color = "blue";
        loadingGif.style.display = "block";
        container.classList.add("expand");
        submitBtn.disabled = true;

        // *** ตรวจสอบ URL ตรงนี้ให้ถูกต้อง ***
        fetch("https://script.google.com/macros/s/AKfycbzWflHbJe1-yIrMJ7ZFooe1U56_h9IuYIAmmWxN1x-5nzJe56KJE_eQ_-cZmmB7oJNX2A/exec?room=" + encodeURIComponent(roomNumber))
            .then(response => response.json())
            .then(data => {
                loadingGif.style.display = "none";
                submitBtn.disabled = false;
                container.classList.remove("expand");
                container.classList.add("shrink");

                if (data.room) {
                    let deepCleanDate = convertToBangkokTime(data.deep_clean);
                    let filterAirDate = convertToBangkokTime(data.filter_air);
                    let nextTimeDate = convertToBangkokTime(data.next_deepclean);
                    let nextFilterAirDate = convertToBangkokTime(data.next_filter_air);

                    resultElement.innerHTML = `
                        ✅ Room: ${roomNumber} <br>
                        ⏭️ Next Deep Clean: ${nextTimeDate} <br>
                        🧼 Lastest Deep Clean: ${deepCleanDate} <br>
                        ⏭️ Next Filter Air: ${nextFilterAirDate} <br>
                        🌬️ Lastest Filter Air: ${filterAirDate}
                    `;
                    resultElement.style.color = "green";

                    showModal(resultElement.innerHTML);
                } else if (data.error) {
                    resultElement.innerText = data.error;
                    resultElement.style.color = "red";
                    showModal("❌ " + data.error);
                }
            })
            .catch(() => {
                resultElement.innerText = "❌ An error occurred.";
                resultElement.style.color = "red";
                showModal("❌ Please try again.");
                loadingGif.style.display = "none";
                submitBtn.disabled = false;
                container.classList.remove("expand");
                container.classList.add("shrink");
            });

    } else {
        resultElement.innerText = "❌ Invalid format!";
        resultElement.style.color = "red";
        showModal("❌ Invalid room format!");
    }
}