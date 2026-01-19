// ===== PERFORMANCE OPTIMIZATION UTILITIES =====
// Memoization cache untuk hasil rendering
const memoCache = new Map();

// Debounce function untuk event listeners
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function untuk event listeners yang frequent
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Safe localStorage getter dengan try-catch
function safeGetLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    console.warn(`Error parsing localStorage key "${key}":`, e);
    return defaultValue;
  }
}

// Safe localStorage setter dengan try-catch
function safeSetLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error(`Error saving to localStorage key "${key}":`, e);
    return false;
  }
}

// Global variables - MODIFIED
let currentUser = null;
let bookingItems = safeGetLocalStorage("bookingItems", []);
let cartItems = safeGetLocalStorage("cartItems", []);
let currentRental = safeGetLocalStorage("currentRental", null);
let currentProductId = null; // Track which product is being viewed
let currentMode = 'buy'; // 'buy' atau 'rent'

// Update products dengan gambar desain dekorasi yang lebih relevan
let products = [
  {
    id: 1,
    name: "Paket Dekorasi Pernikahan Minimalis",
    description: "Paket lengkap dekorasi pernikahan dengan tema minimalis dan elegan",
    image: "dekor.jpg",
    price: 150000,
    rentalPrices: {
      1: 500000,
      3: 1200000,
      7: 2500000,
      14: 4500000
    },
    deposit: 1000000,
    category: "Desain Dekorasi",
    originalPrice: 250000,
    discount: 30,
    rating: 4.8,
    reviews: 245,
    sold: 1240,
    isBestseller: true
  },
  {
    id: 2,
    name: "Dekorasi Pesta Ulang Tahun Anak",
    description: "Dekorasi warna-warni dengan tema karakter kartun favorit anak",
    image: "ulang_tahun_anak.jpeg",
    price: 120000,
    rentalPrices: {
      1: 400000,
      3: 1000000,
      7: 2000000,
      14: 3800000
    },
    deposit: 800000,
    category: "Desain Dekorasi",
    originalPrice: 160000,
    discount: 25,
    rating: 4.7,
    reviews: 189,
    sold: 856,
    isBestseller: true
  },
  {
    id: 3,
    name: "Dekorasi Acara Kantor",
    description: "Dekorasi profesional untuk meeting, seminar, atau acara perusahaan",
    image: "Acara kantor.jpg",
    price: 80000,
    rentalPrices: {
      1: 300000,
      3: 750000,
      7: 1500000,
      14: 2800000
    },
    deposit: 500000,
    category: "Desain Dekorasi",
    rating: 4.6,
    reviews: 142,
    sold: 523
  },
  {
    id: 4,
    name: "Dekorasi Garden Party",
    description: "Dekorasi outdoor dengan tema alam untuk acara di ruang terbuka",
    image: "garden_party.jpeg",
    price: 75000,
    rentalPrices: {
      1: 250000,
      3: 600000,
      7: 1200000,
      14: 2200000
    },
    deposit: 400000,
    category: "Desain Dekorasi",
    rating: 4.5,
    reviews: 98,
    sold: 412
  },
  {
    id: 5,
    name: "Paket Dekorasi Baby Shower",
    description: "Dekorasi lembut dan manis untuk menyambut kehadiran bayi",
    image: "baby_shower.jpeg",
    price: 95000,
    rentalPrices: {
      1: 350000,
      3: 850000,
      7: 1700000,
      14: 3200000
    },
    deposit: 700000,
    category: "Desain Dekorasi",
    originalPrice: 120000,
    discount: 20,
    rating: 4.9,
    reviews: 267,
    sold: 1402,
    isBestseller: true
  },
  {
    id: 6,
    name: "Dekorasi Graduation Party",
    description: "Dekorasi meriah untuk merayakan kelulusan dan prestasi",
    image: "Gradu.jpg",
    price: 110000,
    rentalPrices: {
      1: 400000,
      3: 950000,
      7: 1900000,
      14: 3600000
    },
    deposit: 800000,
    category: "Desain Dekorasi",
    rating: 4.4,
    reviews: 76,
    sold: 289
  },
  {
    id: 7,
    name: "Paket Dekorasi Natal",
    description: "Dekorasi festive dengan tema Natal yang hangat dan meriah",
    image: "Dekorasi natal.jpeg",
    price: 85000,
    rentalPrices: {
      1: 300000,
      3: 700000,
      7: 1400000,
      14: 2600000
    },
    deposit: 600000,
    category: "Desain Dekorasi",
    rating: 4.7,
    reviews: 203,
    sold: 678,
    isBestseller: true
  },
  {
    id: 8,
    name: "Dekorasi Acara Pernikahan Tradisional",
    description: "Dekorasi dengan sentuhan tradisional untuk pernikahan adat",
    image: "Tradi.jpg",
    price: 153000,
    rentalPrices: {
      1: 500000,
      3: 1200000,
      7: 2400000,
      14: 4500000
    },
    deposit: 800000,
    category: "Desain Dekorasi",
    originalPrice: 180000,
    discount: 15,
    rating: 4.8,
    reviews: 156,
    sold: 723
  },
  // Kategori: Tanaman Hias Indoor
  {
    id: 9,
    name: "Monstera Deliciosa",
    description: "Tanaman indoor populer dengan daun hijau besar berlubang yang memukau",
    image: "mosntera.jpeg",
    price: 150000,
    rentalPrices: {
      1: 50000,
      3: 120000,
      7: 250000,
      14: 450000
    },
    deposit: 100000,
    category: "indoor",
    originalPrice: 200000,
    discount: 25,
    rating: 4.9,
    reviews: 342,
    sold: 1893,
    isBestseller: true
  },
  {
    id: 10,
    name: "Pothos Golden",
    description: "Tanaman merambat yang mudah dirawat, cocok untuk pemula dengan daun emas menawan",
    image: "pothos.jpeg",
  price: 75000,
    rentalPrices: {
      1: 25000,
      3: 60000,
      7: 120000,
      14: 200000
    },
    deposit: 50000,
    category: "indoor",
    originalPrice: 100000,
    discount: 25,
    rating: 4.7,
    reviews: 287,
    sold: 1456,
    isBestseller: true
  },
  {
    id: 11,
    name: "Aglonema Red (Chinese Evergreen)",
    description: "Tanaman indoor dengan daun merah cerah yang memberikan aksent warna di ruangan",
    image: "Aglonema Red (Chinese Evergreen).jpeg",
    price: 120000,
    rentalPrices: {
      1: 40000,
      3: 100000,
      7: 200000,
      14: 350000
    },
    deposit: 80000,
    category: "indoor",
    rating: 4.6,
    reviews: 198,
    sold: 876
  },
  {
    id: 12,
    name: "Snake Plant (Sansevieria)",
    description: "Tanaman tahan lama yang menyerap toksin udara dan sangat mudah dirawat",
    image: "Snake Plant (Sansevieria).jpeg",
    price: 85000,
    rentalPrices: {
      1: 30000,
      3: 75000,
      7: 150000,
      14: 250000
    },
    deposit: 60000,
    category: "indoor",
    originalPrice: 110000,
    discount: 23,
    rating: 4.8,
    reviews: 267,
    sold: 1523,
    isBestseller: true
  },
  {
    id: 13,
    name: "Fiddle Leaf Fig",
    description: "Tanaman indoor premium dengan daun besar hijau yang elegan dan modern",
    image: "Fiddle Leaf Fig.jpeg",
    price: 200000,
    rentalPrices: {
      1: 70000,
      3: 170000,
      7: 350000,
      14: 600000
    },
    deposit: 150000,
    category: "indoor",
    originalPrice: 280000,
    discount: 28,
    rating: 4.9,
    reviews: 234,
    sold: 1089
  },
  {
    id: 14,
    name: "Philodendron Pink Princess",
    description: "Tanaman indoor langka dengan daun pink yang eksotis dan menawan",
    image: "Philodendron Pink Princess.jpeg",
    price: 250000,
    rentalPrices: {
      1: 80000,
      3: 200000,
      7: 400000,
      14: 700000
    },
    deposit: 180000,
    category: "indoor",
    originalPrice: 350000,
    discount: 29,
    rating: 4.9,
    reviews: 189,
    sold: 723
  },
  {
    id: 15,
    name: "Calathea Ornata",
    description: "Tanaman indoor cantik dengan pola garis putih yang menciptakan visual yang dramatis",
    image: "Calathea Ornata.jpeg",
    price: 180000,
    rentalPrices: {
      1: 60000,
      3: 150000,
      7: 300000,
      14: 500000
    },
    deposit: 120000,
    category: "indoor",
    originalPrice: 240000,
    discount: 25,
    rating: 4.7,
    reviews: 156,
    sold: 578
  },
  // Kategori: Tanaman Hias Outdoor
  {
    id: 16,
    name: "Bougainvillea Merah",
    description: "Tanaman outdoor yang mekar sepanjang tahun dengan bunga merah mencolok",
    image: "Bougainvillea Merah.jpeg",
    price: 120000,
    rentalPrices: {
      1: 40000,
      3: 100000,
      7: 200000,
      14: 350000
    },
    deposit: 80000,
    category: "outdoor",
    originalPrice: 160000,
    discount: 25,
    rating: 4.8,
    reviews: 245,
    sold: 1834,
    isBestseller: true
  },
  {
    id: 17,
    name: "Mawar Merah Segar",
    description: "Tanaman outdoor dengan bunga mawar indah yang cocok untuk taman dan dekorasi",
    image: "Mawar Merah Segar.jpg",
    price: 100000,
    rentalPrices: {
      1: 35000,
      3: 85000,
      7: 170000,
      14: 300000
    },
    deposit: 70000,
    category: "outdoor",
    originalPrice: 135000,
    discount: 26,
    rating: 4.7,
    reviews: 198,
    sold: 1243
  },
  {
    id: 18,
    name: "Kenikir Kuning (Bunga Matahari)",
    description: "Tanaman outdoor yang cerah dan ceria dengan bunga kuning besar yang tahan lama",
    image: "Kenikir Kuning (Bunga Matahari).jpg",
    price: 65000,
    rentalPrices: {
      1: 20000,
      3: 50000,
      7: 100000,
      14: 180000
    },
    deposit: 45000,
    category: "outdoor",
    originalPrice: 90000,
    discount: 28,
    rating: 4.6,
    reviews: 167,
    sold: 912
  },
  {
    id: 19,
    name: "Bunga Kertas (Bougainvillea Pink)",
    description: "Tanaman outdoor dengan bunga pink yang indah dan tahan cuaca ekstrim",
    image: "Bunga Kertas (Bougainvillea Pink).jpg",
    price: 110000,
    rentalPrices: {
      1: 38000,
      3: 95000,
      7: 190000,
      14: 340000
    },
    deposit: 75000,
    category: "outdoor",
    rating: 4.7,
    reviews: 145,
    sold: 678
  },
  {
    id: 20,
    name: "Cemara Udara Hijau",
    description: "Pohon outdoor dengan daun hijau asri yang sempurna untuk pagar dan peneduh",
    image: "Cemara Udara Hijau.jpg",
    price: 350000,
    rentalPrices: {
      1: 120000,
      3: 300000,
      7: 600000,
      14: 1000000
    },
    deposit: 250000,
    category: "outdoor",
    originalPrice: 450000,
    discount: 22,
    rating: 4.8,
    reviews: 89,
    sold: 245
  },
  {
    id: 21,
    name: "Palem Areka",
    description: "Pohon outdoor yang indah dengan daun menyirip yang mempercantik halaman rumah",
    image: "Palem Areka.jpg",
    price: 280000,
    rentalPrices: {
      1: 95000,
      3: 240000,
      7: 480000,
      14: 850000
    },
    deposit: 200000,
    category: "outdoor",
    originalPrice: 360000,
    discount: 22,
    rating: 4.7,
    reviews: 127,
    sold: 456
  },
  {
    id: 22,
    name: "Anturium Merah Outdoor",
    description: "Tanaman outdoor tahan sinar matahari dengan bunga merah yang elegan dan awet",
    image: "Anturium Merah Outdoor.jpg",
    price: 140000,
    rentalPrices: {
      1: 45000,
      3: 115000,
      7: 230000,
      14: 400000
    },
    deposit: 100000,
    category: "outdoor",
    originalPrice: 180000,
    discount: 22,
    rating: 4.8,
    reviews: 198,
    sold: 834
  },
  // Kategori: Peralatan Dekorasi
  {
    id: 23,
    name: "Standing Banner Aluminium",
    description: "Peralatan display profesional dengan frame aluminium yang ringan dan tahan lama",
    image: "Standing Banner Aluminium.jpg",
    price: 180000,
    rentalPrices: {
      1: 60000,
      3: 150000,
      7: 300000,
      14: 500000
    },
    deposit: 120000,
    category: "peralatan",
    originalPrice: 240000,
    discount: 25,
    rating: 4.7,
    reviews: 156,
    sold: 678,
    isBestseller: true
  },
  {
    id: 24,
    name: "Backdrop Foto Dekorasi",
    description: "Backdrop cantik untuk photobooth dan sesi foto dengan berbagai pilihan desain",
    image: "Backdrop Foto Dekorasi.jpg",
    price: 200000,
    rentalPrices: {
      1: 70000,
      3: 170000,
      7: 350000,
      14: 600000
    },
    deposit: 150000,
    category: "peralatan",
    originalPrice: 280000,
    discount: 29,
    rating: 4.8,
    reviews: 234,
    sold: 1123,
    isBestseller: true
  },
  {
    id: 25,
    name: "Balloons Dekorasi Pesta",
    description: "Paket balon dekorasi lengkap dengan pompa dan aksesoris untuk pesta yang meriah",
    image: "Ballon.jpeg",
    price: 85000,
    rentalPrices: {
      1: 30000,
      3: 75000,
      7: 150000,
      14: 250000
    },
    deposit: 60000,
    category: "peralatan",
    originalPrice: 110000,
    discount: 23,
    rating: 4.6,
    reviews: 289,
    sold: 2134
  },
  {
    id: 26,
    name: "Lightbox LED Dekorasi",
    description: "Lampu dekorasi LED modern yang dapat dikustomisasi dengan berbagai tema dan warna",
    image: "lIGHTBOX.jpeg",
    price: 250000,
    rentalPrices: {
      1: 85000,
      3: 210000,
      7: 420000,
      14: 700000
    },
    deposit: 180000,
    category: "peralatan",
    originalPrice: 350000,
    discount: 29,
    rating: 4.9,
    reviews: 178,
    sold: 834,
    isBestseller: true
  },
  {
    id: 27,
    name: "String Lights Dekorasi",
    description: "Lampu string yang hangat dan elegan untuk menciptakan suasana yang romantis dan cozy",
    image: "String Lights Dekorasi.jpg",
    price: 120000,
    rentalPrices: {
      1: 40000,
      3: 100000,
      7: 200000,
      14: 350000
    },
    deposit: 80000,
    category: "peralatan",
    originalPrice: 160000,
    discount: 25,
    rating: 4.8,
    reviews: 245,
    sold: 1567
  },
  {
    id: 28,
    name: "Tabung Asap Fog Machine",
    description: "Mesin fog profesional untuk menciptakan efek asap yang dramatis di acara Anda",
    image: "Tabung Asap Fog Machine.webp",
    price: 300000,
    rentalPrices: {
      1: 100000,
      3: 250000,
      7: 500000,
      14: 850000
    },
    deposit: 200000,
    category: "peralatan",
    originalPrice: 400000,
    discount: 25,
    rating: 4.7,
    reviews: 123,
    sold: 456
  },
  {
    id: 29,
    name: "Proyektor Dekorasi Hologram",
    description: "Proyektor modern yang menciptakan efek visual menakjubkan untuk acara spesial",
    image: "Proyektor Dekorasi Hologram.jpg",
    price: 450000,
    rentalPrices: {
      1: 150000,
      3: 370000,
      7: 750000,
      14: 1300000
    },
    deposit: 300000,
    category: "peralatan",
    originalPrice: 600000,
    discount: 25,
    rating: 4.9,
    reviews: 89,
    sold: 234
  }
];

