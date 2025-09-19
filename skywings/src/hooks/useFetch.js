import { useState, useEffect, useCallback, useRef } from 'react';

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const controllerRef = useRef(null);
  const isMounted = useRef(true);

  // Default options
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  // Function to fetch data
  const fetchData = useCallback(async (fetchUrl, fetchOptions = {}) => {
    // Abort previous request if it exists
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
    
    // Create new AbortController for this request
    const controller = new AbortController();
    controllerRef.current = controller;
    
    // Set loading state
    setLoading(true);
    setError(null);
    
    try {
      // Merge options with default options
      const mergedOptions = {
        ...defaultOptions,
        ...fetchOptions,
        headers: {
          ...defaultOptions.headers,
          ...fetchOptions.headers,
        },
        signal: controller.signal,
      };
      
      // If we have a body, stringify it
      if (mergedOptions.body && typeof mergedOptions.body === 'object') {
        mergedOptions.body = JSON.stringify(mergedOptions.body);
      }
      
      const response = await fetch(fetchUrl || url, mergedOptions);
      
      // Check if the request was aborted
      if (controller.signal.aborted) {
        return;
      }
      
      // Parse the response
      let responseData;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        responseData = await response.text();
      }
      
      // Check if the response is ok
      if (!response.ok) {
        throw new Error(
          responseData.message || 
          responseData.error || 
          `HTTP error! status: ${response.status}`
        );
      }
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        setData(responseData);
        setLoading(false);
      }
      
      return responseData;
    } catch (err) {
      // Don't update state if the error is from aborting
      if (err.name === 'AbortError') {
        return;
      }
      
      // Only update state if component is still mounted
      if (isMounted.current) {
        setError(err.message || 'Something went wrong');
        setLoading(false);
      }
      
      // Re-throw the error so it can be caught by the caller
      throw err;
    } finally {
      // Only clear the controller if it's the current one
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
    }
  }, [url, defaultOptions]);

  // Function to manually trigger a refetch
  const refetch = useCallback((fetchUrl, fetchOptions) => {
    return fetchData(fetchUrl, fetchOptions);
  }, [fetchData]);

  // Function to update the data manually
  const setLocalData = useCallback((newData) => {
    setData(prevData => {
      if (typeof newData === 'function') {
        return newData(prevData);
      }
      return newData;
    });
  }, []);

  // Effect to fetch data when the component mounts or dependencies change
  useEffect(() => {
    // Only fetch if url is provided
    if (url) {
      fetchData();
    } else {
      setLoading(false);
    }
    
    // Cleanup function to cancel any pending requests
    return () => {
      isMounted.current = false;
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [url, fetchData]);

  return {
    data,
    loading,
    error,
    refetch,
    setData: setLocalData,
  };
};

export default useFetch;
