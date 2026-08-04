# NFS 및 Samba 서버

**NFS**는 Linux/Unix 시스템 간 파일 공유를 위한 프로토콜이고, **Samba**는 Linux와 Windows 간 파일 공유를 위한 SMB/CIFS 프로토콜 구현입니다.

## NFS (Network File System)

### 정의 및 용도
- **목적**: Linux-Unix 환경에서 파일 시스템 네트워크 공유
- **특징**: 원격 파일 시스템을 로컬처럼 접근 가능
- **주요 사용**: 서버 간 파일 공유, 스토리지 연결

### 서버 설정
```bash
# 설치
sudo apt install nfs-kernel-server    # Debian/Ubuntu
sudo yum install nfs-utils            # RHEL/CentOS

# 공유 설정
sudo nano /etc/exports
/home/user/documents 192.168.1.0/24(rw,sync,no_subtree_check)

# 설정 적용
sudo exportfs -a
sudo systemctl restart nfs-kernel-server
```

### 클라이언트 연결
```bash
# Linux 클라이언트
sudo apt install nfs-common
sudo mount server:/path/to/share /local/mountpoint

# 영구 마운트 (/etc/fstab)
server:/path/to/share /local/mountpoint nfs defaults 0 0
```

## Samba (SMB/CIFS)

### 정의 및 용도
- **목적**: Linux와 Windows 간 파일/프린터 공유
- **특징**: Windows 네트워크 환경과 호환 가능
- **주요 사용**: 윈도우 클라이언트가 Linux 서버 파일 접근

### 서버 설정
```bash
# 설치
sudo apt install samba
sudo systemctl start smbd nmbd

# 공유 설정
sudo nano /etc/samba/smb.conf
[share_name]
path = /path/to/share
browseable = yes
read only = no
guest ok = yes

# 사용자 추가
sudo smbpasswd -a username
```

### 클라이언트 연결
```bash
# Linux 클라이언트
sudo apt install smbclient cifs-utils
smbclient -L server -U username
sudo mount -t cifs //server/share /mountpoint -o username=user

# Windows 클라이언트
net use Z: \\server\share /user:username password
```

## 선택 가이드

### NFC vs Samba
| 특징 | NFS | Samba |
|------|-----|--------|
| 환경 | Linux ↔ Linux | Linux ↔ Windows |
| 프로토콜 | NFS | SMB/CIFS |
| 보안 | NFSv4 보안 강화 | SMB3 암호화 |
| Windows 지원 | 제한적 | 완전 지원 |

### 사용 시나리오
```bash
# Linux 서버 간 파일 공유 → NFC 사용
# 윈도우 클라이언트 접속 → Samba 사용
# 혼합 환경 → 둘 다 설치
```

## 기본 명령어

### NFC 관리
```bash
sudo exportfs -v              # 공유 목록 확인
showmount -e server          # 서버 공유 확인
sudo systemctl status nfs-kernel-server  # 상태 확인
```

### Samba 관리
```bash
testparm                      # 설정 테스트
sudo pdbedit -L              # 사용자 목록
smbclient -L server          # 공유 목록 보기
```

## 관련 페이지
- [[linux-commands]] — Linux 시스템 관리
- [[docker-commands]] — 컨테이너 기반 대안
