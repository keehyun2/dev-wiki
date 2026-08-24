---
title: Redis와 Java 클라이언트
---

# Redis와 Java 클라이언트


> 2018년에 작성된 문서입니다. 클라이언트 라이브러리 버전(jedis 2.9 등)은 참고용이며, 현재는 Lettuce·Redisson 가 주로 사용됩니다.
### 들어가기

redis-server 는 오픈소스로 데이터가 메모리에 저장되는 구조로 빠르게 데이터를 가져올 수 있습니다. 또한 map, list등 여러 자료구조를 제공합니다. web 분야에서 session이나 cache 정보를 저장하는 용도로 많이 사용하고, game 분야 에서는 랭킹 리스트(중요하지 않은 정보 빠르게 불러오기 위한 caching 처리) 등에 많이 사용합니다. 

### Server 설치

redis-server 는 linux 계열을 지원하고 윈도우 OS 는 정식으로 지원하지 않습니다. 윈도우에서는 WSL2 사용을 권장합니다. (커뮤니티 포팅 버전도 있으나 비권장) Centos7 에 설치 해보았는데 어렵지 않게 설치 하였습니다. (30분?)

`yum --enablerepo=epel,remi install redis`

설치가 제대로 되지 않으면 [Redis 설치](https://www.lesstif.com/pages/viewpage.action?pageId=23757257) 웹 문서를 참고 하시기 바랍니다. redis-server 는 기본으로 **6379** port 를 기본으로 사용합니다.  redis-server를 외부에서 접근하려면 server config를 수정해야합니다. (127.0.0.1 에서 접근할 경우 필요없습니다. ) centos7 기준 */etc/redis.conf* 에 설정정보가 있습니다. 여기서 61 line 에 `bind 127.0.0.1` 로 되어있는부분 `bind 0.0.0.0` 으로 변경해주고 재시작을 해야 외부에서도 접근이 가능합니다. (centos7 에서 방화벽을 켜져있다면 firewall-cmd 에서 6379 open 합니다.)

`vi /etc/firewalld/zones/public.xml`

### Client 

client 로 여러가지 언어를 지원합니다.  [클라이언트 목록](https://redis.io/clients) 여기서 별 마크를 사용하는 것을 추천합니다. java 분야에서는 **Jedis, lettuce, Redisson** 를 client 로 많이 사용하고 있습니다. 

**1. Jedis** - 제일 사용이 간편해 보입니다.  먼저 의존성을 추가합니다.(maven)

```xml
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>2.9.0</version>
    <type>jar</type>
    <scope>compile</scope>
</dependency>
```

아래는 java source code 예제입니다. 

```java
Jedis jedis = new Jedis("127.0.0.1");
jedis.set("foo", "bar");
String value = jedis.get("foo");
```

좀더 상세한 설명은 영문으로 되어있는 [github wiki](https://github.com/xetorthio/jedis/wiki) 에 있습니다.  위 예제는 key value 만 저장했는데 list 나 map 을 사용하는 예제는 wiki 를 참고하시면 될것 같습니다. 

**Redisson** - 광범위한 자바 객체와 서비스를 제공합니다. [Rich Redis Client](https://redisson.org/)? 다양한 기능으로 응용한 예제들이 많이 있습니다. 예제는 [저장소](https://github.com/redisson/redisson-examples) 에서 내려받을수 있습니다. 소스 내에 class 들은 각각 main 메서드가 있고 상단에 Config 만 아래 처럼 수정해주면 되겠습니다. 

```java
Config config = new Config();
config.useSingleServer().setAddress("127.0.0.1:6379");
RedissonClient redisson = Redisson.create(config);
```
더 상세한 설명은 [wiki](https://github.com/redisson/redisson/wiki/Table-of-Content) 를 참고합니다. 
## 관련 페이지
- [[java-ehcache]] — Java 캐싱 솔루션 Ehcache
- [[java-json-parsing]] — Java JSON 파싱
