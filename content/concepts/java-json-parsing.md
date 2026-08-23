# Json Data Parse in java(Client) 

gson java library 를 활용하여 json 데이터를 읽어와서 활용하고 했는데, spring 에 **RestTemplate** 을 사용하여도 될것 같습니다. 

1. **gson**+ **common-io**아래의 dependency libarary 를 필요로합니다. 

   ```xml
   <dependency>
     <groupId>commons-io</groupId>
     <artifactId>commons-io</artifactId>
     <version>2.4</version>
   </dependency>
   <dependency>
     <groupId>com.google.code.gson</groupId>
     <artifactId>gson</artifactId>
     <version>2.8.0</version>
   </dependency>
   ```

   ```java
   Gson gson = new Gson();
   // list 객체 
   InputStream in = new URL("http://" + hostname + ":" + port + "/caseinfo?name_chk_key_di=" + caseInfoVO.getName_chk_key_di()).openStream();
   String jsonString = IOUtils.toString(in,"UTF-8");
   List<CaseInfoVO> caseInfoList = gson.fromJson(jsonString, new TypeToken<List<CaseInfoVO>>(){}.getType());
   // vo 객체
   in = new URL("http://" + hostname + ":" + port + "/caseinfo/detail?case_num=" + caseInfoVO.getCase_num()).openStream();
   CaseInfoVO detailVO = gson.fromJson(IOUtils.toString(in,"UTF-8"), CaseInfoVO.class);
   ```

   위 코드에서 사용한 libarary 는 common io, gson 을 사용하였습니다.  `IOUtils.toString` 함수에서 인코딩 정보 파라미터는 필수가 아닌데, 그로인해 한글을 제대로 인식못하는 경우가 생깁니다. 저의 경우에는 서버 환경이 바뀌면서 한글을 제대로 못 읽어들이는 문제가 생겼습니다. 인코딩 정보(UTF-8)를 추가하여 문제를 해결한 경험이 있습니다. 이후에  `gson.fromJson` 함수를 사용하여 *json string data* 를 java 객채로 변환합니다.  전달받고자하는 객체가 **String type** 이외의 **int** 등등의 변수를 가지고 있는 경우 java 객체로 변환하는 중에 문제가 생겼던걸로 기억하는데 저는 급해서 전부 String 으로 바꿔서 처리했던 기억이 있습니다.

2. **Spring RestfulTemplate**
   spring 프레임워크에서 제공하는 restful 클라이언트 클래스입니다. 

   ```java
   RestTemplate restTemplate = new RestTemplate();

   String result = restTemplate.getForObject("http://example.com/hotels/{hotel}/bookings/{booking}", String.class, "42", "21");

   Map<String, String> vars = new HashMap<String, String>();
   vars.put("hotel", "42");
   vars.put("booking", "21");
   String result = restTemplate.getForObject("http://example.com/hotels/{hotel}/bookings/{booking}", String.class, vars);
   ```

   위와 같은 코드를 사용해 client 에서 json 데이터를 parse 합니다.
## 관련 페이지
- [[java-8-stream-map]] — Java 8 Stream 데이터 변환
