// const iconRoom = `
// <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none"
//     viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
//   <path stroke-linecap="round" stroke-linejoin="round"
//     d="M3 12l2-2m0 0l7-7 7 7m-9 14v-6h4v6m5-18h3a1 1 0 011 1v16a1 1 0 01-1 1h-3M4 21h3a1 1 0 001-1v-6H4v6a1 1 0 001 1z" />
// </svg>`;

// const iconNextClean = `
// <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none"
//     viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
//   <path stroke-linecap="round" stroke-linejoin="round"
//     d="M12 6v6l4 2m8 4.5A10.5 10.5 0 111.5 12" />
// </svg>`;

// const iconSoap = `
// <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none"
//     viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
//   <path stroke-linecap="round" stroke-linejoin="round"
//     d="M9 12h6m-6 4h6m-7.5 4h9a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0016.5 4.5h-9A2.25 2.25 0 005.25 6.75v11.25A2.25 2.25 0 007.5 20.25z" />
// </svg>`;

// const iconAir = `
// <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none"
//     viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
//   <path stroke-linecap="round" stroke-linejoin="round"
//     d="M3.75 15.75a3 3 0 106.01.51M6 9.75h12m-12-4.5h12M6 14.25h8.25" />
// </svg>`;

const iconRoom = `<img src="hotel.png" class="icon" alt="Room">`;
const iconNextClean = `<img src="calendar.png" class="icon" alt="Next Clean">`;
const iconSoap = `<img src="air-conditioning.png" class="icon" alt="Soap">`;
const iconAir = `<img src="air-conditioner.png" class="icon" alt="Air Filter">`;

// ✅ flag ว่าผู้ใช้กด OK มาแล้ว
let userConfirmedOnce = false;
let isSearching = false;
let isSpecialRoom = false;  

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
// ฟังก์ชันเมื่อเลือกห้องจาก Special Rooms


function selectSpecialRoom(room) {
    // ปิด modal
    closeModal();

    // ใส่ข้อมูลห้องที่เลือกเข้าไปใน input
    document.getElementById('roomNumber').value = room;

    // ตั้งค่า flag ว่าเป็นห้องจาก Special Rooms
    isSpecialRoom = true;

    // เรียกฟังก์ชัน submitRoom เพื่อทำการค้นหาห้อง
    submitRoom();
}


// ฟังก์ชันที่แสดง modal สำหรับ Special Rooms
// ฟังก์ชันที่แสดง modal สำหรับ Special Rooms
function showSpecialRoomOptions() {
    const specialRooms = [
        "Co Working 3 ตัวในสุด", "Co Working 1 ตัวแรก", "Co Working 2 ตัวกลาง", "Fitness 1-หน้าประตู",
        "Server Room", "Fitness 2", "Fitness 3", "Garbage Room", "Game Room", "Kid's Club",
        "Reservation", "VIVA 1 ประตูเข้า", "VIVA 2 Bar", "VIVA 3 Counter", "VIVA 4",
        "VIVA 5 Salad Bar", "Sale Office", "Front Office", "Exe. Office GM", "Exe. Office FC",
        "HK OFFICE", "Canteen", "FC Office", "Meeting Room", "Marketing", "VIVA Wine",
        "Eng Office", "HR Dir. Room"
    ];

    let optionsHtml = `
        <h3 style="margin-bottom: 15px; padding-bottom: 8px; border-bottom: 1px solid #ddd;">เลือกพื้นที่ที่ต้องการ:</h3>
        <div style="max-height: 400px; overflow-y: auto; padding-right: 10px; margin-bottom: 15px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px; padding: 5px;">`;

    specialRooms.forEach(room => {
        optionsHtml += `
            <div style="padding: 5px;">
                <button style="width: 100%; padding: 10px; cursor: pointer; border-radius: 8px; 
                background-color: #f5f5f5; border: 1px solid #ddd; transition: all 0.3s ease;
                font-size: 14px; text-align: left; overflow: hidden; text-overflow: ellipsis;"
                onmouseover="this.style.backgroundColor='#e0e0e0'"
                onmouseout="this.style.backgroundColor='#f5f5f5'"
                onclick="selectSpecialRoom('${room}')">${room}</button>
            </div>`;
    });

    optionsHtml += `
            </div>
        </div>
        <div style="text-align: center; padding-top: 10px;">
            <button style="padding: 8px 20px; cursor: pointer; background-color: #f44336; color: white; 
            border: none; border-radius: 4px;" onclick="closeModal()">ยกเลิก</button>
        </div>`;

    // ปรับขนาด modal ให้เหมาะสม
    const modal = document.getElementById("myModal");
    const modalContent = modal.querySelector(".modal-content");
    
    if (modalContent) {
        modalContent.style.maxWidth = "700px";
        modalContent.style.padding = "20px";
        modalContent.style.borderRadius = "12px";
    }

    showModal(optionsHtml);
fodal(optionsHtml);
}

