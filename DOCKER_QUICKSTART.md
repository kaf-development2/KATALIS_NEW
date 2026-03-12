# 🚀 Quick Start - Docker Commands

## Start Application
```bash
docker-compose up --build
```
**→ http://localhost:4000**

## Common Commands

| Command | Description |
|---------|-------------|
| `docker-compose up` | Start container |
| `docker-compose up -d` | Start in background |
| `docker-compose down` | Stop container |
| `docker-compose logs -f` | View logs |
| `docker-compose restart` | Restart container |
| `docker ps` | List running containers |

## Windows PowerShell
```powershell
.\docker-start.ps1  # Quick start script
```

## Troubleshooting

**Port already in use?**
```bash
# Edit docker-compose.yml, change port:
ports:
  - "3000:4000"  # Use port 3000 instead
```

**Build failed?**
```bash
docker system prune -a
docker-compose up --build
```

**Container crashed?**
```bash
docker-compose logs
docker-compose restart
```

## Files Created
- ✅ `Dockerfile` - Build configuration
- ✅ `docker-compose.yml` - Run configuration
- ✅ `.dockerignore` - Exclude files
- ✅ `docker-start.ps1` - Windows script
- ✅ `DOCKER_GUIDE_ID.md` - Full guide (Indonesian)

## Next Steps
1. Make sure Docker Desktop is running
2. Run: `docker-compose up --build`
3. Open: http://localhost:4000
4. Enjoy! 🎉
