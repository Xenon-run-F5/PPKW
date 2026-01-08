// Global variables - MODIFIED
let currentUser = null;
let bookingItems = JSON.parse(localStorage.getItem("bookingItems")) || [];
let currentRental = JSON.parse(localStorage.getItem("currentRental")) || null;
let currentProductId = null; // Track which product is being viewed

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
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
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
    image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
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
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
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
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
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
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
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
    image: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
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
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
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
  }
];

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
    
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
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
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    document.getElementById('theme-toggle').textContent = '☀️';
  }
  
  // Check for saved user
  const savedUser = localStorage.getItem('user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
  }
  
  // Check for saved booking items
  const savedBookingItems = localStorage.getItem('bookingItems');
  if (savedBookingItems) {
    bookingItems = JSON.parse(savedBookingItems);
  }
  
  // Check for saved rental
  const savedRental = localStorage.getItem('currentRental');
  if (savedRental) {
    currentRental = JSON.parse(savedRental);
  }
}

// FUNGSI BARU: Cek login status dan redirect ke login jika diperlukan
function redirectToLoginIfNeeded(callback) {
  if (!currentUser || !localStorage.getItem('isLoggedIn')) {
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
      if (!currentUser || !localStorage.getItem('isLoggedIn')) {
        showPage('login');
      } else {
        const productId = parseInt(e.target.closest('.btn-booking').dataset.id);
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
    } else if (pageId === 'checkout') {
      displayOrderItems();
      if (currentRental) {
        displayRentalCheckoutInfo();
      }
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

// Display products in a grid - MODIFIED untuk booking
function displayProducts(containerId, productsToDisplay) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = productsToDisplay.map(product => `
    <div class="product-card" data-id="${product.id}">
      ${product.discount ? `<div class="discount-badge">-${product.discount}%</div>` : ''}
      ${product.isBestseller ? `<div class="bestseller-badge"><i class="fas fa-fire"></i> Bestseller</div>` : ''}
      <img src="${product.image}" alt="${product.name}">
      <h4>${product.name}</h4>
      <p>${product.description}</p>
      <div class="product-rating">
        <div class="stars">
          <span class="stars-display">${renderStars(product.rating)}</span>
          <span class="rating-value">${product.rating}</span>
        </div>
        <span class="reviews-count">${product.reviews || 0} ulasan</span>
        <span class="sold-count">Terjual ${product.sold || 0}</span>
      </div>
      <div class="product-price-container">
        <div>
          ${product.originalPrice ? `<div class="original-price">Rp ${product.originalPrice.toLocaleString('id-ID')}</div>` : ''}
          <div class="sale-price">Sewa mulai Rp ${product.rentalPrices[1].toLocaleString('id-ID')}/hari</div>
        </div>
        <button class="btn-booking" data-id="${product.id}"><i class="fas fa-calendar-plus"></i></button>
      </div>
      <button class="btn-detail" onclick="handleDetailClick(${product.id})">Lihat Detail</button>
    </div>
  `).join('');
  
  // Add event listeners to booking buttons
  container.querySelectorAll('.btn-booking').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      if (!currentUser || !localStorage.getItem('isLoggedIn')) {
        showPage('login');
      } else {
        const productId = parseInt(e.target.closest('.btn-booking').dataset.id);
        showProductDetail(productId);
      }
    });
  });
}

// Fungsi helper untuk render bintang rating
function renderStars(rating) {
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
  
  return stars;
}

// FUNGSI BARU: Handle detail button click dengan check login
function handleDetailClick(productId) {
  if (!currentUser || !localStorage.getItem('isLoggedIn')) {
    showPage('login');
  } else {
    showProductDetail(productId);
  }
}

// Show product detail - MODIFIED
function showProductDetail(productId) {
  currentProductId = productId; // Store current product ID
  const product = products.find(p => p.id === productId);
  if (!product) return;
  
  document.getElementById('detail-name').textContent = product.name;
  document.getElementById('detail-price').textContent = `Sewa mulai Rp ${product.rentalPrices[1].toLocaleString('id-ID')}/hari`;
  document.getElementById('detail-description').textContent = product.description;
  document.getElementById('detail-image').src = product.image;
  
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
  
  localStorage.setItem("bookingItems", JSON.stringify(bookingItems));
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
  localStorage.setItem("bookingItems", JSON.stringify(bookingItems));
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
  
  orderItemsContainer.innerHTML = '';
  
  // Jika ada booking items, tampilkan item booking
  if (bookingItems.length > 0) {
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
    
    const shippingCost = document.querySelector('input[name="shipping"]:checked').value === 'regular' ? 15000 : 25000;
    const total = subtotal + shippingCost;
    
    subtotalElement.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
    shippingCostElement.textContent = `Rp ${shippingCost.toLocaleString('id-ID')}`;
    totalAmountElement.textContent = `Rp ${total.toLocaleString('id-ID')}`;
    
    // Sembunyikan deposit dan tanggal sewa untuk booking biasa
    depositRow.style.display = 'none';
    rentalDateGroup.style.display = 'none';
  } else {
    orderItemsContainer.innerHTML = '<p>Belum ada items dalam booking sewa</p>';
    return;
  }
}

