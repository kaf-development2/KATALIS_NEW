# Docker Setup untuk TailAdmin Dashboard

## Prerequisites
- Docker Desktop terinstall di sistem Anda
- Git terinstall

## Cara Menjalankan dengan Docker

### 1. Clone Repository
```bash
git clone https://github.com/kaf-development2/KATALIS_NEW.git
cd KATALIS_NEW
```

### 2. Build dan Run dengan Docker Compose (Cara Paling Mudah)
```bash
docker-compose up --build
```

Aplikasi akan berjalan di: **http://localhost:4000**

### 3. Atau Build Manual dengan Docker
```bash
# Build image
docker build -t tailadmin-dashboard .

# Run container
docker run -p 4000:4000 tailadmin-dashboard
```

## Perintah Docker Berguna

### Stop Container
```bash
docker-compose down
```

### Rebuild dari Scratch
```bash
docker-compose down
docker-compose up --build --force-recreate
```

### Lihat Logs
```bash
docker-compose logs -f
```

### Run di Background
```bash
docker-compose up -d
```

## Struktur Docker Files
- `Dockerfile` - Konfigurasi untuk build Docker image
- `docker-compose.yml` - Orchestration untuk menjalankan container
- `.dockerignore` - File yang diabaikan saat build

## Konfigurasi Port
Aplikasi di-configure untuk running di port **4000** secara default. Jika ingin mengubah port:

1. Edit `docker-compose.yml`:
```yaml
ports:
  - "PORT_YANG_DIINGINKAN:4000"
```

2. Atau edit environment variable PORT di `docker-compose.yml`:
```yaml
environment:
  - PORT=PORT_BARU
ports:
  - "PORT_BARU:PORT_BARU"
```

## Troubleshooting

### Port sudah digunakan
Jika port 4000 sudah digunakan, ubah port mapping di `docker-compose.yml`:
```yaml
ports:
  - "3000:4000"  # Akses via port 3000
```

### Build gagal
```bash
# Clean docker cache
docker system prune -a
docker-compose up --build
```

### Container tidak bisa diakses
Pastikan Docker Desktop sedang berjalan dan container aktif:
```bash
docker ps
```