// Tambahkan buyPrice ke setiap produk jika belum ada
products.forEach(product => {
  if (!product.buyPrice) {
    product.buyPrice = product.price; // Gunakan price sebagai harga beli
  }
});

// DOM Content Loaded - MODIFIED
document.addEventListener("DOMContentLoaded", () => {
  // Show loading screen saat page mulai loading
  showLoadingScreen();
  
  // Check if user is logged in
  checkLoginStatus();
  
  // PERUBAHAN: Selalu tampilkan main content (homepage) tanpa login overlay
  document.getElementById('login-overlay').style.display = 'none';
  document.getElementById('main-content').style.display = 'block';
  
  // Initialize the app
  initApp();
  
  // Display products on home page
  displayProducts('home-products', products);
  
  // Display products on explore page
  displayProducts('explore-products', products);
  
  // Update booking count
  updateBookingCount();
  
  // Update cart count
  updateCartCount();
  
  // Event listeners
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
  document.getElementById('checkout-btn').addEventListener('click', redirectToLoginIfNeeded.bind(null, () => showPage('checkout')));
  document.getElementById('pay-btn').addEventListener('click', handlePayment);
  document.getElementById('profile-form').addEventListener('submit', saveProfile);
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('register-form').addEventListener('submit', handleRegister);
  document.querySelector('.logout-btn').addEventListener('click', handleLogout);
  
  // Event listeners baru
  document.getElementById('rent-now').addEventListener('click', () => {
    redirectToLoginIfNeeded(() => handleRentNow());
  });
  
  // Event listener untuk update harga sewa
  document.querySelectorAll('input[name="rental-period"]').forEach(radio => {
    radio.addEventListener('change', updateRentalSummary);
  });
  
  // Event listener untuk update jumlah
  document.getElementById('quantity').addEventListener('change', updateRentalSummary);
  
  // Set tanggal minimal untuk sewa (hari ini)
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('rental-start-date').min = today;
  
  // Load user profile data if available
  loadUserData();
  
  // Initialize profile photo upload
  initProfilePhotoUpload();
  
  // Jika ada rental yang sedang diproses, tampilkan info di checkout
  if (currentRental) {
    displayRentalCheckoutInfo();
  }
  
  // Event listener untuk login awal
  document.getElementById('initial-login-form').addEventListener('submit', handleInitialLogin);
  
  // Tambahkan event listener pada semua tombol booking di homepage
  addBookingButtonListeners();
  
  // Hide loading screen setelah semua konten selesai dimuat
  setTimeout(() => {
    hideLoadingScreen();
  }, 1000);
});

// Handle initial login
function handleInitialLogin(e) {
  e.preventDefault();
  
  // Show loading screen
  showLoadingScreen();
  
  const username = document.querySelector('#initial-login-form input[type="text"]').value;
  const password = document.querySelector('#initial-login-form input[type="password"]').value;
  
  // Simple validation
  if (!username || !password) {
    hideLoadingScreen();
    alert('Harap isi semua field!');
    return;
  }
  
  // Delay untuk simulasi proses login
  setTimeout(() => {
    // Save user data to localStorage
    const userData = {
      username: username,
      isLoggedIn: true,
      loginTime: new Date().toISOString()
    };
    
    safeSetLocalStorage('userData', userData);
    safeSetLocalStorage('isLoggedIn', true);
    currentUser = userData;
    
    alert('Login berhasil!');
    
    // Hide login overlay and show main content
    document.getElementById('login-overlay').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
    
    // Initialize the app
    initApp();
    
    // Display products on home page
    displayProducts('home-products', products);
    
    // Display products on explore page
    displayProducts('explore-products', products);
    
    // Update booking count
    updateBookingCount();
    
    // Event listeners
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('checkout-btn').addEventListener('click', showPage.bind(null, 'checkout'));
    document.getElementById('pay-btn').addEventListener('click', handlePayment);
    document.getElementById('profile-form').addEventListener('submit', saveProfile);
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.querySelector('.logout-btn').addEventListener('click', handleLogout);
    
    // Event listeners baru
    document.getElementById('rent-now').addEventListener('click', handleRentNow);
    
    // Event listener untuk update harga sewa
    document.querySelectorAll('input[name="rental-period"]').forEach(radio => {
      radio.addEventListener('change', updateRentalSummary);
    });
    
    // Event listener untuk update jumlah
    document.getElementById('quantity').addEventListener('change', updateRentalSummary);
    
    // Set tanggal minimal untuk sewa (hari ini)
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('rental-start-date').min = today;
    
    // Load user profile data if available
    loadUserData();
    
    // Jika ada rental yang sedang diproses, tampilkan info di checkout
    if (currentRental) {
      displayRentalCheckoutInfo();
    }
    
    // Hide loading screen
    hideLoadingScreen();
  }, 1200);
}

