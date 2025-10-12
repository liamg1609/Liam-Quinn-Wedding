# 🚀 Hướng dẫn Deploy lên GitHub Pages

## Bước 1: Chuẩn bị

1. Đảm bảo bạn đã có tài khoản GitHub
2. Tạo repository mới trên GitHub (có thể đặt tên gì cũng được, ví dụ: `wedding-invitation`)

## Bước 2: Push code lên GitHub

```bash
# Khởi tạo git (nếu chưa có)
git init

# Thêm remote repository
git remote add origin https://github.com/USERNAME/REPOSITORY_NAME.git

# Add và commit tất cả file
git add .
git commit -m "Initial commit"

# Push lên GitHub
git push -u origin main
```

> Thay `USERNAME` bằng username GitHub của bạn và `REPOSITORY_NAME` bằng tên repository bạn vừa tạo.

## Bước 3: Cấu hình GitHub Pages

1. Vào repository trên GitHub
2. Click vào **Settings**
3. Trong sidebar bên trái, click **Pages**
4. Tại phần **Source**, chọn **GitHub Actions**
5. Save

## Bước 4: Deploy

Sau khi push code, GitHub Actions sẽ tự động:
- Cài đặt dependencies
- Build project
- Deploy lên GitHub Pages

Quá trình này mất khoảng 1-2 phút. Bạn có thể xem tiến trình tại tab **Actions** trên repository.

## Bước 5: Truy cập website

Sau khi deploy thành công, website của bạn sẽ có địa chỉ:

```
https://USERNAME.github.io/REPOSITORY_NAME/
```

hoặc nếu repository tên là `USERNAME.github.io`:

```
https://USERNAME.github.io/
```

## ⚙️ Cập nhật website

Mỗi khi bạn muốn cập nhật website, chỉ cần:

```bash
git add .
git commit -m "Update content"
git push
```

GitHub Actions sẽ tự động build và deploy lại!

## 🔧 Troubleshooting

### Lỗi 404 khi truy cập
- Kiểm tra lại tên repository và URL
- Đợi thêm 2-3 phút để GitHub Pages cập nhật

### Build failed
- Vào tab **Actions** để xem log lỗi chi tiết
- Thường do thiếu dependencies hoặc lỗi trong code

### CSS/JS không load
- Kiểm tra đường dẫn trong file HTML
- Nếu repository không phải là `USERNAME.github.io`, có thể cần thêm base path

## 📝 Notes

- GitHub Pages miễn phí cho public repositories
- Có giới hạn 100GB bandwidth/tháng
- Source code sẽ public, nếu muốn private cần GitHub Pro

## 🎯 Custom Domain (Optional)

Nếu bạn có domain riêng:

1. Vào **Settings > Pages**
2. Nhập domain vào ô **Custom domain**
3. Cấu hình DNS của domain trỏ về GitHub Pages
4. Đợi vài giờ để DNS propagate

Chi tiết: [docs.github.com/pages/configuring-a-custom-domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
