import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

const tables = [1, 2, 3];
const baseUrl = window.location.origin;

function QRCodeGenerator() {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>QR Codes das Mesas</Typography>
      <Typography variant="body1" gutterBottom color="textSecondary">
        Imprima estes QR codes e coloque-os nas mesas correspondentes. Os clientes poderão escanear para acessar o cardápio.
      </Typography>
      <Grid container spacing={3}>
        {tables.map((table) => (
          <Grid item xs={12} sm={6} md={4} key={table}>
            <Card>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Mesa {table}</Typography>
                <Box sx={{ mb: 2 }}>
                  <QRCodeSVG
                    value={`${baseUrl}/cardapio/${table}`}
                    size={200}
                    level="H"
                    includeMargin
                  />
                </Box>
                <Typography variant="body2" color="textSecondary">
                  Escaneie para acessar o cardápio
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default QRCodeGenerator;