import { Router, Request, Response } from 'express';
import { execFile } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
});

const router = Router();

const users = [
  { id: 1, username: 'test_user', email: 'test@example.com' },
  { id: 2, username: 'john_doe', email: 'john@example.com' },
  { id: 3, username: 'jane_smith', email: 'jane@example.com' },
];

// 修正1: パラメータ化クエリ（実際のDB使用時はプレースホルダを使う）
router.get('/search', (req: Request, res: Response) => {
  const username = req.query.username;
  if (typeof username !== 'string' || !/^[a-zA-Z0-9_]+$/.test(username)) {
    res.status(400).json({ error: 'Invalid username' });
    return;
  }
  const result = users.filter((u) => u.username.includes(username));
  if (result.length === 0) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  res.json(result);
});

// 修正2: execFileで引数を分離し、入力をバリデーション + レートリミット
router.get('/ping', limiter, (req: Request, res: Response) => {
  const host = req.query.host as string;
  if (typeof host !== 'string' || !/^[a-zA-Z0-9.-]+$/.test(host)) {
    res.status(400).json({ error: 'Invalid host' });
    return;
  }
  execFile('ping', ['-c', '1', host], (error, stdout) => {
    res.json({ result: stdout });
  });
});

// 修正3: ファイル名を正規化し、ディレクトリトラバーサルを防止 + レートリミット
router.get('/file', limiter, (req: Request, res: Response) => {
  const filename = req.query.name as string;
  if (typeof filename !== 'string' || /[/\\]/.test(filename)) {
    res.status(400).json({ error: 'Invalid filename' });
    return;
  }
  const basePath = path.join(__dirname, '..', '..', 'data');
  const filePath = path.join(basePath, path.basename(filename));
  if (!filePath.startsWith(basePath)) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    res.json({ content });
  } catch {
    res.status(404).json({ error: 'File not found' });
  }
});

// 修正4: HTMLエスケープ処理
router.get('/greet', (req: Request, res: Response) => {
  const name = req.query.name;
  if (typeof name !== 'string') {
    res.status(400).json({ error: 'Invalid name' });
    return;
  }
  const escaped = name.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c)
  );
  res.send(`<h1>Hello, ${escaped}!</h1>`);
});

export default router;
