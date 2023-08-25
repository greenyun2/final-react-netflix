const API_KEY = '108427441a79a587af94d880ea1a571e';
const BASE_PATH = 'https://api.themoviedb.org/3';


export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
};

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
};

export interface ITv {
  backdrop_path: string;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
}

export interface IGetTvResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}


export const getMovies = () => {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`).then((response) => response.json())
};

export const getTvShow = () => {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`).then((response) => response.json())
};