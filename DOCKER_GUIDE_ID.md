# 🐳 Panduan Lengkap Docker untuk TailAdmin Dashboard

## 📋 Daftar Isi
1. [Persiapan](#persiapan)
2. [Cara Menjalankan](#cara-menjalankan)
3. [Perintah Docker](#perintah-docker)
4. [Troubleshooting](#troubleshooting)
5. [Deploy ke Production](#deploy-ke-production)

---

## 🎯 Persiapan

### Install Docker Desktop
1. Download Docker Desktop dari: https://www.docker.com/products/docker-desktop
2. Install sesuai sistem operasi Anda (Windows/Mac/Linux)
3. Jalankan Docker Desktop
4. Pastikan Docker berjalan dengan command:
   ```bash
   docker --version
   ```

### Clone Repository
```bash
git clone https://github.com/kaf-development2/KATALIS_NEW.git
cd KATALIS_NEW
```

---

## 🚀 Cara Menjalankan

### Metode 1: Docker Compose (PALING MUDAH)

```bash
docker-compose up --build
```

✅ **Aplikasi langsung berjalan di: http://localhost:4000**

### Metode 2: PowerShell Script (Windows)

```powershell
.\docker-start.ps1
```

### Metode 3: Docker Manual

```bash
# Build image
docker build -t tailadmin-dashboard .

# Run container
docker run -p 4000:4000 tailadmin-dashboard
```

---

## 🛠️ Perintah Docker

### Menjalankan Container

```bash
# Jalankan di foreground (lihat logs langsung)
docker-compose up

# Jalankan di background
docker-compose up -d

# Rebuild dan jalankan
docker-compose up --build
```

### Menghentikan Container

```bash
# Stop container
docker-compose down

# Stop dan hapus volumes
docker-compose down -v

# Stop paksa
docker-compose kill
```

### Melihat Status & Logs

```bash
# Lihat container yang berjalan
docker ps

# Lihat semua container
docker ps -a

# Lihat logs
docker-compose logs

# Follow logs real-time
docker-compose logs -f

# Lihat logs specific container
docker logs tailadmin-dashboard
```

### Management Container

```bash
# Masuk ke dalam container
docker exec -it tailadmin-dashboard sh

# Restart container
docker-compose restart

# Stop container specific
docker stop tailadmin-dashboard

# Start container yang sudah ada
docker start tailadmin-dashboard

# Remove container
docker rm tailadmin-dashboard
```

### Membersihkan Docker

```bash
# Hapus semua stopped containers
docker container prune

# Hapus semua unused images
docker image prune -a

# Hapus semua (hati-hati!)
docker system prune -a

# Hapus dengan volumes
docker system prune -a --volumes
```

---

## 🔧 Troubleshooting

### Problem: Port 4000 sudah digunakan

**Solusi 1:** Ganti port di `docker-compose.yml`
```yaml
ports:
  - "3000:4000"  # Akses via localhost:3000
```

**Solusi 2:** Stop aplikasi yang menggunakan port 4000
```powershell
# Windows PowerShell
netstat -ano | findstr :4000
taskkill /PID <PID_NUMBER> /F
```

### Problem: Build gagal

```bash
# Clear Docker cache
docker builder prune -a

# Rebuild from scratch
docker-compose build --no-cache
docker-compose up
```

### Problem: Container exit/crash

```bash
# Lihat logs error
docker-compose logs

# Lihat logs specific container
docker logs tailadmin-dashboard

# Restart container
docker-compose restart
```

### Problem: Perubahan code tidak terdeteksi

```bash
# Rebuild image
docker-compose down
docker-compose up --build --force-recreate
```

### Problem: Docker Desktop tidak jalan

1. Restart Docker Desktop
2. Pastikan WSL2 aktif (Windows)
3. Check Windows Service: Docker Desktop Service
4. Reinstall Docker Desktop jika perlu

### Problem: Network error

```bash
# Reset network
docker network prune

# Recreate network
docker-compose down
docker-compose up
```

---

## 🌐 Deploy ke Production

### Docker Hub

```bash
# Login
docker login

# Tag image
docker tag tailadmin-dashboard username/tailadmin-dashboard:latest

# Push to Docker Hub
docker push username/tailadmin-dashboard:latest
```

### Deploy ke Server

```bash
# Di server, pull image
docker pull username/tailadmin-dashboard:latest

# Run container
docker run -d -p 4000:4000 --name tailadmin --restart unless-stopped username/tailadmin-dashboard:latest
```

### Docker Compose Production

Buat `docker-compose.prod.yml`:
```yaml
version: '3.8'

services:
  tailadmin:
    image: username/tailadmin-dashboard:latest
    ports:
      - "4000:4000"
    environment:
      - NODE_ENV=production
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

Deploy:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

---

## 📝 Environment Variables

Untuk menggunakan environment variables, buat file `.env`:

```env
# .env
NODE_ENV=production
PORT=4000
# Tambahkan variables lain sesuai kebutuhan
```

Update `docker-compose.yml`:
```yaml
services:
  tailadmin:
    env_file:
      - .env
```

---

## 🔒 Security Tips

1. **Jangan commit sensitive data** ke Git
2. **Gunakan .dockerignore** untuk exclude files
3. **Run as non-root user** (sudah dikonfigurasi di Dockerfile)
4. **Update base image** secara regular
5. **Scan vulnerabilities:**
   ```bash
   docker scan tailadmin-dashboard
   ```

---

## 📊 Monitoring

### Docker Stats

```bash
# Lihat resource usage
docker stats

# Specific container
docker stats tailadmin-dashboard
```

### Health Check

Tambahkan di `docker-compose.yml`:
```yaml
services:
  tailadmin:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

---

## 🎓 Tips & Best Practices

1. **Development:** Gunakan `docker-compose up` untuk melihat logs
2. **Production:** Gunakan `docker-compose up -d` untuk background
3. **Debugging:** Gunakan `docker exec -it` untuk masuk ke container
4. **Cleaning:** Jalankan `docker system prune` secara berkala
5. **Backup:** Backup volumes sebelum `docker-compose down -v`

---

## 📞 Support

Jika ada masalah, cek:
- Docker logs: `docker-compose logs`
- Docker status: `docker ps`
- System resources: `docker stats`
- Network: `docker network ls`

---

## 🔗 Links

- Repository: https://github.com/kaf-development2/KATALIS_NEW
- Docker Hub: https://hub.docker.com
- Docker Docs: https://docs.docker.com

**Happy Dockerizing! 🐳**
