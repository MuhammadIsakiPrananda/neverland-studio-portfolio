# Cloudflare Tunnel Configuration for phpMyAdmin

## Setup di Cloudflare Dashboard

1. Login ke Cloudflare Dashboard: https://one.dash.cloudflare.com/
2. Pilih domain: **neverlandstudio.my.id**
3. Navigate ke: **Access → Tunnels**
4. Edit existing tunnel atau create new tunnel
5. Tambahkan Public Hostname baru:

### Konfigurasi Public Hostname untuk phpMyAdmin

```yaml
- hostname: phpmyadmin.neverlandstudio.my.id
  service: http://localhost:8080
```

**Detail konfigurasi:**
- **Subdomain**: phpmyadmin
- **Domain**: neverlandstudio.my.id
- **Type**: HTTP
- **URL**: localhost:8080
- **Path**: / (root)

## Cara Setup Manual di Cloudflare:

### PENTING: Subdomain phpMyAdmin BELUM dikonfigurasi!

**Status saat ini:**
- ❌ Error 404: Subdomain belum ditambahkan di Cloudflare
- ✅ phpMyAdmin running di port 8080 (verified)
- ✅ Container healthy

**Langkah-langkah Setup:**

1. **Login ke Cloudflare Zero Trust Dashboard**
   - URL: https://one.dash.cloudflare.com/
   - Pilih team/account Anda

2. **Navigate ke Tunnels**
   - Sidebar: **Access → Tunnels**
   - Cari tunnel yang aktif (biasanya ada status "Healthy" dengan icon hijau)
   - Klik nama tunnel tersebut

3. **Tambah Public Hostname**
   - Tab: **Public Hostname**
   - Klik tombol **Add a public hostname** (biru, di kanan atas)

4. **Isi form dengan data berikut:**
   ```
   Public hostname:
   ├─ Subdomain: phpmyadmin
   ├─ Domain: neverlandstudio.my.id
   └─ Path: (kosongkan)
   
   Service:
   ├─ Type: HTTP
   └─ URL: localhost:8080
   ```
   
   **Detail lengkap:**
   - **Subdomain**: `phpmyadmin`
   - **Domain**: Pilih `neverlandstudio.my.id` dari dropdown
   - **Path**: Biarkan kosong
   - **Service Type**: Pilih `HTTP` dari dropdown
   - **URL**: `localhost:8080` (atau `127.0.0.1:8080`)

5. **Save Configuration**
   - Klik **Save hostname** (tombol biru di bawah)
   - Tunggu beberapa detik hingga status berubah menjadi "Active"

6. **Verify DNS Record**
   - Navigate ke: **DNS → Records**
   - Pastikan muncul CNAME record:
     ```
     phpmyadmin  CNAME  <tunnel-id>.cfargotunnel.com  Auto (Proxied)
     ```

## Testing Akses

Setelah setup, tunggu DNS propagation (1-5 menit), lalu test:

```bash
curl -I https://phpmyadmin.neverlandstudio.my.id
```

Atau buka di browser:
```
https://phpmyadmin.neverlandstudio.my.id
```

## Keamanan Tambahan (RECOMMENDED)

### 1. Cloudflare Access Policy

Untuk keamanan maksimal, setup Cloudflare Access:

1. Di Cloudflare Dashboard: **Access → Applications**
2. Klik **Add an application**
3. Pilih **Self-hosted**
4. Konfigurasi:
   - **Name**: phpMyAdmin Neverland
   - **Subdomain**: phpmyadmin
   - **Domain**: neverlandstudio.my.id
5. Setup Access Policy:
   - **Policy name**: Admin Access Only
   - **Action**: Allow
   - **Include**: Emails (masukkan email admin)
6. **Save application**

### 2. IP Whitelist di Nginx

Edit file: `/root/neverland-studio-portfolio/docker-compose.yml`

Uncomment dan tambahkan IP kamu di nginx.conf (jika akses langsung port 8080).

### 3. Strong MySQL Password

Ganti password MySQL di file `.env`:

```bash
MYSQL_ROOT_PASSWORD=your-very-strong-password-here
```

## Verifikasi Keamanan

Checklist keamanan phpMyAdmin:
- ✅ Tidak ada auto-login (PMA_USER & PMA_PASSWORD dihapus)
- ✅ HTTPS via Cloudflare Tunnel
- ✅ Subdomain terpisah (phpmyadmin.neverlandstudio.my.id)
- ✅ PMA_ARBITRARY: 0 (disable arbitrary server)
- ✅ Blowfish secret untuk enkripsi
- ⬜ Cloudflare Access (optional tapi recommended)
- ⬜ IP Whitelist (optional)
- ⬜ 2FA di MySQL user (optional)

## Troubleshooting

### Cannot access phpmyadmin subdomain

1. Cek container running:
```bash
docker ps | grep phpmyadmin
```

2. Cek port 8080 accessible:
```bash
curl http://localhost:8080
```

3. Cek Cloudflare Tunnel running:
```bash
docker ps | grep cloudflare
```

4. Test DNS resolution:
```bash
nslookup phpmyadmin.neverlandstudio.my.id
```

### Login failed

1. Verify MySQL credentials di `.env`
2. Cek MySQL container status
3. Test MySQL connection:
```bash
docker exec -it neverland-db mysql -u root -p
```

## Notes

- **Main Site**: https://portfolio.neverlandstudio.my.id
- **phpMyAdmin**: https://phpmyadmin.neverlandstudio.my.id
- **Backend API**: https://portfolio.neverlandstudio.my.id/api/

Semua service menggunakan Cloudflare Tunnel untuk HTTPS otomatis dan keamanan.