// Initialize the application
function initApp() {
  // Check for saved theme
  if (safeGetLocalStorage('theme') === 'dark') {
    document.body.classList.add('dark');
    document.getElementById('theme-toggle').textContent = '☀️';
  }
  
  // Check for saved user
  currentUser = safeGetLocalStorage('user', null);
  if (currentUser) {
  }
  
  // Check for saved booking items
  const savedBookingItems = safeGetLocalStorage('bookingItems', []);
  if (savedBookingItems.length > 0) {
    bookingItems = savedBookingItems;
  }
  
  // Check for saved rental
  const savedRental = safeGetLocalStorage('currentRental', null);
  if (savedRental) {
    currentRental = savedRental;
  }
}

// FUNGSI BARU: Cek login status dan redirect ke login jika diperlukan
function redirectToLoginIfNeeded(callback) {
  if (!currentUser || !safeGetLocalStorage('isLoggedIn')) {
    // Arahkan ke halaman login
    showPage('login');
    return;
  }
  
  // Jika sudah login, jalankan callback
  if (callback) {
    callback();
  }
}

// FUNGSI BARU: Tambahkan event listener pada semua tombol booking
function addBookingButtonListeners() {
  const bookingButtons = document.querySelectorAll('.btn-booking');
  bookingButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      if (!currentUser || !safeGetLocalStorage('isLoggedIn')) {
        showProductDetail(productId);
      }
    });
  });
}

// Show specific page and hide others
function showPage(pageId) {
  // Show loading screen
  showLoadingScreen();
  
  // Delay page transition untuk efek loading
  setTimeout(() => {
    // Hide all pages
    document.querySelectorAll('.page-section').forEach(page => {
      page.classList.remove('active');
    });
    
    // Show the selected page
    document.getElementById(pageId).classList.add('active');
    
    // PERUBAHAN: Kontrol navbar berdasarkan halaman aktif
    updateNavbarVisibility(pageId);
    
    // Kontrol footer visibility - sembunyikan di checkout
    const footer = document.querySelector('footer');
    if (footer) {
      if (pageId === 'checkout') {
        footer.style.display = 'none';
      } else {
        footer.style.display = 'block';
      }
    }
    
    // Update content for specific pages
    if (pageId === 'booking') {
      displayBookingItems();
    } else if (pageId === 'cart') {
      displayCartItems();
    } else if (pageId === 'checkout') {
      displayOrderItems();
      if (currentRental) {
        displayRentalCheckoutInfo();
      }
    } else if (pageId === 'booking-proof') {
      initBookingProof();
    }
    
    // Hide loading screen setelah konten selesai ditampilkan
    hideLoadingScreen();
  }, 500);
}

// FUNGSI BARU: Kontrol visibilitas navbar
function updateNavbarVisibility(pageId) {
  const headerSearch = document.querySelector('.header-search');
  const nav = document.querySelector('header nav');
  const headerActions = document.querySelector('.header-actions');
  const headerTitle = document.querySelector('header h1');
  const header = document.querySelector('header');
  
  // Jika di halaman login atau register, sembunyikan elemen lain
  if (pageId === 'login' || pageId === 'register') {
    if (headerSearch) headerSearch.style.display = 'none';
    if (nav) nav.style.display = 'none';
    if (headerActions) headerActions.style.display = 'none';
    if (header) {
      header.style.textAlign = 'center';
      header.style.paddingTop = '20px';
      header.style.paddingBottom = '20px';
    }
  } else {
    // Tampilkan kembali elemen navbar untuk halaman lain
    if (headerSearch) headerSearch.style.display = 'flex';
    if (nav) nav.style.display = 'flex';
    if (headerActions) headerActions.style.display = 'flex';
    if (header) {
      header.style.textAlign = 'initial';
      header.style.paddingTop = 'initial';
      header.style.paddingBottom = 'initial';
    }
  }
}

// Optimized render stars dengan memoization
const starsCache = new Map();
function renderStars(rating) {
  if (starsCache.has(rating)) {
    return starsCache.get(rating);
  }
  
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  let stars = '';
  
  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fas fa-star"></i>';
  }
  
  if (hasHalfStar) {
    stars += '<i class="fas fa-star-half-alt"></i>';
  }
  
  const emptyStars = 5 - Math.ceil(rating);
  for (let i = 0; i < emptyStars; i++) {
    stars += '<i class="far fa-star"></i>';
  }
  
  starsCache.set(rating, stars);
  return stars;
}

// Optimized display products dengan lazy loading dan event delegation
function displayProducts(containerId, productsToDisplay) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  // Build HTML lebih efisien
  const html = productsToDisplay.map(product => {
    const starsHTML = renderStars(product.rating);
    const originalPriceHTML = product.originalPrice ? `<div class="original-price">Rp ${product.originalPrice.toLocaleString('id-ID')}</div>` : '';
    const discountHTML = product.discount ? `<div class="discount-badge">-${product.discount}%</div>` : '';
    const bestsellerHTML = product.isBestseller ? `<div class="bestseller-badge"><i class="fas fa-fire"></i> Bestseller</div>` : '';
    
    return `<div class="product-card" data-id="${product.id}">
      ${discountHTML}
      ${bestsellerHTML}
      <img src="${product.image}" alt="${product.name}" loading="lazy">
      <h4>${product.name}</h4>
      <p>${product.description}</p>
      <div class="product-rating">
        <div class="stars">
          <span class="stars-display">${starsHTML}</span>
          <span class="rating-value">${product.rating}</span>
        </div>
        <span class="reviews-count">${product.reviews || 0} ulasan</span>
        <span class="sold-count">Terjual ${product.sold || 0}</span>
      </div>
      <div class="product-price-container">
        <div>
          ${originalPriceHTML}
          <div class="sale-price">Sewa mulai Rp ${product.rentalPrices[1].toLocaleString('id-ID')}/hari</div>
        </div>
        <button class="btn-booking" data-id="${product.id}"><i class="fas fa-calendar-plus"></i></button>
      </div>
      <button class="btn-detail" data-id="${product.id}">Lihat Detail</button>
    </div>`;
  }).join('');
  
  container.innerHTML = html;
  
  // Use event delegation instead of adding listeners to each button
  container.addEventListener('click', (e) => {
    const bookingBtn = e.target.closest('.btn-booking');
    const detailBtn = e.target.closest('.btn-detail');
    
    if (bookingBtn) {
      e.preventDefault();
      if (!currentUser || !safeGetLocalStorage('isLoggedIn')) {
        showPage('login');
      } else {
        const productId = parseInt(bookingBtn.dataset.id);
        showProductDetail(productId);
      }
    } else if (detailBtn) {
      const productId = parseInt(detailBtn.dataset.id);
      handleDetailClick(productId);
    }
  }, false);
}

// FUNGSI BARU: Handle detail button click dengan check login
function handleDetailClick(productId) {
  if (!currentUser || !safeGetLocalStorage('isLoggedIn')) {
    showPage('login');
  } else {
    showProductDetail(productId);
  }
}

// Switch mode antara Beli dan Sewa
function switchMode(mode) {
  currentMode = mode;
  
  // Update button styling
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  event.target.classList.add('active');
  
  // Update detail price berdasarkan mode
  updateDetailPrice();
  
  // Toggle visibility sections
  const rentalPeriod = document.querySelector('.rental-period');
  const buyQuantity = document.querySelector('.buy-quantity');
  const buyActionButtons = document.querySelector('.buy-action-buttons');
  const rentNowBtn = document.getElementById('rent-now');
  
  if (mode === 'buy') {
    // Tampilkan opsi beli
    if (rentalPeriod) rentalPeriod.style.display = 'none';
    if (buyQuantity) buyQuantity.style.display = 'block';
    if (buyActionButtons) buyActionButtons.style.display = 'flex';
    if (rentNowBtn) rentNowBtn.style.display = 'none';
  } else {
    // Tampilkan opsi sewa
    if (rentalPeriod) rentalPeriod.style.display = 'block';
    if (buyQuantity) buyQuantity.style.display = 'none';
    if (buyActionButtons) buyActionButtons.style.display = 'none';
    if (rentNowBtn) rentNowBtn.style.display = 'block';
  }
}

// Show product detail - MODIFIED
function showProductDetail(productId) {
  currentProductId = productId; // Store current product ID
  currentMode = 'rent'; // Default mode adalah rent
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  document.getElementById('detail-name').textContent = product.name;
  // Inisialisasi dengan harga sewa
  document.getElementById('detail-price').textContent = `Sewa mulai Rp ${product.rentalPrices[1].toLocaleString('id-ID')}/hari`;
  document.getElementById('detail-description').textContent = product.description;
  document.getElementById('detail-image').src = product.image;
  
  // Set mode buttons
  document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelector('.mode-btn:nth-child(2)').classList.add('active'); // Sewa button
  
  // Initialize visibility
  const rentalPeriod = document.querySelector('.rental-period');
  const buyQuantity = document.querySelector('.buy-quantity');
  const buyActionButtons = document.querySelector('.buy-action-buttons');
  const rentNowBtn = document.getElementById('rent-now');
  
  if (rentalPeriod) rentalPeriod.style.display = 'block';
  if (buyQuantity) buyQuantity.style.display = 'none';
  if (buyActionButtons) buyActionButtons.style.display = 'none';
  if (rentNowBtn) rentNowBtn.style.display = 'block';
  
  // Set rental prices jika tersedia
  if (product.rentalPrices) {
    document.querySelector('input[name="rental-period"][value="1"]').nextElementSibling.querySelector('.rental-price').textContent = 
      `Rp ${product.rentalPrices[1].toLocaleString('id-ID')}`;
    document.querySelector('input[name="rental-period"][value="3"]').nextElementSibling.querySelector('.rental-price').textContent = 
      `Rp ${product.rentalPrices[3].toLocaleString('id-ID')}`;
    document.querySelector('input[name="rental-period"][value="7"]').nextElementSibling.querySelector('.rental-price').textContent = 
      `Rp ${product.rentalPrices[7].toLocaleString('id-ID')}`;
    document.querySelector('input[name="rental-period"][value="14"]').nextElementSibling.querySelector('.rental-price').textContent = 
      `Rp ${product.rentalPrices[14].toLocaleString('id-ID')}`;
    
    // Set deposit
    document.querySelector('.rental-summary-row:nth-child(2) span:last-child').textContent = 
      `Rp ${product.deposit.toLocaleString('id-ID')}`;
  }
  
  // Update ringkasan sewa
  updateRentalSummary();
  
  // Setup rental period change listener
  document.querySelectorAll('input[name="rental-period"]').forEach(radio => {
    radio.removeEventListener('change', updateRentalSummary);
    radio.addEventListener('change', updateRentalSummary);
  });
  
  // Setup quantity change listener
  const quantityInput = document.getElementById('quantity');
  quantityInput.removeEventListener('change', updateRentalSummary);
  quantityInput.addEventListener('change', updateRentalSummary);
  
  // Setup booking button - remove old listener and add new one
  const rentButton = document.getElementById('rent-now');
  const newRentButton = rentButton.cloneNode(true);
  rentButton.parentNode.replaceChild(newRentButton, rentButton);
  
  newRentButton.addEventListener('click', () => {
    const selectedPeriod = document.querySelector('input[name="rental-period"]:checked').value;
    const quantity = parseInt(document.getElementById('quantity').value);
    const startDate = document.getElementById('rental-start-date')?.value || new Date().toISOString().split('T')[0];
    
    addToBooking(currentProductId, parseInt(selectedPeriod), quantity, startDate);
  });
  
  // Display comments for this product
  displayProductComments(productId);
  initCommentForm();
  
  showPage('product-detail');
}

