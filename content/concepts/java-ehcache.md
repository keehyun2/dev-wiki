# Java Ehcache 가이드

**Ehcache**는 Java 애플리케이션을 위한 강력한 캐싱 솔루션으로, 메모리, 디스크, 분산 캐싱을 지원합니다.

## 개요

### 주요 특징
- **인메모리 캐싱**: 빠른 데이터 접근
- **디스크 캐싱**: 대용량 데이터 저장
- **분산 캐싱**: 여러 서버 간 캐시 공유
- **다층 아키텍처**: Heap → Off-heap → Disk

### 의존성 추가
```xml
<dependency>
    <groupId>org.ehcache</groupId>
    <artifactId>ehcache</artifactId>
    <version>3.10.8</version>
</dependency>
```

## 기본 사용법

### 캐시 생성 및 사용
```java
// 캐시 매니저 생성
CacheManager cacheManager = CacheManagerBuilder.newCacheManagerBuilder().build();
cacheManager.init();

// 캐시 생성
Cache<String, User> userCache = cacheManager.createCache("userCache",
    CacheConfigurationBuilder.newCacheConfigurationBuilder(
        String.class, User.class,
        ResourcePoolsBuilder.heap(100)  // 최대 100개 항목
    )
);

// 캐시 사용
User user = userCache.get("user1");
if (user == null) {
    user = loadUserFromDatabase("user1");
    userCache.put("user1", user);
}

// 종료
cacheManager.close();
```

### 기본 CRUD 작업
```java
Cache<String, User> cache = cacheManager.getCache("userCache", String.class, User.class);

// 생성/수정
cache.put("user1", newUser);

// 읽기
User user = cache.get("user1");

// 삭제
cache.remove("user1");

// 존재 확인
if (cache.containsKey("user1")) {
    // 처리
}
```

## 리소스 풀 설정

### 힙 메모리
```java
// 항목 수로 제한
ResourcePoolsBuilder.heap(1000)

// 메모리 크기로 제한
ResourcePoolsBuilder.heap(100, MemoryUnit.MB)
```

### 다층 캐싱
```java
// Heap → Off-heap → Disk
Cache<String, Data> cache = cacheManager.createCache("multiTierCache",
    CacheConfigurationBuilder.newCacheConfigurationBuilder(
        String.class, Data.class,
        ResourcePoolsBuilder.newResourcePoolsBuilder()
            .heap(100, MemoryUnit.MB)          // 1단계: Heap
            .offheap(1, MemoryUnit.GB)         // 2단계: Off-heap
            .disk(10, MemoryUnit.GB)          // 3단계: Disk
    )
);
```

## 만료 정책

### 시간 기반 만료
```java
// Time-to-Live (생존 시간)
.withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofMinutes(10)))

// Time-to-Idle (유휴 시간)
.withExpiry(ExpiryPolicyBuilder.timeToIdleExpiration(Duration.ofMinutes(5)))
```

### 조건부 연산
```java
// 없을 때만 추가
cache.putIfAbsent("user1", defaultUser);

// 있을 때만 교체
cache.replace("user1", updatedUser);

// 계산으로 로드
User user = cache.computeIfAbsent("user1", key -> loadUser(key));
```

## 캐싱 전략

### Read-through
```java
// 캐시 미스 시 자동 로드
CacheLoaderWriter<String, User> loader = new CacheLoaderWriter<String, User>() {
    @Override
    public User load(String key) throws Exception {
        return loadUserFromDatabase(key);  // DB에서 로드
    }
};

CacheConfigurationBuilder.newCacheConfigurationBuilder(
    String.class, User.class,
    ResourcePoolsBuilder.heap(100)
).withLoaderWriter(loader);
```

### Write-through
```java
// 캐시 쓰기 시 DB에도 저장
CacheLoaderWriter<String, User> loader = new CacheLoaderWriter<String, User>() {
    @Override
    public void write(String key, User value) throws Exception {
        saveUserToDatabase(key, value);  // DB에 저장
    }
};
```

## 모범 사례

### 설정 가이드라인
```java
// 1. 적절한 캐시 크기 설정
ResourcePoolsBuilder.heap(1000)  // 너무 작거나 크지 않게

// 2. 적절한 만료 정책
.withExpiry(ExpiryPolicyBuilder.timeToLiveExpiration(Duration.ofMinutes(10)))

// 3. 통계 활성화 (개발 환경)
.withDefaultStatistics(true)

// 4. 효율적인 캐시 키 사용
cache.get("user_" + userId);  // 좋음
cache.get(computeComplexKey(userId, sessionId));  // 나쁨
```

### 성능 최적화
```java
// 히트 비율 모니터링
CacheStatistics stats = cache.getStatistics();
double hitRatio = stats.getCacheHits() / (double)(stats.getCacheHits() + stats.getCacheMisses());

if (hitRatio < 0.8) {
    // 캐시 크기 증가 또는 만료 정책 조정 고려
}

// 벌크 연산 사용
cache.getAll(keys);   // 개별 get보다 효율적
cache.putAll(entries); // 개별 put보다 효율적
```

## 문제 해결

### 메모리 관리
```java
// 문제: 과도한 힙 사용으로 OutOfMemoryError
// 해결: Off-heap 및 디스크 계층 사용
ResourcePoolsBuilder.newResourcePoolsBuilder()
    .heap(100, MemoryUnit.MB)        // 힙 사용 제한
    .offheap(1, MemoryUnit.GB)       // Off-heap 사용
    .disk(10, MemoryUnit.GB);        // 디스크 사용
```

## 관련 페이지
- [[java-8-stream-map]] — Java 8 Stream API
- [[java-debugging]] — Java 디버깅
