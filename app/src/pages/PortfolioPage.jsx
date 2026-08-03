function PortfolioPage({}) {
  return (
    <>
      <h2>포트폴리오 상세</h2>
      <section>
        <h3>Project Title</h3>
        <a href="">수정하기</a>
        <div>
          <p>
            작성일: <time></time>
          </p>
          <p>
            <time>2026/04/07</time> ~ <time>2026/08/21</time>
          </p>
        </div>
        <div>
          <div>
            <img src="" alt="author" />
            <p>author</p>
          </div>
          <div>65535</div>
          <div>1972</div>
          <div>북마크</div>
        </div>
        <ul>
          <li>
            카테고리
            <ul></ul>
          </li>
          <li>
            기술 스택
            <ul></ul>
          </li>
          <li>배포 링크</li>
          <li>Repo 주소</li>
          <li>담당 역할</li>
          <li>프로젝트 형태</li>
        </ul>
        <div>
          <h4>AI 요약 미리보기</h4>
          <p></p>
          <a href="">전체 AI 분석 보기</a>
        </div>
      </section>
      <section>
        <h3>프로젝트 설명</h3>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit.</div>
      </section>
      <section>
        <h3>AI 분석결과</h3>
        <p>AI로 생성된 내용입니다.</p>
        <div>
          <ul>
            <li>프로젝트 요약</li>
            <li>주요 기능</li>
            <li>기술적 특징</li>
            <li>프로젝트 구조 및 복잡도</li>
            <li>담당 역할</li>
            <li>참여 내역</li>
          </ul>
        </div>
      </section>
      <section>
        <h3>작성자 정보</h3>
        <div>
          <h4>author</h4>
          <p>Frontend Developer</p>
          <a href="">View Profile</a>
          <ul>
            <li>Email</li>
            <li>GitHub</li>
            <li>Linkedin</li>
          </ul>
        </div>
        <div>
          <h4>author의 다른 프로젝트</h4>
          <a href="">View all 4</a>
          <article></article>
          <article></article>
        </div>
      </section>
    </>
  );
}

export default PortfolioPage;
