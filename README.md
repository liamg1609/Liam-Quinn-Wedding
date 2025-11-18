# 💌 Template website undangan pernikahan sederhana

![Thumbnail](/assets/images/banner.webp)

[![Netlify Status](https://api.netlify.com/api/v1/badges/cef32dbf-f26f-4865-84a9-b85a439c9994/deploy-status)](https://app.netlify.com/sites/ulems/deploys)
[![Hits](https://dikit.my.id/0b3y8q)](https://cie.my.id)
[![GitHub repo size](https://img.shields.io/github/repo-size/dewanakl/undangan?color=brightgreen)](https://shields.io)
[![GitHub License](https://img.shields.io/github/license/dewanakl/undangan?color=brightgreen)](https://shields.io)

## 🚀 Demo
Untuk kamu yang ingin melihat demo terlebih dahulu:

[https://ulems.my.id/?to=Teman teman semua](https://ulems.my.id/?to=Teman%20teman%20semua)

## 🚀 Quick Start (Local Development)

### Cách 1: Sử dụng esbuild dev server (Khuyên dùng)
```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Mở browser và truy cập: http://localhost:8080
```

### Cách 2: Sử dụng Python HTTP server
```bash
# Cài đặt dependencies
npm install

# Build project
npm run build

# Chạy HTTP server
python3 -m http.server 8080

# Mở browser và truy cập: http://localhost:8080
```

### Cách 3: Sử dụng Node.js HTTP server
```bash
# Cài đặt dependencies
npm install

# Build project
npm run build

# Chạy HTTP server
npx http-server -p 8080

# Mở browser và truy cập: http://localhost:8080
```

## 🔧 Troubleshooting

### Lỗi "This page isn't working"
- **Nguyên nhân:** Server không khởi động được
- **Giải pháp:** Thử cách 2 hoặc 3 ở trên, hoặc kiểm tra port 8080 có bị chiếm không

### Lỗi JSON Parse Error
```
Uncaught SyntaxError: Unexpected token 'd', "dark" is not valid JSON
```
- **Nguyên nhân:** localStorage chứa data cũ
- **Giải pháp:** Mở Developer Console (F12) và gõ: `localStorage.clear()`, sau đó refresh trang

### Port 8080 đã được sử dụng
```bash
# Tìm process đang dùng port 8080
lsof -i :8080

# Kill process (thay PID bằng số thực tế)
kill -9 PID

# Hoặc dùng port khác
python3 -m http.server 3000
```

## 📦 Documentation

* Ubah isi file `index.html` sesuai keinginanmu.
* Jika tidak ingin menggunakan **fitur komentar**, hapus atribut `data-url` dan `data-key` di elemen `<body>` pada index.html.
* Sesuaikan `data-url` pada `<body>` di index dan dashboard sesuai dengan URL backend (jika kamu meng-hosting sendiri).
* Sesuaikan juga `data-key` di index dengan access key yang bisa kamu ambil dari dashboard.
* Jika ingin menggunakan GIF, dapatkan Tenor API key di [developers.google.com/tenor](https://developers.google.com/tenor/guides/quickstart).
* Untuk deployment, jalankan `npm run build:public`. Folder `public` adalah yang akan kamu upload.
* Untuk backend self-hosting, lihat penjelasan di bawah, atau gunakan **trial API** secara gratis.

> Undangan ini hanya menggunakan HTML, CSS, dan JavaScript biasa. NPM digunakan agar file JavaScript bisa langsung dieksekusi (bukan bertipe module lagi).

> Jika tetap ingin tanpa NPM, ubah `src="./dist/guest.js"` menjadi `src="./js/guest.js" type="module"` pada tag `<head>` di index dan dashboard.html, dengan risiko glitch tema di awal loading.

> Jika kamu punya pertanyaan, gunakan fitur `discussions` agar bisa dibaca juga oleh teman-teman lainnya.

> [!WARNING]  
> Gunakan versi 3.14.0, untuk versi 4 masih tahap pengembangan dan berpotensi teredapat bug 🐛

## 🔥 Deployment API

- Video\
    otw

- Presentation
    [https://docs.google.com/presentation](https://docs.google.com/presentation/d/1EY2YmWdZUI7ASoo0f2wvU7ec_Yt0uZanYa8YLbfNysk/edit)

## ⏰ Trial API
Untuk kamu yang ingin mencoba secara gratis:

[https://trial.ulems.my.id](https://trial.ulems.my.id)

## ⚙️ Tech stack

- Bootstrap 5.3.7
- AOS 2.3.4
- Fontawesome 6.7.2
- Canvas Confetti 1.9.3
- Google Fonts
- Vanilla JS

## 🎨 Credit
All visual assets in this project are sourced from Pixabay.

## 🤝 Contributing

I'm very open to those of you who want to contribute to the undangan!

## 🐞 Security Vulnerabilities

If you find any security vulnerabilities in this undangan, please email DKL via [dewanakretarta29@gmail.com](mailto:dewanakretarta29@gmail.com).

## 📜 License

Undangan is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