// Update detail price berdasarkan mode
function updateDetailPrice() {
  const product = products.find(p => p.id === currentProductId);
  if (!product) return;
  
  const priceElement = document.getElementById('detail-price');
  
  if (currentMode === 'buy') {
    priceElement.textContent = `Beli Rp ${product.buyPrice.toLocaleString('id-ID')}`;
  } else {
    priceElement.textContent = `Sewa mulai Rp ${product.rentalPrices[1].toLocaleString('id-ID')}/hari`;
  }
}

// Update rental summary
function updateRentalSummary() {
  const product = products.find(p => p.id === currentProductId);
  if (!product || !product.rentalPrices) return;
  
  const selectedPeriod = document.querySelector('input[name="rental-period"]:checked').value;
  const quantity = parseInt(document.getElementById('quantity').value);
  
  const rentalPrice = product.rentalPrices[selectedPeriod];
  const totalRental = rentalPrice * quantity;
  const deposit = product.deposit * quantity;
  const totalPayment = totalRental + deposit;
  
  document.getElementById('rental-price-summary').textContent = `Rp ${totalRental.toLocaleString('id-ID')}`;
  document.querySelector('.rental-summary-row:nth-child(2) span:last-child').textContent = `Rp ${deposit.toLocaleString('id-ID')}`;
  document.getElementById('rental-total').textContent = `Rp ${totalPayment.toLocaleString('id-ID')}`;
}

// Fungsi untuk menambah ke booking
function addToBooking(productId, rentalPeriod = 1, quantity = 1, startDate = null) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const rentalPrice = product.rentalPrices[rentalPeriod];
  const deposit = product.deposit;
  const totalPrice = (rentalPrice * quantity) + (deposit * quantity);
  
  // Check if item already exists in booking
  const existingItem = bookingItems.find(item => 
    item.id === productId && 
    item.rentalPeriod === rentalPeriod && 
    item.startDate === (startDate || new Date().toISOString().split('T')[0])
  );
  
  if (existingItem) {
    // Update quantity if item already exists
    existingItem.quantity += quantity;
    existingItem.totalPrice = (rentalPrice * existingItem.quantity) + (deposit * existingItem.quantity);
    alert(`✅ Jumlah ${product.name} diperbarui menjadi ${existingItem.quantity}!`);
  } else {
    // Add new booking item
    const bookingItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      rentalPeriod: rentalPeriod,
      quantity: quantity,
      rentalPrice: rentalPrice,
      deposit: deposit,
      totalPrice: totalPrice,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: calculateEndDate(startDate, rentalPeriod)
    };
    
    bookingItems.push(bookingItem);
    alert(`✅ ${product.name} berhasil ditambahkan ke booking sewa!`);
  }
  
  safeSetLocalStorage("bookingItems", bookingItems);
  updateBookingCount();
  
  // Redirect ke halaman booking
  showPage('booking');
}

// Fungsi untuk menghitung tanggal akhir
function calculateEndDate(startDate, rentalPeriod) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + parseInt(rentalPeriod));
  return date.toISOString().split('T')[0];
}

// Update booking count
function updateBookingCount() {
  const bookingCount = bookingItems.reduce((total, item) => total + item.quantity, 0);
  document.getElementById('booking-count').textContent = bookingCount;
}

// Update cart count
function updateCartCount() {
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cartCount;
  }
}

// Tambah ke keranjang belanja
function addToCart(productId, quantity = 1) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  const existingItem = cartItems.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
    alert(`✅ ${product.name} berhasil diperbarui di keranjang!`);
  } else {
    const cartItem = {
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity: quantity
    };
    cartItems.push(cartItem);
    alert(`✅ ${product.name} berhasil ditambahkan ke keranjang!`);
  }
  
  safeSetLocalStorage("cartItems", cartItems);
  updateCartCount();
}

// Hapus dari keranjang
function removeFromCart(index) {
  cartItems.splice(index, 1);
  safeSetLocalStorage("cartItems", cartItems);
  displayCartItems();
  updateCartCount();
}

// Display cart items
function displayCartItems() {
  const cartItemsContainer = document.getElementById('cart-items');
  const totalPriceElement = document.getElementById('total-price');
  
  if (!cartItemsContainer) return;
  
  cartItemsContainer.innerHTML = '';
  
  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = '<p>Keranjang belanja Anda kosong.</p>';
    totalPriceElement.textContent = '0';
    return;
  }
  
  let totalPrice = 0;
  
  cartItems.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    totalPrice += itemTotal;
    
    const cartItemElement = document.createElement('div');
    cartItemElement.className = 'cart-item';
    cartItemElement.innerHTML = `
      <div class="cart-item-info">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-details">
          <h4>${item.name}</h4>
          <div class="cart-quantity">${item.quantity} × Rp ${item.price.toLocaleString('id-ID')}</div>
        </div>
      </div>
      <div class="cart-price">Rp ${itemTotal.toLocaleString('id-ID')}</div>
      <button class="remove-btn" onclick="removeFromCart(${index})">Hapus</button>
    `;
    cartItemsContainer.appendChild(cartItemElement);
  });
  
  totalPriceElement.textContent = totalPrice.toLocaleString('id-ID');
}

// Handle Add to Cart
// Global variable untuk menyimpan cart items asli saat direct buy
let directBuyItem = null;
let savedCartItems = null;

function handleAddToCart() {
  const quantity = parseInt(document.getElementById('buy-quantity').value || 1);
  addToCart(currentProductId, quantity);
  showPage('cart');
}

// Handle Direct Buy (Beli Sekarang)
function handleDirectBuy() {
  const quantity = parseInt(document.getElementById('buy-quantity').value || 1);
  const product = products.find(p => p.id === currentProductId);
  
  if (!product) return;
  
  // Simpan cart items yang ada sebelumnya
  savedCartItems = JSON.parse(JSON.stringify(cartItems));
  
  // Buat direct buy item
  directBuyItem = {
    id: product.id,
    name: product.name,
    image: product.image,
    price: product.price,
    quantity: quantity
  };
  
  // Set cart dengan hanya direct buy item
  cartItems = [directBuyItem];
  safeSetLocalStorage('cartItems', cartItems);
  updateCartCount();
  
  // Go langsung ke checkout page
  showPage('checkout');
}

// Handle Direct Buy Cancel (restore cart items lama)
function restorePreviousCart() {
  if (savedCartItems !== null) {
    cartItems = savedCartItems;
    safeSetLocalStorage('cartItems', cartItems);
    updateCartCount();
    directBuyItem = null;
    savedCartItems = null;
  }
}

// Handle Direct Buy Success (clear direct buy flags)
function completeDirectBuy() {
  directBuyItem = null;
  savedCartItems = null;
}

// Handle Back to Cart (restore cart items dan batal direct buy)
function handleBackToCart() {
  if (directBuyItem !== null) {
    // Restore cart items yang lama
    restorePreviousCart();
  }
  showPage('cart');
}

// Handle Rent Now button
function handleRentNow() {
  const product = products.find(p => p.id === parseInt(document.querySelector('.product-card[data-id]').dataset.id));
  if (!product) return;
  
  const selectedPeriod = document.querySelector('input[name="rental-period"]:checked').value;
  const quantity = parseInt(document.getElementById('quantity').value);
  const startDate = document.getElementById('rental-start-date')?.value || new Date().toISOString().split('T')[0];
  
  addToBooking(product.id, parseInt(selectedPeriod), quantity, startDate);
}

// Display booking items
function displayBookingItems() {
  const bookingItemsContainer = document.getElementById('booking-items');
  const totalPriceElement = document.getElementById('total-price');
  
  bookingItemsContainer.innerHTML = '';
  
  if (bookingItems.length === 0) {
    bookingItemsContainer.innerHTML = '<p>Belum ada items dalam booking sewa Anda.</p>';
    totalPriceElement.textContent = '0';
    return;
  }
  
  let totalPrice = 0;
  
  bookingItems.forEach((item, index) => {
    totalPrice += item.totalPrice;
    
    const bookingItemElement = document.createElement('div');
    bookingItemElement.className = 'booking-item';
    bookingItemElement.innerHTML = `
      <div class="booking-item-info">
        <img src="${item.image}" alt="${item.name}">
        <div class="booking-details">
          <h4>${item.name}</h4>
          <div class="booking-duration">Sewa ${item.rentalPeriod} hari</div>
          <div class="booking-date">
            ${item.startDate} - ${item.endDate} (${item.quantity} item)
          </div>
        </div>
      </div>
      <div class="booking-price">Rp ${item.totalPrice.toLocaleString('id-ID')}</div>
      <button class="remove-btn" onclick="removeFromBooking(${index})">Hapus</button>
    `;
    bookingItemsContainer.appendChild(bookingItemElement);
  });
  
  totalPriceElement.textContent = totalPrice.toLocaleString('id-ID');
}

