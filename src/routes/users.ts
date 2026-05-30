import { Router, Request, Response } from 'express';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

// 脆弱性1: SQLインジェクション（ユーザー入力を直接クエリに埋め込み）
router.get('/search', (req: Request, res: Response) => {
  const username = req.query.username;
  const query = `SELECT * FROM users WHERE name = '${username}'`;
  res.json({ query });
});

// 脆弱性2: コマンドインジェクション（ユーザー入力をシェルコマンドに渡す）
router.get('/ping', (req: Request, res: Response) => {
  const host = req.query.host as string;
  exec(`ping -c 1 ${host}`, (error, stdout) => {
    res.json({ result: stdout });
  });
});

// 脆弱性3: パストラバーサル（ユーザー入力でファイルパスを構築）
router.get('/file', (req: Request, res: Response) => {
  const filename = req.query.name as string;
  const filePath = path.join('/data', filename);
  const content = fs.readFileSync(filePath, 'utf-8');
  res.json({ content });
});

// 脆弱性4: XSS（レスポンスにユーザー入力をそのまま反映）
router.get('/greet', (req: Request, res: Response) => {
  const name = req.query.name;
  res.send(`<h1>Hello, ${name}!</h1>`);
});

export default router;
