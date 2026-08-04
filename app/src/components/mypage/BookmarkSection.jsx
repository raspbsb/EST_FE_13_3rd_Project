import { NavLink } from 'react-router-dom';
import BookmarkCard from './BookmarkCard';

export default function BookmarkSection() {
  const collections = [
    {
      title: 'Collection title',
      total: 10,
    },
    {
      title: 'Collection title',
      total: 10,
    },
    {
      title: 'Collection title',
      total: 10,
    },
  ];
  return (
    <section>
      <div>
        <h2>북마크</h2>
        <nav>
          <NavLink to=''>View all</NavLink>
        </nav>
      </div>
      <div>
        {collections.map(c => (
          <BookmarkCard key={c.title} title={c.title} total={c.total} />
        ))}
      </div>
    </section>
  );
}