// Handle payment - MODIFIED untuk booking
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
  
  // Simpan informasi pengiriman untuk booking
  if (bookingItems.length > 0) {
    const bookingInfo = {
      name: formData.get('fullname'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      postalcode: formData.get('postalcode'),
      bookingItems: bookingItems
    };
    
    localStorage.setItem("bookingInfo", JSON.stringify(bookingInfo));
  }
  
  // Simulasikan proses pembayaran
  const payBtn = document.getElementById('pay-btn');
  payBtn.textContent = 'Memproses...';
  payBtn.disabled = true;
  
  setTimeout(() => {
    // Buat order object
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      status: 'completed',
      type: 'booking',
      items: bookingItems,
      customer: {
        name: formData.get('fullname'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        city: formData.get('city'),
        postalcode: formData.get('postalcode')
      },
      shipping: document.querySelector('input[name="shipping"]:checked').value,
      payment: document.querySelector('input[name="payment"]:checked').value,
      total: bookingItems.reduce((total, item) => total + item.totalPrice, 0) + 
             (document.querySelector('input[name="shipping"]:checked').value === 'regular' ? 15000 : 25000)
    };
    
    // Simpan order ke localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Reset booking items
    bookingItems = [];
    localStorage.removeItem('bookingItems');
    
    updateBookingCount();
    
    // Tampilkan modal sukses
    document.getElementById('order-id').textContent = order.id;
    document.getElementById('success-modal').classList.add('active');
    
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
    localStorage.setItem('theme', 'dark');
  } else {
    themeToggle.textContent = '🌙';
    localStorage.setItem('theme', 'light');
  }
}

// Check login status
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const profileElement = document.querySelector('.profile');
  
  if (profileElement) {
    if (!isLoggedIn) {
      profileElement.style.display = 'none';
    } else {
      profileElement.style.display = 'block';
    }
  }
  
  // Set currentUser
  if (isLoggedIn) {
    const userData = localStorage.getItem('userData');
    if (userData) {
      currentUser = JSON.parse(userData);
    }
  }
}

// Load user data
function loadUserData() {
  const userProfile = JSON.parse(localStorage.getItem("userProfile")) || {};
  
  if (userProfile.name) document.getElementById("name").value = userProfile.name;
  if (userProfile.email) document.getElementById("email").value = userProfile.email;
  if (userProfile.phone) document.getElementById("phone").value = userProfile.phone;
  if (userProfile.address) document.getElementById("address").value = userProfile.address;
  
  // Also prefill checkout form if user is logged in
  if (currentUser) {
    document.getElementById("fullname").value = userProfile.name || '';
    document.getElementById("email").value = userProfile.email || '';
    document.getElementById("phone").value = userProfile.phone || '';
    document.getElementById("address").value = userProfile.address || '';
  }
}

// Save profile
function saveProfile(e) {
  e.preventDefault();
  
  const profile = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value
  };
  
  localStorage.setItem("userProfile", JSON.stringify(profile));
  
  // Also save the current avatar if it exists
  const currentAvatar = document.getElementById('profile-avatar-img').src;
  if (currentAvatar && currentAvatar !== 'default-avatar-url') {
    localStorage.setItem('userAvatar', currentAvatar);
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
  
  localStorage.setItem('userData', JSON.stringify(userData));
  localStorage.setItem('isLoggedIn', 'true');
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
  
  localStorage.setItem('userData', JSON.stringify(userData));
  localStorage.setItem('isLoggedIn', 'true');
  currentUser = userData;
  
  // Also save to profile
  localStorage.setItem("userProfile", JSON.stringify({
    name: name,
    email: email,
    phone: phone
  }));
  
  alert('Pendaftaran berhasil! Anda telah login.');
  showPage('home');
  checkLoginStatus();
}

// Handle logout
function handleLogout() {
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userData');
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
  if (!currentUser || !localStorage.getItem('isLoggedIn')) {
    showPage('login');
  } else {
    filterProducts(category);
  }
}

// FUNGSI BARU: Handle explore button click dengan check login
function handleExploreClick(e) {
  e.preventDefault();
  if (!currentUser || !localStorage.getItem('isLoggedIn')) {
    showPage('login');
  } else {
    showPage('explore');
  }
}

// Search products
function searchProducts() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase();
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm) || 
    product.description.toLowerCase().includes(searchTerm)
  );
  
  displayProducts('explore-products', filteredProducts);
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
  const emails = JSON.parse(localStorage.getItem('newsletterEmails')) || [];
  if (!emails.includes(email)) {
    emails.push(email);
    localStorage.setItem('newsletterEmails', JSON.stringify(emails));
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
  const comments = JSON.parse(localStorage.getItem('productComments')) || [];
  comments.push(comment);
  localStorage.setItem('productComments', JSON.stringify(comments));
  
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
  
  const comments = JSON.parse(localStorage.getItem('productComments')) || [];
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
  const savedAvatar = localStorage.getItem('userAvatar');
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
    localStorage.setItem('userAvatar', imageData);
    
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
