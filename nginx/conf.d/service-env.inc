# ========================================
# Blue-Green 스위칭 설정
# ========================================
# Blue 활성화: set $service_url blue;
# Green 활성화: set $service_url green;
#
# 변경 후 Nginx 리로드:
# docker exec travel-nginx nginx -s reload

set $service_url blue;
