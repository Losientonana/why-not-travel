export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 md:p-12">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">이용약관</h1>
            <p className="text-sm text-gray-500">최종 업데이트: 2026년 1월 18일</p>
          </div>

          {/* Content */}
          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제1조 (목적)</h2>
              <p className="text-gray-700 leading-relaxed">
                본 약관은 TravelMate(이하 "회사")가 제공하는 여행 계획 및 관리 서비스(이하 "서비스")의
                이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을
                목적으로 합니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제2조 (정의)</h2>
              <div className="space-y-3">
                <p className="text-gray-700 leading-relaxed">
                  본 약관에서 사용하는 용어의 정의는 다음과 같습니다:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                  <li>
                    "서비스"라 함은 회사가 제공하는 여행 계획, 일정 관리, 경비 정산, 사진 공유 등의 모든
                    기능을 의미합니다.
                  </li>
                  <li>
                    "회원"이라 함은 회사의 서비스에 접속하여 본 약관에 따라 회사와 이용계약을 체결하고
                    회사가 제공하는 서비스를 이용하는 고객을 말합니다.
                  </li>
                  <li>
                    "아이디(ID)"라 함은 회원의 식별과 서비스 이용을 위하여 회원이 정하고 회사가 승인하는
                    문자와 숫자의 조합을 의미합니다.
                  </li>
                  <li>
                    "비밀번호"라 함은 회원이 부여받은 아이디와 일치되는 회원임을 확인하고 비밀보호를
                    위해 회원 자신이 정한 문자 또는 숫자의 조합을 의미합니다.
                  </li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제3조 (약관의 게시와 개정)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>회사는 본 약관의 내용을 회원이 쉽게 알 수 있도록 서비스 초기 화면에 게시합니다.</li>
                <li>
                  회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 개정할 수 있으며, 개정된 약관은
                  시행일자 및 개정사유를 명시하여 현행약관과 함께 서비스 초기화면에 그 적용일자 7일
                  이전부터 적용일자 전일까지 공지합니다.
                </li>
                <li>
                  회원이 개정약관의 적용에 동의하지 않는 경우 회사는 개정 약관의 내용을 적용할 수
                  없으며, 이 경우 회원은 이용계약을 해지할 수 있습니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제4조 (서비스의 제공 및 변경)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>회사는 다음과 같은 업무를 수행합니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>여행 계획 및 일정 관리 서비스</li>
                    <li>여행 경비 기록 및 정산 서비스</li>
                    <li>사진 및 추억 공유 서비스</li>
                    <li>협업 및 커뮤니케이션 서비스</li>
                    <li>기타 회사가 추가 개발하거나 다른 회사와의 제휴계약 등을 통해 회원에게 제공하는 일체의 서비스</li>
                  </ul>
                </li>
                <li>
                  회사는 서비스의 내용, 품질, 기술적 사양의 변경이 필요한 경우 변경될 서비스의 내용 및
                  제공일자를 명시하여 현재의 서비스가 제공되는 화면에 즉시 게시합니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제5조 (서비스의 중단)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  회사는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신의 두절 등의 사유가 발생한
                  경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.
                </li>
                <li>
                  회사는 천재지변, 비상사태, 해결이 곤란한 기술적 결함 등으로 정상적인 서비스 제공이
                  불가능한 경우 서비스의 전부 또는 일부를 제한하거나 중지할 수 있습니다.
                </li>
                <li>
                  회사는 제1항 및 제2항의 사유로 서비스의 제공이 일시적으로 중단됨으로 인하여 이용자가
                  입은 손해에 대하여 책임을 지지 않습니다. 단, 회사에 고의 또는 중대한 과실이 있는 경우는
                  제외합니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제6조 (회원가입)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  회원가입은 이용자가 약관의 내용에 대하여 동의를 하고 회원가입신청을 한 후 회사가 이러한
                  신청에 대하여 승낙함으로써 체결됩니다.
                </li>
                <li>
                  회원가입을 희망하는 이용자는 회사가 정한 가입 양식에 따라 회원정보를 기입한 후
                  본 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.
                </li>
                <li>
                  회사는 제2항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지
                  않는 한 회원으로 등록합니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>가입신청자가 본 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                    <li>실명이 아니거나 타인의 명의를 이용한 경우</li>
                    <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                    <li>만 14세 미만 아동이 법정대리인의 동의를 얻지 아니한 경우</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제7조 (회원 탈퇴 및 자격 상실)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  회원은 회사에 언제든지 탈퇴를 요청할 수 있으며 회사는 즉시 회원탈퇴를 처리합니다.
                </li>
                <li>
                  회원이 다음 각 호의 사유에 해당하는 경우, 회사는 회원자격을 제한 및 정지시킬 수
                  있습니다:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>가입 신청 시에 허위 내용을 등록한 경우</li>
                    <li>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 전자상거래 질서를 위협하는 경우</li>
                    <li>서비스를 이용하여 법령 또는 본 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제8조 (회원에 대한 통지)</h2>
              <p className="text-gray-700 leading-relaxed">
                회사가 회원에 대한 통지를 하는 경우, 회원이 회사와 미리 약정하여 지정한 전자우편 주소로
                할 수 있습니다. 회사는 불특정다수 회원에 대한 통지의 경우 1주일 이상 서비스 공지사항에
                게시함으로써 개별 통지에 갈음할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제9조 (개인정보보호)</h2>
              <p className="text-gray-700 leading-relaxed">
                회사는 관계 법령이 정하는 바에 따라 회원의 개인정보를 보호하기 위해 노력합니다.
                개인정보의 보호 및 사용에 대해서는 관련법 및 회사의 개인정보처리방침이 적용됩니다.
                다만, 회사의 공식 사이트 이외의 링크된 사이트에서는 회사의 개인정보처리방침이 적용되지
                않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제10조 (책임의 한계)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  회사는 천재지변, 전쟁 및 기타 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는
                  경우에는 서비스 제공에 대한 책임이 면제됩니다.
                </li>
                <li>
                  회사는 기간통신 사업자가 전기통신 서비스를 중지하거나 정상적으로 제공하지 아니하여
                  손해가 발생한 경우 책임이 면제됩니다.
                </li>
                <li>
                  회사는 서비스용 설비의 보수, 교체, 정기점검, 공사 등 부득이한 사유로 발생한 손해에
                  대한 책임이 면제됩니다.
                </li>
                <li>
                  회사는 이용자의 귀책사유로 인한 서비스 이용의 장애 또는 손해에 대하여 책임을 지지
                  않습니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제11조 (분쟁해결)</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700 ml-4">
                <li>
                  회사는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여
                  피해보상처리기구를 설치·운영합니다.
                </li>
                <li>
                  회사와 이용자간에 발생한 분쟁은 전자문서 및 전자거래 기본법 제32조 및 동 시행령 제15조에
                  의하여 설치된 전자문서·전자거래분쟁조정위원회의 조정에 따를 수 있습니다.
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">제12조 (재판권 및 준거법)</h2>
              <p className="text-gray-700 leading-relaxed">
                본 약관에 명시되지 않은 사항은 전기통신사업법 등 대한민국의 관계법령과 상관습에 따릅니다.
                서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우 회사의 본사 소재지를 관할하는
                법원을 관할 법원으로 합니다.
              </p>
            </section>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                본 약관은 2026년 1월 18일부터 시행됩니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
