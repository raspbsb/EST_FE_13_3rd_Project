import { NavLink } from "react-router-dom";

export default function MyProjects() {
  return (
    <section>
      <div>
        <h2>내 프로젝트</h2>
        <nav>
          <NavLink to="">View all</NavLink>
        </nav>
      </div>
      <div>
        <p>프로젝트 카드 영역</p>
      </div>
    </section>
  );
}
