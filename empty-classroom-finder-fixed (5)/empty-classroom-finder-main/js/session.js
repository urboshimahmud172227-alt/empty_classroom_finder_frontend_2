// Session helper: shows the real user in the topbar, hides admin-only UI
// from non-admins, guards admin.html by role, and shows a booking badge on the bell.

import { auth, db } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { doc, getDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

const page = window.location.pathname.split("/").pop();

// Hide admin links until we know the role (prevents a flash for students)
const hideStyle = document.createElement("style");
hideStyle.textContent = 'a[href="admin.html"]{display:none !important}';
document.head.appendChild(hideStyle);

function todayStr() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

onAuthStateChanged(auth, async (user) => {
  if (!user) return; // auth.js redirects to login

  let role = "student";
  let name = user.email.split("@")[0];
  try {
    const snap = await getDoc(doc(db, "users", user.uid));
    if (snap.exists()) {
      role = snap.data().role || role;
      name = snap.data().name || name;
    }
  } catch (e) {
    console.error("Could not load user profile:", e);
  }

  const isAdmin = role === "admin";

  // Role guard for the admin page
  if (page === "admin.html") {
    if (!isAdmin) {
      window.location.replace("dashboard.html");
      return;
    }
    document.body.style.visibility = "visible";
  }

  if (isAdmin) hideStyle.remove();

  // Topbar user badge
  const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);
  document.querySelectorAll(".user-avatar").forEach((el) => {
    el.textContent = name.trim().charAt(0).toUpperCase();
  });
  document.querySelectorAll(".user-badge span:not(.user-avatar)").forEach((el) => {
    el.textContent = `${name.trim().split(" ")[0]} (${roleLabel})`;
  });

  // Notification bell: badge with number of upcoming bookings, click opens My Bookings
  try {
    const q = query(collection(db, "bookings"), where("booked_by", "==", user.email));
    const res = await getDocs(q);
    const today = todayStr();
    let upcoming = 0;
    res.forEach((d) => {
      const b = d.data();
      if (b.status !== "cancelled" && b.date >= today) upcoming++;
    });
    document.querySelectorAll(".notification-btn").forEach((btn) => {
      btn.title = upcoming ? `${upcoming} upcoming booking(s)` : "No upcoming bookings";
      btn.style.position = "relative";
      if (upcoming) {
        const badge = document.createElement("span");
        badge.textContent = upcoming;
        badge.style.cssText =
          "position:absolute;top:-4px;right:-4px;min-width:18px;height:18px;padding:0 5px;border-radius:9px;" +
          "background:#e0342a;color:#fff;font-size:11px;font-weight:600;line-height:18px;text-align:center;";
        btn.appendChild(badge);
      }
      btn.addEventListener("click", () => (window.location.href = "bookings.html"));
    });
  } catch (e) {
    console.error("Could not load notifications:", e);
  }
});
