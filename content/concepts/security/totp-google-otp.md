---
title: Google OTP (TOTP) 인증 원리
---

# Google OTP (TOTP) 인증 원리와 적용


> PHP 기준으로 작성된 문서이지만 TOTP 동작 원리는 언어와 무관하게 동일합니다.
**OTP(One-Time Password)** 란 보안 강화를 목적으로 사용자 비밀번호 에 추가적인 인증 수단으로 많이 사용됩니다. Google OTP 는 Time based OTP 를 사용하여, 30초마다 바뀌는 6자리의 숫자로된 비밀번호가 생성됩니다. 이OTP 코드는 **비밀키(base32 encoded)**를 통해 생성됩니다. 이 비밀키는 사용자 스마트폰과 데이터베이스에 저장되어 있어야합니다. 그리고 인증하는 순간에 사용자 스마트폰과 웹사이트에서 이 비밀키로 각각 6자리 숫자를 생성하고 같은지를 확인하여 인증 성공여부를 결정합니다.

```shell
MFZWIZDBONSGC5TDMN5HQY32PBRXU6DD # base32 로 인코딩된 비밀키입니다.
```

사용자별로 위와 같은 복잡한 키를 생성하고, 스마트폰에 저장하여야합니다. 이를 편하게 저장하기 위해서 Google api 는 **QR code image**를 생성해주고, **[google authenticator](https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&hl=ko)** 앱에서 인식하고 key 를 저장할 수 있도록 지원하고 있습니다. 



### php Google OTP 인증 과정

1. 사용자별로 유일하게 가질 비밀키 생성 규칙 정하기. ex) **ID** + **Password** 조합 (설명 생략)
2. 조합된 문자열을 Base32 로 인코딩 하여 비밀키 생성
3. 사용자 DB 에 비밀키를 저장하는 Logic 구현 (설명 생략)
4. 비밀키로 생성된 QR Code image 를 사용자에게 출력
5. **Google authenticator** 앱으로 QR Code 인식하여 비밀 key 를 스마트폰에 저장 (설명 생략)



### 로그인 과정

1. **Google authenticator** 에 나타난 **인증번호(6자리 숫자)** 확인 (설명 생략)
2. 로그인할때 아이디/패스워드에 추가적으로 **인증번호** 입력하여 서버에 요청 (설명 생략)
3. 서버에서 사용자의 비밀키를 DB 에서 가져와서 **인증번호**를 생성 
4. 각각의 인증번호가 동일한 경우 인증 성공 (설명 생략)



위의 과정에서 **Base32 인코딩**, **비밀키로 OTP 6자리 인증번호 생성** 하는 부분은 오픈소스 를 사용하였습니다. 저는 **[otphp](https://github.com/Spomky-Labs/otphp)** 라이브러리의 도움을 받아서 구현을 하였습니다. 사용자 메뉴얼에는 **php 7.1** 이상을 사용하여야 한다고 나와있는데, **php 5.6** 에서 위의 2가지 기능을 사용하는데는 문제 없었고, **php 5.2** 에서는 namespace 기능을 지원하지 않아서 적용하는데 실패했습니다. 



### Base32 인코딩(비밀키 생성)

아래는 비밀키를 생성한 예인데 생성한 비밀키를 사용자 DB 에 저장합니다. 

```php
<?php
include_once('./otphp/lib/otphp.php'); # php 라이브러리 include
...
$Base32 = new Base32(); # class 객체 생성
$mb_id_long = str_pad($mb_id, 30 , "$#%"); 
# 사용자별로 고유한 아이디의 오른쪽에 $#% 를 덪붙혀서 30자를 생성 - 각자 만들고 싶은대로... 
$encoded = $Base32->encode($mb_id_long); # $mb_id_long 를 base32 로 인코딩 하여 $encoded 에 저장
?>
```



### QR Code image print

```php+HTML
<img id="qrImg" style="margin:0 auto;" src="https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=100x100&chld=M|0&cht=qr&chl=otpauth://totp/Pinnacle (<?=$mb_id?>)%3Fsecret%3D<?=$encoded?>" />
```

위와 같은 태그로 google api 의 도움을 받아 QR Code 이미지를 생성하여 사용자가 인증앱에 키를 쉽게 등록하도록 합니다. chart.googleapis.com 에 접근이 불가능한 네트워크 환경(폐쇄망) 에서는 QR code 를 사용자에게 제공할 수 없습니다. 아래는 이미지 예시입니다. 파라미터를 변경하여 크기등을 조작할 수 있습니다. 

![테스트 QR Code](https://chart.googleapis.com/chart?chs=100x100&cht=qr&chl=100x100&chld=M|0&cht=qr&chl=otpauth://totp/테스트%3Fsecret%3)

### OTP 인증번호 생성 및 비교

```php
<?php
include_once('./otphp/lib/otphp.php'); # php 라이브러리 include
...
$totp = new \OTPHP\TOTP($encoded); // $encoded를 매개변수로 사용하여 TOTP class 객체 생성
$auth_code_now = $totp->now(); // 현재 시점의 인증번호(30초마다 바뀜)

$auth_code = $_POST['auth_code']; // 사용자가 입력한 인증번호

if($auth_code_now != $auth_code){
	echo("인증번호 불일치");
	exit;
}
?>
```

위의 코드는 OTP 인증번호 생성 및 비교하는 코드입니다. 인증번호는 4~5 line 에서 생성됩니다. 



OTP javascript Test - https://keehyun2.github.io/

