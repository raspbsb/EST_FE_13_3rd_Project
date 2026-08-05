import theme from '../../styles/theme';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Text from '@mui/material/Typography';

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
    <Grid container spacing={3} sx={{ justifyContent: 'center', bgcolor: '#000', borderRadius: 3, py: 3 }}>
      {stats.map(item => (
        <Grid key={item.idx}>
          <Text variant='h6'>{item.title}</Text>
          <Box sx={{ display: 'flex' }}>
            <Text variant='h4'>{item.count}</Text>
            <Text variant='h5'>개</Text>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
// <section>
//   {stats.map(stat => (
//     <div className='' key={stat.title}>
//       <h3>{stat.title}</h3>

//       <p>{stat.count}</p>
//     </div>
//   ))}
// </section>
//   );
// }
