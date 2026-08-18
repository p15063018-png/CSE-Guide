import { auth } from "./firebase-config.js";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

const loginForm = document.getElementById("login-form");
const phoneInput = document.getElementById("phone");
const branchSelect = document.getElementById("branch");
const collegeInput = document.getElementById("college");

const otpSection = document.getElementById("otp-section");
const otpInput = document.getElementById("otp");
const verifyOtpButton = document.getElementById("verify-otp-btn");

let confirmationResult = null;
let tempUserData = null;

function generateDeviceId() {
  const random = Math.random().toString(36).slice(2, 10);
  const time = Date.now().toString(36);
  return `${random}-${time}`;
}

function getStoredDeviceId() {
  return localStorage.getItem("device_id");
}

function storeDeviceId(deviceId) {
  localStorage.setItem("device_id", deviceId);
}

function storeSession(user) {
  localStorage.setItem("user_session", JSON.stringify(user));
}

// reCAPTCHA verifier (implicit)
const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
  size: "invisible"
});

// If already logged in, redirect
const existingSession = localStorage.getItem("user_session");
if (existingSession) {
  window.location.href = "dashboard.html";
}

loginForm.addEventListener("submit", async function (event) {
  event.preventDefault();

  const phone = phoneInput.value.trim();
  const branch = branchSelect.value;
  const college = collegeInput.value.trim();

  if (!/^[0-9]{10}$/.test(phone)) {
    alert("Please enter a valid 10-digit mobile number.");
    return;
  }

  const fullPhone = "+91" + phone;

  try {
    confirmationResult = await signInWithPhoneNumber(
      auth,
      fullPhone,
      recaptchaVerifier
    );

    tempUserData = { phone, branch, college };
    otpSection.style.display = "block";
    loginForm.querySelector("button[type='submit']").disabled = true;
    alert("OTP sent. Please check your phone.");
  } catch (error) {
    console.error("OTP send error:", error);
    alert("Failed to send OTP. Please try again.");
  }
});

verifyOtpButton.addEventListener("click", async function () {
  const otp = otpInput.value.trim();
  if (!/^[0-9]{6}$/.test(otp)) {
    alert("Please enter a valid 6-digit OTP.");
    return;
  }

  try {
    const result = await confirmationResult.confirm(otp);
    const user = result.user;

    let deviceId = getStoredDeviceId();
    if (!deviceId) {
      deviceId = generateDeviceId();
      storeDeviceId(deviceId);
    }

    const userDoc = {
      uid: user.uid,
      phone: tempUserData.phone,
      branch: tempUserData.branch,
      college: tempUserData.college,
      device_id: deviceId,
      created_at: new Date().toISOString()
    };

    storeSession(userDoc);

    window.location.href = "dashboard.html";
  } catch (error) {
    console.error("OTP verify error:", error);
    alert("Invalid OTP. Please try again.");
  }
});
