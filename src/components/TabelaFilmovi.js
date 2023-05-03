import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import { reducer } from '../Reducers';
import FormaFilmovi from './FormaFilmovi';
import { Card, CardContent, CardHeader } from '@mui/material/';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
// stableSort() brings sort stability to non-modern browsers (notably IE11). If you
// only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
// with exampleArray.slice().sort(exampleComparator)
function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'redni_broj',
    numeric: false,
    disablePadding: true,
    label: 'RB',
  },
  {
    id: 'naziv',
    numeric: false,
    disablePadding: true,
    label: 'Naziv',
  },
  {
    id: 'reziser',
    numeric: true,
    disablePadding: true,
    label: 'Reziser',
  },
  {
    id: 'ocena',
    numeric: false,
    disablePadding: true,
    label: 'Ocena',
  },
  {
    id: 'duzinaTrajanja',
    numeric: false,
    disablePadding: true,
    label: 'Duzina trajanja',
  },
  {
    id: 'triD',
    numeric: false,
    disablePadding: true,
    label: '3D',
  },
  
];

const DEFAULT_ORDER = 'asc';
const DEFAULT_ORDER_BY = 'redni_broj';
const DEFAULT_ROWS_PER_PAGE = 5;

function EnhancedTableHead(props) {
  const { order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (newOrderBy) => (event) => {
    onRequestSort(event, newOrderBy);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align='justify'
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected,tableName } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {tableName}
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};


export default function EnhancedTable(props) {
  const {tableName,inicijalnoStanje}=props
  const [data,dispatch]=React.useReducer(reducer,inicijalnoStanje)
  const [order, setOrder] = React.useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [visibleRows, setVisibleRows] = React.useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);
  const [paddingHeight, setPaddingHeight] = React.useState(0);
  var [izmena,setIzmena]=React.useState(false);
  const [topMovies, setTopMovies] = React.useState([]);
  const [editedRowIndex, setEditedRowIndex] = React.useState(-1);
  React.useEffect(() => {
    setVisibleRows(data.osobas.map(x=>x));

  }, [data]);
  
  

  const handleRequestSort = React.useCallback(
    (event, newOrderBy) => {
      const isAsc = orderBy === newOrderBy && order === 'asc';
      const toggledOrder = isAsc ? 'desc' : 'asc';
      setOrder(toggledOrder);
      setOrderBy(newOrderBy);

      const sortedRows = stableSort(data.osobas, getComparator(toggledOrder, newOrderBy));
      

      setVisibleRows(sortedRows.map(x=>x));
    },
    [order, orderBy, page, rowsPerPage],
  );

 

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

 const addFilm=(film)=>{
  dispatch({ type: "ADD_FILM", payload: film });
  setVisibleRows(data.osobas.map(x=>x))
 }
 const obrisiFilm=(id)=>{
  dispatch({type: "REMOVE_FILM", payload: id});
  setVisibleRows(visibleRows.filter((row) => row.id !== id));
}
const snimiIzmene=(film)=>{
  dispatch({type: "EDIT_FILM", payload: film})
  setVisibleRows(data.osobas.map(x=>x))
}
const updatedRows = [...visibleRows];
const filmovi = [...updatedRows];
const top3Filma = filmovi
  .sort((a, b) => b.ocena - a.ocena)
  .slice(0, 3);
React.useEffect(() => {
  setTopMovies(top3Filma);
}, [visibleRows]);

  return (
    <Box sx={{ width: '100%' }}>
      <FormaFilmovi addfilm={addFilm}></FormaFilmovi>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} tableName={tableName} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={0}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;           
                    const handleChange = (event) => {
                      updatedRows[index].triD = event.target.value;
                      setVisibleRows(updatedRows);
                    };
                    
                    
                    return (         
                      <TableRow key={row.id}>
                        <TableCell>{index+1}</TableCell>
                        <TableCell align="justify">{editedRowIndex !== index?row.naziv:<input type="text" value={row.naziv} onChange={
                          (e) => {
                          updatedRows[index].naziv = e.target.value;
                          setVisibleRows(updatedRows); 
                          }}></input>}
                        </TableCell>
                        <TableCell align="justify">{editedRowIndex !== index?row.reziser:<input type="text" value={row.reziser} onChange={
                          (e) => {
                          updatedRows[index].reziser = e.target.value;
                        setVisibleRows(updatedRows);}
                        }></input>}</TableCell>
                        <TableCell align="justify">{editedRowIndex !== index?row.ocena:<input type="text" value={row.ocena} onChange={
                          (e) => {
                            parseInt(e.target.value)<=5?updatedRows[index].ocena=parseInt(e.target.value):setVisibleRows();
                            setVisibleRows(updatedRows);
                          }
                        }></input>}</TableCell>
                        <TableCell align="justify">{editedRowIndex !== index?row.duzinaTrajanja:<input type="text" value={row.duzinaTrajanja} onChange={
                          (e) =>{
                            updatedRows[index].duzinaTrajanja = parseInt(e.target.value);
                            setVisibleRows(updatedRows);
                          }
                        }></input>}min</TableCell>

                        <TableCell align="justify">
                        {
                          editedRowIndex !== index?row.triD:<select name="cars" id="cars" value={row.triD} onChange={handleChange}>  
                          <option value="Da">Da</option>
                          <option value="Ne">Ne</option>
                          </select>
                        }</TableCell>

                        <TableCell align="justify">
                          <button onClick={()=>obrisiFilm(row.id)}>Obrisi</button>
                          {editedRowIndex !== index?<button onClick={(e)=>{   
                            setEditedRowIndex(index);}
                          }>Izmeni</button>:<button onClick={(e)=>{
                            setEditedRowIndex(-1);    
                            snimiIzmene(row)}}>Snimi</button>}
                        </TableCell>
                      </TableRow>
                    );
                  })
                }
              {paddingHeight > 0 && (
                <TableRow
                  style={{
                    height: paddingHeight,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      <div>
    {topMovies.map((movie) => (
      <Card key={movie.id} >
        <CardContent style={{textAlign:'center'}}>
          <Typography variant="h5" component="h2">
            {movie.naziv}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Reziser:{movie.reziser}
          </Typography>
          <Typography color="textSecondary">
            Ocena:{movie.ocena}
          </Typography>
          <Typography variant="body2" component="p">
            Trajanje filma:{movie.duzinaTrajanja}min
          </Typography>
          <Typography color="textSecondary">
            3D?:{movie.triD}
          </Typography>
        </CardContent>
      </Card>
    ))}
  </div>
    </Box>
    
  );
}