// เพิ่มฟังก์ชัน searchRoom
function searchRoom(roomNumber) {
    let resultElement = document.getElementById('result');
    let submitBtn = document.getElementById('submitBtn');
    let loadingGif = document.getElementById('loadingGif');
    let container = document.querySelector('.container');

    isSearching = true; // ตั้ง flag

    resultElement.innerText = "Searching...";
    resultElement.style.color = "blue";
    loadingGif.style.display = "block";
    container.classList.add("shrink");

    // เพิ่ม padding animation ถ้าเคยกด OK
    if (userConfirmedOnce) {
        container.classList.remove("padding-anim");
        void container.offsetWidth; // รีเฟรชการแสดงผล
        container.classList.add("padding-anim"); // เพิ่มแอนิเมชัน
    }

    submitBtn.disabled = true;
    submitBtn.innerText = "Searching...";

    fetch("https://script.google.com/macros/s/AKfycbzWflHbJe1-yIrMJ7ZFooe1U56_h9IuYIAmmWxN1x-5nzJe56KJE_eQ_-cZmmB7oJNX2A/exec?room=" + encodeURIComponent(roomNumber))
        .then(response => response.json())
        .then(data => {
            isSearching = false; // รีเซ็ต flag

            loadingGif.style.display = "none";
            submitBtn.disabled = false;
            submitBtn.innerText = "Submit";

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
                ${iconSoap} <strong>Latest Deep Clean:</strong> ${deepCleanDate} <br>
                ${iconNextClean} <strong>Next Air Filter Clean:</strong> ${nextFilterAirDate} <br>
                ${iconAir} <strong>Latest Air Filter Clean:</strong> ${filterAirDate} <br>
                <p style="margin-top: 10px;">
                    <small>
                        <em>🐾 Come meet TaoTao, the super cute cat that everyone falls in love with at first sight. 
                       <a href="https://www.instagram.com/p/DF6tlZqPay5/?img_index=1" style="color: blue; text-decoration: underline; font-weight: bold;"> click</a>
                    TaoTao and you'll see why everyone's so smitten!</em>
                    </small>
                </p>
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
            isSearching = false; // รีเซ็ต flag

            resultElement.innerText = "❌ An error occurred.";
            resultElement.style.color = "red";
            showModal("❌ Please try again.");
            loadingGif.style.display = "none";
            submitBtn.disabled = false;
            submitBtn.innerText = "Submit";

            container.classList.remove("expand", "shrink");
            void container.offsetWidth;
            container.classList.add("shrink");
        });
}
// ฟังก์ชันสำหรับการ submit ห้อง
/* The `submitRoom()` function in the provided JavaScript code is responsible for handling the
submission of a room number input by the user. Here is a breakdown of what the function does: */
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
    
    // ตรวจสอบว่าเป็น ## หรือไม่ก่อนตรวจสอบ pattern
    if (roomNumber === "##") {
        showSpecialRoomOptions();
        return;
    }
    
    // ถ้าเลือกห้องจาก Special Rooms ข้ามการตรวจสอบรูปแบบ
    if (isSpecialRoom) {
        // รีเซ็ต flag หลังจากการเลือกห้องจาก Special Rooms
        isSpecialRoom = false;
        searchRoom(roomNumber);  // เรียกฟังก์ชัน searchRoom โดยไม่ตรวจสอบรูปแบบ
        return;
    }
    
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
                    ${iconSoap} <strong>Latest Deep Clean:</strong> ${deepCleanDate} <br>
                    ${iconNextClean} <strong>Next Air Filter Clean:</strong> ${nextFilterAirDate} <br>
                    ${iconAir} <strong>Latest Air Filter Clean:</strong> ${filterAirDate} <br>
                    <p style="margin-top: 10px;">
                        <small>
                            <em>🐾 Come meet TaoTao, the super cute cat that everyone falls in love with at first sight. 
                           <a href="https://www.instagram.com/p/DF6tlZqPay5/?img_index=1" style="color: blue; text-decoration: underline; font-weight: bold;"> click</a>
                        TaoTao and you'll see why everyone's so smitten!</em>
                        </small>
                    </p>
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
