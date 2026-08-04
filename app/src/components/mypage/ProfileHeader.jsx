import EditIcon from '@mui/icons-material/Edit';

export default function ProfileHeader({ mode }) {
  return (
    <section>
      <div>{/* <img src='' alt='' /> */}</div>

      <div>
        <div>
          <h1>User Name</h1>
          {mode === 'mypage' && (
            <button>
              <EditIcon />
            </button>
          )}
        </div>
        <p>Frontend Developer</p>
        <p>
          Crafting highly performant, accessible, and delightful web experiences. Specializing in modern React
          ecosystems and scalable design systems for creative professionals.
        </p>
        <div className='stack'>
          <p>React</p>
          <p>Tailwind</p>
          <p>Next.js</p>
        </div>
      </div>
    </section>
  );
}
