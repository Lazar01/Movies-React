import Grid from '@mui/material/Grid';
import Tabela from '../components/TabelaFilmovi'

function Filmovi({inicijalnoStanje}){
    return (
        <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={12} md={12} lg={12}>
            <Tabela tableName='Filmovi' inicijalnoStanje={inicijalnoStanje} ></Tabela>
          </Grid>
        </Grid>
    )
}

export default Filmovi