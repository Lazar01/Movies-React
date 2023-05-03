export function reducer(state, action) {
    switch (action.type) {
      case "ADD_FILM":{
        var id=1;
        var tmp=state.osobas.map(x=>x)
        if(tmp.length>0){
          id=tmp.sort((a,b)=>{return b.id-a.id})[0].id+1
        }
        action.payload.id=id
        return {
            ...state,
            osobas: [...state.osobas, action.payload]
          };
      }
      case "REMOVE_FILM":{

        const updatedMovies = state.osobas.filter(film => film.id !== action.payload);
        return {
          ...state,
          osobas: updatedMovies
        }
      }
      case 'EDIT_FILM':
        {
          var id=1;
          var tmp=state.osobas.map(x=>x)
          if(tmp.length>0){
            id=tmp.sort((a,b)=>{return b.id-a.id})[0].id+1
          }
          action.payload.id=id
          return {
              ...state,
              osobas: [...state.osobas]
            };
        }
       
      default:
        return state;
    }
  }