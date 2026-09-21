#!/usr/bin/env python3
"""TLS application hub for LifeOS, PaperRec, and shared research projects."""

import asyncio
import ssl
from pathlib import Path

LISTEN_HOST = "0.0.0.0"
LISTEN_PORT = 9003
CERT_FILE = "/root/paperrec-tls.crt"
KEY_FILE = "/root/paperrec-tls.key"
PID_FILE = Path("/root/lifehub_proxy.pid")
ROUTES = {
    "/paperrec": ("127.0.0.1", 19103, True),
    "/lifeos": ("127.0.0.1", 19104, False),
    "/50example": ("127.0.0.1", 19005, False),
    "/projects": ("127.0.0.1", 19006, False),
}

PORTAL = """<!doctype html><html lang=zh-CN><meta charset=utf-8><meta name=viewport content='width=device-width,initial-scale=1'><title>Life Hub</title><style>
*{box-sizing:border-box}body{margin:0;min-height:100vh;background:#0d1713;color:#ecf5f0;font:16px system-ui,-apple-system,'PingFang SC',sans-serif}main{width:min(1180px,calc(100% - 32px));margin:auto;padding:64px 0}.over{color:#78aa94;font-size:13px;letter-spacing:.16em;text-transform:uppercase}h1{font-size:clamp(34px,7vw,68px);margin:10px 0 8px;letter-spacing:-.05em}header p{color:#91a79d;margin:0 0 42px}.tabs{display:grid;grid-template-columns:repeat(5,1fr);gap:14px}.tab{min-height:190px;display:flex;flex-direction:column;padding:22px;border:1px solid #294137;border-radius:20px;background:#13231c;color:inherit;text-decoration:none;transition:.18s}.tab:hover{transform:translateY(-3px);border-color:#4c7f69;background:#172c23}.tab i{width:38px;height:38px;display:grid;place-items:center;border-radius:12px;background:#214333;color:#91d1b3;font-style:normal;font-weight:800}.tab h2{margin:28px 0 5px;font-size:20px}.tab p{margin:0;color:#82998f;font-size:13px;line-height:1.5}.tab b{margin-top:auto;color:#78aa94;font-size:12px}.soon{opacity:.5;cursor:default}.soon:hover{transform:none;border-color:#294137;background:#13231c}@media(max-width:860px){main{padding-top:36px}.tabs{grid-template-columns:1fr 1fr}.tab{min-height:160px}}@media(max-width:440px){.tabs{grid-template-columns:1fr}}
</style><main><header><span class=over>Personal workspace</span><h1>Life Hub</h1><p>选择要进入的空间。</p></header><nav class=tabs><a class=tab href=/lifeos/><i>L</i><h2>LifeOS</h2><p>目标、计划、习惯与每日复盘。</p><b>打开 →</b></a><a class=tab href=/paperrec/><i>P</i><h2>PaperRec</h2><p>论文推荐、阅读与研究资料库。</p><b>打开 →</b></a><a class=tab href=/projects/economic-systems-toy/><i>E</i><h2>Economic Toy Lab</h2><p>LLM 经济制度模拟研究协作台。</p><b>打开 →</b></a><div class='tab soon'><i>G</i><h2>Game</h2><p>数值成长与奖励系统。</p><b>待建设</b></div><div class='tab soon'><i>N</i><h2>Novel</h2><p>小说阅读与创作空间。</p><b>待建设</b></div></nav></main></html>""".encode()


async def pipe(reader: asyncio.StreamReader, writer: asyncio.StreamWriter) -> None:
    while data := await reader.read(64 * 1024):
        writer.write(data)
        await writer.drain()


def response(status: str, body: bytes, content_type: str = "text/plain; charset=utf-8", extra: bytes = b"") -> bytes:
    return (f"HTTP/1.1 {status}\r\nContent-Type: {content_type}\r\nContent-Length: {len(body)}\r\nConnection: close\r\n".encode() + extra + b"\r\n" + body)


async def handle(client_reader: asyncio.StreamReader, client_writer: asyncio.StreamWriter) -> None:
    try:
        header = await client_reader.readuntil(b"\r\n\r\n")
        lines = header.split(b"\r\n")
        method, target, version = lines[0].decode("latin-1").split(" ", 2)
    except (asyncio.IncompleteReadError, asyncio.LimitOverrunError, ValueError):
        client_writer.close(); return
    path = target.split("?", 1)[0]
    if path == "/":
        client_writer.write(response("200 OK", PORTAL, "text/html; charset=utf-8")); await client_writer.drain(); client_writer.close(); return
    route = next(((prefix, spec) for prefix, spec in ROUTES.items() if path == prefix or path.startswith(prefix + "/")), None)
    if route is None:
        client_writer.write(response("404 Not Found", b"Not Found")); await client_writer.drain(); client_writer.close(); return
    prefix, (host, port, strip_prefix) = route
    if path == prefix:
        client_writer.write(response("308 Permanent Redirect", b"", extra=f"Location: {prefix}/\r\n".encode())); await client_writer.drain(); client_writer.close(); return
    forwarded_target = target[len(prefix):] if strip_prefix else target
    forwarded = [f"{method} {forwarded_target} {version}".encode("latin-1")]
    forwarded.extend(line for line in lines[1:] if not line.lower().startswith(b"connection:"))
    forwarded.insert(-2 if forwarded[-2:] == [b"", b""] else len(forwarded), b"Connection: close")
    try:
        upstream_reader, upstream_writer = await asyncio.open_connection(host, port)
    except OSError:
        client_writer.write(response("503 Service Unavailable", b"Application is unavailable")); await client_writer.drain(); client_writer.close(); return
    upstream_writer.write(b"\r\n".join(forwarded)); await upstream_writer.drain()
    upload = asyncio.create_task(pipe(client_reader, upstream_writer))
    try: await pipe(upstream_reader, client_writer)
    finally: upload.cancel(); upstream_writer.close(); client_writer.close()


async def main() -> None:
    PID_FILE.write_text(str(__import__("os").getpid()), encoding="ascii")
    tls = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER); tls.minimum_version = ssl.TLSVersion.TLSv1_2; tls.load_cert_chain(CERT_FILE, KEY_FILE)
    server = await asyncio.start_server(handle, LISTEN_HOST, LISTEN_PORT, ssl=tls)
    try:
        async with server: await server.serve_forever()
    finally: PID_FILE.unlink(missing_ok=True)


if __name__ == "__main__": asyncio.run(main())
