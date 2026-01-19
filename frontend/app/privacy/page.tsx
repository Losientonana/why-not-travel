export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              개인정보처리방침
            </h1>
            <p className="text-sm text-gray-500">최종 업데이트: 2026년 1월 18일</p>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <p className="text-gray-700 leading-relaxed mb-4">
                TravelMate(이하 "회사")는 이용자의 개인정보를 중요시하며, 「개인정보 보호법」,
                「정보통신망 이용촉진 및 정보보호 등에 관한 법률」 등 관련 법령을 준수하고 있습니다.
                회사는 개인정보처리방침을 통하여 이용자가 제공하는 개인정보가 어떠한 용도와 방식으로
                이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. 수집하는 개인정보의 항목</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                회사는 회원가입, 원활한 고객상담, 각종 서비스 제공을 위해 최초 회원가입 시 아래와 같은
                개인정보를 수집하고 있습니다.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">필수 수집 항목</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>이메일 주소</li>
                    <li>이름 (닉네임)</li>
                    <li>비밀번호 (암호화하여 저장)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">선택 수집 항목</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>프로필 사진</li>
                    <li>전화번호</li>
                    <li>생년월일</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">서비스 이용 과정에서 자동 수집되는 정보</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>IP 주소, 쿠키, 방문 일시</li>
                    <li>서비스 이용 기록, 불량 이용 기록</li>
                    <li>기기 정보 (OS, 브라우저 버전 등)</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. 개인정보의 수집 및 이용목적</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                회사는 수집한 개인정보를 다음의 목적을 위해 활용합니다.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">서비스 제공에 관한 계약 이행</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>여행 계획 및 일정 관리 서비스 제공</li>
                    <li>경비 기록 및 정산 서비스 제공</li>
                    <li>사진 및 콘텐츠 저장 및 공유</li>
                    <li>고객 문의 및 불만 처리</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">회원 관리</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>회원제 서비스 이용에 따른 본인확인</li>
                    <li>개인 식별, 불량회원의 부정 이용 방지</li>
                    <li>가입 의사 확인, 연령확인</li>
                    <li>분쟁 조정을 위한 기록보존</li>
                    <li>불만처리 등 민원처리</li>
                    <li>공지사항 전달</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">신규 서비스 개발 및 마케팅</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>신규 서비스 개발 및 맞춤 서비스 제공</li>
                    <li>이벤트 및 광고성 정보 제공</li>
                    <li>서비스의 유효성 확인</li>
                    <li>접속빈도 파악, 회원의 서비스 이용에 대한 통계</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. 개인정보의 보유 및 이용기간</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                회사는 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
                단, 관계법령의 규정에 의하여 보존할 필요가 있는 경우 회사는 아래와 같이 관계법령에서
                정한 일정한 기간 동안 회원정보를 보관합니다.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900">보존 항목 및 기간</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1 mt-2">
                    <li>계약 또는 청약철회 등에 관한 기록: 5년</li>
                    <li>대금결제 및 재화 등의 공급에 관한 기록: 5년</li>
                    <li>소비자의 불만 또는 분쟁처리에 관한 기록: 3년</li>
                    <li>웹사이트 방문기록: 3개월</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. 개인정보의 파기절차 및 방법</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체없이
                파기합니다. 파기절차 및 방법은 다음과 같습니다.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">파기절차</h3>
                  <p className="text-gray-700 leading-relaxed">
                    이용자가 회원가입 등을 위해 입력한 정보는 목적이 달성된 후 별도의 DB로 옮겨져
                    내부 방침 및 기타 관련 법령에 의한 정보보호 사유에 따라(보유 및 이용기간 참조)
                    일정 기간 저장된 후 파기됩니다.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">파기방법</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다.</li>
                    <li>종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. 개인정보의 제3자 제공</h2>
              <p className="text-gray-700 leading-relaxed">
                회사는 이용자의 개인정보를 "개인정보의 수집 및 이용목적"에서 고지한 범위 내에서
                사용하며, 이용자의 사전 동의 없이는 동 범위를 초과하여 이용하거나 원칙적으로 이용자의
                개인정보를 외부에 공개하지 않습니다. 다만, 아래의 경우에는 예외로 합니다:
              </p>
              <ul className="list-disc list-inside text-gray-700 ml-4 space-y-2 mt-3">
                <li>이용자들이 사전에 공개에 동의한 경우</li>
                <li>법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. 개인정보의 처리 위탁</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                회사는 서비스 향상을 위해서 아래와 같이 개인정보를 위탁하고 있으며, 관계 법령에 따라
                위탁계약 시 개인정보가 안전하게 관리될 수 있도록 필요한 사항을 규정하고 있습니다.
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <table className="w-full text-sm text-gray-700">
                  <thead className="border-b border-gray-300">
                    <tr>
                      <th className="text-left py-2 px-3 font-semibold">수탁업체</th>
                      <th className="text-left py-2 px-3 font-semibold">위탁업무 내용</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-3">AWS (Amazon Web Services)</td>
                      <td className="py-3 px-3">클라우드 서비스 제공</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-3 px-3">Twilio SendGrid</td>
                      <td className="py-3 px-3">이메일 발송 서비스</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. 이용자 및 법정대리인의 권리</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                이용자 및 법정대리인은 언제든지 등록되어 있는 자신 혹은 당해 만 14세 미만 아동의
                개인정보를 조회하거나 수정할 수 있으며 가입 해지를 요청할 수도 있습니다.
              </p>
              <p className="text-gray-700 leading-relaxed">
                개인정보 조회, 수정을 위해서는 '개인정보변경'(또는 '회원정보수정' 등)을,
                가입 해지(동의 철회)를 위해서는 "회원탈퇴"를 클릭하여 본인 확인 절차를 거치신 후
                직접 열람, 정정 또는 탈퇴가 가능합니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. 개인정보 보호를 위한 기술적/관리적 대책</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                회사는 이용자들의 개인정보를 처리함에 있어 개인정보가 분실, 도난, 누출, 변조 또는
                훼손되지 않도록 안전성 확보를 위하여 다음과 같은 기술적/관리적 대책을 강구하고 있습니다.
              </p>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">기술적 대책</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>비밀번호 암호화: 비밀번호는 암호화되어 저장 및 관리됩니다.</li>
                    <li>해킹 등에 대비한 대책: 백신프로그램을 이용하여 컴퓨터바이러스에 의한 피해를 방지하기 위한 조치</li>
                    <li>암호화 통신: 개인정보 전송 시 SSL/TLS 암호화 기술을 사용합니다.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">관리적 대책</h3>
                  <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1">
                    <li>개인정보에 대한 접근 권한을 최소한의 인원으로 제한</li>
                    <li>개인정보를 처리하는 직원에 대한 정기적인 교육 실시</li>
                    <li>개인정보보호 전담조직 운영</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. 개인정보 보호책임자 및 담당자</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                회사는 이용자의 개인정보를 보호하고 개인정보와 관련한 불만을 처리하기 위하여 아래와
                같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-2 text-gray-700">
                  <p><span className="font-semibold">개인정보 보호책임자:</span> 홍길동</p>
                  <p><span className="font-semibold">직책:</span> CTO</p>
                  <p><span className="font-semibold">이메일:</span> privacy@travelmate.com</p>
                  <p><span className="font-semibold">전화:</span> 1588-1234</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed mt-4">
                기타 개인정보침해에 대한 신고나 상담이 필요하신 경우에는 아래 기관에 문의하시기 바랍니다.
              </p>
              <ul className="list-disc list-inside text-gray-700 ml-4 space-y-1 mt-2">
                <li>개인정보침해신고센터 (privacy.kisa.or.kr / 국번없이 118)</li>
                <li>개인정보분쟁조정위원회 (www.kopico.go.kr / 1833-6972)</li>
                <li>대검찰청 사이버수사과 (www.spo.go.kr / 국번없이 1301)</li>
                <li>경찰청 사이버안전국 (cyberbureau.police.go.kr / 국번없이 182)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. 개인정보처리방침의 변경</h2>
              <p className="text-gray-700 leading-relaxed">
                이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가,
                삭제 및 정정이 있는 경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할
                것입니다.
              </p>
            </section>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">
                <strong>공고일자:</strong> 2026년 1월 18일
              </p>
              <p className="text-sm text-gray-500">
                <strong>시행일자:</strong> 2026년 1월 18일
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
