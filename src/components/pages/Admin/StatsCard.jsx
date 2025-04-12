import { Card, CardContent, Typography } from "@mui/material";

const StatsCard = ({ title, value }) => (
  <Card sx={{ minWidth: 200 }}>
    <CardContent>
      <Typography variant="h6" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </CardContent>
  </Card>
);

export default StatsCard;
