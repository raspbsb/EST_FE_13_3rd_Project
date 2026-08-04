import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function BookmarkCard({ title, total }) {
  return (
    <article>
      <div>{/* <img src='' alt='' /> */}</div>
      <div>
        <h3>{title}</h3>
        <p>{total}</p>
      </div>
      <button>
        <ChevronRightIcon />
      </button>
    </article>
  );
}
