import { Router, Request, Response } from 'express';
import { execFile } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const router = Router();

// 修正1: パラメータ化クエリ（実際のDB使用時はプレースホルダを使う）
router.get('/search', (req: Request, res: Response) => {
  const username = req.query.username;
  if (typeof username !== 'string' || !/^[a-zA-Z0-9_]+$/.test(username)) {
    res.status(400).json({ error: 'Invalid username' });
    return;
  }
  res.json({ username });
});

// 修正2: execFileで引数を分離し、入力をバリデーション
router.get('/ping', (req: Request, res: Response) => {
  const host = req.query.host as string;
  if (typeof host !== 'string' || !/^[a-zA-Z0-9.\-]+$/.test(host)) {
    res.status(400).json({ error: 'Invalid host' });
    return;
  }
  execFile('ping', ['-c', '1', host], (error, stdout) => {
    res.json({ result: stdout });
  });
});

// 修正3: ファイル名を正規化し、ディレクトリトラバーサルを防止
router.get('/file', (req: Request, res: Response) => {
  const filename = req.query.name as string;
  if (typeof filename !== 'string' || /[/\\]/.test(filename)) {
    res.status(400).json({ error: 'Invalid filename' });
    return;
  }
  const basePath = '/data';
  const filePath = path.join(basePath, path.basename(filename));
  if (!filePath.startsWith(basePath)) {
    res.status(403).json({ error: 'Access denied' });
    return;
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  res.json({ content });
});

// 修正4: テキストレスポンスでエスケープ処理
router.get('/greet', (req: Request, res: Response) => {
  const name = req.query.name;
  if (typeof name !== 'string') {
    res.status(400).json({ error: 'Invalid name' });
    return;
  }
  res.type('text').send(`Hello, ${name}!`);
});

export default router;
