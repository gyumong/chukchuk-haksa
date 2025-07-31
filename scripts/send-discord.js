#!/usr/bin/env node

const https = require('https');
const url = require('url');

// 디스코드 웹훅 URL (환경변수에서 가져오기)
const WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

if (!WEBHOOK_URL) {
  console.error('❌ DISCORD_WEBHOOK_URL 환경변수가 설정되지 않았습니다.');
  console.error('사용법: export DISCORD_WEBHOOK_URL="your_webhook_url"');
  process.exit(1);
}

const [, , team, ...messageParts] = process.argv;
const message = messageParts.join(' ');

if (!team || !message) {
  console.error('사용법: send-discord "팀명" "메시지 내용"');
  console.error('예시: send-discord "백엔드팀" "API 엔드포인트 CORS 설정 필요"');
  process.exit(1);
}

// 팀별 멘션 설정
const teamMentions = {
  '백엔드': '<@&BACKEND_ROLE_ID>',
  '백엔드팀': '<@&BACKEND_ROLE_ID>',
  '프론트': '<@&FRONTEND_ROLE_ID>',
  '프론트팀': '<@&FRONTEND_ROLE_ID>',
  '디자인': '<@&DESIGN_ROLE_ID>',
  '디자인팀': '<@&DESIGN_ROLE_ID>',
  '전체': '@everyone'
};

const mention = teamMentions[team] || '';
const timestamp = new Date().toLocaleString('ko-KR');

const payload = {
  embeds: [{
    title: `🔔 ${team} 요청사항`,
    description: message,
    color: 0x5865F2, // 디스코드 블루
    footer: {
      text: `작업자: ${process.env.USER || 'Claude Code User'} | ${timestamp}`
    },
    fields: [
      {
        name: '📝 상세 내용',
        value: message,
        inline: false
      }
    ]
  }],
  content: mention ? `${mention} 새로운 요청사항이 있습니다!` : undefined
};

const parsedUrl = url.parse(WEBHOOK_URL);
const postData = JSON.stringify(payload);

const options = {
  hostname: parsedUrl.hostname,
  port: 443,
  path: parsedUrl.path,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  if (res.statusCode === 204) {
    console.log('✅ 디스코드 메시지 전송 완료!');
  } else {
    console.error(`❌ 전송 실패: HTTP ${res.statusCode}`);
  }
});

req.on('error', (error) => {
  console.error('❌ 네트워크 오류:', error.message);
});

req.write(postData);
req.end();