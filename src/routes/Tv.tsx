
import { IGetTvResult, getTvShow } from '../api';
import { useQuery } from 'react-query';
import styled from 'styled-components';
import { makeImagePath } from '../utils';

const Wrapper = styled.div`
  background-color: #000;
`;


const Tv = () => {
  const { data, isLoading } = useQuery<IGetTvResult>(['tv', 'popular'], getTvShow);
  return (
    <Wrapper>

    </Wrapper>
  );
};

export default Tv;