const iconRoom = `
<svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none"
    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round"
    d="M3 12l2-2m0 0l7-7 7 7m-9 14v-6h4v6m5-18h3a1 1 0 011 1v16a1 1 0 01-1 1h-3M4 21h3a1 1 0 001-1v-6H4v6a1 1 0 001 1z" />
</svg>`;

const iconNextClean = `
<svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none"
    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round"
    d="M12 6v6l4 2m8 4.5A10.5 10.5 0 111.5 12" />
</svg>`;

const iconSoap = `
<svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none"
    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round"
    d="M9 12h6m-6 4h6m-7.5 4h9a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0016.5 4.5h-9A2.25 2.25 0 005.25 6.75v11.25A2.25 2.25 0 007.5 20.25z" />
</svg>`;

const iconAir = `
<svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none"
    viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round"
    d="M3.75 15.75a3 3 0 106.01.51M6 9.75h12m-12-4.5h12M6 14.25h8.25" />
</svg>`;

// ✅ flag ว่าผู้ใช้กด OK มาแล้ว
let userConfirmedOnce = false;
let isSearching = false;

document.addEventListener("DOMContentLoaded", () => {
    const modalOkBtn = document.getElementById("modalOkBtn");
    const container = document.querySelector(".container");
    const modal = document.getElementById("myModal");
    const roomInput = document.getElementById("roomNumber");

    // ฟังก์ชันเมื่อกดปุ่ม OK
    modalOkBtn.addEventListener("click", () => {
        closeModal();
        userConfirmedOnce = true;

        container.classList.remove("shrink", "expand");
        void container.offsetWidth;

        container.classList.add("shrink");
        setTimeout(() => {
            container.classList.remove("shrink");
            void container.offsetWidth;
            container.classList.add("expand");
        }, 300);
    });

    // ปิด modal เมื่อคลิกพื้นที่ว่าง
    document.addEventListener("click", (event) => {
        if (modal.classList.contains("show") && event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", (event) => {
        // ปิด modal ด้วย ESC
        if (event.key === "Escape" && modal.classList.contains("show")) {
            closeModal();
            return;
        }

        // ปิด modal ด้วย Enter
        if (event.key === "Enter" && modal.classList.contains("show")) {
            closeModal();
            return;
        }

        // Submit ห้องเมื่อกด Enter และ modal ยังไม่เปิด
        if (event.key === "Enter" && document.activeElement === roomInput && !modal.classList.contains("show")) {
            submitRoom();
            return;
        }
    });

    // เรียกใช้แอนิเมชันเมื่อโหลดหน้า
    container.classList.add('animate-on-load');
});

// ฟังก์ชันแปลงเวลา
function convertToBangkokTime(dateString) {
    if (!dateString || dateString === "No schedule available") {
        return "N/A";
    }
    return dateString.replace(/(\d{2})(\d{2})(\d{2})/, "$1/$2/20$3");
}

// ฟังก์ชันแสดง modal
function showModal(message) {
    document.getElementById("modalMessage").innerHTML = message;
    let modal = document.getElementById("myModal");
    modal.style.display = "flex";
    setTimeout(() => {
        modal.classList.add("show");
    }, 10);
}

// ฟังก์ชันปิด modal
function closeModal() {
    let modal = document.getElementById("myModal");
    modal.classList.remove("show");
    setTimeout(() => {
        modal.style.display = "none";
        document.getElementById("roomNumber").focus(); // 👈 focus คืน
    }, 300);
}

document.querySelector("form")?.addEventListener("submit", e => e.preventDefault());

// ฟังก์ชันสำหรับการ submit ห้อง
function submitRoom() {
    if (isSearching) return; // ป้องกันการกดซ้ำ

    let roomNumber = document.getElementById('roomNumber').value.trim().toUpperCase();
    let pattern = /^[ABC]\d{3}$/;
    let resultElement = document.getElementById('result');
    let submitBtn = document.getElementById('submitBtn');
    let loadingGif = document.getElementById('loadingGif');
    let container = document.querySelector('.container');

    container.classList.remove("expand", "shrink");
    void container.offsetWidth;

    if (pattern.test(roomNumber)) {
        isSearching = true; // ✅ ตั้ง flag

        resultElement.innerText = "Searching...";
        resultElement.style.color = "blue";
        loadingGif.style.display = "block";
        container.classList.add("shrink");

        // ✅ เพิ่ม padding animation ถ้าเคยกด OK
        if (userConfirmedOnce) {
            container.classList.remove("padding-anim");
            void container.offsetWidth; // รีเฟรชการแสดงผล
            container.classList.add("padding-anim"); // เพิ่มแอนิเมชัน
        }

        submitBtn.disabled = true;
        submitBtn.innerText = "Searching...";  // 👈 เพิ่มบรรทัดนี้ก่อน fetch

        fetch("https://script.google.com/macros/s/AKfycbzWflHbJe1-yIrMJ7ZFooe1U56_h9IuYIAmmWxN1x-5nzJe56KJE_eQ_-cZmmB7oJNX2A/exec?room=" + encodeURIComponent(roomNumber))
            .then(response => response.json())
            .then(data => {
                isSearching = false; // ✅ รีเซ็ต flag

                loadingGif.style.display = "none";
                submitBtn.disabled = false;
                submitBtn.innerText = "Submit";  // 👈 เพิ่มบรรทัดนี้หลังจาก fetch เสร็จ

                container.classList.remove("expand", "shrink");
                void container.offsetWidth;
                container.classList.add("shrink");

                // รีเซ็ต userConfirmedOnce หลังจากค้นหาสำเร็จ
                userConfirmedOnce = false;

                if (data.room) {
                    let deepCleanDate = convertToBangkokTime(data.deep_clean);
                    let filterAirDate = convertToBangkokTime(data.filter_air);
                    let nextTimeDate = convertToBangkokTime(data.next_deepclean);
                    let nextFilterAirDate = convertToBangkokTime(data.next_filter_air);

                    resultElement.innerHTML = `
                    ${iconRoom} <strong>Room:</strong> ${roomNumber} <br>
                    ${iconNextClean} <strong>Next Deep Clean:</strong> ${nextTimeDate} <br>
                    ${iconSoap} <strong>Lastest Deep Clean:</strong> ${deepCleanDate} <br>
                    ${iconNextClean} <strong>Next Filter Air:</strong> ${nextFilterAirDate} <br>
                    ${iconAir} <strong>Lastest Filter Air:</strong> ${filterAirDate}<br>
                    <br><em>🐾 Get to know Taotao, the cat that everyone falls in love with at first sight. Try clicking on Taotao !! .</em>
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
                isSearching = false; // ✅ รีเซ็ต flag

                resultElement.innerText = "❌ An error occurred.";
                resultElement.style.color = "red";
                showModal("❌ Please try again.");
                loadingGif.style.display = "none";
                submitBtn.disabled = false;
                submitBtn.innerText = "Submit";  // 👈 เพิ่มบรรทัดนี้หลังจาก fetch เสร็จ

                container.classList.remove("expand", "shrink");
                void container.offsetWidth;
                container.classList.add("shrink");
            });

    } else {
        resultElement.innerText = "❌ Invalid format!";
        resultElement.style.color = "red";
        showModal("❌ Invalid room format!");
    }
}