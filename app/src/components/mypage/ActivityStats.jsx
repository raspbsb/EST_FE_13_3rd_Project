import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Text from '@mui/material/Typography';

export default function ActivityStats({ mode, profile }) {
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
    <Box sx={{ pt: 6 }}>
      <Grid
        container
        spacing={3}
        sx={{ justifyContent: 'space-around', bgcolor: 'text.primary', borderRadius: 3, py: 3 }}
      >
        {stats.map(item => (
          <Grid
            key={item.idx}
            sx={{
              color: 'background.default',
            }}
          >
            <Text component="h3" variant="h6">
              {item.title}
            </Text>
            <Box sx={{ display: 'flex', alignItems: 'baseline' }}>
              <Text component="span" variant="h4">
                {item.count}
              </Text>
              <Text component="span" variant="h5">
                개
              </Text>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