// Fungsi untuk menghapus dari booking
function removeFromBooking(index) {
  bookingItems.splice(index, 1);
  safeSetLocalStorage("bookingItems", bookingItems);
  displayBookingItems();
  updateBookingCount();
}

// Display rental checkout info
function displayRentalCheckoutInfo() {
  if (!currentRental) return;
  
  const rentalInfoElement = document.getElementById('rental-checkout-info');
  const rentalDetailsElement = document.getElementById('rental-checkout-details');
  const rentalDateGroup = document.getElementById('rental-date-group');
  
  rentalInfoElement.style.display = 'block';
  rentalDateGroup.style.display = 'block';
  
  rentalDetailsElement.innerHTML = `
    <div class="rental-item">
      <div>
        <strong>${currentRental.productName}</strong>
        <p>Sewa ${currentRental.rentalPeriod} hari × ${currentRental.quantity}</p>
      </div>
      <div>Rp ${currentRental.totalRental.toLocaleString('id-ID')}</div>
    </div>
    <div class="rental-item">
      <div>
        <strong>Deposit</strong>
        <p>Dikembalikan setelah tanaman dikembalikan dalam kondisi baik</p>
      </div>
      <div>Rp ${currentRental.totalDeposit.toLocaleString('id-ID')}</div>
    </div>
  `;
  
  // Tampilkan row deposit di ringkasan
  document.getElementById('deposit-row').style.display = 'flex';
  document.getElementById('deposit-amount').textContent = `Rp ${currentRental.totalDeposit.toLocaleString('id-ID')}`;
}

// Display order items in checkout - MODIFIED untuk booking
function displayOrderItems() {
  const orderItemsContainer = document.getElementById('order-items');
  const subtotalElement = document.getElementById('subtotal');
  const shippingCostElement = document.getElementById('shipping-cost');
  const totalAmountElement = document.getElementById('total-amount');
  const depositRow = document.getElementById('deposit-row');
  const rentalDateGroup = document.getElementById('rental-date-group');
  const rentalCheckoutInfo = document.getElementById('rental-checkout-info');
  
  orderItemsContainer.innerHTML = '';
  
  // Handle Shopping Cart Items
  if (cartItems.length > 0) {
    let subtotal = 0;
    
    cartItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      const orderItemElement = document.createElement('div');
      orderItemElement.className = 'order-item';
      orderItemElement.innerHTML = `
        <div class="item-info">
          <h4>${item.name}</h4>
          <p>${item.quantity} × Rp ${item.price.toLocaleString('id-ID')}</p>
        </div>
        <div class="item-total">
          Rp ${itemTotal.toLocaleString('id-ID')}
        </div>
      `;
      orderItemsContainer.appendChild(orderItemElement);
    });
    
    const shippingElement = document.querySelector('input[name="shipping"]:checked');
    const shippingCost = (shippingElement && shippingElement.value === 'regular') ? 15000 : 25000;
    const total = subtotal + shippingCost;
    
    subtotalElement.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    shippingCostElement.textContent = `Rp ${shippingCost.toLocaleString('id-ID')}`;
    totalAmountElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    
    // Sembunyikan section untuk rental
    if (depositRow) depositRow.style.display = 'none';
    if (rentalDateGroup) rentalDateGroup.style.display = 'none';
    if (rentalCheckoutInfo) rentalCheckoutInfo.style.display = 'none';
    
  } else if (bookingItems.length > 0) {
    // Handle Rental Booking Items
    let subtotal = 0;
    
    bookingItems.forEach(item => {
      subtotal += item.totalPrice;
      
      const orderItemElement = document.createElement('div');
      orderItemElement.className = 'order-item';
      orderItemElement.innerHTML = `
        <div class="item-info">
          <h4>${item.name} (Sewa ${item.rentalPeriod} hari)</h4>
          <p>${item.quantity} × Rp ${item.rentalPrice.toLocaleString('id-ID')}</p>
        </div>
        <div class="item-total">
          Rp ${item.totalPrice.toLocaleString('id-ID')}
        </div>
      `;
      orderItemsContainer.appendChild(orderItemElement);
    });
    
    const shippingElement2 = document.querySelector('input[name="shipping"]:checked');
    const shippingCost = (shippingElement2 && shippingElement2.value === 'regular') ? 15000 : 25000;
    const total = subtotal + shippingCost;
    
    subtotalElement.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    shippingCostElement.textContent = `Rp ${shippingCost.toLocaleString('id-ID')}`;
    totalAmountElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    
    // Sembunyikan shipping untuk rental
    if (rentalCheckoutInfo) rentalCheckoutInfo.style.display = 'block';
    
  } else {
    orderItemsContainer.innerHTML = '<p>Belum ada items untuk checkout</p>';
    return;
  }
}

// Handle payment - MODIFIED untuk dual mode (belanja + sewa)
function handlePayment() {
  // Validasi form
  const formData = new FormData(document.getElementById('checkout-form'));
  const requiredFields = ['fullname', 'email', 'phone', 'address', 'city', 'postalcode'];
  
  for (let field of requiredFields) {
    if (!formData.get(field)) {
      alert(`Harap lengkapi field ${field}`);
      return;
    }
  }
  
  // Validasi ada items untuk checkout
  if (cartItems.length === 0 && bookingItems.length === 0) {
    alert('Tidak ada items untuk checkout!');
    return;
  }
  
  // Simulasikan proses pembayaran
  const payBtn = document.getElementById('pay-btn');
  payBtn.textContent = 'Memproses...';
  payBtn.disabled = true;
  
  setTimeout(() => {
    // Tentukan tipe order berdasarkan items yang ada
    let orderType = cartItems.length > 0 ? 'purchase' : 'booking';
    let items = cartItems.length > 0 ? cartItems : bookingItems;
    let totalAmount = 0;
    
    if (cartItems.length > 0) {
      // Untuk pembelian: tambah shipping
      const shippingElem = document.querySelector('input[name="shipping"]:checked');
      const shippingCost = (shippingElem && shippingElem.value === 'regular') ? 15000 : 25000;
      totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0) + shippingCost;
    } else {
      // Untuk sewa: tambah shipping
      const shippingElem = document.querySelector('input[name="shipping"]:checked');
      const shippingCost = (shippingElem && shippingElem.value === 'regular') ? 15000 : 25000;
      totalAmount = bookingItems.reduce((total, item) => total + item.totalPrice, 0) + shippingCost;
    }
    
    // Ambil data form dari DOM elements
    const fullnameEl = document.getElementById('fullname');
    const emailEl = document.getElementById('email');
    const phoneEl = document.getElementById('phone');
    const addressEl = document.getElementById('address');
    const cityEl = document.getElementById('city');
    const postalcodeEl = document.getElementById('postalcode');
    
    // Extract values with validation
    const fullnameValue = fullnameEl && fullnameEl.value.trim() ? fullnameEl.value.trim() : '';
    const emailValue = emailEl && emailEl.value.trim() ? emailEl.value.trim() : '';
    const phoneValue = phoneEl && phoneEl.value.trim() ? phoneEl.value.trim() : '';
    const addressValue = addressEl && addressEl.value.trim() ? addressEl.value.trim() : '';
    const cityValue = cityEl && cityEl.value.trim() ? cityEl.value.trim() : '';
    const postalcodeValue = postalcodeEl && postalcodeEl.value.trim() ? postalcodeEl.value.trim() : '';
    
    // Debug: log input values
    console.log('Form Data:', {
      fullname: fullnameValue || 'kosong',
      email: emailValue || 'kosong',
      phone: phoneValue || 'kosong',
      address: addressValue || 'kosong',
      city: cityValue || 'kosong',
      postalcode: postalcodeValue || 'kosong'
    });
    
    // Buat order object
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      status: 'completed',
      type: orderType,
      items: items,
      customer: {
        name: fullnameValue || '-',
        email: emailValue || '-',
        phone: phoneValue || '-',
        address: addressValue || '-',
        city: cityValue || '-',
        postalcode: postalcodeValue || '-'
      },
      shipping: document.querySelector('input[name="shipping"]:checked') ? document.querySelector('input[name="shipping"]:checked').value : 'regular',
      payment: document.querySelector('input[name="payment-method"]:checked') ? document.querySelector('input[name="payment-method"]:checked').value : 'cod',
      total: totalAmount
    };
    
    console.log('Order object created:', order);
    
    // Simpan order ke localStorage
    const orders = safeGetLocalStorage('orders', []);
    orders.push(order);
    safeSetLocalStorage('orders', orders);
    
    // Simpan current order untuk ditampilkan di proof page
    safeSetLocalStorage('currentOrder', order);
    
    // Reset items sesuai tipe order
    if (cartItems.length > 0) {
      cartItems = [];
      safeSetLocalStorage('cartItems', []);
      updateCartCount();
      completeDirectBuy(); // Clear direct buy flags
    } else {
      bookingItems = [];
      safeSetLocalStorage('bookingItems', []);
      updateBookingCount();
    }
    
    // Reset form checkout
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.reset();
    }
    
// Tampilkan halaman bukti pembayaran atau bukti pemesanan
    showLoadingScreen();
    
    setTimeout(() => {
      document.getElementById('order-id').textContent = order.id;
      hideLoadingScreen();
      
      // Redirect ke halaman payment proof untuk pembelian, atau booking-proof untuk sewa
      if (orderType === 'booking') {
        showPage('booking-proof');
        initBookingProof();
      } else {
        showPage('payment-proof');
        setCurrentDate();
        displayPaymentProof(order); // Tampilkan data payment proof
      }
    }, 500);
    
    // Reset tombol bayar
    payBtn.textContent = 'Bayar Sekarang';
    payBtn.disabled = false;
  }, 2000);
}

// Toggle theme
function toggleTheme() {
  document.body.classList.toggle('dark');
  const themeToggle = document.getElementById('theme-toggle');
  
  if (document.body.classList.contains('dark')) {
    themeToggle.textContent = '☀️';
    safeSetLocalStorage('theme', 'dark');
  } else {
    themeToggle.textContent = '🌙';
    safeSetLocalStorage('theme', 'light');
  }
}

