import { useLocation, useSearchParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getMultiSearch, IGetSearch , getMovies } from "../api";
import { IGetMoviesResult } from "../api";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { makeImagePath } from "../utils";

const Wrapper = styled.div`

`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
`;

const SearchBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Items = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  justify-content: center;
`;

const Item = styled.div`
  background-size: cover;
  background-position: center center;
`;

const Search = () => {
  // const location = useLocation();
  // const keyword = new URLSearchParams(location.search);
  const [searchResult, setSearchResult] = useState('');

  const [ keyword ,setKeyword ] = useSearchParams();

  console.log('keyword =>', keyword.get('keyword'));


  const { data, isLoading } = useQuery<IGetSearch>(
    ['search', 'multi'], 
    getMultiSearch
  );

  useEffect(() => {

  }, [keyword])

  console.log('멀티서치 =>', data);

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>loading...</Loader>
      ) : (
        <SearchBox>
          {}
          <Items>
            <Item>
            <h2>{}</h2>
            <p>{}</p>
            </Item>
          </Items>

        </SearchBox>
      )}
    </Wrapper>
  );
};

export default Search;