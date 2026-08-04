export default function ActivityStats() {
  const stats = [
    {
      title: '프로젝트',
      count: 3,
    },
    {
      title: '받은 관심',
      count: 3,
    },
    {
      title: '받은 연락',
      count: 3,
    },
    {
      title: '조회수',
      count: 3,
    },
  ];
  return (
    <section>
      {stats.map(stat => (
        <div className='' key={stat.title}>
          <h3>{stat.title}</h3>

          <p>{stat.count}</p>
        </div>
      ))}
    </section>
  );
}
