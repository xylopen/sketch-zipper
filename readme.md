## Install
```
npm install sketch-zipper -g
```
전역에 설치해서 사용합니다.


## Usage

```
$ sketch -u ./file-name-path.sketch
or
$ sketch --unzip ./file-name-path.sketch

```
스케치 파일과 같은 경로에 `file-name`의 폴더가 생성되며, 폴더 하위에 압축이 풀린 스케치 내부파일이 생성됩니다.

```
$ sketch -z ./directory-path
or
$ sketch --zip ./directory-path

```
입력한 경로의 폴더 내부에 있는 스케치 내부 파일을 담은 `directory-name.sketch` 스케치 파일이 생성됩니다.


## License
MIT