# MySQL Query Log 설정 및 관리

## General Query Log 설정

mysql에서 실행한 쿼리 내역을 로그로 남기기 위해선 추가적인 설정이 필요합니다.

`/etc/my.cnf`에 다음 설정을 추가합니다.

```shell
...
[mysqld]
...
general_log_file = /var/log/mysql/general.log # log 파일 경로는 변경가능합니다.
general_log = 1
...
```

위와 같이 설정하면 실행된 쿼리 내역들이 `/var/log/mysql/general.log`에 계속 쌓입니다.

## 로그파일 관리

이 로그 파일은 크기가 계속 늘어나기 때문에 관리가 필요합니다.

crontab에 매일 새벽 3시에 돌아가는 예약 작업을 등록해서 관리할 수 있습니다. 다음 명령어를 shell에서 실행합니다.

`$ crontab -e`

```shell
# 로그파일명 뒤에 날짜를 붙혀서 백업하고, 기존의 로그는 내용을 지웁니다.
0 3 * * * \cp /var/log/mysql/general.log /var/log/mysql/general_$(date +\%Y\%m\%d).log && cat /dev/null > /var/log/mysql/general.log
# 30일이 지난 로그는 general_*.log 파일을 찾아서 삭제합니다.
0 3 * * * find /var/log/mysql/ -name 'general_*.log' -mtime +30 -delete
```

## MySQL 덤프 crontab

매일 새벽 2시에 디비 덤프를 하고 60일 이상된 백업파일은 삭제하는 명령어입니다.

```shell
0 2 * * * mysqldump -u root -p비밀번호 mydb > /data/mysqldump/mydb_$(date +\%Y\%m\%d).sql
0 2 * * * find /data/mysqldump/ -name 'mydb_*.sql' -mtime +60 -delete
```

## 관련 페이지
- [[oracle-sql]] — Oracle SQL 필수 문법
- [[linux-commands]] — crontab 등 Linux 명령어
