#!/bin/bash

# Discord 메시지 전송 시스템 설정

echo "🚀 Discord 메시지 전송 시스템 설정 중..."

# alias 추가
ALIAS_LINE="alias send-discord='node $(pwd)/scripts/send-discord.js'"

# .zshrc에 alias 추가 (중복 방지)
if ! grep -q "send-discord" ~/.zshrc; then
    echo "" >> ~/.zshrc
    echo "# Discord 메시지 전송 alias" >> ~/.zshrc
    echo "$ALIAS_LINE" >> ~/.zshrc
    echo "✅ ~/.zshrc에 alias 추가 완료"
else
    echo "⚠️  이미 send-discord alias가 존재합니다"
fi

# .bashrc에도 추가 (있다면)
if [[ -f ~/.bashrc ]]; then
    if ! grep -q "send-discord" ~/.bashrc; then
        echo "" >> ~/.bashrc
        echo "# Discord 메시지 전송 alias" >> ~/.bashrc
        echo "$ALIAS_LINE" >> ~/.bashrc
        echo "✅ ~/.bashrc에 alias 추가 완료"
    fi
fi

echo ""
echo "📋 설정 완료! 사용법:"
echo "1. 디스코드 웹훅 URL을 환경변수로 설정:"
echo "   export DISCORD_WEBHOOK_URL='https://discord.com/api/webhooks/YOUR_WEBHOOK_URL'"
echo ""
echo "2. 터미널 재시작 또는 source ~/.zshrc 실행"
echo ""
echo "3. 사용 예시:"
echo "   send-discord '백엔드팀' 'API CORS 설정 필요: dv.cchaksa.com 도메인 허용 부탁드립니다'"
echo "   send-discord '프론트팀' '환경별 URL 자동 감지 로직 완성. 테스트 부탁드려요'"
echo ""
echo "🎉 설정 완료!"