// Check login status
function checkLoginStatus() {
  const isLoggedIn = safeGetLocalStorage('isLoggedIn', false) === 'true' || safeGetLocalStorage('isLoggedIn') === true;
  const profileElement = document.querySelector('.profile');
  
  if (profileElement) {
    profileElement.style.display = isLoggedIn ? 'block' : 'none';
  }
  
  // Set currentUser
  if (isLoggedIn) {
    currentUser = safeGetLocalStorage('userData', null);
  }
}

// Load user data with optimized localStorage access
function loadUserData() {
  const userProfile = safeGetLocalStorage("userProfile", {});
  const fieldsToUpdate = [
    { id: "name", key: "name" },
    { id: "email", key: "email" },
    { id: "phone", key: "phone" },
    { id: "address", key: "address" }
  ];
  
  fieldsToUpdate.forEach(field => {
    const element = document.getElementById(field.id);
    if (element && userProfile[field.key]) {
      element.value = userProfile[field.key];
    }
  });
  
  // Also prefill checkout form if user is logged in
  if (currentUser) {
    fieldsToUpdate.forEach(field => {
      const element = document.getElementById(field.id);
      if (element && userProfile[field.key]) {
        element.value = userProfile[field.key];
      }
    });
  }
}

// Save profile with optimized localStorage
function saveProfile(e) {
  e.preventDefault();
  
  const profile = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value
  };
  
  safeSetLocalStorage("userProfile", profile);
  
  // Also save the current avatar if it exists
  const currentAvatar = document.getElementById('profile-avatar-img').src;
  if (currentAvatar && currentAvatar !== 'default-avatar-url') {
    safeSetLocalStorage('userAvatar', currentAvatar);
  }
  
  // Update avatar di navbar
  const navbarAvatar = document.querySelector('.profile img');
  if (navbarAvatar && currentAvatar) {
    navbarAvatar.src = currentAvatar;
  }
  
  alert("Profil berhasil disimpan!");
}

// Handle login
function handleLogin(e) {
  e.preventDefault();
  const username = document.querySelector('#login-form input[type="text"]').value;
  const password = document.querySelector('#login-form input[type="password"]').value;
  
  // Simple validation
  if (!username || !password) {
    alert('Harap isi semua field!');
    return;
  }
  
  // Save user data to localStorage
  const userData = {
    username: username,
    isLoggedIn: true,
    loginTime: new Date().toISOString()
  };
  
  safeSetLocalStorage('userData', userData);
  safeSetLocalStorage('isLoggedIn', true);
  currentUser = userData;
  
  alert('Login berhasil!');
  showPage('home');
  checkLoginStatus();
}

// Handle register
function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('first-name').value + ' ' + document.getElementById('last-name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  
  // Validation
  if (!name || !email || !phone || !password || !confirmPassword) {
    alert('Harap isi semua field!');
    return;
  }
  
  if (password !== confirmPassword) {
    alert('Password dan konfirmasi password tidak cocok!');
    return;
  }
  
  if (password.length < 6) {
    alert('Password harus minimal 6 karakter!');
    return;
  }
  
  // Save new user data
  const userData = {
    name: name,
    email: email,
    phone: phone,
    username: email,
    isLoggedIn: true,
    registrationDate: new Date().toISOString()
  };
  
  safeSetLocalStorage('userData', userData);
  safeSetLocalStorage('isLoggedIn', true);
  currentUser = userData;
  
  // Also save to profile
  safeSetLocalStorage("userProfile", {
    name: name,
    email: email,
    phone: phone
  });
  
  alert('Pendaftaran berhasil! Anda telah login.');
  showPage('home');
  checkLoginStatus();
}

// Handle logout
function handleLogout() {
  safeSetLocalStorage('isLoggedIn', false);
  safeSetLocalStorage('userData', null);
  currentUser = null;
  alert('Anda telah logout');
  
  // Show login overlay again
  document.getElementById('login-overlay').style.display = 'flex';
  document.getElementById('main-content').style.display = 'none';
}

// Filter products by category
function filterProducts(category) {
  let filteredProducts = products;
  
  if (category !== 'all') {
    filteredProducts = products.filter(product => product.category === category);
  }
  
  displayProducts('home-products', filteredProducts);
  displayProducts('explore-products', filteredProducts);
}

// FUNGSI BARU: Handle category card click dengan check login
function handleCategoryClick(category) {
  if (!currentUser || !safeGetLocalStorage('isLoggedIn')) {
    showPage('login');
  } else {
    filterProducts(category);
  }
}

// FUNGSI BARU: Handle explore button click dengan check login
function handleExploreClick(e) {
  e.preventDefault();
  if (!currentUser || !safeGetLocalStorage('isLoggedIn')) {
    showPage('login');
  } else {
    showPage('explore');
  }
}

// Optimized search products dengan debouncing
const debouncedSearch = debounce(() => {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  if (searchTerm.length === 0) {
    displayProducts('explore-products', products);
    return;
  }
  
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) || 
    product.description.toLowerCase().includes(searchTerm)
  );
  
  displayProducts('explore-products', filteredProducts);
}, 300);

// Search products function
function searchProducts() {
  debouncedSearch();
}

// ===== LIVE CHAT FUNCTIONS =====
function toggleChatWidget() {
  const chatPopup = document.getElementById('chat-popup');
  chatPopup.classList.toggle('active');
}

function sendChatMessage() {
  const inputField = document.getElementById('chat-input-field');
  const message = inputField.value.trim();
  
  if (!message) return;
  
  const chatMessages = document.getElementById('chat-messages');
  
  // Add user message
  const userMessageDiv = document.createElement('div');
  userMessageDiv.className = 'chat-message user';
  userMessageDiv.innerHTML = `<div class="chat-bubble">${message}</div>`;
  chatMessages.appendChild(userMessageDiv);
  
  // Clear input
  inputField.value = '';
  
  // Auto-scroll to bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
  
  // Simulate agent response
  setTimeout(() => {
    const responses = [
      'Terima kasih atas pertanyaannya! 😊',
      'Baik, saya catat pertanyaan Anda.',
      'Ada yang bisa saya jelaskan lebih lanjut?',
      'Tim kami sedang membantu Anda dengan cepat.',
      'Kami siap melayani Anda 24/7!'
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const agentMessageDiv = document.createElement('div');
    agentMessageDiv.className = 'chat-message agent';
    agentMessageDiv.innerHTML = `<div class="chat-bubble">${randomResponse}</div>`;
    chatMessages.appendChild(agentMessageDiv);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 500);
}

function handleChatMessage(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}

// ===== NEWSLETTER FUNCTIONS =====
function handleNewsletterSignup(e) {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value;
  
  if (!email) return;
  
  // Save newsletter email
  const emails = safeGetLocalStorage('newsletterEmails', []);
  if (!emails.includes(email)) {
    emails.push(email);
    safeSetLocalStorage('newsletterEmails', emails);
  }
  
  alert('✅ Terima kasih telah mendaftar newsletter! Kami akan mengirim penawaran eksklusif ke email Anda.');
  e.target.reset();
}

// ===== PRODUCT COMMENTS FUNCTIONS =====
function setCommentRating(rating) {
  document.getElementById('comment-rating').value = rating;
  
  // Update star display
  const stars = document.querySelectorAll('.stars-input i');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('active');
    } else {
      star.classList.remove('active');
    }
  });
}

function submitProductComment(e) {
  e.preventDefault();
  
  const name = document.getElementById('comment-name').value.trim();
  const text = document.getElementById('comment-text').value.trim();
  const rating = document.getElementById('comment-rating').value;
  
  if (!name || !text) {
    alert('Harap isi semua field!');
    return;
  }
  
  // Get current product ID (from data attribute or global variable)
  const productId = parseInt(document.querySelector('.product-card[data-id]')?.dataset.id || 1);
  
  // Create comment object
  const comment = {
    id: Date.now(),
    productId: productId,
    name: name,
    text: text,
    rating: parseInt(rating),
    date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
    timestamp: Date.now()
  };
  
  // Save to localStorage
  const comments = safeGetLocalStorage('productComments', []);
  comments.push(comment);
  safeSetLocalStorage('productComments', comments);
  
  // Reset form
  document.getElementById('comment-form').reset();
  document.getElementById('comment-rating').value = '5';
  document.querySelectorAll('.stars-input i').forEach(star => star.classList.remove('active'));
  document.querySelectorAll('.stars-input i').slice(0, 5).forEach(star => star.classList.add('active'));
  
  // Refresh comments display
  displayProductComments(productId);
  
  alert('✅ Terima kasih! Ulasan Anda telah ditambahkan.');
}

function displayProductComments(productId) {
  const commentsList = document.getElementById('comments-list');
  if (!commentsList) return;
  
  const comments = safeGetLocalStorage('productComments', []);
  const productComments = comments
    .filter(c => c.productId === productId)
    .sort((a, b) => b.timestamp - a.timestamp);
  
  if (productComments.length === 0) {
    commentsList.innerHTML = `
      <div class="empty-comments">
        <p>Belum ada ulasan untuk produk ini. Jadilah yang pertama!</p>
      </div>
    `;
    return;
  }
  
  commentsList.innerHTML = productComments.map(comment => `
    <div class="comment-item">
      <div class="comment-header">
        <div>
          <div class="comment-author">${escapeHtml(comment.name)}</div>
          <div class="comment-rating">${renderStars(comment.rating)}</div>
        </div>
        <div class="comment-date">${comment.date}</div>
      </div>
      <p class="comment-text">${escapeHtml(comment.text)}</p>
    </div>
  `).join('');
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Initialize comment form with default 5 stars
function initCommentForm() {
  const stars = document.querySelectorAll('.stars-input i');
  stars.forEach((star, index) => {
    if (index < 5) {
      star.classList.add('active');
    }
  });
}

// Initialize profile photo upload
function initProfilePhotoUpload() {
  const avatarUploadInput = document.getElementById('avatar-upload');
  if (!avatarUploadInput) return;
  
  avatarUploadInput.addEventListener('change', handleAvatarUpload);
  
  // Load saved avatar from localStorage
  const savedAvatar = safeGetLocalStorage('userAvatar', null);
  if (savedAvatar) {
    document.getElementById('profile-avatar-img').src = savedAvatar;
    // Also update navbar avatar
    const navbarAvatar = document.querySelector('.profile img');
    if (navbarAvatar) {
      navbarAvatar.src = savedAvatar;
    }
  }
}

function handleAvatarUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Harap pilih file gambar!');
    return;
  }
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Ukuran file terlalu besar! Maksimal 5MB.');
    return;
  }
  
  const reader = new FileReader();
  reader.onload = (event) => {
    const imageData = event.target.result;
    
    // Update display di halaman profil
    document.getElementById('profile-avatar-img').src = imageData;
    
    // Update avatar di navbar
    const navbarAvatar = document.querySelector('.profile img');
    if (navbarAvatar) {
      navbarAvatar.src = imageData;
    }
    
    // Save to localStorage
    safeSetLocalStorage('userAvatar', imageData);
    
    alert('✅ Foto profil berhasil diupload!');
  };
  
  reader.readAsDataURL(file);
}

