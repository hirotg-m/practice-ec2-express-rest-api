# API テストガイド（curl）

開発サーバー起動後、各 API エンドポイントを curl で確認する方法をまとめます。

```bash
npm run dev
```

## ベース URL

```
http://localhost:3000
```

## エンドポイント一覧

### GET /

ルート情報を返します。

```bash
curl -s -w '\nHTTP Status: %{http_code}\n' http://localhost:3000/
```

期待されるレスポンス：

```
{"message":"EC2 Express REST API Server","version":"1.0.0"}
HTTP Status: 200
```

### GET /health

ヘルスチェック用エンドポイントです。

```bash
curl -s -w '\nHTTP Status: %{http_code}\n' http://localhost:3000/health
```

期待されるレスポンス：

```
{"status":"ok","timestamp":"2026-05-30T12:34:56.789Z"}
HTTP Status: 200
```

### GET /users/search

ユーザー名で検索します。英数字とアンダースコアのみ有効です。

```bash
# 正常系
# test_user で検索
curl -s -w '\nHTTP Status: %{http_code}\n' 'http://localhost:3000/users/search?username=test_user'

# john で検索
curl -s -w '\nHTTP Status: %{http_code}\n' 'http://localhost:3000/users/search?username=john'

# jane で検索
curl -s -w '\nHTTP Status: %{http_code}\n' 'http://localhost:3000/users/search?username=jane'


# 異常系（不正な文字を含む）
curl -s -w '\nHTTP Status: %{http_code}\n' 'http://localhost:3000/users/search?username=<invalid>'
```

期待されるレスポンス（正常系）：

```
{"username":"test_user"}
HTTP Status: 200
```

期待されるレスポンス（異常系）：

```
{"error":"Invalid username"}
HTTP Status: 400
```

### GET /users/ping

指定したホストに ping を実行します。レートリミット（60秒間に10回）が適用されます。

```bash
# 正常系
curl -s -w '\nHTTP Status: %{http_code}\n' 'http://localhost:3000/users/ping?host=localhost'

# 異常系（不正なホスト名）
curl -s -w '\nHTTP Status: %{http_code}\n' 'http://localhost:3000/users/ping?host=;rm+-rf+/'
```

期待されるレスポンス（正常系）：

```
{"result":"PING localhost ..."}
HTTP Status: 200
```

期待されるレスポンス（異常系）：

```
{"error":"Invalid host"}
HTTP Status: 400
```

### GET /users/file

指定したファイル名の内容を返します。ディレクトリトラバーサル防止済み。レートリミット適用。

```bash
# 正常系（/data ディレクトリに sample.txt が存在する場合）
curl -s -w '\nHTTP Status: %{http_code}\n' 'http://localhost:3000/users/file?name=sample.txt'

# 異常系（パス区切り文字を含む）
curl -s -w '\nHTTP Status: %{http_code}\n' 'http://localhost:3000/users/file?name=../etc/passwd'

# 異常系（ファイルが存在しない）
curl -s -w '\nHTTP Status: %{http_code}\n' 'http://localhost:3000/users/file?name=nonexistent.txt'
```

期待されるレスポンス（パス区切り文字）：

```
{"error":"Invalid filename"}
HTTP Status: 400
```

期待されるレスポンス（ファイル未存在）：

```
{"error":"File not found"}
HTTP Status: 404
```

### GET /users/greet

名前を指定して挨拶メッセージ（HTML）を返します。XSS 対策としてエスケープ処理済み。

```bash
# 正常系
curl -s -w '\nHTTP Status: %{http_code}\n' 'http://localhost:3000/users/greet?name=World'

# XSS 試行（エスケープされる）
curl -s -w '\nHTTP Status: %{http_code}\n' 'http://localhost:3000/users/greet?name=<script>alert(1)</script>'
```

期待されるレスポンス（正常系）：

```
<h1>Hello, World!</h1>
HTTP Status: 200
```

期待されるレスポンス（XSS 試行）：

```
<h1>Hello, &lt;script&gt;alert(1)&lt;/script&gt;!</h1>
HTTP Status: 200
```

### 存在しないパス（404）

```bash
curl -s -w '\nHTTP Status: %{http_code}\n' http://localhost:3000/unknown
```

期待されるレスポンス：

```
{"error":"Not Found","path":"/unknown","method":"GET"}
HTTP Status: 404
```
