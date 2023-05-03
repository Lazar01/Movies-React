import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { useState} from 'react'
import Button from '@mui/material/Button';
import Add from '@mui/icons-material/Add'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'
import CheckIcon from '@mui/icons-material/Check';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';


function FormaFilmovi({addfilm,snimifilm}){
    var [naziv,setNaziv]=useState('')
    var [reziser,setReziser]=useState('')
    var [ocena,setOcena]=useState('')
    var [duzinaTrajanja,setDuzinaTrajanja]=useState('')
    var [triD,setTriD]=useState('')
    var [alert,setAlert]=useState({
      show:false
    })
    const handleChange = (event) => {
      setTriD(event.target.value);
    };
          
    return (
      <Box>
          {alert.show?<Alert icon={<CheckIcon fontSize="inherit" />} severity={alert.severity}>
            {alert.text}
          </Alert>:''}
          <Box
          component="form"
          sx={{
            '& > :not(style)': { m: 1, width: '25ch' },
          }}
          noValidate
          autoComplete="off"         
        >
          
          <Typography variant="body1" color="initial" style={{fontSize:3 + 'em',background:'black',color:'white',textAlign:'center',margin:'auto',width:100+'%'}}>Unesite film</Typography>
          <TextField id="outlined-basic" label="Naziv" variant="outlined" value={naziv} onChange={(e)=>{setNaziv(e.target.value)}} />
          <TextField id="outlined-basic" label="Reziser" variant="outlined" value={reziser} onChange={(e)=>{setReziser(e.target.value)}} />
          <TextField id="outlined-basic" label="Ocena" variant="outlined" value={ocena} onChange={(e)=>{parseInt(e.target.value)<=5?setOcena(e.target.value):setOcena("")}} />
          <TextField id="outlined-basic" label="Duzina Trajanja(u minutima)" variant="outlined" value={duzinaTrajanja} onChange={(e)=>{setDuzinaTrajanja(parseInt(e.target.value))}} />          
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">3D?</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={triD}
                label="triD"
                onChange={handleChange}
              >
                <MenuItem value={'Da'}>Da</MenuItem>
                <MenuItem value={'Ne'}>Ne</MenuItem>
              </Select>
            </FormControl>
        <Button variant="outlined" color='success'  startIcon={<Add />} onClick={()=>{
              addfilm({
                  naziv:naziv,
                  reziser:reziser,
                  ocena:ocena,
                  duzinaTrajanja:duzinaTrajanja,
                  triD:triD,
              })
              setAlert({
                show:true,
                text:'Uspesno dodan novi film',
                severity:'success'
              })
              setTimeout(()=>{
                setAlert({
                  show:false
                })
              },2000)
              setNaziv("");
              setReziser("");
              setOcena("");
              setDuzinaTrajanja("");
              setTriD("");
          }} ></Button>
        </Box>
      </Box>
    )
}

export default FormaFilmovi