// ===== LOADING SCREEN FUNCTIONS =====
function showLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.remove('hidden');
  }
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
  }
}

// Hide loading screen setelah page fully loaded
window.addEventListener('load', () => {
  setTimeout(() => {
    hideLoadingScreen();
  }, 800);
});

// ===== FAQ TOGGLE FUNCTION =====
function toggleFAQ(element) {
  const faqItem = element.closest('.faq-item');
  
  // Close other FAQs
  document.querySelectorAll('.faq-item.active').forEach(item => {
    if (item !== faqItem) {
      item.classList.remove('active');
    }
  });
  
  // Toggle current FAQ
  faqItem.classList.toggle('active');
}

// ===== CONTACT FORM HANDLER =====
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactForm);
  }
});

function handleContactForm(e) {
  e.preventDefault();
  
  // Get form data
  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const phone = document.getElementById('contact-phone').value;
  const subject = document.getElementById('contact-subject').value;
  const message = document.getElementById('contact-message').value;
  
  // Show loading screen
  showLoadingScreen();
  
  // Simulate sending message
  setTimeout(() => {
    // Save to localStorage for demo
    const contactData = {
      name,
      email,
      phone,
      subject,
      message,
      date: new Date().toISOString()
    };
    
    // In real app, this would be sent to server
    alert('✅ Pesan Anda telah terkirim! Tim kami akan menghubungi Anda segera.');
    
    // Reset form
    document.getElementById('contact-form').reset();
    
    // Hide loading screen
    hideLoadingScreen();
  }, 1500);
}

// ===== SUBSCRIPTION HANDLER =====
document.addEventListener('DOMContentLoaded', () => {
  const subscribeButtons = document.querySelectorAll('.btn-subscribe');
  subscribeButtons.forEach(button => {
    button.addEventListener('click', handleSubscribe);
  });
});

function handleSubscribe(e) {
  const planName = e.target.closest('.subscription-card').querySelector('h3').textContent;
  
  showLoadingScreen();
  
  setTimeout(() => {
    alert(`✅ Anda telah memilih paket ${planName}. Proses pembayaran akan segera dibuka.`);
    hideLoadingScreen();
  }, 800);
}

// ===== BOOKING PROOF HANDLER =====
function generateBookingId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `BK-${year}${month}${date}-${random}`;
}

function generateBookingRefNumber() {
  return 'BK-TRX-' + Date.now().toString().slice(-10);
}

function formatDate(date) {
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const d = new Date(date);
  return d.getDate() + ' ' + months[d.getMonth()] + ' ' + d.getFullYear();
}

function displayBookingProof(data) {
  // Data bisa berupa array items atau order object
  let bookingData, order;
  
  if (!data) return;
  
  // Jika data adalah array, gunakan sebagai bookingData
  // Jika data adalah object dengan property items, itu adalah order object
  if (Array.isArray(data)) {
    if (data.length === 0) return;
    bookingData = data;
    order = null;
  } else if (data && data.items && Array.isArray(data.items)) {
    bookingData = data.items;
    order = data;
  } else {
    return;
  }
  
  // Get first booking item for reference
  const firstItem = bookingData[0];
  if (!firstItem) return;
  
  const bookingId = order ? order.id : generateBookingId();
  const refNumber = order ? order.id : generateBookingRefNumber();
  const bookingDate = order ? formatDate(new Date(order.date)) : new Date().toLocaleDateString('id-ID');
  
  // Update booking ID
  const bookingIdElement = document.getElementById('proof-booking-id');
  if (bookingIdElement) {
    bookingIdElement.innerHTML = '<strong>' + bookingId + '</strong>';
  }
  
  // Update booking date
  const bookingDateElement = document.getElementById('proof-booking-date');
  if (bookingDateElement) {
    bookingDateElement.textContent = bookingDate;
  }
  
  // Update customer name - dari order atau currentUser
  const customerNameElement = document.getElementById('proof-customer-name');
  if (customerNameElement) {
    const customerName = (order && order.customer) ? 
                         order.customer.name : 
                         (currentUser ? currentUser.name || currentUser.username : 'Pelanggan');
    customerNameElement.textContent = customerName;
  }
  
  // Update reference number
  const refElement = document.getElementById('proof-booking-ref');
  if (refElement) {
    refElement.textContent = refNumber;
  }
  
  // Calculate rental dates
  const startDate = new Date(firstItem.startDate);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + firstItem.rentalPeriod);
  
  // Update rental period
  const startDateElement = document.getElementById('proof-start-date');
  if (startDateElement) {
    startDateElement.textContent = formatDate(startDate);
  }
  
  const endDateElement = document.getElementById('proof-end-date');
  if (endDateElement) {
    endDateElement.textContent = formatDate(endDate);
  }
  
  const durationElement = document.getElementById('proof-duration');
  if (durationElement) {
    durationElement.textContent = firstItem.rentalPeriod + ' Hari';
  }
  
  // Display booking items
  const itemsListElement = document.getElementById('proof-items-list');
  if (itemsListElement) {
    itemsListElement.innerHTML = '';
    bookingData.forEach(item => {
      const itemHTML = document.createElement('div');
      itemHTML.className = 'booking-item';
      itemHTML.style.cssText = 'display: flex; justify-content: space-between; padding: 12px; border-bottom: 1px solid #eee; align-items: center;';
      
      const itemInfo = document.createElement('div');
      itemInfo.style.cssText = 'flex: 1;';
      itemInfo.innerHTML = `
        <div style="font-weight: 500; color: #333;">${item.name}</div>
        <div style="font-size: 13px; color: #666; margin-top: 4px;">
          ${item.rentalPeriod} hari × ${item.quantity} unit
        </div>
      `;
      
      const itemPrice = document.createElement('div');
      itemPrice.style.cssText = 'font-weight: 500; color: #2ecc71; min-width: 120px; text-align: right;';
      itemPrice.textContent = 'Rp ' + item.totalPrice.toLocaleString('id-ID');
      
      itemHTML.appendChild(itemInfo);
      itemHTML.appendChild(itemPrice);
      itemsListElement.appendChild(itemHTML);
    });
  }
  
  // Calculate costs
  let totalRental = 0;
  let totalQuantity = 0;
  let totalDeposit = 0;
  
  bookingData.forEach(item => {
    totalRental += item.totalPrice;
    totalQuantity += item.quantity;
    totalDeposit += (item.deposit || 0) * item.quantity;
  });
  
  const insuranceCost = Math.round(totalRental * 0.05); // 5% dari harga sewa
  const deliveryCost = 50000; // Fixed delivery cost
  const totalPayment = order ? order.total : (totalRental + totalDeposit + insuranceCost + deliveryCost);
  
  // Update cost breakdown
  document.getElementById('proof-rental-price').textContent = 'Rp ' + totalRental.toLocaleString('id-ID');
  document.getElementById('proof-deposit').textContent = 'Rp ' + totalDeposit.toLocaleString('id-ID');
  document.getElementById('proof-insurance').textContent = 'Rp ' + insuranceCost.toLocaleString('id-ID');
  document.getElementById('proof-delivery').textContent = 'Rp ' + deliveryCost.toLocaleString('id-ID');
  document.getElementById('proof-total').textContent = 'Rp ' + totalPayment.toLocaleString('id-ID');
  
  // Update address - dari order atau currentUser
  const addressElement = document.getElementById('proof-address');
  if (addressElement) {
    const address = (order && order.customer) ? 
                    order.customer.address : 
                    (currentUser ? currentUser.address : 'Jakarta, Indonesia');
    addressElement.textContent = address;
  }
  
  // Update payment method jika ada
  const paymentElement = document.getElementById('proof-payment-method');
  if (paymentElement && order && order.payment) {
    paymentElement.textContent = order.payment.toUpperCase();
  }
}

function downloadBookingProof() {
  const element = document.querySelector('.booking-proof-card');
  if (!element) return;
  
  const opt = {
    margin: 10,
    filename: 'Bukti_Pemesanan.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
  };
  
  // Fallback jika html2pdf tidak tersedia
  alert('💾 Fitur download PDF sedang diproses. Silakan gunakan fitur Print (Ctrl+P) untuk menyimpan sebagai PDF.');
  window.print();
}

function printBookingProof() {
  window.print();
}

function initBookingProof() {
  const currentOrder = safeGetLocalStorage('currentOrder', null);
  
  if (currentOrder && currentOrder.items && currentOrder.items.length > 0) {
    displayBookingProof(currentOrder);
  } else {
    // Jika tidak ada currentOrder, coba ambil dari orders array terakhir
    const orders = safeGetLocalStorage('orders', []);
    if (orders.length > 0) {
      const lastOrder = orders[orders.length - 1];
      displayBookingProof(lastOrder);
    }
  }
}

// ===== PAYMENT PROOF HANDLER =====
function setCurrentDate() {
  const now = new Date();
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const dateString = now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear() + 
                    ', ' + String(now.getHours()).padStart(2, '0') + ':' + 
                    String(now.getMinutes()).padStart(2, '0') + ' WIB';
  const dateElement = document.getElementById('payment-date');
  if (dateElement) {
    dateElement.textContent = dateString;
  }
}

