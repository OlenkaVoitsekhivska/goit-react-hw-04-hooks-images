import { useEffect,  useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Searchbar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Loader from './Loader/Loader';
import Button from './Button/Button';

const API_KEY = '25705868-b120ad61381773d51dfa3e39d';
const API_URL = 'https://pixabay.com/api/';

export default function App() {
  const [query, setQuery] = useState('');
  const [pics, setPics] = useState([]);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('idle');
  const [totalHits, setTotalHits] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (query === '') {
      return;
    }
    setStatus('pending');
    const fetchApi = () => {
      return fetch(
        `${API_URL}?q=${query}&page=${page}&key=${API_KEY}&image_type=photo&orientation=horizontal&per_page=12`
      )
        .then(response => {
          if (response.ok) {
            return response.json();
          }
          return Promise.reject(new Error('Failed to find any images'));
        })
        .then(pics => {
          if (!pics.total) {
            toast.error('Did find anything, mate');
          }
          return pics;
        })
        .catch(error => {
          setError(error);
          setStatus('rejected');
        });
    };

    fetchApi().then(pics => {
      const selectedProperties = pics.hits.map(
        ({ id, largeImageURL, webformatURL }) => {
          return { id, largeImageURL, webformatURL };
        }
      );
      setPics(prevState => [...prevState, ...selectedProperties]);
      setStatus('resolved');
      setTotalHits(pics.total);
    });
  }, [page, query]);

  const processSubmit = query => {
    setQuery(query);
    setPage(1);
    setPics([]);
  };

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  return (
    <>
      <Searchbar onSubmit={processSubmit} />
      {pics.length && <ImageGallery images={pics} />}
      {totalHits > pics.length && <Button onClick={() => handleLoadMore()} />}
      {status === 'pending' && <Loader />}
      <ToastContainer autoClose={2000} />
    </>
  );
}