function displayPaymentProof(order) {
  if (!order) {
    console.log('Order is null/undefined in displayPaymentProof');
    return;
  }
  
  console.log('displayPaymentProof called with order:', order);
  console.log('Customer data:', order.customer);
  
  // Update payment badge berdasarkan metode pembayaran
  const isCOD = order.payment === 'cod';
  
  const badgeIcon = document.getElementById('badge-icon');
  const badgeTitle = document.getElementById('badge-title');
  const badgeMessage = document.getElementById('badge-message');
  const badge = document.getElementById('payment-badge');
  
  if (isCOD) {
    // COD: Status menunggu pembayaran
    if (badgeIcon) badgeIcon.textContent = '⏳';
    if (badgeTitle) {
      badgeTitle.textContent = 'Menunggu Pembayaran';
      badgeTitle.style.color = '#f39c12';
    }
    if (badgeMessage) badgeMessage.textContent = 'Pembayaran akan dilakukan saat barang tiba';
    if (badge) {
      badge.style.backgroundColor = '#fff3cd';
      badge.style.borderColor = '#f39c12';
    }
  } else {
    // Metode pembayaran lain: Status pembayaran berhasil
    if (badgeIcon) badgeIcon.textContent = '💳';
    if (badgeTitle) {
      badgeTitle.textContent = 'Pembayaran Berhasil';
      badgeTitle.style.color = '#2ecc71';
    }
    if (badgeMessage) badgeMessage.textContent = 'Transaksi Anda sedang diproses';
    if (badge) {
      badge.style.backgroundColor = '#d4edda';
      badge.style.borderColor = '#2ecc71';
    }
  }
  
  // Update order ID
  const orderIdElement = document.getElementById('proof-order-id');
  if (orderIdElement) {
    orderIdElement.textContent = '#OR-' + order.id;
  }
  
  // Payment method details based on payment type
  const paymentDetails = {
    'bca': {
      name: 'Bank Transfer - BCA',
      accountNumber: '1234567890',
      accountName: 'PT. Urban Leaf Indonesia',
      status: 'Terverifikasi'
    },
    'mandiri': {
      name: 'Bank Transfer - Bank Mandiri',
      accountNumber: '1230123456789',
      accountName: 'PT. Urban Leaf Indonesia',
      status: 'Terverifikasi'
    },
    'bni': {
      name: 'Bank Transfer - BNI',
      accountNumber: '1234567890',
      accountName: 'PT. Urban Leaf Indonesia',
      status: 'Terverifikasi'
    },
    'cimb': {
      name: 'Bank Transfer - CIMB Niaga',
      accountNumber: '1234567890',
      accountName: 'PT. Urban Leaf Indonesia',
      status: 'Terverifikasi'
    },
    'bri': {
      name: 'Bank Transfer - BRI',
      accountNumber: '1234567890',
      accountName: 'PT. Urban Leaf Indonesia',
      status: 'Terverifikasi'
    },
    'gopay': {
      name: 'GoPay',
      accountNumber: '081234567890',
      accountName: 'Urban Leaf',
      status: 'Aktif'
    },
    'ovo': {
      name: 'OVO',
      accountNumber: '081234567890',
      accountName: 'Urban Leaf',
      status: 'Aktif'
    },
    'dana': {
      name: 'DANA',
      accountNumber: '081234567890',
      accountName: 'Urban Leaf',
      status: 'Aktif'
    },
    'cod': {
      name: 'Bayar saat barang diterima',
      accountNumber: '-',
      accountName: 'Kurir',
      status: 'Pending'
    }
  };
  
  const paymentDetail = paymentDetails[order.payment] || paymentDetails['cod'];
  
  // Update payment method color berdasarkan status
  const paymentMethodElement = document.getElementById('proof-payment-method');
  if (paymentMethodElement) {
    paymentMethodElement.textContent = paymentDetail.name;
    // Ubah warna sesuai status
    if (isCOD) {
      paymentMethodElement.style.color = '#f39c12';
    } else {
      paymentMethodElement.style.color = '#2ecc71';
    }
  }
  
  // Update payment methods section background
  const paymentMethodsSection = document.getElementById('payment-methods-section');
  if (paymentMethodsSection) {
    if (isCOD) {
      paymentMethodsSection.style.background = '#fff3cd';
      paymentMethodsSection.style.borderColor = '#f39c12';
      const methodTitle = paymentMethodsSection.querySelector('.method-title');
      if (methodTitle) {
        methodTitle.style.color = '#d4a017';
      }
    } else {
      paymentMethodsSection.style.background = '#e8f8f5';
      paymentMethodsSection.style.borderColor = '#2ecc71';
      const methodTitle = paymentMethodsSection.querySelector('.method-title');
      if (methodTitle) {
        methodTitle.style.color = '#27ae60';
      }
    }
  }
  
  // Update payment info details
  const paymentInfoElement = document.getElementById('payment-info-details');
  if (paymentInfoElement) {
    const statusColor = isCOD ? '#f39c12' : '#2ecc71';
    const statusIcon = isCOD ? '⏳' : '✓';
    paymentInfoElement.innerHTML = `
      <div class="detail-row">
        <span class="detail-label">${order.payment === 'cod' ? 'Kurir Terpercaya' : 'Nomor Rekening'}</span>
        <span class="detail-value" style="font-weight: bold;">${paymentDetail.accountNumber}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Atas Nama</span>
        <span class="detail-value">${paymentDetail.accountName}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Status</span>
        <span class="detail-value" style="color: ${statusColor}; font-weight: bold;">${statusIcon} ${paymentDetail.status}</span>
      </div>
    `;
  }
  
  // Update customer name dari order.customer - FIXED
  const customerNameElement = document.getElementById('proof-customer-name');
  if (customerNameElement) {
    if (order.customer && order.customer.name) {
      customerNameElement.textContent = order.customer.name;
    } else {
      customerNameElement.textContent = '-';
    }
    console.log('Customer name set to:', customerNameElement.textContent);
  }
  
  // Update customer email
  const customerEmailElement = document.getElementById('proof-customer-email');
  if (customerEmailElement) {
    if (order.customer && order.customer.email) {
      customerEmailElement.textContent = order.customer.email;
    } else {
      customerEmailElement.textContent = '-';
    }
  }
  
  // Update customer phone
  const customerPhoneElement = document.getElementById('proof-customer-phone');
  if (customerPhoneElement) {
    if (order.customer && order.customer.phone) {
      customerPhoneElement.textContent = order.customer.phone;
    } else {
      customerPhoneElement.textContent = '-';
    }
  }
  
  // Update reference number
  const referenceElement = document.getElementById('proof-reference');
  if (referenceElement) {
    referenceElement.textContent = 'TRX-' + order.id;
  }
  
  // Display order items - FIXED
  const itemsListElement = document.getElementById('proof-items-list');
  if (itemsListElement) {
    itemsListElement.innerHTML = '';
    
    if (order.items && order.items.length > 0) {
      let subtotal = 0;
      
      order.items.forEach(item => {
        // Handle both cart items and booking items
        const itemName = item.name || 'Item';
        const itemQuantity = item.quantity || 1;
        const itemPrice = item.price || 0;
        const itemTotal = itemPrice * itemQuantity;
        subtotal += itemTotal;
        
        const itemHTML = document.createElement('div');
        itemHTML.className = 'order-item';
        itemHTML.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #eee;';
        
        const itemPriceFormatted = itemTotal.toLocaleString('id-ID');
        
        itemHTML.innerHTML = `
          <div class="item-info" style="flex: 1;">
            <div class="item-name" style="font-weight: 500; color: #333;">${itemName}</div>
            <div class="item-qty" style="font-size: 13px; color: #999;">Qty: ${itemQuantity}</div>
          </div>
          <div class="item-price" style="text-align: right; font-weight: 600; color: #2ecc71;">Rp ${itemPriceFormatted}</div>
        `;
        itemsListElement.appendChild(itemHTML);
      });
      
      // Calculate shipping cost
      const shippingCost = order.total - subtotal;
      
      // Update subtotal
      const subtotalElement = document.getElementById('proof-subtotal');
      if (subtotalElement) {
        subtotalElement.textContent = 'Rp ' + subtotal.toLocaleString('id-ID');
      }
      
      // Update shipping cost
      const shippingElement = document.getElementById('proof-shipping-cost');
      if (shippingElement) {
        shippingElement.textContent = 'Rp ' + shippingCost.toLocaleString('id-ID');
      }
    } else {
      itemsListElement.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">Tidak ada item</p>';
    }
  }
  
  // Update shipping address
  const addressElement = document.getElementById('proof-address');
  if (addressElement) {
    if (order.customer) {
      const address = order.customer.address || '-';
      const city = order.customer.city || '-';
      const postal = order.customer.postalcode || '-';
      const fullAddress = address !== '-' ? `${address}, ${city} ${postal}` : '-';
      addressElement.textContent = fullAddress;
      console.log('Address set to:', fullAddress);
    } else {
      addressElement.textContent = '-';
    }
  }
  
  // Update total amount
  const totalElement = document.getElementById('proof-total');
  if (totalElement && order.total) {
    const totalFormatted = order.total.toLocaleString('id-ID');
    totalElement.textContent = 'Rp ' + totalFormatted;
  }
  
  // Update total section styling berdasarkan status pembayaran
  const totalSection = document.getElementById('total-section');
  if (totalSection) {
    if (isCOD) {
      // COD: warna orange/yellow gradient
      totalSection.style.background = 'linear-gradient(135deg, #f39c12, #e67e22)';
    } else {
      // Transfer/e-wallet: warna green gradient
      totalSection.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
    }
  }
}

function downloadPaymentProof() {
  alert('Fitur download akan segera tersedia. Untuk sekarang, Anda dapat menggunakan fitur print browser (Ctrl+P) untuk menyimpan sebagai PDF.');
}

// Initialize payment proof page when navigating to it
function initPaymentProof() {
  setCurrentDate();
  
  // Get current order atau latest order
  let order = safeGetLocalStorage('currentOrder', null);
  
  if (!order) {
    // Jika tidak ada currentOrder, coba ambil dari orders array terakhir
    const orders = safeGetLocalStorage('orders', []);
    if (orders.length > 0) {
      order = orders[orders.length - 1];
    }
  }
  
  if (order) {
    console.log('initPaymentProof - displaying order:', order);
    displayPaymentProof(order);
  } else {
    console.log('No order found in localStorage');
  }
}


// Override showPage to handle payment-proof and booking-proof
const originalShowPage = window.showPage;
window.showPage = function(page) {
  if (page === 'payment-proof') {
    initPaymentProof();
  } else if (page === 'booking-proof') {
    initBookingProof();
  }
  originalShowPage(page);
};

// Initialize payment proof page
document.addEventListener('DOMContentLoaded', () => {
  setCurrentDate();
});

